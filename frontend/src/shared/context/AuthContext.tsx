import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

/** ===== Config back ===== */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://fieldz-pro.koyeb.app";

/** ===== Types ===== */
type Role = "JOUEUR" | "CLUB" | "ADMIN";
type JwtPayload = { role?: Role; exp?: number; sub?: string };

export interface AuthContextType {
  token: string | null;
  role: Role | null;
  /** vrai uniquement quand on a un token non expiré */
  isAuthenticated: boolean;
  /** vrai après le bootstrap (tentative de refresh au montage) */
  authReady: boolean;

  remember: boolean;
  setRemember: (val: boolean) => void;

  login: (newToken: string, opts?: { remember?: boolean }) => void;
  logout: () => Promise<void>;

  /** pratique pour forcer un 401 et tester le refresh */
  expireNow: () => void;
}

/** ===== Helpers ===== */
const ACCESS_TOKEN_KEY = "access_token";
const REMEMBER_KEY = "remember_me";

const decodeRole = (t: string | null): Role | null => {
  if (!t) return null;
  try {
    const payload = jwtDecode<JwtPayload>(t);
    return (payload.role as Role) ?? null;
  } catch {
    return null;
  }
};

const hasValidToken = (t: string | null): boolean => {
  if (!t) return false;
  if (t.split(".").length !== 3) return false;
  try {
    const payload = jwtDecode<JwtPayload>(t);
    if (typeof payload.exp !== "number") return true;
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};

/** ===== Contexte ===== */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // token en sessionStorage (mémoire persistante de l’onglet)
  const [token, setToken] = useState<string | null>(() => {
    try { return sessionStorage.getItem(ACCESS_TOKEN_KEY); } catch { return null; }
  });

  // préférence remember
  const [remember, _setRemember] = useState<boolean>(() => {
    try { return localStorage.getItem(REMEMBER_KEY) === "true"; } catch { return false; }
  });

  const [role, setRole] = useState<Role | null>(() => decodeRole(token));
  const [authReady, setAuthReady] = useState<boolean>(false);
  const isAuthenticated = useMemo(() => hasValidToken(token), [token]);

  const setRemember = useCallback((val: boolean) => {
    _setRemember(val);
    try { localStorage.setItem(REMEMBER_KEY, String(val)); } catch {}
  }, []);

  /** Pose le token après login */
  const login = useCallback((newToken: string, opts?: { remember?: boolean }) => {
    if (typeof opts?.remember === "boolean") setRemember(opts.remember);
    try { sessionStorage.setItem(ACCESS_TOKEN_KEY, newToken); } catch {}
    setToken(newToken);
    setRole(decodeRole(newToken));
  }, [setRemember]);

  /** Logout : invalide le refresh côté back + nettoie */
  const logout = useCallback(async () => {
    try {
      await axios.post(`${API_BASE}/api/auth/logout`, {}, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // même si le back échoue, on nettoie
    } finally {
      try { sessionStorage.removeItem(ACCESS_TOKEN_KEY); } catch {}
      try { localStorage.removeItem(REMEMBER_KEY); } catch {}
      _setRemember(false);
      setToken(null);
      setRole(null);
      setAuthReady(true); // état connu
      window.location.assign("/login");
    }
  }, []);

  /** Pour tester : vide l’access token (provoque un 401 à la prochaine requête) */
  const expireNow = useCallback(() => {
    try { sessionStorage.removeItem(ACCESS_TOKEN_KEY); } catch {}
    setToken(null);
    setRole(null);
  }, []);

  /** Sync entre onglets */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === ACCESS_TOKEN_KEY) {
        const v = e.newValue ?? null;
        setToken(v);
        setRole(decodeRole(v));
      }
      if (e.key === REMEMBER_KEY) _setRemember(e.newValue === "true");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /** Si un intercepteur signale l’expiration, on nettoie proprement */
  useEffect(() => {
    const onExpired = () => {
      try { sessionStorage.removeItem(ACCESS_TOKEN_KEY); } catch {}
      setToken(null);
      setRole(null);
      window.location.assign("/login");
    };
    window.addEventListener("auth:session-expired", onExpired as EventListener);
    return () => window.removeEventListener("auth:session-expired", onExpired as EventListener);
  }, []);

  /**
   * Bootstrap au premier render :
   * - Si token valide -> prêt tout de suite.
   * - Si token invalide/absent -> tenter refresh silencieux UNIQUEMENT si remember === true.
   * - Sinon, pas de refresh -> prêt et non authentifié.
   */
  useEffect(() => {
    (async () => {
      const tokenOk = hasValidToken(token);

      if (tokenOk) {
        setAuthReady(true);
        return;
      }

      // 👉 Pas de refresh auto si "Se souvenir de moi" n'est pas activé
      if (!remember) {
        // on ne touche pas au cookie, on laisse l'utilisateur non authentifié
        setAuthReady(true);
        return;
      }

      // ✅ Remember activé -> tenter refresh via cookie HttpOnly
      try {
        const res = await axios.post(
          `${API_BASE}/api/auth/refresh`,
          {},
          { withCredentials: true, headers: { "Content-Type": "application/json" } }
        );
        const newAccess: string = res.data.token ?? res.data.accessToken;
        if (newAccess) {
          try { sessionStorage.setItem(ACCESS_TOKEN_KEY, newAccess); } catch {}
          setToken(newAccess);
          setRole(decodeRole(newAccess));
        } else {
          try { sessionStorage.removeItem(ACCESS_TOKEN_KEY); } catch {}
          setToken(null);
          setRole(null);
        }
      } catch {
        try { sessionStorage.removeItem(ACCESS_TOKEN_KEY); } catch {}
        setToken(null);
        setRole(null);
      } finally {
        setAuthReady(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // montage uniquement

  const value = useMemo(() => ({
    token, role, isAuthenticated, authReady,
    remember, setRemember,
    login, logout, expireNow
  }), [token, role, isAuthenticated, authReady, remember, setRemember, login, logout, expireNow]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
