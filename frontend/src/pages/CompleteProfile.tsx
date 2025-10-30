import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "./style/completeProfile.css"

const CompleteProfile = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'error', 'success', 'warning'
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Vérifie l'état du profil
  useEffect(() => {
    fetch('http://localhost:8080/api/utilisateur/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(user => {
        if (user.profilComplet) {
          navigate('/joueur');
        } else {
          setIsCheckingProfile(false); // profil incomplet, on affiche le formulaire
        }
      })
      .catch(err => {
        console.error("Erreur profil :", err);
        navigate('/login');
      });
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    setIsSubmitting(true);

    try {
      // 🔁 Envoie la mise à jour du profil
      const response = await fetch('http://localhost:8080/api/utilisateur/complete-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nom, prenom, telephone })
      });

      if (!response.ok) {
        setMessage("❌ Erreur lors de la mise à jour du profil.");
        setMessageType('error');
        setIsSubmitting(false);
        return;
      }

      // ✅ Recharge les données utilisateur à jour
      const res = await fetch('http://localhost:8080/api/utilisateur/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedUser = await res.json();
      console.log("✅ Profil rechargé :", updatedUser);

      if (updatedUser.profilComplet) {
        setMessage("✅ Profil complété avec succès !");
        setMessageType('success');
        setTimeout(() => navigate('/joueur'), 1000);
      } else {
        setMessage("⚠️ Profil toujours incomplet. Réessayez.");
        setMessageType('warning');
        setIsSubmitting(false);
      }

    } catch (error) {
      console.error("Erreur :", error);
      setMessage("❌ Une erreur est survenue.");
      setMessageType('error');
      setIsSubmitting(false);
    }
  };

  // Affiche le loader pendant la vérification du profil
  if (isCheckingProfile) {
    return (
      <div className="complete-profile-container">
        <div className="profile-loader">
          <div className="loader-spinner"></div>
          <p className="loader-text">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="complete-profile-container">
      <form onSubmit={handleSubmit} className="complete-profile-form">
        <div className="form-header">
          <div className="form-logo">
            <span className="form-logo-emoji">🎾</span>FIELDZ
          </div>
          <h1 className="form-title">Complétez votre profil</h1>
        </div>

        <div className="form-group">
          <label className="form-label">Nom *</label>
          <input
            type="text"
            placeholder="Votre nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Prénom *</label>
          <input
            type="text"
            placeholder="Votre prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Téléphone *</label>
          <input
            type="tel"
            placeholder="+213 XX XX XX XX"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <button
          type="submit"
          className="form-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Validation en cours...' : 'Valider'}
        </button>

        {message && (
          <div className={`form-message ${messageType}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CompleteProfile;