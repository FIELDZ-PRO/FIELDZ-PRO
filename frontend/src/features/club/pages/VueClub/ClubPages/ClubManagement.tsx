import React, { useEffect, useState, useRef } from 'react';
import { Settings, DoorOpen, DoorClosed,User, MapPin, Mail, Phone, Image as ImageIcon, Loader2, Text, ShieldCheck, ChevronLeft, ChevronRight, Trash2, Plus, Dumbbell, X } from 'lucide-react';
import './style/ClubManagement.css';
import { getClubMe, modifyInfoClub, addClubImage, deleteClubImage, ClubDto } from '../../../../../shared/services/ClubService';
import { ClubImage } from '../../../../../shared/types';
import CustomAlert, { AlertType } from '../../../../../shared/components/atoms/CustomAlert';

// Available sports list - must match backend Sport enum exactly
const AVAILABLE_SPORTS = ['FOOTBALL', 'PADEL', 'TENNIS', 'BASKET', 'HANDBALL', 'VOLLEY'] as const;

interface AlertState {
  show: boolean;
  type: AlertType;
  message: string;
}

/** ====== Limites centralisées ====== */
const MAX_DESC = 4000;     // limite description
const MAX_POLICY = 6000;   // limite politique
const SOFT_WARN_PCT = 0.9; // avertir à 90%

/** Textarea réutilisable avec compteur + clamp + blocage au coller */
type TAProps = {
  label: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  rows?: number;
  disabled?: boolean;
  placeholder?: string;
};
const TextareaWithCounter: React.FC<TAProps> = ({
  label, value, onChange, maxLength, rows = 8, disabled, placeholder
}) => {
  const remaining = maxLength - value.length;
  const warn = value.length >= Math.floor(maxLength * SOFT_WARN_PCT);
  const over = remaining < 0;

  const clamp = (s: string) => s.slice(0, maxLength);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(clamp(e.target.value));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const ta = e.target as HTMLTextAreaElement;
    const pasted = e.clipboardData.getData('text');
    const start = ta.selectionStart ?? value.length;
    const end = ta.selectionEnd ?? value.length;
    const newText = value.slice(0, start) + pasted + value.slice(end);
    const clamped = clamp(newText);
    e.preventDefault();
    onChange(clamped);
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <textarea
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        className="fz-textarea"
        maxLength={maxLength} // ce maxLength HTML sert aussi d’aide pour certains lecteurs
      />
      <div
        className="fz-counter"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 12,
          marginTop: 4,
          color: over ? '#dc2626' : warn ? '#d97706' : '#6b7280'
        }}
      >
        <span>{warn && !over ? 'Presque au maximum…' : ' '}</span>
        <span>{Math.max(remaining, 0)} caractères restants</span>
      </div>
    </div>
  );
};

