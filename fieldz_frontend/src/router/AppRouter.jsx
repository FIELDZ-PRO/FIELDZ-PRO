import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ClubDashboard from '../pages/ClubDashboard';
import JoueurDashboard from '../pages/JoueurDashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import LandingPage from '../pages/LandingPage';
import NotFound from '../pages/NotFound';
import ResetPassword from "../pages/ResetPassword";
import ForgotPassword from '../pages/ForgotPassword';
import OAuthSuccess from '../pages/oauth-success';



export default function AppRouter() {
  return (
      <Routes>
 
        {/* Landing page publique */}
        <Route path="/home" element={<LandingPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<NotFound />} />

        {/* Authentification */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />



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



  );
}
