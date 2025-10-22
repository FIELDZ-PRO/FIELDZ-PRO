import React, { useEffect, useState } from 'react';
import { Settings, User, MapPin, Mail, Phone, Image as ImageIcon } from 'lucide-react';
import './style/ClubManagement.css';
import { getClubMe, modifyInfoClub } from '../../../services/ClubService';
import { ClubDto } from '../../../services/ClubService';

const ClubManagementPage = () => {
    const [clubInfo, setClubInfo] = useState<Omit<ClubDto, 'id'>>({
        nom: '',
        ville: '',
        adresse: '',
        telephone: '',
        sports: [],
    });

    const token = localStorage.getItem("token");
    const [isEditing, setIsEditing] = useState(false);

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const fetchClubInfo = async () => {
        try {
            const data = await getClubMe();
            setClubInfo(data);
            if ((data as any).imageUrl) {
                setPreviewImage((data as any).imageUrl);
            }
        } catch (error) {
            alert("The Recup process for the club's information didn't work");
        }
    };

    useEffect(() => {
        fetchClubInfo();
    }, [token]);

    const handleSave = async () => {
        try {
            await modifyInfoClub(clubInfo);
            console.log('Saving club info:', clubInfo);
            setIsEditing(false);
        } catch (error) {
            alert("The modification didn't work");
        }
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isEditing) return;
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isEditing) return;
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
        }
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

            <div
                className={`image-section ${dragActive ? "drag-active" : ""} ${isEditing ? "editing" : ""}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
            >
                <h2><ImageIcon size={18} /> Image du club</h2>

                {previewImage ? (
                    <div className="image-preview-container">
                        <img src={previewImage} alt="Club" className="image-preview" />
                    </div>
                ) : (
                    <p className="no-image">Aucune image</p>
                )}

                {isEditing && (
                    <div className="dropzone">
                        <p>Glissez-déposez une image ici ou</p>
                        <label className="upload-label">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            <span className="upload-button">Choisissez une image</span>
                        </label>
                    </div>
                )}
            </div>

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
                            <label><Mail size={16} /> Ville</label>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubManagementPage;
