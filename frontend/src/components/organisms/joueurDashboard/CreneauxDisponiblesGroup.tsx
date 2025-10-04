import React, { useState } from "react";
import { Creneau } from "../../../types";
import CreneauCard from "../../molecules/CreneauCard";

type Props = {
  creneaux: Creneau[];
  onReserver: (c: Creneau) => void;
};

const CreneauxDisponiblesGroup: React.FC<Props> = ({ creneaux, onReserver }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border rounded-lg shadow-sm bg-white mb-4">
      <div
        className="cursor-pointer px-4 py-2 bg-blue-100 font-semibold flex justify-between items-center rounded-t-lg"
        onClick={() => setOpen(!open)}
      >
        <span>📅 Créneaux disponibles</span>
        <span>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div className="p-4">
          {creneaux.length === 0 ? (
            <p className="text-gray-500 italic">Aucun créneau disponible pour l’instant.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {creneaux.map((c) => (
                <CreneauCard key={c.id} creneau={c} role="joueur" onReserver={() => onReserver(c)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreneauxDisponiblesGroup;
