import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ClubDashboard from '../pages/ClubDashboard';
import JoueurDashboard from '../pages/JoueurDashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import LandingPage from '../pages/LandingPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page publique */}
        <Route path="/home" element={<LandingPage />} />

        {/* Authentification */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboards protégés */}
        <Route
          path="/club"
          element={
            <ProtectedRoute>
              <ClubDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/joueur"
          element={
            <ProtectedRoute>
              <JoueurDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
