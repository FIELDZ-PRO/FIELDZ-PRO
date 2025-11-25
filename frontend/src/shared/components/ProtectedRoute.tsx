import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "JOUEUR" | "CLUB" | "ADMIN";
}

/**
 * Attend le bootstrap d'auth (`authReady`) avant de décider.
 * - Tant que `authReady` est false, on ne redirige pas (le Context tente /refresh via cookie).
 * - Une fois prêt, si non authentifié => /login
 * - Si authentifié mais mauvais rôle => redirige vers le dashboard correspondant.
 */
const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, role, authReady } = useAuth();

  // 1) Pendant le bootstrap: ne rien rediriger (affiche un mini loader si tu veux)
  if (!authReady) {
    return null; // ou <div className="fullpage-loader">Chargement…</div>
  }

  // 2) Après bootstrap: pas authentifié -> login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3) Rôle requis non satisfait -> redirige vers le bon espace
  if (requiredRole && role !== requiredRole) {
    if (role === "ADMIN")  return <Navigate to="/admin" replace />;
    if (role === "CLUB")   return <Navigate to="/club" replace />;
    if (role === "JOUEUR") return <Navigate to="/joueur" replace />;
    return <Navigate to="/login" replace />;
  }

  // 4) OK
  return <>{children}</>;
};

export default ProtectedRoute;
