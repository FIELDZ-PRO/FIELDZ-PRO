import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "JOUEUR" | "CLUB" | "ADMIN";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Redirige selon le vrai rôle courant
    if (role === "ADMIN") return <Navigate to="/admin" replace />;
    if (role === "CLUB") return <Navigate to="/club" replace />;
    if (role === "JOUEUR") return <Navigate to="/joueur" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
