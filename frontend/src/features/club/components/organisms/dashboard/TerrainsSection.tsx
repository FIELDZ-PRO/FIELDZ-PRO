import React from 'react';
import TerrainForm from "../../molecules/TerrainForm";
import { Terrain } from '../../../../../shared/types/index';
import { useAuth } from '../../../../../shared/context/AuthContext';
import TerrainGroup from './TerrainGroup';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

type TerrainsSectionProps = {
  terrains: Terrain[];
  setTerrains: React.Dispatch<React.SetStateAction<Terrain[]>>;
};

const TerrainsSection: React.FC<TerrainsSectionProps> = ({ terrains, setTerrains }) => {
  const { token } = useAuth();

  const handleAjouterTerrain = async (terrain: Omit<Terrain, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/terrains`, {
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

  return (
    <section>
      <div className="section-title">🏟️ Ajouter un terrain</div>
      <TerrainForm onAddTerrain={handleAjouterTerrain} />

      <div className="section-title">🏟️ Mes Terrains</div>

      {/* Liste déroulante masquée par défaut */}
      <TerrainGroup titre="📋 Liste des terrains" terrains={terrains} />
    </section>
  );


};

export default TerrainsSection;