const ClubManagementPage = () => {
  const [clubInfo, setClubInfo] = useState<Omit<ClubDto, 'id'>>({
    nom: '',
    ville: '',
    adresse: '',
    telephone: '',
    images: [],
    description: '',
    politique: '',
    heureOuverture: '',
    heureFermeture: '',
    sports: [],
    locationLink: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [alertState, setAlertState] = useState<AlertState>({ show: false, type: 'info', message: '' });

  const showAlert = (type: AlertType, message: string) => {
    setAlertState({ show: true, type, message });
  };

  const fetchClubInfo = async () => {
    try {
      const data = await getClubMe();
      setClubInfo(data);
      // Reset to first image when data is loaded
      if (data.images && data.images.length > 0) {
        setCurrentImageIndex(0);
      }
    } catch (error) {
      showAlert('error', 'Erreur lors de la récupération des informations du club.');
    }
  };

  useEffect(() => {
    fetchClubInfo();
    // console.log('This is the club info : ', clubInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Garde-fou: empêcher l’envoi si on dépasse la limite */
  const overDesc = (clubInfo.description ?? '').length > MAX_DESC;
  const overPolicy = (clubInfo.politique ?? '').length > MAX_POLICY;
  const hasOverLimit = overDesc || overPolicy;

  const handleSave = async () => {
    if (hasOverLimit) {
      const message = `Le texte dépasse la limite autorisée.\n` +
        (overDesc ? `- Description: max ${MAX_DESC} caractères\n` : '') +
        (overPolicy ? `- Politique: max ${MAX_POLICY} caractères` : '');
      return showAlert('warning', message);
    }

    // Trim léger + clamp avant envoi (double sécurité)
    const payload = {
      ...clubInfo,
      description: (clubInfo.description ?? '').trim().slice(0, MAX_DESC),
      politique: (clubInfo.politique ?? '').trim().slice(0, MAX_POLICY),
    };

    try {
      await modifyInfoClub(payload);
      showAlert('success', 'Modifications enregistrées avec succès !');
      setIsEditing(false);
    } catch (error) {
      showAlert('error', 'Erreur lors de la sauvegarde des modifications.');
    }
  };

  const handleFile = async (file: File) => {
    setIsUploading(true);
    try {
      const uploadedImage = await addClubImage(file);
      const updatedImages = [...(clubInfo.images || []), uploadedImage];
      const updatedClubInfo = { ...clubInfo, images: updatedImages };
      setClubInfo(updatedClubInfo);
      // Set current index to the newly added image
      setCurrentImageIndex(updatedImages.length - 1);
      showAlert('success', 'Image ajoutée avec succès !');
    } catch (error) {
      showAlert('error', "Erreur lors du téléchargement de l'image");
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (index: number) => {
    if (!clubInfo.images || clubInfo.images.length === 0) return;

    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?');
    if (!confirmDelete) return;

    const imageToDelete = clubInfo.images[index];

    try {
      // Call backend API to delete the image
      await deleteClubImage(imageToDelete.id);

      // Update local state after successful deletion
      const updatedImages = clubInfo.images.filter((_, i) => i !== index);
      setClubInfo({ ...clubInfo, images: updatedImages });

      // Adjust current index if needed
      if (currentImageIndex >= updatedImages.length && updatedImages.length > 0) {
        setCurrentImageIndex(updatedImages.length - 1);
      } else if (updatedImages.length === 0) {
        setCurrentImageIndex(0);
      }
      showAlert('success', 'Image supprimée avec succès !');
    } catch (error) {
      showAlert('error', "Erreur lors de la suppression de l'image");
      console.error('Delete failed:', error);
    }
  };

  const handlePrevImage = () => {
    if (!clubInfo.images || clubInfo.images.length === 0) return;
    setSlideDirection('right');
    setCurrentImageIndex((prev) => (prev === 0 ? clubInfo.images!.length - 1 : prev - 1));
    setTimeout(() => setSlideDirection(null), 500);
  };

  const handleNextImage = () => {
    if (!clubInfo.images || clubInfo.images.length === 0) return;
    setSlideDirection('left');
    setCurrentImageIndex((prev) => (prev === clubInfo.images!.length - 1 ? 0 : prev + 1));
    setTimeout(() => setSlideDirection(null), 500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  };

  return (
    <div className="club-management-page">
      {alertState.show && (
        <CustomAlert
          type={alertState.type}
          message={alertState.message}
          onClose={() => setAlertState({ ...alertState, show: false })}
          duration={5000}
        />
      )}

      <div className="page-header">
        <h1>Gestion du club</h1>
        <button
          className={`btn-add btn-primary ${hasOverLimit ? 'btn-disabled' : ''}`}
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={hasOverLimit} // désactive si dépassement
          title={hasOverLimit ? 'Réduisez le texte avant de sauvegarder' : undefined}
        >
          <Settings size={16} />
          {isEditing ? 'Sauvegarder' : 'Modifier'}
        </button>
      </div>

      {/* 🖼️ Section images du club */}
      <div className={`image-section ${isEditing ? 'editing' : ''} ${dragActive ? 'drag-active' : ''}`}>
        <h2><ImageIcon size={18} /> Images du club</h2>

        <div className="image-container">
          {clubInfo.images && clubInfo.images.length > 0 ? (
            <div className="image-slider-container">
              <div className="image-preview-wrapper">
                <img
                  key={currentImageIndex}
                  src={clubInfo.images[currentImageIndex].imageUrl}
                  alt={`Image ${currentImageIndex + 1} du club`}
                  className={`image-preview ${slideDirection ? `club-image-slide-${slideDirection}` : ''}`}
                />

                {/* Navigation arrows */}
                {clubInfo.images.length > 1 && (
                  <>
                    <button
                      className="slider-arrow slider-arrow-left"
                      onClick={handlePrevImage}
                      aria-label="Image précédente"
                    >
                      <ChevronLeft size={32} />
                    </button>
                    <button
                      className="slider-arrow slider-arrow-right"
                      onClick={handleNextImage}
                      aria-label="Image suivante"
                    >
                      <ChevronRight size={32} />
                    </button>
                  </>
                )}

                {/* Delete button (only in edit mode) */}
                {isEditing && (
                  <button
                    className="delete-image-btn"
                    onClick={() => handleDeleteImage(currentImageIndex)}
                    aria-label="Supprimer cette image"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              {/* Image indicators */}
              {clubInfo.images.length > 1 && (
                <div className="image-indicators">
                  {clubInfo.images.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Aller à l'image ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Image counter */}
              <div className="image-counter">
                {currentImageIndex + 1} / {clubInfo.images.length}
              </div>
            </div>
          ) : (
            <p className="no-image">Aucune image disponible</p>
          )}

          {isUploading && (
            <div className="image-loader-overlay">
              <Loader2 className="image-loader" size={40} />
              <p>Upload en cours...</p>
            </div>
          )}
        </div>

        {isEditing && (
          <div
            className="dropzone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <p>Glissez une image ici ou cliquez pour en ajouter</p>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label
              className="upload-label"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus size={20} style={{ marginRight: '8px' }} />
              <span className="upload-button">Ajouter une image</span>
            </label>
          </div>
        )}
      </div>

      {/* 🧾 Informations du club */}
      <div className="management-content">
        <div className="club-info-section2">
          <div className="info-form">
            <div className="form-group">
              <label><User size={16} /> Nom du club</label>
              <input
                type="text"
                value={clubInfo.nom}
                onChange={(e) => setClubInfo({ ...clubInfo, nom: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label><MapPin size={16} /> Adresse</label>
              <input
                type="text"
                value={clubInfo.adresse}
                onChange={(e) => setClubInfo({ ...clubInfo, adresse: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label><Mail size={16} /> Wilaya</label>
              <input
                type="text"
                value={clubInfo.ville}
                onChange={(e) => setClubInfo({ ...clubInfo, ville: e.target.value })}
                disabled={!isEditing}
              />
            </div>
                    <div className="form-group">
              <label><DoorOpen size={16} /> Heure d'ouverture</label>
              <input
                type="time"
                value={clubInfo.heureOuverture ?? ''}
                onChange={(e) => setClubInfo({ ...clubInfo, heureOuverture: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label><DoorClosed size={16} /> Heure de fermeture</label>
              <input
                type="time"
                value={clubInfo.heureFermeture ?? ''}
                onChange={(e) => setClubInfo({ ...clubInfo, heureFermeture: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label><Phone size={16} /> Téléphone</label>
              <input
                type="tel"
                value={clubInfo.telephone ?? ''}
                onChange={(e) => setClubInfo({ ...clubInfo, telephone: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label><MapPin size={16} /> Lien de localisation</label>
              <input
                type="url"
                value={clubInfo.locationLink ?? ''}
                onChange={(e) => setClubInfo({ ...clubInfo, locationLink: e.target.value })}
                disabled={!isEditing}
                placeholder="https://maps.google.com/..."
              />
            </div>

            {/* ===== Sports Management ===== */}
            <div className="form-group">
              <label><Dumbbell size={16} /> Sports proposés</label>
              <div className="sports-selector">
                {AVAILABLE_SPORTS.map((sport) => {
                  const isSelected = clubInfo.sports?.includes(sport);
                  return (
                    <button
                      key={sport}
                      type="button"
                      className={`sport-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        if (!isEditing) return;
                        const currentSports = clubInfo.sports || [];
                        if (isSelected) {
                          setClubInfo({
                            ...clubInfo,
                            sports: currentSports.filter(s => s !== sport)
                          });
                        } else {
                          setClubInfo({
                            ...clubInfo,
                            sports: [...currentSports, sport]
                          });
                        }
                      }}
                      disabled={!isEditing}
                    >
                      {sport}
                      {isSelected && isEditing && <X size={14} style={{ marginLeft: '4px' }} />}
                    </button>
                  );
                })}
              </div>
              {!clubInfo.sports || clubInfo.sports.length === 0 ? (
                <p className="sports-hint">Aucun sport sélectionné</p>
              ) : null}
            </div>

            {/* ===== Textareas avec compteur & limites ===== */}
            <TextareaWithCounter
              label={<><Text size={16} /> Description du club</>}
              value={clubInfo.description ?? ''}
              onChange={(v) => setClubInfo({ ...clubInfo, description: v })}
              maxLength={MAX_DESC}
              rows={10}
              disabled={!isEditing}
              placeholder="Installations, ambiance, services proposés, coachs, évènements, etc."
            />

            <TextareaWithCounter
              label={<><ShieldCheck size={16} /> Politique du club</>}
              value={clubInfo.politique ?? ''}
              onChange={(v) => setClubInfo({ ...clubInfo, politique: v })}
              maxLength={MAX_POLICY}
              rows={10}
              disabled={!isEditing}
              placeholder="Règles d’annulation, ponctualité, sécurité, météo, responsabilité, etc."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubManagementPage;
