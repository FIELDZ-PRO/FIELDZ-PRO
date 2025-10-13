import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Clock, Dumbbell } from 'lucide-react';
import './style/TerrainsPage.css';
import { Terrain } from '../../../types';
import { ClubService } from '../../../services/ClubService';

export type TypeDeSport = 'Padel' | 'Football';


const TerrainsPage = () => {
    const [terrains, setTerrains] = useState<Terrain[]>([]);
    const token = localStorage.getItem("token");
    const [DataLoaded, setDataLoaded] = useState(false);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editTerrain, setEditTerrain] = useState<Terrain>({
        id: 0,
        nomTerrain: '',
        typeSurface: '',
        ville: '',
        sport: '',
        politiqueClub: '',
    })
    const [newTerrain, setNewTerrain] = useState<Omit<Terrain, "id">>({
        nomTerrain: '',
        typeSurface: '',
        ville: '',
        sport: '',
        politiqueClub: '',
    });

    const handleAjouterTerrain = async (terrain: Omit<Terrain, 'id'>) => {
        try {
            const res = await fetch('http://localhost:8080/api/terrains', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(terrain),
            });

            if (!res.ok) {
                const error = await res.text();
                alert("❌ Erreur : " + error);
                return;
            }

            const newTerrain = await res.json();
            setShowAddForm(false);
            //alert(`✅ Terrain ajouté (ID: ${newTerrain.id})`);
            console.log("success on adding the terrain")
            setTerrains((prev) => [...prev, newTerrain]);
        } catch (err) {
            alert("❌ Erreur réseau ou serveur.");
            console.error(err);
        }
    };
    const fetchTerrains = async () => {
        try {
            setTerrains([]);
            const res = await fetch('http://localhost:8080/api/terrains', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            console.log(data);
            if (data.length === 0) {
                setDataLoaded(false);
            } else {
                setDataLoaded(true);
            }
            setTerrains(data);
        } catch (err) {
            console.error('Erreur lors du chargement des terrains', err);
        }
    };
    useEffect(() => {


        fetchTerrains();
    }, [token]);


    const handleMAJTerrain = async () => {
        const ret = await ClubService.ModifyTerrain(editTerrain.id, editTerrain.nomTerrain, editTerrain.typeSurface, editTerrain.ville, editTerrain.sport, editTerrain.politiqueClub)
        if (ret) {
            setTerrains(prevTerrains =>
                prevTerrains.map(terrain =>
                    terrain.id === editTerrain.id
                        ? { ...terrain, ...editTerrain }
                        : terrain
                )
            );
            setShowEditForm(false)
        } else {
            alert("erreur dans la modification du terrain " + editTerrain.nomTerrain)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewTerrain({ ...newTerrain, [e.target.name]: e.target.value });
    };
    const handleEditTerrain = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        //await ClubService.ModifyTerrain(editTerrain.id, editTerrain.nomTerrain, editTerrain.typeSurface, editTerrain.ville, editTerrain.sport, editTerrain.politiqueClub)

        setEditTerrain({ ...editTerrain, [e.target.name]: e.target.value });
    };
    const handleDeleteTerrain = async (id: number) => {
        const checkDelete = await ClubService.DeleteTerrain(id)
        if (checkDelete) {
            setTerrains(prevTerrains => prevTerrains.filter(terrain => terrain.id !== id));
        } else {
            alert("Le terrain n'a pas été supprimé avec succés");
        }

        //fetchTerrains();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Disponible': return '#059669';
            case 'Occupé': return '#dc2626';
            case 'Maintenance': return '#d97706';
            default: return '#64748b';
        }
    };

    return (
        <div className="terrains-page">
            <div className="page-header">
                <h1>Gestion des terrains</h1>
                <button
                    className="btn-add btn-primary"
                    onClick={() => setShowAddForm(true)}
                >
                    <Plus size={16} />
                    Ajouter un terrain
                </button>
            </div>

            {!DataLoaded &&
                (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <MapPin size={48} />
                        </div>
                        <h3>Aucun terrain trouvé</h3>
                        <p>Commencez par ajouter votre premier terrain à la liste.</p>
                    </div>
                )}

            {DataLoaded && (<div className="terrains-grid">
                {terrains.map((terrain) => (
                    <div key={terrain.nomTerrain} className="terrain-card">
                        <div className="terrain-card-header">
                            <h3>{terrain.nomTerrain}</h3>
                            <div className="terrain-actions">
                                <button className="action-btn edit">
                                    <Edit size={16} onClick={() => {
                                        setShowEditForm(true)
                                        setEditTerrain(terrain)
                                    }} />
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
                                <MapPin size={16} />
                                <span>{terrain.ville}</span>
                            </div>

                            <div className="info-item">
                                <Clock size={16} />
                                <span>{terrain.typeSurface} </span>
                            </div>
                            <div className="info-item">
                                <Dumbbell size={16} />
                                <span>{terrain.sport} </span>
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
                            <h2>Ajouter un nouveau terrain</h2>
                            <button
                                className="close-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowAddForm(false);
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleAjouterTerrain(newTerrain)
                        }} className="terrain-form">
                            <div className="form-group">
                                <label>Nom du terrain</label>
                                <input
                                    type="text"
                                    name='nomTerrain'
                                    value={newTerrain.nomTerrain}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="sport-select">Sport</label>
                                <select
                                    id="select"
                                    name='sport'
                                    value={newTerrain.sport}
                                    onChange={handleChange}
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
                                    type="string"
                                    name='typeSurface'
                                    value={newTerrain.typeSurface}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Ville du Terrain</label>
                                <input
                                    type="string"
                                    name='ville'
                                    value={newTerrain.ville}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Politique du club</label>
                                <textarea
                                    name='politiqueClub'
                                    value={newTerrain.politiqueClub}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
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
                            <h2>Modifier un terrain</h2>
                            <button
                                className="close-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowEditForm(false);
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleMAJTerrain()
                        }} className="terrain-form">
                            <div className="form-group">
                                <label>Nom du terrain</label>
                                <input
                                    type="text"
                                    name='nomTerrain'
                                    value={editTerrain.nomTerrain}
                                    onChange={handleEditTerrain}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="sport-select">Sport</label>
                                <select
                                    id="select"
                                    name='sport'
                                    value={editTerrain.sport}
                                    onChange={handleEditTerrain}
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
                                    type="string"
                                    name='typeSurface'
                                    value={editTerrain.typeSurface}
                                    onChange={handleEditTerrain}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Ville du Terrain</label>
                                <input
                                    type="string"
                                    name='ville'
                                    value={editTerrain.ville}
                                    onChange={handleEditTerrain}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Politique du club</label>
                                <textarea
                                    name='politiqueClub'
                                    value={editTerrain.politiqueClub}
                                    onChange={handleEditTerrain}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowEditForm(false)}>
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