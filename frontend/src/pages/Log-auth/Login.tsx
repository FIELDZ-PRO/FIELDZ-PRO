import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./style/Login.css";
import React from "react";

type JwtPayload = { role?: "CLUB" | "JOUEUR" | string };
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roleChoisi, setRoleChoisi] = useState<"CLUB" | "JOUEUR" | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!roleChoisi) {
      setMessage("Veuillez choisir votre rôle (Joueur ou Club).");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        motDePasse, //password: motDePasse, 
      });
      const token: string = res.data.token;
      login(token);

      const role = jwtDecode<JwtPayload>(token)?.role;
      if (role === "CLUB" && roleChoisi === "CLUB") navigate("/club2");
      else if (role === "JOUEUR" && roleChoisi === "JOUEUR") navigate("/joueur");
      else setMessage("Rôle invalide ou non autorisé pour ce compte.");
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

  const loginWithGoogle = () => {
    window.location.href = `${API_BASE}/oauth2/authorization/google`;
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="avatar" aria-hidden />
        <h1 className="title">Bienvenue</h1>
        <p className="subtitle">Connectez-vous ou créer un compte</p>

        {/* Onglets (actif à gauche) */}
        <div className="tabs login">
          <Link to="/login" className="tab">Connexion</Link>
          <Link to="/register" className="tab">Inscription</Link>
          <span className="indicator" />
        </div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          {message && <div className="api-error">{message}</div>}

          {/* Toggle rôle (UI) */}
          <div className="field">
            <label className="label">Rôle</label>
            <div className="role-toggle" role="group" aria-label="Choisir un rôle">
              <button
                type="button"
                className={`role-btn ${roleChoisi === "JOUEUR" ? "active" : ""}`}
                onClick={() => setRoleChoisi("JOUEUR")}
              >
                Joueur
              </button>
              <button
                type="button"
                className={`role-btn ${roleChoisi === "CLUB" ? "active" : ""}`}
                onClick={() => setRoleChoisi("CLUB")}
              >
                Club
              </button>
            </div>
          </div>

          <div className="field">
            <label className="label">Email</label>
            <div className="input-wrap">
              <span className="icon email" aria-hidden />
              <input
                className="input"
                type="email"
                placeholder="Votre email : example@gmail.com"
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

          <button className="primary" disabled={isLoading || !roleChoisi}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>

          <Link className="forgot" to="/forgot-password">Mot de passe oublié ?</Link>

          <div className="divider" />
          <p className="continue">Ou continuer avec</p>

          <div className="oauth-row">
            <button type="button" className="oauth google" onClick={loginWithGoogle}>
              <span className="g">G</span> Google
            </button>
            <button type="button" className="oauth facebook" disabled>
              <span className="f">f</span> Facebook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
