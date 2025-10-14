import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'; // 1. Importer useCallback
import { jwtDecode } from 'jwt-decode';

// L'interface pour le payload du token (ne change pas)
interface JwtPayloadWithRole {
  role: 'JOUEUR' | 'CLUB' | 'ADMIN';
  [key: string]: any;
}

// L'interface du contexte (ne change pas)
interface AuthContextType {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (newToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const isAuthenticated = !!token;

  // 2. Envelopper les fonctions dans useCallback
  // Cela garantit que les fonctions login et logout ne sont pas recréées à chaque rendu.
  const login = useCallback((newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    try {
      const decoded = jwtDecode(newToken) as JwtPayloadWithRole;
      setRole(decoded.role);
    } catch (error) {
      console.error("Failed to decode token:", error);
      setRole(null);
    }
  }, []); // Le tableau de dépendances est vide car la fonction n'utilise aucune variable externe

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setRole(null);
  }, []); // Le tableau de dépendances est vide

  // La valeur fournie au contexte est maintenant stable
  const value = { token, role, isAuthenticated, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Le hook personnalisé ne change pas
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};