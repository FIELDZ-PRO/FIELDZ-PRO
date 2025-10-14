import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./style/Register.css";
import React from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function Register() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    motDePasse: "",
    confirm: "",
  });

  const [showPwd, setShowPwd] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.nom.trim()) return "Nom requis";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Email invalide";
    if (form.motDePasse.length < 6) return "Mot de passe trop court (≥6)";
    if (form.motDePasse !== form.confirm) return "Les mots de passe ne correspondent pas";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const v = validate();
    if (v) return setMessage(v);

    setIsLoading(true);
    try {
      await axios.post(`${API_BASE}/api/auth/register`, {
        nom: form.nom,
        email: form.email,
        motDePasse: form.motDePasse,
        role: "JOUEUR", // ← Toujours JOUEUR
        adresse: "",
        nomClub: ""
      });
      navigate("/login");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erreur lors de l'inscription.";
      setMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="avatar" aria-hidden />
        <h1 className="title">Bienvenue</h1>
        <p className="subtitle">Créez votre compte joueur</p>

        {/* Onglets (actif à droite) */}
        <div className="tabs register">
          <Link to="/login" className="tab">Connexion</Link>
          <Link to="/register" className="tab">Inscription</Link>
          <span className="indicator" />
        </div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          {message && <div className="api-error">{message}</div>}

          <div className="field">
            <label className="label">Votre nom</label>
            <div className="input-wrap">
              <input
                className="input"
                name="nom"
                placeholder="Exemple : Aziz CoupDeCouteau"
                value={form.nom}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Email</label>
            <div className="input-wrap">
              <span className="icon email" aria-hidden />
              <input
                className="input"
                type="email"
                name="email"
                placeholder="Votre email : example@gmail.com"
                value={form.email}
                onChange={onChange}
                autoComplete="email"
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
                name="motDePasse"
                placeholder="Votre mot de passe"
                value={form.motDePasse}
                onChange={onChange}
                autoComplete="new-password"
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

          <div className="field">
            <label className="label">Confirmez votre mot de passe</label>
            <div className="input-wrap">
              <span className="icon lock" aria-hidden />
              <input
                className="input"
                type={showPwd ? "text" : "password"}
                name="confirm"
                placeholder="Confirmation"
                value={form.confirm}
                onChange={onChange}
                autoComplete="new-password"
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
            {isLoading ? "Création..." : "S'inscrire"}
          </button>

          <div className="divider" />
          <p className="continue">Ou continuer avec</p>

          <div className="oauth-row">
            <button type="button" className="oauth google" disabled>
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