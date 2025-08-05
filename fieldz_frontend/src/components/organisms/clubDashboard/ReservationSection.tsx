import React, { useState } from "react";
import { Reservation } from "../../../types";
import ReservationCard from "../../molecules/ReservationCard";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

type Props = {
  reservations: Reservation[];
};

const ReservationDuJourSection: React.FC<Props> = ({ reservations }) => {
  const [expanded, setExpanded] = useState({
    RESERVE: true,
    CONFIRMEE: true,
    ANNULE_PAR_CLUB: true,
    ANNULE_PAR_JOUEUR: true,
  });

  const toggle = (statut: keyof typeof expanded) => {
    setExpanded({ ...expanded, [statut]: !expanded[statut] });
  };

  const groupByStatut = (statut: string) =>
    reservations.filter((r) => r.statut === statut);

  return (
    <section>
      <h2 className="section-title flex items-center gap-2">
        <FaChevronDown className="text-green-600" />
        📋 Réservations du jour
      </h2>

      {[
        {
          label: "📅 Réservations actives",
          statut: "RESERVE",
          color: "text-purple-700",
        },
        {
          label: "✅ Confirmées",
          statut: "CONFIRMEE",
          color: "text-green-700",
        },
        {
          label: "🏢 Annulées par le club",
          statut: "ANNULE_PAR_CLUB",
          color: "text-red-700",
        },
        {
          label: "🙋 Annulées par le joueur",
          statut: "ANNULE_PAR_JOUEUR",
          color: "text-orange-700",
        },
      ].map(({ label, statut, color }) => (
        <div key={statut} className="mt-4">
          <div
            className={`flex items-center gap-2 font-semibold cursor-pointer ${color}`}
            onClick={() => toggle(statut as keyof typeof expanded)}
          >
            {expanded[statut as keyof typeof expanded] ? (
              <FaChevronDown />
            ) : (
              <FaChevronRight />
            )}
            <span>{label}</span>
          </div>

          {expanded[statut as keyof typeof expanded] &&
            groupByStatut(statut).map((r) => (
              <ReservationCard key={r.id} reservation={r} />
            ))}
        </div>
      ))}
    </section>
  );
};

export default ReservationDuJourSection;
