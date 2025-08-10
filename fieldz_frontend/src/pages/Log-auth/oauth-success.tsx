import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      login(token); // stocke dans localStorage + context
      const decoded = jwtDecode(token);
      console.log("✅ Utilisateur connecté via Google :", decoded);

      // ✅ Petit délai pour éviter d'aller trop vite
      setTimeout(() => {
        fetch("http://localhost:8080/api/utilisateur/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache", // force un vrai appel backend
          },
        })
          .then(res => {
            if (!res.ok) throw new Error("Erreur lors de la récupération du profil");
            return res.json();
          })
          .then(user => {
            console.log("👤 Données utilisateur (rafraîchies) :", user);
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
          .catch(error => {
            console.error("❌ Erreur de récupération utilisateur :", error);
            navigate("/login");
          });
      }, 300); // 🕒 petit délai de 300ms

    } catch (error) {
      console.error("❌ Token Google invalide :", error);
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
