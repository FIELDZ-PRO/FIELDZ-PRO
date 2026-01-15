import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { getToken, setToken as saveToken, removeToken } from '../api/client';
import { Role, JwtPayload } from '../types';

interface AuthContextType {
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  authReady: boolean;
  login: (newToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const decodeRole = (t: string | null): Role | null => {
  if (!t) return null;
  try {
    const payload = jwtDecode<JwtPayload>(t);
    return payload.role ?? null;
  } catch {
    return null;
  }
};

const hasValidToken = (t: string | null): boolean => {
  if (!t) return false;
  if (t.split('.').length !== 3) return false;
  try {
    const payload = jwtDecode<JwtPayload>(t);
    if (typeof payload.exp !== 'number') return true;
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);

  const isAuthenticated = useMemo(() => hasValidToken(token), [token]);

  // Charger le token au démarrage
  useEffect(() => {
    (async () => {
      try {
        const storedToken = await getToken();
        if (storedToken && hasValidToken(storedToken)) {
          setToken(storedToken);
          setRole(decodeRole(storedToken));
        }
      } catch (error) {
        console.warn('Failed to load token:', error);
      } finally {
        setAuthReady(true);
      }
    })();
  }, []);

  const login = useCallback(async (newToken: string) => {
    try {
      await saveToken(newToken);
      setToken(newToken);
      setRole(decodeRole(newToken));
    } catch (error) {
      console.error('Failed to save token:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await removeToken();
    } catch (error) {
      console.warn('Failed to delete token:', error);
    } finally {
      setToken(null);
      setRole(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      token,
      role,
      isAuthenticated,
      authReady,
      login,
      logout,
    }),
    [token, role, isAuthenticated, authReady, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
