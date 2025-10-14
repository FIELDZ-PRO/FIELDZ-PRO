import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Log-auth/Login';
import Register from '../pages/Log-auth/Register';
import AdminLogin from '../components/admin/AdminLogin';

import ClubDashboard from '../pages/ClubDashboard';
import ClubDashboard2 from '../pages/ClubDashboard2';

import JoueurDashboard from "../pages/JoueurDashboard";

import JoueurDashboard2 from "../pages/JoueurDashboard2";

import ProtectedRoute from '../components/ProtectedRoute';
import LandingPage from '../pages/LandingPage';
import NotFound from '../pages/NotFound';
import ResetPassword from "../pages/Log-auth/ResetPassword";
import ForgotPassword from '../pages/ForgotPassword';
import OAuthSuccess from '../pages/Log-auth/oauth-success';
import CompleteProfile from '../pages/CompleteProfile';
import ProfilJoueur from '../pages/ProfilJoueur';
import ProfilClub from '../pages/ProfilClub';

import AccueilClub from '../pages/VueClub/AccueilClub';
import Club from '../pages/Club';
import { NavigationProvider } from '../pages/VueClub/Context/NavigationContext';
import { LoginClub } from '../pages/VueClub/LoginClub';
import { MailSent } from '../pages/VueClub/MailSent';
import { ForgotPasswordPageCLub } from '../pages/VueClub/ForgotPasswordClub';

// Import des composants Admin
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminClubs from '../pages/admin/AdminClubs';
import AdminJoueurs from '../pages/admin/AdminJoueurs';


import ClubDetailsJoueur from '../pages/ClubDetailsJoueur';

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
      <Route path="/profil-club" element={<ProfilClub />} />
      <Route path="/profil-joueur" element={<ProfilJoueur />} />



      {/*Club Pages*/}
      <Route path="/MailSent"
        element={
          <MailSent />
        }
      />

      <Route path="/ForgotPasswordClub"
        element={
          <ForgotPasswordPageCLub />
        }
      />

      <Route
        path="/LoginClub"
        element={
          <NavigationProvider>
            <LoginClub />
          </NavigationProvider>
        }
      />

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

          <ClubDashboard />

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
          path="/club/:id"
           element=
           {
            <ProtectedRoute requiredRole="JOUEUR">
               <ClubDetailsJoueur />
            </ProtectedRoute>
            }
      />

      <Route
        path="/joueur"
        element={
          <ProtectedRoute requiredRole="JOUEUR">
            <JoueurDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/joueur2"
        element={
          <ProtectedRoute>
            <JoueurDashboard2 />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Routes Admin - Protégées */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="clubs" element={<AdminClubs />} />
        <Route path="joueurs" element={<AdminJoueurs />} />
      </Route>
    </Routes>



  );
}