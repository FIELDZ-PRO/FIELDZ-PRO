import React from "react";
import { Reservation } from "../../../../../shared/types";
import { formatDateFr, formatHour } from "../../../../../utils/dateUtils";

function formatStatutFr(statut: string): string {
  switch (statut) {
    case "RESERVE":
      return "En attente de confirmation";
    case "CONFIRMEE":
      return "Confirmée";
    case "ANNULE_PAR_CLUB":
      return "Annulée par le club";
    case "ANNULE_PAR_JOUEUR":
      return "Annulée par le joueur";
    case "ANNULE":
      return "Annulée";
    case "LIBRE":
      return "Libre";
    default:
      return statut;
  }
}

function getStatutClass(statut: string): string {
  switch (statut) {
    case "RESERVE":
      return "bg-yellow-100 text-yellow-800";
    case "CONFIRMEE":
      return "bg-green-100 text-green-800";
    case "ANNULE_PAR_CLUB":
      return "bg-red-100 text-red-800";
    case "ANNULE_PAR_JOUEUR":
      return "bg-orange-100 text-orange-800";
    case "ANNULE":
      return "bg-red-200 text-red-800";
    case "LIBRE":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}



type Props = {
  date: string;
  onDateChange: (value: string) => void;
  onVoir: () => void;
  reservations: Reservation[];
};

const ReservationParDateSection: React.FC<Props> = ({
  date,
  onDateChange,
  onVoir,
  reservations,
}) => {


  return (
    <section>
      <div className="section-title">Voir les réservations pour une date donnée</div>
      <div className="form-group flex gap-4 items-center">
        <input
          type="date"
          className="input-field"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
        <button
          onClick={onVoir}
          className="btn btn-view"
        >
          Voir les réservations
        </button>
      </div>

      <div className="mt-4">
        {reservations.length === 0 ? (
          <div>Aucune réservation pour cette date.</div>
        ) : (
          reservations.map((r) => (
            <div key={r.id} className="list-card bg-gray-100 opacity-80 mb-2">
              <div className="flex justify-between items-center">
                <div>
                  <strong>Créneau #{r.creneau?.id}</strong>{" – "}
                  {formatDateFr(r.creneau.dateDebut)} | {formatHour(r.creneau.dateDebut)}–{formatHour(r.creneau.dateFin)}
                  {" – Terrain : "}{r.creneau.terrain?.nomTerrain}
                  {" – Joueur : "}{r.joueur?.prenom} {r.joueur?.nom}{"–"}
                </div>

                <span className={`ml-4 px-3 py-1 text-sm rounded font-medium ${getStatutClass(r.statut)}`}>
                  {formatStatutFr(r.statut)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ReservationParDateSection;
