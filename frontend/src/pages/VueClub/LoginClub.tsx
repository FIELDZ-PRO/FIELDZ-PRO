import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClubService } from '../../services/ClubService';
import './LoginClub.css';

export const LoginClub = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const data = await ClubService.Login(email, password);
      console.log("Token:", data.token);
      navigate("/AccueilClub");
    } catch (error) {
      setMessage("Email ou mot de passe incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginGoogle = () => {
    // Logique OAuth Google pour clubs si nécessaire
    alert("Connexion Google pour clubs à venir");
  };

  return (
    <>
      <button 
        className="back-to-home"
        onClick={() => navigate('/')}
      >
        ← Retour
      </button>
      
      <div className="auth-page">
        <div className="auth-card">
          <div className="avatar" aria-hidden />
          <h1 className="title">Espace Club</h1>
          <p className="subtitle">Connectez-vous à votre compte club</p>

          <form className="form" onSubmit={handleSubmit} noValidate>
            {message && <div className="api-error">{message}</div>}

            <div className="field">
              <label className="label">Email du club</label>
              <div className="input-wrap">
                <span className="icon email" aria-hidden />
                <input
                  className="input"
                  type="email"
                  placeholder="club@exemple.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button className="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </button>

            <a 
              className="forgot" 
              onClick={() => navigate("/ForgotPasswordClub")}
              style={{ cursor: 'pointer' }}
            >
              Mot de passe oublié ?
            </a>

            <div className="divider" />
            <p className="continue">Ou continuer avec</p>

            <div className="oauth-row">
              <button 
                type="button" 
                className="oauth google" 
                onClick={handleLoginGoogle}
              >
                <span className="g">G</span> Google
              </button>
              <button type="button" className="oauth facebook" disabled>
                <span className="f">f</span> Facebook
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};