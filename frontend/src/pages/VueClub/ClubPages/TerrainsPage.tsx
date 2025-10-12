import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Clock, Dumbbell } from 'lucide-react';
import './style/TerrainsPage.css';
import { Terrain } from '../../../types';

export type TypeDeSport = 'Padel' | 'Football';


const TerrainsPage = () => {
    const [terrains, setTerrains] = useState<Omit<Terrain, 'id'>[]>([]);
    const token = localStorage.getItem("token");

    const [showAddForm, setShowAddForm] = useState(false);
    const [newTerrain, setNewTerrain] = useState<Omit<Terrain, "id">>({
        nomTerrain: '',
        typeSurface: '',
        ville: '',
        sport: 'padel',
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

    useEffect(() => {
        const fetchTerrains = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/terrains', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                console.log(data);
                setTerrains(data);
            } catch (err) {
                console.error('Erreur lors du chargement des terrains', err);
            }
        };

        fetchTerrains();
    }, [token]);




    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewTerrain({ ...newTerrain, [e.target.name]: e.target.value });
    };
    const handleDeleteTerrain = (nom: string) => {
        setTerrains(terrains.filter(terrain => terrain.nomTerrain !== nom));
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

            <div className="terrains-grid">
                {terrains.map((terrain) => (
                    <div key={terrain.nomTerrain} className="terrain-card">
                        <div className="terrain-card-header">
                            <h3>{terrain.nomTerrain}</h3>
                            <div className="terrain-actions">
                                <button className="action-btn edit">
                                    <Edit size={16} />
                                </button>
                                <button
                                    className="action-btn delete"
                                    onClick={() => handleDeleteTerrain(terrain.nomTerrain)}
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
        </div>
    );
};

export default TerrainsPage;