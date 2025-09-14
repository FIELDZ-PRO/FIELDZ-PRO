// src/components/organisms/clubDashboard/TerrainGroup.tsx
import React, { useState } from 'react';
import { Terrain } from '../../../types';

interface Props {
  titre: string;
  terrains: Terrain[];
}

const TerrainGroup: React.FC<Props> = ({ titre, terrains }) => {
  const [visible, setVisible] = useState(false); // 🔒 masqué par défaut

  return (
    <div className="border rounded-md my-4 bg-white shadow-sm">
      <button
        onClick={() => setVisible(!visible)}
        className="w-full text-left p-3 font-semibold bg-gray-100 hover:bg-gray-200 rounded-t"
      >
        {visible ? '▾' : '▸'} {titre} ({terrains.length})
      </button>

      {visible && (
        <div className="p-4 space-y-2">
          {terrains.map((t) => (
            <div key={t.id} className="border p-2 rounded-md">
              <div><strong>Nom :</strong> {t.nomTerrain}</div>
              <div>📍 Ville : {t.ville}</div>
              <div>🎾 Surface : {t.typeSurface}</div>
              <div>📖 Politique : {t.politiqueClub || "Non définie"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TerrainGroup;
