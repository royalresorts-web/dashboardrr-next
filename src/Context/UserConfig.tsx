"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { fetchUserPermissions } from '@/lib';


// 1. Definimos el tipo para nuestro objeto de usuario simplificado
export interface UserPermissionsType {
  correo: string | null;
  code: string | null;
  description: string | null;
  url: string | null;
}
export interface UserProyectsType {
  id: string | null;
  name: string | null;
  directory: string | null;
}

export interface getPermissionsResType {
  code: string | null;
  data: string | null;
  Data: UserPermissionsType[] | null;
  Proyects: UserProyectsType[] | null;
  message: string | null;
}


// 2. Definimos el tipo para el valor del contexto
interface UserConfigContextType {
  userConfig: UserPermissionsType[] | null;
  userProyects: UserProyectsType[] | null;
}

// 3. Creamos el contexto con un valor inicial `undefined` para chequear si se usa fuera del Provider
const UserConfigContext = createContext<UserConfigContextType | undefined>(undefined);

// 4. Hook personalizado para usar el contexto de forma segura
export const useUserConfig = (): UserConfigContextType => {
  const context = useContext(UserConfigContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

// 5. Definimos los props para el Provider
interface UserConfigProviderProps {
  children: ReactNode;
}

function UserConfigProvider({ children }: UserConfigProviderProps) {
  const { user } = useAuth();
  const [userConfig, setUserConfig] = useState<UserPermissionsType[] | null>(null);
  const [userProyects, setUserProyects] = useState<UserProyectsType[] | null>(null);
  const [errorConfig, setErrorConfig] = useState<string | null>(null);



  useEffect(() => {
    if(user && user.email && !userConfig && !userProyects){
      console.log("uno entro", user , user.email , !userConfig , !userProyects);
      fetchUserPermissions(user.email, (response: getPermissionsResType) => {
        setUserConfig(response.Data);
        setUserProyects(response.Proyects);

      }, (err) => {
        setUserConfig(null);
        setUserProyects(null);
        setErrorConfig("Error fetching info: " + err);

      })         
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const value = {
    user,
    userConfig,
    userProyects,
    errorConfig
  };

  return <UserConfigContext.Provider value={value}>{children}</UserConfigContext.Provider>;
}

export {UserConfigProvider}