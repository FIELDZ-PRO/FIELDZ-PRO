import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../../shared/context/AuthContext";
import React from "react";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // 1) Récupère le token depuis le FRAGMENT (#token=...), puis fallback query (?token=...)
    const fromHash = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("token");
    const fromQuery = new URLSearchParams(window.location.search).get("token");

    // 2) Fallback stockage (si le handler back l'a déjà écrit côté 8080 ou via compat)
    const fromSession = sessionStorage.getItem("fieldz_access") || undefined;
    const fromLocal = localStorage.getItem("fieldz_access") || undefined;

    const token = fromHash || fromQuery || fromSession || fromLocal;

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Enregistre via ton contexte (écrit dans localStorage selon ta logique actuelle)
      login(token);

      // Petit log utile en dev
      const decoded: any = jwtDecode(token);
      console.log("✅ Utilisateur connecté via Google :", decoded);

      // Nettoie l'URL (retire #token ou ?token)
      const cleanUrl = window.location.pathname + window.location.search.replace(/(\?|&)token=[^&]*/,"").replace(/\?&/,"?").replace(/\?$/,"");
      window.history.replaceState(null, "", cleanUrl);

      // 3) Charge le profil et redirige selon le rôle
      setTimeout(() => {
        fetch("http://localhost:8080/api/utilisateur/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Erreur lors de la récupération du profil");
            return res.json();
          })
          .then((user) => {
            console.log("👤 Données utilisateur :", user);
            if (!user.profilComplet) {
              navigate("/complete-profile");
            } else if (user.role === "JOUEUR") {
              navigate("/joueur");
            } else if (user.role === "CLUB") {
              navigate("/club");
            } else {
              navigate("/");
            }
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
