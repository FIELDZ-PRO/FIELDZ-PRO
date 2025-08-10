import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await axios.post(`${API_BASE}/auth/reset-password`, {
        token,
        newPassword
      });

      setMessage("✅ Mot de passe réinitialisé avec succès !");
    } catch (error) {
      console.error("Erreur :", error);
      const status = error.response?.status;
      console.log("Code d'erreur reçu :", status);

      if (status === 400 || status === 404) {
        setMessage("❌ Le lien est invalide ou a expiré.");
      } else if (status === 429) {
        setMessage("⛔ Trop de tentatives. Réessayez dans quelques minutes.");
      } else {
        setMessage("❌ Une erreur est survenue.");
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 16 }}>
      <h2>Réinitialiser le mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{ marginBottom: 10 }}
        >
          {showPassword ? "🙈 Masquer" : "👁️ Afficher"}
        </button>

        <button type="submit" style={{ width: '100%' }}>
          Réinitialiser
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: 10,
            color: message.startsWith("✅") ? "green" : "red",
            fontWeight: 500
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
