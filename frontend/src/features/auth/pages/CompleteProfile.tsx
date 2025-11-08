import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import "./style/CompleteProfile.css"

// Liste des indicatifs téléphoniques principaux
const COUNTRY_CODES = [
  { code: '+213', country: 'Algérie', flag: '🇩🇿' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+34', country: 'Espagne', flag: '🇪🇸' },
  { code: '+212', country: 'Maroc', flag: '🇲🇦' },
  { code: '+216', country: 'Tunisie', flag: '🇹🇳' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'Royaume-Uni', flag: '🇬🇧' },
  { code: '+49', country: 'Allemagne', flag: '🇩🇪' },
  { code: '+39', country: 'Italie', flag: '🇮🇹' },
  { code: '+32', country: 'Belgique', flag: '🇧🇪' },
];

const CompleteProfile = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [countryCode, setCountryCode] = useState('+213'); // Par défaut Algérie
  const [phoneNumber, setPhoneNumber] = useState('');
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

  // Validation du numéro de téléphone (max 10 chiffres)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Garde uniquement les chiffres
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    if (!nom.trim()) {
      setMessage("❌ Le nom est requis.");
      setMessageType('error');
      return false;
    }
    if (!prenom.trim()) {
      setMessage("❌ Le prénom est requis.");
      setMessageType('error');
      return false;
    }
    if (phoneNumber.length < 9 || phoneNumber.length > 10) {
      setMessage("❌ Le numéro de téléphone doit contenir 9 ou 10 chiffres.");
      setMessageType('error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Construction du numéro complet avec l'indicatif
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    try {
      // 🔁 Envoie la mise à jour du profil
      const response = await fetch('http://localhost:8080/api/utilisateur/complete-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nom: nom.trim(),
          prenom: prenom.trim(),
          telephone: fullPhoneNumber
        })
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
            <span className="form-logo-emoji">⚽</span>FIELDZ
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
          <div className="phone-input-wrapper">
            <select
              className="country-code-select"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              {COUNTRY_CODES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              placeholder="0X XX XX XX XX (max 10 chiffres)"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className="form-input phone-number-input"
              required
            />
          </div>
          <div className="phone-hint">
            Format: {countryCode} {phoneNumber || 'XXXXXXXXXX'}
          </div>
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