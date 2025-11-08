import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import './style/resetpassword.css';
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!token) {
      setMessage('Lien invalide (token manquant).');
      return;
    }
    if (newPassword.length < 8) {
      setMessage('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/api/auth/reset-password`,
        { token, newPassword },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setSuccess(true);
      setMessage('Mot de passe réinitialisé avec succès !');
    } catch (error: any) {
      console.error('Erreur :', error);
      const status = error.response?.status;
      if (status === 400 || status === 404) {
        setMessage('Le lien est invalide ou a expiré.');
      } else if (status === 429) {
        setMessage('Trop de tentatives. Réessayez dans quelques minutes.');
      } else {
        const apiMsg = error.response?.data?.message || error.response?.data;
        setMessage(apiMsg || 'Une erreur est survenue.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="avatar" aria-hidden />
        <h1 className="title">Réinitialiser le mot de passe</h1>
        <p className="subtitle">Choisissez un nouveau mot de passe sécurisé</p>

        {success ? (
          <div className="form">
            <div className="api-success" style={{ 
              padding: '1rem', 
              background: '#d4edda', 
              color: '#155724', 
              borderRadius: '0.5rem',
              marginBottom: '1rem'
            }}>
              ✅ {message}
            </div>
            <Link to="/login" className="primary" style={{ textAlign: 'center', display: 'block' }}>
              Se connecter
            </Link>
          </div>
        ) : (
          <form className="form" onSubmit={handleSubmit} noValidate>
            {message && <div className="api-error">{message}</div>}

            <div className="field">
              <label className="label">Nouveau mot de passe</label>
              <div className="input-wrap">
                <span className="icon lock" aria-hidden />
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 caractères"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Confirmer le mot de passe</label>
              <div className="input-wrap">
                <span className="icon lock" aria-hidden />
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Retapez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button className="primary" disabled={loading || !token}>
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>

            <Link className="forgot" to="/login">Retour à la connexion</Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;