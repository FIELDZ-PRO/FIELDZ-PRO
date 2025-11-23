import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import './style/ProfilJoueur.css';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// L'interface correspond au JoueurDto du backend
interface PlayerData {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  description?: string | null;
  photoProfilUrl: string | null;
}

const ProfilJoueur = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated, logout } = useAuth();

  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchPlayerData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/joueur/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) logout();
          throw new Error("Impossible de charger le profil.");
        }
        const data = await response.json();
        setPlayerData(data);
      } catch (error: any) {
        setMessage({ text: error.message, type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlayerData();
  }, [isAuthenticated, token, navigate, logout]);

  if (isLoading) {
    return (
      <div className="profil-page-background">
        <div className="loading">Chargement du profil...</div>
      </div>
    );
  }

  if (!playerData) {
    return (
      <div className="profil-page-background">
        <div className="error">{message?.text || "Erreur lors du chargement du profil."}</div>
      </div>
    );
  }

  return (
    <div className="profil-page-background">
      <div className="profil-container">
        <button className="back-button" onClick={() => navigate('/joueur')}>
          ← Retour au dashboard
        </button>

        <div className="profil-page-header">
          <h1 className="profil-page-title">Mon Profil</h1>
          <p className="profil-page-subtitle">Tes informations personnelles</p>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profil-card">
          {/* Header avec photo et infos */}
          <div className="profil-header">
            {playerData.photoProfilUrl ? (
              <img
                src={playerData.photoProfilUrl}
                alt="Profil"
                className="profil-photo"
              />
            ) : (
              <div className="profil-photo-wrapper">
                <span className="profil-user-icon">
                  {playerData.prenom?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}

            <div className="profil-header-info">
              <h2>{playerData.prenom} {playerData.nom}</h2>
              <p className="email-display">{playerData.email}</p>
            </div>
          </div>

          {/* Informations en lecture seule */}
          <div className="profil-form">
            <div className="profil-fields">
              <div className="field-group">
                <label htmlFor="prenom">
                  <span className="field-icon">👤</span>
                  Prénom
                </label>
                <input
                  type="text"
                  id="prenom"
                  value={playerData.prenom || ''}
                  disabled
                  className="readonly-field"
                />
              </div>

              <div className="field-group">
                <label htmlFor="nom">
                  <span className="field-icon">👤</span>
                  Nom
                </label>
                <input
                  type="text"
                  id="nom"
                  value={playerData.nom || ''}
                  disabled
                  className="readonly-field"
                />
              </div>

              <div className="field-group">
                <label htmlFor="email">
                  <span className="field-icon">✉️</span>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={playerData.email || ''}
                  disabled
                  className="readonly-field"
                />
              </div>

              <div className="field-group">
                <label htmlFor="telephone">
                  <span className="field-icon">📞</span>
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="telephone"
                  value={playerData.telephone || 'Non renseigné'}
                  disabled
                  className="readonly-field"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilJoueur;