import React, { useEffect, useState } from 'react';
import { Plus, Calendar, MapPin } from 'lucide-react';
import './style/TerrainSection.css';
import { Terrain } from '../../../../../shared/types';
import { useAuth } from '../../../../../shared/context/AuthContext';
import apiClient from '../../../../../shared/api/axiosClient';


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

    const handleAjouterTerrain = async (terrain: Omit<Terrain, 'id'>) => {
        try {
            const res = await apiClient.post<Terrain>('/api/terrains', terrain);
            alert(`✅ Terrain ajouté (ID: ${res.data.id})`);
            setTerrains((prev) => [...prev, res.data]);
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || err?.message || "Erreur réseau ou serveur.";
            alert("❌ Erreur : " + errorMsg);
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchTerrains = async () => {
            try {
                const res = await apiClient.get<Terrain[]>('/api/terrains');
                console.log(res.data);
                setTerrains(res.data);
            } catch (err) {
                console.error('Erreur lors du chargement des terrains', err);
            }
        };

        fetchTerrains();
    }, []);

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