// src/components/organisms/ReservationGroupByStatut.tsx
import React, { useState } from "react";
import { Reservation } from "../../../types";
import ReservationCard from "../../molecules/ReservationCard"; 

type Props = {
  titre: string;
  statut: string;
  reservations: Reservation[];
};

const ReservationGroupByStatut: React.FC<Props> = ({ titre, statut, reservations }) => {
  const [expanded, setExpanded] = useState(true);

  const filtered = reservations.filter((r) => r.statut === statut);

  if (filtered.length === 0) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left font-bold text-lg py-2 bg-gray-200 rounded-md px-4"
      >
        {expanded ? "▼" : "▶"} {titre} ({filtered.length})
      </button>

      {expanded && (
        <div className="mt-2 space-y-2">
          {filtered.map((r) => (
            <ReservationCard key={r.id} reservation={r} role="club" />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationGroupByStatut;
