// components/molecules/ReservationStatusSection.tsx
import React, { useState } from "react";
import { Reservation } from "../../types";
import { formatDateFr, formatHour } from "../../utils/dateUtils"; // ✅ À adapter selon ton projet

type Props = {
  titre: string;
  statut: string;
  color: string; // ex: 'green', 'red', etc.
  icon: string;
  reservations: Reservation[];
  defaultOpen?: boolean;
  onConfirm?: (id: number) => void;
};

const ReservationStatusSection: React.FC<Props> = ({
  titre,
  statut,
  color,
  icon,
  reservations,
  defaultOpen = false,
  onConfirm,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-4">
      <div className="section-title flex items-center gap-2">
        <button
          onClick={() => setOpen(!open)}
          className={`text-${color}-600 text-lg focus:outline-none`}
        >
          {open ? "▼" : "►"}
        </button>
        <h6 className={`text-${color}-700 font-semibold`}>
          {icon} {titre}
        </h6>
      </div>

      {open && (
        reservations.length === 0 ? (
          <div className="ml-6 text-sm text-gray-600">Aucune réservation.</div>
        ) : (
          reservations.map((r) => (
            <div
              key={r.id}
              className={`ml-6 mt-2 p-3 rounded bg-${color}-100 opacity-90`}
            >
              <div>
                <strong>Créneau #{r.creneau?.id}</strong>{" "}
                — {formatDateFr(r.creneau.dateDebut)} | {formatHour(r.creneau.dateDebut)}–{formatHour(r.creneau.dateFin)}
                {" — Terrain : "}{r.creneau.terrain?.nomTerrain}
              </div>
              <div>👤 Joueur : {r.joueur?.prenom} {r.joueur?.nom}</div>

              {statut === "RESERVE" && onConfirm && (
                <button
                  onClick={() => onConfirm(r.id)}
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                >
                  ✅ Confirmer
                </button>
              )}
            </div>
          ))
        )
      )}
    </div>
  );
};

export default ReservationStatusSection;
