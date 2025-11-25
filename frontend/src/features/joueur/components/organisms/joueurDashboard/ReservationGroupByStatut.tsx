import React, { useState } from "react";
import { Reservation } from "../../../../../shared/types";
import ReservationCard from "../../../../../shared/components/molecules/ReservationCard";

type Props = {
  titre: string;
  reservations: Reservation[];
  onUpdate?: () => void; // utilisé pour rafraîchir les données après annulation
};

const ReservationGroupByStatut: React.FC<Props> = ({ titre, reservations, onUpdate }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-lg shadow-sm bg-white mb-4">
      <div
        className="cursor-pointer px-4 py-2 bg-gray-100 font-semibold flex justify-between items-center rounded-t-lg"
        onClick={() => setOpen(!open)}
      >
        <span>{titre}</span>
        <span>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className="p-4 space-y-4">
          {reservations.length === 0 ? (
            <p className="text-gray-500 italic">Aucune réservation</p>
          ) : (
            reservations.map((r) => (
              <ReservationCard
                key={r.id}
                reservation={r}
                role="joueur"
                onUpdate={onUpdate}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationGroupByStatut;
