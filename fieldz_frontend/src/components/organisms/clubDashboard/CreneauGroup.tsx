// src/components/organisms/clubDashboard/CreneauGroup.tsx
import React, { useState } from 'react';
import { Creneau } from '../../../types';

interface Props {
  titre: string;
  creneaux: Creneau[];
}

const CreneauGroup: React.FC<Props> = ({ titre, creneaux }) => {
  const [visible, setVisible] = useState(false); // 👈 masqué par défaut

  return (
    <div className="border rounded-md my-4 bg-white shadow-sm">
      <button
        onClick={() => setVisible(!visible)}
        className="w-full text-left p-3 font-semibold bg-gray-100 hover:bg-gray-200 rounded-t"
      >
        {visible ? '▾' : '▸'} {titre} ({creneaux.length})
      </button>

      {visible && (
        <div className="p-4 space-y-2">
          {creneaux.map((c) => (
            <div key={c.id} className="border p-2 rounded-md">
              <div><strong>Terrain :</strong> {c.terrain.nomTerrain}</div>
              <div>🕒 {new Date(c.dateDebut).toLocaleString('fr-FR')} → {new Date(c.dateFin).toLocaleTimeString('fr-FR')}</div>
              <div>💰 {c.prix} DA</div>
              <div>📌 Statut : {c.statut}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreneauGroup;
