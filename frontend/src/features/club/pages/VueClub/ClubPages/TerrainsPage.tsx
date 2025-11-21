import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Dumbbell, Goal } from 'lucide-react';
import './style/TerrainsPage.css';
import { Terrain } from '../../../../../shared/types';
import { ClubService, uploadClubImage } from '../../../../../shared/services/ClubService';
import { useModal } from '../../../../../shared/context/ModalContext';
import apiClient from '../../../../../shared/api/axiosClient';
import ImageUpload from '../../../../../shared/components/molecules/ImageUpload';

export type TypeDeSport = 'Padel' | 'Football';

// Helper function to convert base64 to File
const base64ToFile = (base64String: string, filename: string): File => {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

const TerrainsPage = () => {
    const [terrains, setTerrains] = useState<Terrain[]>([]);
    const [DataLoaded, setDataLoaded] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editTerrain, setEditTerrain] = useState<Terrain>({
        id: 0,
        nomTerrain: '',
        typeSurface: '',
        ville: '',
        sport: '',
        photo: '',
        politiqueClub: '',
    });
    const [newTerrain, setNewTerrain] = useState<Omit<Terrain, "id">>({
        nomTerrain: '',
        typeSurface: '',
        ville: '',
        sport: '',
        photo: '',
        politiqueClub: '',
    });

    const { setIsModalOpen } = useModal();

    // Fetch terrains
    const fetchTerrains = async () => {
        try {
            const res = await apiClient.get<Terrain[]>('/api/terrains');
            setDataLoaded(res.data.length > 0);
            setTerrains(res.data);
        } catch (err) {
            console.error('Erreur lors du chargement des terrains', err);
        }
    };

    useEffect(() => {
        fetchTerrains();
    }, []);

    // Add terrain
    const handleAjouterTerrain = async (terrain: Omit<Terrain, 'id'>) => {
        try {
            let photoUrl = terrain.photo;

            if (terrain.photo && terrain.photo.startsWith('data:')) {
                const photoFile = base64ToFile(terrain.photo, `terrain-${Date.now()}.jpg`);
                photoUrl = await uploadClubImage(photoFile);
            }

            const terrainData = {
                ...terrain,
                photo: photoUrl
            };

            const res = await apiClient.post<Terrain>('/api/terrains', terrainData);
            setTerrains((prev) => [...prev, res.data]);
            closeAddForm();
        } catch (err) {
            alert("❌ Erreur lors de l'ajout du terrain.");
            console.error(err);
        }
    };

    const handleMAJTerrain = async () => {
        try {
            let photoUrl = editTerrain.photo;

            if (editTerrain.photo && editTerrain.photo.startsWith('data:')) {
                const photoFile = base64ToFile(editTerrain.photo, `terrain-${editTerrain.id}-${Date.now()}.jpg`);
                photoUrl = await uploadClubImage(photoFile);
            }

            console.log(photoUrl);
            const ret = await ClubService.ModifyTerrain(
                editTerrain.id,
                editTerrain.nomTerrain,
                editTerrain.typeSurface,
                editTerrain.ville,
                editTerrain.sport,
                editTerrain.politiqueClub,
                photoUrl
            );

            if (ret) {
                const updatedTerrain = { ...editTerrain, photo: photoUrl };
                setTerrains(prev =>
                    prev.map(t => t.id === editTerrain.id ? updatedTerrain : t)
                );
                closeEditForm();
            } else {
                alert("Erreur lors de la modification du terrain.");
            }
        } catch (error) {
            alert("❌ Erreur lors de la modification du terrain.");
            console.error(error);
        }
    };

    const handleDeleteTerrain = async (id: number) => {
        const checkDelete = await ClubService.DeleteTerrain(id);
        if (checkDelete) {
            setTerrains(prev => prev.filter(t => t.id !== id));
        } else {
            alert("Le terrain n'a pas été supprimé avec succès");
        }
    };

    const openAddForm = () => {
        setShowAddForm(true);
        setIsModalOpen(true);
    };

    const closeAddForm = () => {
        setShowAddForm(false);
        setIsModalOpen(false);
    };

    const openEditForm = (terrain: Terrain) => {
        setEditTerrain(terrain);
        setShowEditForm(true);
        setIsModalOpen(true);
    };

    const closeEditForm = () => {
        setShowEditForm(false);
        setIsModalOpen(false);
    };

    return (
        <div className="terrains-page">
            <div className="page-header">
                <h1>Gestion des terrains</h1>
                <button className="btn-add btn-primary" onClick={openAddForm}>
                    <Plus size={16} /> Ajouter un terrain
                </button>
            </div>

            {!DataLoaded && (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <MapPin size={48} />
                    </div>
                    <h3>Aucun terrain trouvé</h3>
                    <p>Commencez par ajouter votre premier terrain.</p>
                </div>
            )}

            {DataLoaded && (
                <div className="terrains-grid">
                    {terrains.map((terrain) => (
                        <div key={terrain.id} className="terrain-card">
                            <div className="terrain-card-image">
                                {terrain.photo ? (
                                    <img src={terrain.photo} alt={terrain.nomTerrain} />
                                ) : (
                                    <div className="terrain-card-image-placeholder">
                                        <MapPin size={48} />
                                        <span>Aucune photo</span>
                                    </div>
                                )}
                            </div>
                            <div className="terrain-card-content">
                                <div className="terrain-card-header">
                                    <h3>{terrain.nomTerrain}</h3>
                                    <div className="terrain-actions">
                                        <button className="action-btn edit" onClick={() => openEditForm(terrain)}>
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => handleDeleteTerrain(terrain.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="terrain-info">
                                    <div className="info-item">
                                        <Goal size={16} />
                                        <span>{terrain.typeSurface}</span>
                                    </div>
                                    <div className="info-item">
                                        <Dumbbell size={16} />
                                        <span>{terrain.sport}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Ajouter un terrain</h2>
                            <button className="close-btn" onClick={closeAddForm}>×</button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAjouterTerrain(newTerrain);
                            }}
                            className="terrain-form"
                        >
                            <ImageUpload
                                value={newTerrain.photo}
                                onChange={(photo) => setNewTerrain({ ...newTerrain, photo })}
                                label="Photo du terrain"
                            />

                            <div className="form-group">
                                <label>Nom du terrain</label>
                                <input
                                    type="text"
                                    name="nomTerrain"
                                    value={newTerrain.nomTerrain}
                                    onChange={(e) =>
                                        setNewTerrain({ ...newTerrain, [e.target.name]: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Sport</label>
                                <select
                                    name="sport"
                                    value={newTerrain.sport}
                                    onChange={(e) =>
                                        setNewTerrain({ ...newTerrain, [e.target.name]: e.target.value })
                                    }
                                    required
                                >
                                    <option value="" disabled>Sélectionner un sport</option>
                                    <option value="Padel">Padel</option>
                                    <option value="Football">Football</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Type de surface</label>
                                <input
                                    type="text"
                                    name="typeSurface"
                                    value={newTerrain.typeSurface}
                                    onChange={(e) =>
                                        setNewTerrain({ ...newTerrain, [e.target.name]: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={closeAddForm}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Modifier le terrain</h2>
                            <button className="close-btn" onClick={closeEditForm}>×</button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleMAJTerrain();
                            }}
                            className="terrain-form"
                        >
                            <ImageUpload
                                value={editTerrain.photo}
                                onChange={(photo) => setEditTerrain({ ...editTerrain, photo })}
                                label="Photo du terrain"
                            />

                            <div className="form-group">
                                <label>Nom du terrain</label>
                                <input
                                    type="text"
                                    name="nomTerrain"
                                    value={editTerrain.nomTerrain}
                                    onChange={(e) =>
                                        setEditTerrain({ ...editTerrain, [e.target.name]: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Sport</label>
                                <select
                                    name="sport"
                                    value={editTerrain.sport}
                                    onChange={(e) =>
                                        setEditTerrain({ ...editTerrain, [e.target.name]: e.target.value })
                                    }
                                    required
                                >
                                    <option value="" disabled>Sélectionner un sport</option>
                                    <option value="Padel">Padel</option>
                                    <option value="Football">Football</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Type de surface</label>
                                <input
                                    type="text"
                                    name="typeSurface"
                                    value={editTerrain.typeSurface}
                                    onChange={(e) =>
                                        setEditTerrain({ ...editTerrain, [e.target.name]: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={closeEditForm}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Modifier
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TerrainsPage;
