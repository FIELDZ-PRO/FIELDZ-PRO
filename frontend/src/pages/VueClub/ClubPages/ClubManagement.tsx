import React, { useEffect, useState, useRef } from 'react';
import { Settings, User, MapPin, Mail, Phone, Image as ImageIcon, Loader2, Text, ShieldCheck } from 'lucide-react'; // Loader2 for animation
import './style/ClubManagement.css';
import { getClubMe, modifyInfoClub, uploadClubImage } from '../../../services/ClubService';
import { ClubDto } from '../../../services/ClubService';

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

    const token = localStorage.getItem("token");
    const [isEditing, setIsEditing] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false); // 🆕 new state
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const fetchClubInfo = async () => {
        try {
            const data = await getClubMe();
            console.log("this is the data received : ")
            console.log(data);
            setClubInfo(data);
            if (data.banniereUrl) setPreviewUrl(data.banniereUrl);
        } catch (error) {
            alert("Erreur lors de la récupération des informations du club.");
        }
    };

    useEffect(() => {
        fetchClubInfo();
        console.log("This is the club info : ")
        console.log(clubInfo)
    }, [token]);

    const handleSave = async () => {
        try {
            await modifyInfoClub(clubInfo);
            setIsEditing(false);
        } catch (error) {
            alert("Erreur lors de la sauvegarde des modifications.");
        }
    };

    const handleFile = async (file: File) => {
        setIsUploading(true); // 🆕 start loader
        try {
            const uploadedUrl = await uploadClubImage(file);
            const updatedClubInfo = { ...clubInfo, banniereUrl: uploadedUrl };
            setClubInfo(updatedClubInfo);
            setPreviewUrl(uploadedUrl);
            await modifyInfoClub(updatedClubInfo);
        } catch (error) {
            alert("Erreur lors du téléchargement de l'image");
            console.error("Upload failed:", error);
        } finally {
            setIsUploading(false); // 🆕 stop loader
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
                    className="btn-add btn-primary"
                    onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
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

                    {/* 🌀 Loader overlay */}
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

                        <div className="form-group">
                            <label><Text size={16} />Description du club</label>
                            <textarea
                                name="description"
                                value={clubInfo.description ?? ''}
                                onChange={(e) => setClubInfo({ ...clubInfo, description: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="form-group">
                            <label><ShieldCheck size={16} />Politique du club</label>
                            <textarea
                                name="description"
                                value={clubInfo.politique ?? ''}
                                onChange={(e) => setClubInfo({ ...clubInfo, politique: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubManagementPage;
