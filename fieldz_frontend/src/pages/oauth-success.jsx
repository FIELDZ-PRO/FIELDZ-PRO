import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";

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
      login(token); // stocke dans localStorage + state
      const decoded = jwtDecode(token);
      console.log("✅ Utilisateur connecté via Google :", decoded);

      setTimeout(() => {
        if (decoded.role === "JOUEUR") navigate("/joueur");
        else if (decoded.role === "CLUB") navigate("/club");
        else navigate("/");
      }, 100); // petit délai pour s'assurer que le contexte est prêt

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
