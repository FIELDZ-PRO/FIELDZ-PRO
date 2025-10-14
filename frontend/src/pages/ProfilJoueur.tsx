import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './style/ProfilJoueur.css';

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
  const [initialData, setInitialData] = useState<PlayerData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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
        const response = await fetch('http://localhost:8080/api/joueur/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) logout();
          throw new Error("Impossible de charger le profil.");
        }
        const data = await response.json();
        setPlayerData(data);
        setInitialData(data);
      } catch (error: any) {
        setMessage({ text: error.message, type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlayerData();
  }, [isAuthenticated, token, navigate, logout]);

  // Met à jour l'état à chaque frappe dans un champ
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayerData(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null);
  };

  // Annule les modifications
  const handleCancel = () => {
    setPlayerData(initialData);
    setIsEditing(false);
    setMessage(null);
  };

  // --- FONCTION DE SAUVEGARDE ---
  const handleSave = async (e: FormEvent) => {
    e.preventDefault(); // Empêche la page de se recharger
    if (!playerData) return;
    setMessage(null);

    try {
      // Envoie les données modifiées au backend
      const response = await fetch('http://localhost:8080/api/utilisateur/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData), // On envoie l'objet complet
      });

      if (!response.ok) {
        // Si le backend renvoie une erreur, on l'affiche
        const errorText = await response.text();
        throw new Error(errorText || 'La mise à jour a échoué.');
      }
      
      const successMessage = await response.text();
      setMessage({ text: successMessage, type: 'success' });
      setIsEditing(false);
      setInitialData(playerData); // Les nouvelles données deviennent la base pour la prochaine modif
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  if (isLoading) return <div className="loading">Chargement...</div>;
  if (!playerData) return <div className="error">{message?.text || "Erreur."}</div>;

  return (
    <div className="profil-page-background">
      <div className="profil-card">
        <button className="back-button" onClick={() => navigate('/joueur')}>
          ← Retour au dashboard
        </button>

        {/* Le formulaire appelle handleSave lors de la soumission */}
        <form onSubmit={handleSave}>
          <div className="profil-header">
            <img src={playerData.photoProfilUrl || 'https://via.placeholder.com/150'} alt="Profil" className="profil-photo"/>
            <h2>{initialData?.prenom} {initialData?.nom}</h2>
            <p className="email-display">{playerData.email}</p>
          </div>
          <div className="profil-fields">
            <div className="field-group">
              <label htmlFor="prenom">Prénom</label>
              <input type="text" name="prenom" value={playerData.prenom || ''} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div className="field-group">
              <label htmlFor="nom">Nom</label>
              <input type="text" name="nom" value={playerData.nom || ''} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div className="field-group">
              <label htmlFor="telephone">Téléphone</label>
              <input type="tel" name="telephone" value={playerData.telephone || ''} onChange={handleChange} disabled={!isEditing} />
            </div>
          </div>

          <div className="profil-actions">
            {isEditing ? (
              <>
                <button type="submit" className="action-button save">💾 Enregistrer</button>
                <button type="button" className="action-button cancel" onClick={handleCancel}>❌ Annuler</button>
              </>
            ) : (
              <button type="button" className="action-button edit" onClick={() => setIsEditing(true)}>✏️ Modifier</button>
            )}
          </div>
          
          {message && <p className={`message ${message.type}`}>{message.text}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfilJoueur;