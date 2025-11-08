import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

/** ===== Types ===== */
interface JwtPayloadWithRole {
  role?: "JOUEUR" | "CLUB" | "ADMIN";
  exp?: number; // seconds since epoch
  [key: string]: any;
}

interface AuthContextType {
  token: string | null;
  role: "JOUEUR" | "CLUB" | "ADMIN" | null;
  isAuthenticated: boolean;
  login: (newToken: string) => void;
  logout: () => void;
}

/** ===== Helpers ===== */
const decodeRole = (t: string | null): AuthContextType["role"] => {
  if (!t) return null;
  try {
    const payload = jwtDecode<JwtPayloadWithRole>(t);
    return (payload.role as AuthContextType["role"]) ?? null;
  } catch {
    return null;
  }
};

const hasValidToken = (t: string | null): boolean => {
  if (!t) return false;
  if (t.split(".").length !== 3) return false;
  try {
    const payload = jwtDecode<JwtPayloadWithRole>(t);
    if (typeof payload.exp !== "number") return true; // pas d'exp => on considère valide selon ton back
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};

/** ===== Contexte ===== */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps { children: ReactNode; }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Lecture synchrone du token dès le 1er render
  const [token, setTokenState] = useState<string | null>(() => {
    try { return localStorage.getItem("token"); } catch { return null; }
  });

  const [role, setRole] = useState<AuthContextType["role"]>(() =>
    decodeRole(
      (() => {
        try { return localStorage.getItem("token"); } catch { return null; }
      })()
    )
  );

  const isAuthenticated = useMemo<boolean>(() => hasValidToken(token), [token]);

  const login = useCallback((newToken: string) => {
    try { localStorage.setItem("token", newToken); } catch {}
    setTokenState(newToken);
    setRole(decodeRole(newToken));
  }, []);

  const logout = useCallback(() => {
    try { localStorage.removeItem("token"); } catch {}
    setTokenState(null);
    setRole(null);
  }, []);

  // Synchronise si le token change dans un autre onglet
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "token") return;
      const newVal = e.newValue ?? null;
      setTokenState(newVal);
      setRole(decodeRole(newVal));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({ token, role, isAuthenticated, login, logout }),
    [token, role, isAuthenticated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

// Utils réutilisables (si besoin dans les pages)
export const authUtils = { hasValidToken };
