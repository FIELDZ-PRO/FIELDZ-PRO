import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'JOUEUR' | 'CLUB' | 'ADMIN';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { token, role } = useAuth();
  
  // Pas de token = redirection vers login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si un rôle spécifique est requis
  if (requiredRole && role !== requiredRole) {
    // Redirection selon le rôle de l'utilisateur
    if (role === 'ADMIN') {
      return <Navigate to="/admin" />;
    } else if (role === 'CLUB') {
      return <Navigate to="/club" />;
    } else if (role === 'JOUEUR') {
      return <Navigate to="/joueur" />;
    } else {
      return <Navigate to="/login" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;