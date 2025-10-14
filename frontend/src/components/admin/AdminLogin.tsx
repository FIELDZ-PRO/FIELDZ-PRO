import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "../../pages/Log-auth/style/Login.css";
import React from "react";

type JwtPayload = { role?: "ADMIN" | string };
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        motDePasse,
      });
      const token: string = res.data.token;
      login(token);

      const role = jwtDecode<JwtPayload>(token)?.role;
      
      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        setMessage("Accès refusé. Cette page est réservée aux administrateurs.");
      }
    } catch (err: any) {
      const s = err?.response?.status;
      const d = err?.response?.data;
      if (s === 401) setMessage("Mot de passe incorrect.");
      else if (s === 423) setMessage("Compte bloqué temporairement : " + d);
      else if (s === 404) setMessage("Utilisateur non trouvé.");
      else setMessage("Erreur inattendue. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="avatar" aria-hidden />
        <h1 className="title">Portail Admin</h1>
        <p className="subtitle">Connexion réservée aux administrateurs</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          {message && <div className="api-error">{message}</div>}

          <div className="field">
            <label className="label">Email administrateur</label>
            <div className="input-wrap">
              <span className="icon email" aria-hidden />
              <input
                className="input"
                type="email"
                placeholder="admin@fieldz.dz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Mot de passe</label>
            <div className="input-wrap">
              <span className="icon lock" aria-hidden />
              <input
                className="input"
                type={showPwd ? "text" : "password"}
                placeholder="Votre mot de passe"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              />
            </div>
          </div>

          <button className="primary" disabled={isLoading}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}