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
        role: "JOUEUR",
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

  const registerWithGoogle = () => {
    window.location.href = `${API_BASE}/oauth2/authorization/google`;
  };

  return (
    <div className="register-page">
      <button 
        className="back-btn"
        onClick={() => navigate('/')}
      >
        ← Retour
      </button>

      <div className="register-container">
        {/* Section gauche - Branding */}
        <div className="branding-section">
          <div className="branding-logo">F</div>
          <h1 className="branding-title">FIELDZ</h1>
          <p className="branding-motto">Cliki Tiri Marki</p>
          <p className="branding-subtitle">
            Rejoins ta communauté de sport et trouve ton prochain défis !
          </p>
        </div>

        {/* Section droite - Formulaire */}
        <div className="form-section">
          <div className="form-header">
            <h2 className="form-title">Inscription</h2>
            <p className="form-subtitle">Crée ton compte joueur gratuitement</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit} noValidate>
            {message && <div className="register-error">{message}</div>}

            <div className="form-group">
              <label className="form-label">Nom</label>
              <input
                className="form-input"
                name="nom"
                placeholder="Nom"
                value={form.nom}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="exemple@email.com"
                value={form.email}
                onChange={onChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <div className="input-wrapper">
                <input
                  className="form-input password-input"
                  type={showPwd ? "text" : "password"}
                  name="motDePasse"
                  placeholder="Min. 6 caractères"
                  value={form.motDePasse}
                  onChange={onChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPwd((s) => !s)}
                  aria-label={showPwd ? "Masquer" : "Afficher"}
                >
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    {showPwd ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirmer le mot de passe</label>
              <div className="input-wrapper">
                <input
                  className="form-input password-input"
                  type={showPwd ? "text" : "password"}
                  name="confirm"
                  placeholder="Confirmez"
                  value={form.confirm}
                  onChange={onChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPwd((s) => !s)}
                  aria-label={showPwd ? "Masquer" : "Afficher"}
                >
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    {showPwd ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <button className="submit-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Création..." : "Créer mon compte"}
            </button>

            <div className="divider-line">
              <span>Ou continuer avec</span>
            </div>

            <div className="oauth-btns">
              <button type="button" className="oauth-btn google-btn" onClick={registerWithGoogle}>
                <span className="oauth-logo">G</span>
                Google
              </button>
              <button type="button" className="oauth-btn facebook-btn" disabled>
                <span className="oauth-logo">f</span>
                Facebook
              </button>
            </div>
          </form>

          <div className="register-footer">
            <p>
              Déjà un compte ?{" "}
              <Link to="/login" className="login-link">
                Connecte-toi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}