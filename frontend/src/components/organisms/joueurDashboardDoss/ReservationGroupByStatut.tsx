import React, { useState } from "react";
import { Reservation } from "../../../shared/types/index";
import ReservationCard from "../../../shared/components/molecules/ReservationCard";

type Props = {
  titre: string;
  reservations: Reservation[];
  onUpdate?: () => void;
};

const ReservationGroupByStatut: React.FC<Props> = ({ titre, reservations, onUpdate }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="reservation-group">
      <div className="group-header" onClick={() => setOpen(!open)}>
        <span>{titre}</span>
        <span>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className="group-content">
          {reservations.length === 0 ? (
            <div className="empty-state">Aucune réservation</div>
          ) : (
            <div className="reservation-list">
              {reservations.map((r) => (
                <ReservationCard
                  key={r.id}
                  reservation={r}
                  role="joueur"
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationGroupByStatut;