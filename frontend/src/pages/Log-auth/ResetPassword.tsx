import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL || // au cas où
  "http://10.188.124.180:5173/";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!token) {
      setMessage('❌ Lien invalide (token manquant).');
      return;
    }
    if (newPassword.length < 8) {
      setMessage('❌ Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('❌ Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/api/auth/reset-password`,  // <-- corrigé
        { token, newPassword },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMessage('✅ Mot de passe réinitialisé avec succès ! Vous pouvez vous connecter.');
    } catch (error: any) {
      console.error('Erreur :', error);
      const status = error.response?.status;
      if (status === 400 || status === 404) {
        setMessage('❌ Le lien est invalide ou a expiré.');
      } else if (status === 429) {
        setMessage('⛔ Trop de tentatives. Réessayez dans quelques minutes.');
      } else {
        const apiMsg = error.response?.data?.message || error.response?.data;
        setMessage(`❌ ${apiMsg || 'Une erreur est survenue.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 16 }}>
      <h2>Réinitialiser le mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
        />

        <input
          type={showPassword ? 'text' : 'password'}
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
          {showPassword ? '🙈 Masquer' : '👁️ Afficher'}
        </button>

        <button type="submit" style={{ width: '100%' }} disabled={loading || !token}>
          {loading ? 'Réinitialisation…' : 'Réinitialiser'}
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: 10,
            color: message.startsWith('✅') ? 'green' : 'red',
            fontWeight: 500,
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
