"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/Context/AuthContext'; // Ajusta la ruta

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no está cargando y no hay usuario, redirige
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  // Si hay usuario, renderiza el contenido
  if (user) {
    return <>{children}</>;
  }
  
  // Si no hay usuario (y ya no está cargando), no renderiza nada mientras redirige
  return null;
};

export {ProtectedRoute};