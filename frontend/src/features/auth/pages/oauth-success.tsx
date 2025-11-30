import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../../shared/context/AuthContext";
import React from "react";

const API_BASE = import.meta.env.VITE_API_URL || "https://prime-cherida-fieldzz-17996b20.koyeb.app/api";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // 1) Récupérer le token (#token=... puis ?token=... puis sessionStorage)
    const fromHash = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("token");
    const fromQuery = new URLSearchParams(window.location.search).get("token");
    const fromSession = sessionStorage.getItem("access_token") || undefined;
    const token = fromHash || fromQuery || fromSession;

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // 2) Enregistrer le token côté front
      login(token);

      // Optionnel: log dev
      const decoded: any = jwtDecode(token);
      console.log("✅ Utilisateur connecté via Google :", decoded);

      // Nettoyer l'URL (retire #token ou ?token)
      const cleanUrl =
        window.location.pathname +
        window.location.search.replace(/(\?|&)token=[^&]*/, "").replace(/\?&/, "?").replace(/\?$/, "");
      window.history.replaceState(null, "", cleanUrl);

      // 3) Appeler l'API pour récupérer le profil utilisateur
      setTimeout(() => {
        fetch(`${API_BASE}/utilisateur/me`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }, // garde l'Authorization
          // credentials: "include" // optionnel: cookies envoyés par défaut en same-origin
        })
          .then((res) => {
            if (!res.ok) throw new Error("Erreur lors de la récupération du profil");
            return res.json();
          })
          .then((user) => {
            console.log("👤 Données utilisateur :", user);
            if (!user.profilComplet) navigate("/complete-profile");
            else if (user.role === "JOUEUR") navigate("/joueur");
            else if (user.role === "CLUB") navigate("/club");
            else navigate("/");
          })
          .catch((err) => {
            console.error("❌ Erreur de récupération utilisateur :", err);
            navigate("/login");
          });
      }, 300);
    } catch (e) {
      console.error("❌ Token Google invalide :", e);
      navigate("/login");
    }
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <p className="text-gray-600 text-lg">Connexion en cours...</p>
    </div>
  );
};

export default OAuthSuccess;
