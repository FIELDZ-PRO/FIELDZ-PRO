import React, { useEffect, useState } from 'react';
import { Plus, Calendar, MapPin } from 'lucide-react';
import './style/TerrainSection.css';
import { Terrain } from '../../../shared/types';
import { useAuth } from '../../../shared/context/AuthContext';


interface TerrainResponse {
    id: number;
    nomTerrain: string;
    typeSurface: string;
    ville: string;
    sport: string;
    politiqueClub?: string;
    club?: {
        id: number;
        nomClub: string;
        nom: string;
        adresse: string;
    };
}

const TerrainSection = () => {
    const [terrains, setTerrains] = useState<Omit<Terrain, 'id'>[]>([]);
    const token = localStorage.getItem("token");

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
            alert(`✅ Terrain ajouté (ID: ${newTerrain.id})`);
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

    return (
        <div className="terrain-section">


            <div className="terrain-content">
                <div className="terrain-header">
                    <h3>Résumé des Terrains</h3>

                </div>

                <div className="terrain-table">
                    <div className="table-header">
                        <div>Terrains</div>
                        <div>Type</div>
                        <div>Sport</div>
                    </div>
                    {terrains.map((terrain, index) => (
                        <div key={index} className="table-row">
                            <div className="terrain-name">{terrain.nomTerrain}</div>
                            <div className="terrain-type">{terrain.typeSurface}</div>
                            <div className="terrain-sport">{terrain.sport}</div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TerrainSection;