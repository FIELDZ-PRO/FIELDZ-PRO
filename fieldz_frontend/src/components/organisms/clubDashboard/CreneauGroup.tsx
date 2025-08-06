// src/components/organisms/clubDashboard/CreneauGroup.tsx
import React, { useState } from 'react';
import { Creneau } from '../../../types';
import CreneauCard from '../../molecules/CreneauCard'; // adapte le chemin si besoin


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
  <CreneauCard
    key={c.id}
    creneau={c}
    role="club"       // 👈 active le bouton Annuler
    onUpdate={() => window.location.reload()} // ou un refetch propre
  />
))}

        </div>
      )}
    </div>
  );
};

export default CreneauGroup;
