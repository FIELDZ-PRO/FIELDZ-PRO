import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './style/ProfilClub.css';
import { useNavigate } from 'react-router-dom';
import { ClubImage } from '../../../shared/types';
import { Spinner } from '../../../shared/components/atoms';

// --- Définition des types ---
type Sport = "FOOTBALL" | "TENNIS" | "PADEL" | "BASKET" | "HANDBALL" | "VOLLEY";
const ALL_SPORTS: Sport[] = ["FOOTBALL", "TENNIS", "PADEL", "BASKET", "HANDBALL", "VOLLEY"];

interface ClubData {
  nom: string;
  ville: string;
  adresse: string;
  telephone: string;
  email: string;
  sports: Sport[];
  photoProfilUrl: string; // Logo
  images: ClubImage[];    // Changed from imageUrls to images array with IDs
}

type StatusMessage = {
  text: string;
  type: 'success' | 'error' | '';
};


const ProfilClub = () => {
  // --- Initialisation du hook pour la navigation ---
  const navigate = useNavigate();

  // --- États du composant ---
  const [isEditing, setIsEditing] = useState(false);
  const [clubData, setClubData] = useState<ClubData | null>(null);
  const [initialData, setInitialData] = useState<ClubData | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);
  const [message, setMessage] = useState<StatusMessage>({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);

  // --- Effet pour charger les données ---
  useEffect(() => {
    const fetchClubData = async () => {
      setIsLoading(true);
      try {
        const mockData: ClubData = {
          nom: 'Grand Club Sportif',
          ville: 'Paris',
          adresse: '123 Rue du Sport, 75001 Paris',
          telephone: '0198765432',
          email: 'contact@grandclub.fr',
          sports: ['FOOTBALL', 'TENNIS'],
          photoProfilUrl: 'https://via.placeholder.com/150x150',
          images: [{ id: 1, imageUrl: 'https://via.placeholder.com/1200x250', displayOrder: 0 }],
        };
        setClubData(mockData);
        setInitialData(mockData);
        setPreviewLogo(mockData.photoProfilUrl);
        setPreviewBanner(mockData.images[0]?.imageUrl || null);
      } catch (error) {
        setMessage({ text: 'Erreur lors du chargement du profil.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchClubData();
  }, []);

  // --- Gestionnaires d'événements ---
  // ... (toute la logique de handleInputChange, handleImageChange, etc. reste identique)

   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (clubData) {
      setClubData({ ...clubData, [name]: value });
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') {
          setLogoFile(file);
          setPreviewLogo(reader.result as string);
        } else {
          setBannerFile(file);
          setPreviewBanner(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSport = (sport: Sport) => {
    if (!isEditing || !clubData) return;
    const currentSports = clubData.sports;
    const newSports = currentSports.includes(sport)
      ? currentSports.filter(s => s !== sport)
      : [...currentSports, sport];
    setClubData({ ...clubData, sports: newSports });
  };
  
  const handleCancel = () => {
    setClubData(initialData);
    setPreviewLogo(initialData?.photoProfilUrl || null);
    setPreviewBanner(initialData?.images[0]?.imageUrl || null);
    setIsEditing(false);
    setMessage({ text: '', type: '' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!clubData) return;
    // ... la logique de soumission reste la même
    setMessage({ text: 'Profil du club mis à jour ! (Simulation)', type: 'success' });
    setIsEditing(false);
  };


  // --- Rendu conditionnel ---
  if (isLoading && !clubData) {
    return <Spinner loading={isLoading} text="Chargement du profil du club..." fullScreen />;
  }

  if (!clubData) {
    return <div>Impossible de charger le profil.</div>;
  }

  // --- Rendu du composant ---
  return (
    <div className="profil-page-background">
      <div className="profil-club-card">
        {/* BOUTON CORRIGÉ : navigate(-1) renvoie à la page précédente dans l'historique */}
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Retour
        </button>

        <div className="club-header">
          <div className="club-banner" style={{ backgroundImage: `url(${previewBanner})` }}>
            {isEditing && (
              <label htmlFor="bannerUpload" className="banner-upload-button">
                📷 Changer la bannière
                <input id="bannerUpload" type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'banner')} />
              </label>
            )}
          </div>
          <div className="club-logo-container">
            <img src={previewLogo || ''} alt="Logo du club" className="club-logo" />
             {isEditing && (
                <label htmlFor="logoUpload" className="logo-upload-label">
                  📷
                  <input id="logoUpload" type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'logo')} />
                </label>
              )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="club-form-content">
          <h2 className="club-name">{clubData.nom}</h2>
          
          <div className="profil-fields">
             <div className="field-group">
              <label htmlFor="nom">Nom du club</label>
              <input type="text" id="nom" name="nom" value={clubData.nom} onChange={handleInputChange} disabled={!isEditing} />
            </div>
             <div className="field-group">
              <label htmlFor="ville">Ville</label>
              <input type="text" id="ville" name="ville" value={clubData.ville} onChange={handleInputChange} disabled={!isEditing} />
            </div>
             <div className="field-group">
              <label htmlFor="adresse">Adresse complète</label>
              <input type="text" id="adresse" name="adresse" value={clubData.adresse} onChange={handleInputChange} disabled={!isEditing} />
            </div>
             <div className="field-group">
              <label htmlFor="telephone">Téléphone</label>
              <input type="tel" id="telephone" name="telephone" value={clubData.telephone} onChange={handleInputChange} disabled={!isEditing} />
            </div>
            <div className="field-group">
              <label>Email</label>
              <input type="email" value={clubData.email} disabled />
            </div>
            
            <div className="field-group">
                <label>Sports disponibles</label>
                <div className="sports-container">
                    {ALL_SPORTS.map(sport => (
                        <span 
                            key={sport} 
                            className={`sport-pill ${clubData.sports.includes(sport) ? 'selected' : ''} ${isEditing ? 'editable' : ''}`}
                            onClick={() => toggleSport(sport)}
                        >
                            {sport}
                        </span>
                    ))}
                </div>
            </div>
          </div>
          
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="profil-actions">
            {isEditing ? (
              <>
                <button type="submit" className="action-button save" disabled={isLoading}>💾 Enregistrer</button>
                <button type="button" className="action-button cancel" onClick={handleCancel}>❌ Annuler</button>
              </>
            ) : (
              <button type="button" className="action-button edit" onClick={() => setIsEditing(true)}>✏️ Modifier le profil</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilClub;