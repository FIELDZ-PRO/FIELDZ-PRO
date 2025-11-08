import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Log-auth/Login";
import Register from "../pages/Log-auth/Register";
import AdminLogin from "../components/admin/AdminLogin";

import ClubDashboard from "../features/club/pages/ClubDashboard";
import ClubDashboard2 from "../features/club/pages/ClubDashboard2";

import JoueurDashboard from "../pages/JoueurDashboard";
import JoueurDashboard2 from "../pages/JoueurDashboard2";

import ProtectedRoute from "../components/ProtectedRoute";
import LandingPage from "../pages/LandingPage";
import NotFound from "../pages/NotFound";
import ResetPassword from "../pages/Log-auth/ResetPassword";
import ForgotPassword from "../pages/ForgotPassword";
import OAuthSuccess from "../pages/Log-auth/oauth-success";
import CompleteProfile from "../pages/CompleteProfile";
import ProfilJoueur from "../pages/ProfilJoueur";
import ProfilClub from "../features/club/pages/ProfilClub";

import AccueilClub from "../features/club/pages/VueClub/AccueilClub";
import Club from "../features/club/pages/Club";
import { NavigationProvider } from "../features/club/pages/VueClub/Context/NavigationContext";
import { LoginClub } from "../features/club/pages/VueClub/LoginClub";
import { MailSent } from "../features/club/pages/VueClub/MailSent";
import { ForgotPasswordPageClub } from "../features/club/pages/VueClub/ForgotPasswordClub";

// Admin
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminClubs from "../pages/admin/AdminClubs";
import AdminJoueurs from "../pages/admin/AdminJoueurs";

import ClubDetailsJoueur from "../pages/ClubDetailsJoueur";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/home" element={<LandingPage onNavigate={undefined} />} />
      <Route path="/" element={<LandingPage onNavigate={undefined} />} />
      <Route path="*" element={<NotFound />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/profil-joueur" element={<ProfilJoueur />} />
      <Route
        path="/profil-club"
        element={
          <ProtectedRoute requiredRole="CLUB">
            <ProfilClub />
          </ProtectedRoute>
        }
      />

      {/* Club pages (publique) */}
      <Route path="/MailSent" element={<MailSent />} />
      <Route path="/ForgotPasswordClub" element={<ForgotPasswordPageClub />} />
      <Route
        path="/LoginClub"
        element={
          <NavigationProvider>
            <LoginClub />
          </NavigationProvider>
        }
      />

      {/* Club pages (protégées CLUB) */}
      <Route
        path="/AccueilClub"
        element={
          <ProtectedRoute requiredRole="CLUB">
            <NavigationProvider>
              <Club />
            </NavigationProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/TestPage"
        element={
          <ProtectedRoute requiredRole="CLUB">
            <NavigationProvider>
              <Club />
            </NavigationProvider>
          </ProtectedRoute>
        }
      />

      {/* Dashboards protégés */}
      <Route
        path="/club"
        element={
          <ProtectedRoute requiredRole="CLUB">
            <ClubDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/club2"
        element={
          <ProtectedRoute requiredRole="CLUB">
            <ClubDashboard2 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/club/:id"
        element={
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
          <ProtectedRoute requiredRole="JOUEUR">
            <JoueurDashboard2 />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
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
