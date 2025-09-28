import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Log-auth/Login';
import Register from '../pages/Log-auth/Register';

import ClubDashboard from '../pages/ClubDashboard';
import ClubDashboard2 from '../pages/ClubDashboard2';

import JoueurDashboard from "../pages/JoueurDashboard";
import ProtectedRoute from '../components/ProtectedRoute';
import LandingPage from '../pages/LandingPage';
import NotFound from '../pages/NotFound';
import ResetPassword from "../pages/Log-auth/ResetPassword";
import ForgotPassword from '../pages/ForgotPassword';
import OAuthSuccess from '../pages/Log-auth/oauth-success';
import CompleteProfile from '../pages/CompleteProfile';
import ProfilPage from '../pages/ProfilPage';
import AccueilClub from '../pages/VueClub/AccueilClub';
import Club from '../pages/Club';
import { NavigationProvider } from '../pages/VueClub/Context/NavigationContext';


export default function AppRouter() {
  return (
    <Routes>

      {/* Landing page publique */}
      <Route path="/home" element={<LandingPage onNavigate={undefined} />} />
      <Route path="/" element={<LandingPage onNavigate={undefined} />} />
      <Route path="*" element={<NotFound />} />

      {/* Authentification */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/profil" element={<ProfilPage />} />

      <Route
        path="/AccueilClub"
        element={
          <NavigationProvider>
            <Club />
          </NavigationProvider>
        }
      />
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
        path="/club2"
        element={
          <ProtectedRoute>
            <ClubDashboard2 />
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
