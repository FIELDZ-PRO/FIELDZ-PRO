import React from "react";
import { Routes, Route } from "react-router-dom";

// Auth Feature
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ResetPassword from "../features/auth/pages/ResetPassword";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import OAuthSuccess from "../features/auth/pages/oauth-success";
import CompleteProfile from "../features/auth/pages/CompleteProfile";

// Club Feature
import ClubDashboard from "../features/club/pages/ClubDashboard";
import ClubDashboard2 from "../features/club/pages/ClubDashboard2";
import ProfilClub from "../features/club/pages/ProfilClub";
import AccueilClub from "../features/club/pages/VueClub/AccueilClub";
import Club from "../features/club/pages/Club";
import { NavigationProvider } from "../features/club/pages/VueClub/Context/NavigationContext";
import { LoginClub } from "../features/club/pages/VueClub/LoginClub";
import { MailSent } from "../features/club/pages/VueClub/MailSent";
import { ForgotPasswordPageClub } from "../features/club/pages/VueClub/ForgotPasswordClub";

// Joueur Feature
import JoueurDashboard from "../features/joueur/pages/JoueurDashboard";
import JoueurDashboard2 from "../features/joueur/pages/JoueurDashboard2";
import ProfilJoueur from "../features/joueur/pages/ProfilJoueur";
import ClubDetailsJoueur from "../features/joueur/pages/ClubDetailsJoueur";

// Admin Feature
import AdminLayout from "../features/admin/components/AdminLayout";
import AdminLogin from "../features/admin/pages/AdminLogin";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import AdminClubs from "../features/admin/pages/AdminClubs";
import AdminJoueurs from "../features/admin/pages/AdminJoueurs";

// Shared
import ProtectedRoute from "../shared/components/ProtectedRoute";

// Public Pages
import LandingPage from "../pages/LandingPage";
import NotFound from "../pages/NotFound";

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
