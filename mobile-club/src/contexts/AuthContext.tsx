import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, removeToken, setToken } from '../api/client';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  role: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await getToken();
      if (token) {
        const decoded = jwtDecode<JwtPayload>(token);

        // Vérifier que le token est pour un club
        if (decoded.role === 'CLUB') {
          setIsAuthenticated(true);
          setRole(decoded.role);
        } else {
          // Si le token n'est pas pour un club, on le supprime
          await removeToken();
          setIsAuthenticated(false);
          setRole(null);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    try {
      await setToken(token);
      const decoded = jwtDecode<JwtPayload>(token);

      // Vérifier que le token est pour un club
      if (decoded.role !== 'CLUB') {
        throw new Error('Ce compte n\'est pas un compte club');
      }

      setIsAuthenticated(true);
      setRole(decoded.role);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await removeToken();
      setIsAuthenticated(false);
      setRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
