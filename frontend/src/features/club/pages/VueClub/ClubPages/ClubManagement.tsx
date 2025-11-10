import React, { useEffect, useState, useRef } from 'react';
import { Settings, User, MapPin, Mail, Phone, Image as ImageIcon, Loader2, Text, ShieldCheck } from 'lucide-react';
import './style/ClubManagement.css';
import { getClubMe, modifyInfoClub, uploadClubImage, ClubDto } from '../../../../../shared/services/ClubService';

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
    banniereUrl: '',
    description: '',
    politique: '',
    sports: [],
  });

  const token = localStorage.getItem('token');
  const [isEditing, setIsEditing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchClubInfo = async () => {
    try {
      const data = await getClubMe();
      setClubInfo(data);
      if (data.banniereUrl) setPreviewUrl(data.banniereUrl);
    } catch (error) {
      alert('Erreur lors de la récupération des informations du club.');
    }
  };

  useEffect(() => {
    fetchClubInfo();
    // console.log('This is the club info : ', clubInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /** Garde-fou: empêcher l’envoi si on dépasse la limite */
  const overDesc = (clubInfo.description ?? '').length > MAX_DESC;
  const overPolicy = (clubInfo.politique ?? '').length > MAX_POLICY;
  const hasOverLimit = overDesc || overPolicy;

  const handleSave = async () => {
    if (hasOverLimit) {
      return alert(
        `Le texte dépasse la limite autorisée.\n` +
        (overDesc ? `- Description: max ${MAX_DESC} caractères\n` : '') +
        (overPolicy ? `- Politique: max ${MAX_POLICY} caractères` : '')
      );
    }

    // Trim léger + clamp avant envoi (double sécurité)
    const payload = {
      ...clubInfo,
      description: (clubInfo.description ?? '').trim().slice(0, MAX_DESC),
      politique: (clubInfo.politique ?? '').trim().slice(0, MAX_POLICY),
    };

    try {
      await modifyInfoClub(payload);
      setIsEditing(false);
    } catch (error) {
      alert('Erreur lors de la sauvegarde des modifications.');
    }
  };

  const handleFile = async (file: File) => {
    setIsUploading(true);
    try {
      const uploadedUrl = await uploadClubImage(file);
      const updatedClubInfo = { ...clubInfo, banniereUrl: uploadedUrl };
      setClubInfo(updatedClubInfo);
      setPreviewUrl(uploadedUrl);
      await modifyInfoClub({
        ...updatedClubInfo,
        description: (updatedClubInfo.description ?? '').trim().slice(0, MAX_DESC),
        politique: (updatedClubInfo.politique ?? '').trim().slice(0, MAX_POLICY),
      });
    } catch (error) {
      alert("Erreur lors du téléchargement de l'image");
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
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

      {/* 🖼️ Section image du club */}
      <div className={`image-section ${isEditing ? 'editing' : ''} ${dragActive ? 'drag-active' : ''}`}>
        <h2><ImageIcon size={18} /> Bannière du club</h2>

        <div className="image-container">
          {previewUrl ? (
            <div className="image-preview-container">
              <img src={previewUrl} alt="Bannière du club" className="image-preview" />
            </div>
          ) : (
            <p className="no-image">Aucune bannière disponible</p>
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
            <p>Glissez une image ici ou cliquez pour en choisir une</p>
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
              <span className="upload-button">Choisir une image</span>
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
              <label><Phone size={16} /> Téléphone</label>
              <input
                type="tel"
                value={clubInfo.telephone ?? ''}
                onChange={(e) => setClubInfo({ ...clubInfo, telephone: e.target.value })}
                disabled={!isEditing}
              />
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
