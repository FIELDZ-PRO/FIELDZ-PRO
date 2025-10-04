import React from "react";
import { Creneau } from "../../../types";
import CreneauCard from "../../molecules/CreneauCard";

type Props = {
  creneaux: Creneau[];
  onReserver: (c: Creneau) => void;
};

const CreneauxDisponiblesGroup: React.FC<Props> = ({ creneaux, onReserver }) => {
  return (
    <div className="creneau-group">
      <div className="group-content">
        {creneaux.length === 0 ? (
          <div className="empty-state">Aucun créneau disponible pour l'instant.</div>
        ) : (
          <div className="jd-grid">
            {creneaux.map((c) => (
              <CreneauCard key={c.id} creneau={c} role="joueur" onReserver={() => onReserver(c)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreneauxDisponiblesGroup;