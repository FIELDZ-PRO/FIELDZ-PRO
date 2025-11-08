import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../../../shared/context/AuthContext';
import { ClubService } from '../../services/ClubService';
import './LoginClub.css';

type JwtPayload = { role?: 'CLUB' | 'JOUEUR' | 'ADMIN' };

export const LoginClub = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ on récupère la fonction login du contexte

  const extractToken = (raw: any): string | null => {
    if (!raw) return null;
    if (typeof raw === 'string') return raw;
    // supporte plusieurs shapes: {token}, {access_token}, {jwt}, etc.
    return raw.token ?? raw.access_token ?? raw.jwt ?? null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const data = await ClubService.Login(email, password);

      const token = extractToken(data);
      if (!token) {
        setMessage("Réponse inattendue du serveur (token manquant).");
        return;
      }

      // ✅ 1) Enregistrer le token via le contexte (met aussi localStorage)
      login(token);

      // ✅ 2) Router selon le rôle décodé
      let role: JwtPayload['role'] = undefined;
      try {
        const payload = jwtDecode<JwtPayload>(token);
        role = payload?.role;
      } catch {
        // si pas de rôle lisible, on envoie quand même sur l’espace club
      }

      if (role === 'CLUB') {
        navigate('/AccueilClub', { replace: true });
      } else if (role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (role === 'JOUEUR') {
        navigate('/joueur', { replace: true });
      } else {
        // par défaut pour ce formulaire spécifique Club
        navigate('/AccueilClub', { replace: true });
      }
    } catch (error) {
      setMessage('Email ou mot de passe incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-club-page">
      <button
        className="back-btn"
        onClick={() => navigate('/')}
      >
        ← Retour
      </button>

      <div className="login-club-container">
        {/* Section gauche - Branding */}
        <div className="branding-section">
          <div className="branding-logo">F</div>
          <h1 className="branding-title">FIELDZ</h1>
          <p className="branding-subtitle">
            Gérez votre club de football simplement et efficacement
          </p>
        </div>

        {/* Section droite - Formulaire */}
        <div className="form-section">
          <div className="form-header">
            <h2 className="form-title">Connexion Club</h2>
            <p className="form-subtitle">Connectez-vous à votre espace club</p>
          </div>

          <form className="login-club-form" onSubmit={handleSubmit} noValidate>
            {message && <div className="login-club-error">{message}</div>}

            <div className="form-group">
              <label className="form-label">Email du club</label>
              <input
                className="form-input"
                type="email"
                placeholder="club@exemple.com"
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
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPwd((s) => !s)}
                  aria-label={showPwd ? 'Masquer' : 'Afficher'}
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
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <a
              className="forgot-link"
              onClick={() => navigate('/ForgotPasswordClub')}
              style={{ cursor: 'pointer' }}
            >
              Mot de passe oublié ?
            </a>

            <button className="submit-btn" type="submit" disabled={isLoading}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
