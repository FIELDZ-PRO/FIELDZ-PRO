import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import './style/ProfilJoueur.css';

const API_BASE = import.meta.env.VITE_API_URL || "https://prime-cherida-fieldzz-17996b20.koyeb.app/api";

// L'interface correspond au JoueurDto du backend
interface PlayerData {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  photoProfilUrl: string | null;
}

const ProfilJoueur = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated, logout } = useAuth();

  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [formData, setFormData] = useState<PlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchPlayerData = async () => {
      setIsLoading(true);
      setMessage(null);
      try {
        const response = await fetch(`${API_BASE}/joueur/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // Vérifier le statut HTTP
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            logout();
            return;
          }
          const errorText = await response.text();
          console.error(`Error ${response.status}:`, errorText);
          throw new Error(`Erreur serveur (${response.status})`);
        }

        // Lire le corps de la réponse une seule fois
        const text = await response.text();

        // Vérifier si la réponse est vide
        if (!text || text.trim() === '') {
          console.error('Empty response from server');
          throw new Error("Le serveur n'a renvoyé aucune donnée");
        }

        // Vérifier le content-type
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error('Non-JSON response:', text.substring(0, 200));
          throw new Error("Réponse invalide du serveur");
        }

        // Parser le JSON
        try {
          const data = JSON.parse(text);
          setPlayerData(data);
          setFormData(data);
        } catch (parseError) {
          console.error('JSON parse error:', parseError, 'Text:', text.substring(0, 200));
          throw new Error("Impossible de lire les données du profil");
        }
      } catch (error: any) {
        console.error('Fetch player error:', error);
        const message = error.message || 'Erreur lors du chargement du profil';
        setMessage({ text: message, type: 'error' });
        setPlayerData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlayerData();
  }, [isAuthenticated, token, navigate, logout]);

  const handleEdit = () => {
    setIsEditing(true);
    setMessage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(playerData);
    setMessage(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    if (!formData) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE}/utilisateur/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          telephone: formData.telephone,
        }),
      });

      // Vérifier le statut HTTP
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout();
          return;
        }
        const errorText = await response.text();
        console.error(`Update error ${response.status}:`, errorText);
        throw new Error(`Erreur serveur (${response.status})`);
      }

      // Lire le corps de la réponse une seule fois
      const text = await response.text();

      // Vérifier si la réponse est vide
      if (!text || text.trim() === '') {
        console.error('Empty response from server');
        throw new Error("Le serveur n'a renvoyé aucune donnée");
      }

      // Vérifier le content-type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error("Réponse invalide du serveur");
      }

      // Parser le JSON
      try {
        const updatedData = JSON.parse(text);
        setPlayerData(updatedData);
        setFormData(updatedData);
        setIsEditing(false);
        setMessage({ text: 'Profil mis à jour avec succès !', type: 'success' });
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Text:', text.substring(0, 200));
        throw new Error("Impossible de lire la réponse du serveur");
      }
    } catch (error: any) {
      console.error('Save profile error:', error);
      const message = error.message || 'Erreur lors de la sauvegarde';
      setMessage({ text: message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

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

          {/* Formulaire de modification */}
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
                  name="prenom"
                  value={formData?.prenom || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={isEditing ? "editable-field" : "readonly-field"}
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
                  name="nom"
                  value={formData?.nom || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={isEditing ? "editable-field" : "readonly-field"}
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
                  name="email"
                  value={formData?.email || ''}
                  disabled
                  className={isEditing ? "editable-field" : "readonly-field"}
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
                  name="telephone"
                  value={formData?.telephone || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={isEditing ? "editable-field" : "readonly-field"}
                  placeholder="Votre numéro de téléphone"
                />
              </div>


            </div>

            {/* Boutons d'action */}
            <div className="profil-actions">
              {!isEditing ? (
                <button className="profil-btn-primary" onClick={handleEdit}>
                  Modifier le profil
                </button>
              ) : (
                <>
                  <button
                    className="profil-btn-success"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? '⏳ Enregistrement...' : '✅ Enregistrer'}
                  </button>
                  <button
                    className="profil-btn-cancel"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    ❌ Annuler
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilJoueur;