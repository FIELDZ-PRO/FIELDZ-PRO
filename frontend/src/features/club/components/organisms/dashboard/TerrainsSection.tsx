import React, { useState } from 'react';
import TerrainForm from "../../molecules/TerrainForm";
import { Terrain } from '../../../../../shared/types/index';
import { useAuth } from '../../../../../shared/context/AuthContext';
import TerrainGroup from './TerrainGroup';
import CustomAlert, { AlertType } from '../../../../../shared/components/atoms/CustomAlert';

interface AlertState {
  show: boolean;
  type: AlertType;
  message: string;
}

const API_BASE = import.meta.env.VITE_API_URL || "https://prime-cherida-fieldzz-17996b20.koyeb.app/api";

type TerrainsSectionProps = {
  terrains: Terrain[];
  setTerrains: React.Dispatch<React.SetStateAction<Terrain[]>>;
};

const TerrainsSection: React.FC<TerrainsSectionProps> = ({ terrains, setTerrains }) => {
  const { token } = useAuth();
  const [alertState, setAlertState] = useState<AlertState>({ show: false, type: 'info', message: '' });

  const showAlert = (type: AlertType, message: string) => {
    setAlertState({ show: true, type, message });
  };

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
        showAlert('error', "Erreur : " + error);
        return;
      }

      const newTerrain = await res.json();
      showAlert('success', `Terrain ajouté (ID: ${newTerrain.id})`);
      setTerrains((prev) => [...prev, newTerrain]);
    } catch (err) {
      showAlert('error', "Erreur réseau ou serveur.");
      console.error(err);
    }
  };

  return (
    <section>
      {alertState.show && (
        <CustomAlert
          type={alertState.type}
          message={alertState.message}
          onClose={() => setAlertState({ ...alertState, show: false })}
          duration={5000}
        />
      )}

      <div className="section-title">🏟️ Ajouter un terrain</div>
      <TerrainForm onAddTerrain={handleAjouterTerrain} />

      <div className="section-title">🏟️ Mes Terrains</div>

      {/* Liste déroulante masquée par défaut */}
      <TerrainGroup titre="📋 Liste des terrains" terrains={terrains} />
    </section>
  );


};

export default TerrainsSection;
