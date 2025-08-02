import React from 'react';
import { Plus, Calendar, MapPin } from 'lucide-react';
import '../style/TerrainSection.css';

const TerrainSection = () => {
    const terrains = [
        { name: 'Court 1', type: 'Padel', price: '40 €' },
        { name: 'Court 3', type: 'Synthétique', price: '80 €' },
        { name: 'Field 8', type: 'Foot', price: '70 €' },
    ];

    return (
        <div className="terrain-section">
            <div className="section-header">
                <div className="action-buttons">
                    <button className="btn btn-primary">
                        <Calendar size={16} />
                        Calendrier
                    </button>
                    <button className="btn btn-secondary">
                        <MapPin size={16} />
                        Terrains
                    </button>
                </div>
            </div>

            <div className="terrain-content">
                <div className="terrain-header">
                    <h3>Terrains</h3>
                    <button className="btn btn-outline">
                        <Plus size={16} />
                        Ajouter un terrain
                    </button>
                </div>

                <div className="terrain-table">
                    <div className="table-header">
                        <div>Terrains</div>
                        <div>Type</div>
                        <div>Prix</div>
                    </div>
                    {terrains.map((terrain, index) => (
                        <div key={index} className="table-row">
                            <div className="terrain-name">{terrain.name}</div>
                            <div className="terrain-type">{terrain.type}</div>
                            <div className="terrain-price">{terrain.price}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TerrainSection;