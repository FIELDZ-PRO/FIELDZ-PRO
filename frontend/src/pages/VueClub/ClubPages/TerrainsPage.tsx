import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Clock, Euro } from 'lucide-react';
import './style/TerrainsPage.css';

const TerrainsPage = () => {
    const [terrains, setTerrains] = useState([
        { id: 1, name: 'Court 1', type: 'Padel', price: 40, status: 'Disponible', capacity: 4 },
        { id: 2, name: 'Court 3', type: 'Synthétique', price: 80, status: 'Occupé', capacity: 22 },
        { id: 3, name: 'Field 8', type: 'Foot', price: 70, status: 'Disponible', capacity: 22 },
        { id: 4, name: 'Court 2', type: 'Padel', price: 40, status: 'Maintenance', capacity: 4 },
        { id: 5, name: 'Field 5', type: 'Foot', price: 70, status: 'Disponible', capacity: 22 },
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newTerrain, setNewTerrain] = useState({
        name: '',
        type: 'Padel',
        price: 40,
        capacity: 4
    });

    const handleAddTerrain = (e: React.FormEvent) => {
        e.preventDefault();
        const terrain = {
            id: Date.now(),
            ...newTerrain,
            status: 'Disponible'
        };
        setTerrains([...terrains, terrain]);
        setNewTerrain({ name: '', type: 'Padel', price: 40, capacity: 4 });
        setShowAddForm(false);
    };

    const handleDeleteTerrain = (id: number) => {
        setTerrains(terrains.filter(terrain => terrain.id !== id));
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
                    className="btn btn-primary"
                    onClick={() => setShowAddForm(true)}
                >
                    <Plus size={16} />
                    Ajouter un terrain
                </button>
            </div>

            <div className="terrains-grid">
                {terrains.map((terrain) => (
                    <div key={terrain.id} className="terrain-card">
                        <div className="terrain-card-header">
                            <h3>{terrain.name}</h3>
                            <div className="terrain-actions">
                                <button className="action-btn edit">
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
                                <MapPin size={16} />
                                <span>{terrain.type}</span>
                            </div>
                            <div className="info-item">
                                <Euro size={16} />
                                <span>{terrain.price}€/heure</span>
                            </div>
                            <div className="info-item">
                                <Clock size={16} />
                                <span>{terrain.capacity} personnes max</span>
                            </div>
                        </div>

                        <div className="terrain-status">
                            <span
                                className="status-badge"
                                style={{ backgroundColor: getStatusColor(terrain.status) }}
                            >
                                {terrain.status}
                            </span>
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
                                onClick={() => setShowAddForm(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleAddTerrain} className="terrain-form">
                            <div className="form-group">
                                <label>Nom du terrain</label>
                                <input
                                    type="text"
                                    value={newTerrain.name}
                                    onChange={(e) => setNewTerrain({ ...newTerrain, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    value={newTerrain.type}
                                    onChange={(e) => setNewTerrain({ ...newTerrain, type: e.target.value })}
                                >
                                    <option value="Padel">Padel</option>
                                    <option value="Foot">Foot</option>
                                    <option value="Synthétique">Synthétique</option>
                                    <option value="Tennis">Tennis</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Prix (€/heure)</label>
                                <input
                                    type="number"
                                    value={newTerrain.price}
                                    onChange={(e) => setNewTerrain({ ...newTerrain, price: parseInt(e.target.value) })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Capacité (personnes)</label>
                                <input
                                    type="number"
                                    value={newTerrain.capacity}
                                    onChange={(e) => setNewTerrain({ ...newTerrain, capacity: parseInt(e.target.value) })}
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