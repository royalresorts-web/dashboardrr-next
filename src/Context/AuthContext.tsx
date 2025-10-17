"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as authSignOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Asegúrate de que la ruta sea correcta

// 1. Definimos el tipo para nuestro objeto de usuario simplificado
export interface UserType {
  uid: string;
  email: string | null;
  photoURL: string | null;
  displayName: string | null;
  getIdToken: () => Promise<string>;
}

// 2. Definimos el tipo para el valor del contexto
interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// 3. Creamos el contexto con un valor inicial `undefined` para chequear si se usa fuera del Provider
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Hook personalizado para usar el contexto de forma segura
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

// 5. Definimos los props para el Provider
interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        console.log(firebaseUser);
        
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          displayName: firebaseUser.displayName, 
          getIdToken: () => firebaseUser.getIdToken(),    
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setUser(null);
    await authSignOut(auth);
  };

  const value = {
    user,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export {AuthProvider}