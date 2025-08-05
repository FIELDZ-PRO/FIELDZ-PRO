import React, { createContext, useContext, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// 1. Définir l'interface pour le payload du token
interface JwtPayloadWithRole {
  role: 'JOUEUR' | 'CLUB' | 'ADMIN';
  [key: string]: any;
}

// 2. Définir le type du contexte
interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (newToken: string) => void;
  logout: () => void;
}

// 3. Créer le contexte avec une valeur par défaut explicite (null, puis vérifié dans useAuth)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Typage des props de AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('token');
    try {
      return savedToken ? (jwtDecode(savedToken) as JwtPayloadWithRole).role : null;
    } catch {
      return null;
    }
  });

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const decoded = jwtDecode(newToken) as JwtPayloadWithRole;
    setRole(decoded.role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Hook avec vérification
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
