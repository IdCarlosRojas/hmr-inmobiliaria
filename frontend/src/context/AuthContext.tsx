import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Usuario } from '../types';

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('hmr_token');
    const savedUsuario = localStorage.getItem('hmr_usuario');
    if (savedToken && savedUsuario) {
      setToken(savedToken);
      setUsuario(JSON.parse(savedUsuario));
    }
  }, []);

  const login = (newToken: string, newUsuario: Usuario) => {
    localStorage.setItem('hmr_token', newToken);
    localStorage.setItem('hmr_usuario', JSON.stringify(newUsuario));
    setToken(newToken);
    setUsuario(newUsuario);
  };

  const logout = () => {
    localStorage.removeItem('hmr_token');
    localStorage.removeItem('hmr_usuario');
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      login,
      logout,
      isAuthenticated: !!token,
      isSuperAdmin: usuario?.rol === 'super_admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);