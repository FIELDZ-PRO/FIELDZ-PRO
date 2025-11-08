import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style/Login.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/forgot-password`,
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setSuccess(true);
      setMessage(res.data?.message || "Si l'email existe, un lien a été envoyé.");
    } catch (err: any) {
      console.error(err);
      const apiMsg = err?.response?.data?.message;
      setMessage(apiMsg || "Erreur : impossible d'envoyer la demande.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="avatar" aria-hidden />
        <h1 className="title">Mot de passe oublié</h1>
        <p className="subtitle">Entrez votre email pour recevoir un lien de réinitialisation</p>

        {success ? (
          <div className="form">
            <div style={{ 
              padding: '1rem', 
              background: '#d4edda', 
              color: '#155724', 
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              ✅ {message}
            </div>
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Vérifiez votre boîte mail (et vos spams)
            </p>
            <Link to="/login" className="primary" style={{ textAlign: 'center', display: 'block' }}>
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form className="form" onSubmit={handleSubmit} noValidate>
            {message && !success && <div className="api-error">{message}</div>}

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
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <button className="primary" disabled={isLoading}>
              {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
            </button>

            <Link className="forgot" to="/login">Retour à la connexion</Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;