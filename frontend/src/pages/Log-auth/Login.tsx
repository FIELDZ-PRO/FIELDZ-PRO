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
                <svg className="oauth-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button type="button" className="oauth-btn facebook-btn" disabled>
                <svg className="oauth-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  <path fill="#FFF" d="M16.671 15.543l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.513V4.996s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.642H7.078v3.47h3.047v8.385a12.14 12.14 0 003.75 0v-8.385h2.796z"/>
                </svg>
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