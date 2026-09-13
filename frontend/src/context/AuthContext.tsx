'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 💡 1. Definimos la estructura exacta del usuario (Adiós al 'any')
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  loginGlobal: (token: string, user: UserProfile) => void;
  logoutGlobal: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // 💡 Controla el estado de carga inicial
  const router = useRouter();

  useEffect(() => {
    // 💡 Recuperamos la sesión de forma segura asegurando que estamos en el cliente
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      setLoading(false); // La aplicación terminó de comprobar la sesión
    }
  }, []);

  const loginGlobal = (newToken: string, newUser: UserProfile) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    router.push('/dashboard');
  };

  const logoutGlobal = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, loginGlobal, logoutGlobal, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};
