import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./style/Login.css";
import React from "react";

type JwtPayload = { role?: "JOUEUR" | string };
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function Login() {
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
      
      if (role === "JOUEUR") {
        navigate("/joueur");
      } else {
        setMessage("Cette page est réservée aux joueurs. Les clubs doivent utiliser 'Connexion Club'.");
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

  const loginWithGoogle = () => {
    window.location.href = `${API_BASE}/oauth2/authorization/google`;
  };

  return (
    <div className="login-page">
      <button 
        className="back-btn"
        onClick={() => navigate('/')}
      >
        ← Retour
      </button>

      <div className="login-container">
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
            <h2 className="form-title">Connexion</h2>
            <p className="form-subtitle">Connecte-toi à ton compte joueur</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {message && <div className="login-error">{message}</div>}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <div className="input-wrapper">
                <input
                  className="form-input password-input"
                  type={showPwd ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  autoComplete="current-password"
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

            <Link className="forgot-link" to="/forgot-password">
              Mot de passe oublié ?
            </Link>

            <button className="submit-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </button>

            <div className="divider-line">
              <span>Ou continuer avec</span>
            </div>

            <div className="oauth-btns">
              <button type="button" className="oauth-btn google-btn" onClick={loginWithGoogle}>
                <span className="oauth-logo">G</span>
                Google
              </button>
              <button type="button" className="oauth-btn facebook-btn" disabled>
                <span className="oauth-logo">f</span>
                Facebook
              </button>
            </div>
          </form>

          <div className="login-footer">
            <p>
              Pas encore de compte ?{" "}
              <Link to="/register" className="register-link">
                Inscris-toi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}