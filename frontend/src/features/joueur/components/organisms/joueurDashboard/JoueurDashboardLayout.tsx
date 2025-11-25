import React, { useState } from "react";
import { Creneau, Reservation, Joueur } from "../../../../../shared/types";
import CreneauCard from "../../../../../shared/components/molecules/CreneauCard";
import ReservationCard from "../../../../../shared/components/molecules/ReservationCard";
import ReservationGroupByStatut from "./ReservationGroupByStatut";
import ReservationModal from "./ReservationModal";
import CreneauxDisponiblesGroup from "./CreneauxDisponiblesGroup";


type Props = {
  joueur: Joueur | null;
  reservations: Reservation[];
  creneauxLibres: Creneau[];
  onRefresh: () => void;
};

const JoueurDashboardLayout: React.FC<Props> = ({

  joueur,
  reservations,
  creneauxLibres,
  onRefresh,
}) => {
  const [creneauSelectionne, setCreneauSelectionne] = useState<Creneau | null>(null);


  const groupByStatut = (statut: string) =>
    reservations.filter((r) => r.statut === statut);

  return (


    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold mb-4 text-green-500">[TEST] Fonctionnalités du JoueurDashboard</h2>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">

        <h1 className="text-2xl font-semibold text-blue-700">
          🎾 FIELDZ Joueur
          {joueur && (
            <span className="ml-4 text-lg text-gray-700">
              | {joueur.nom ?? joueur.email} {joueur.prenom ?? ""}
            </span>
          )}
        </h1>
        <a
          href="/profil"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          👤 Mon profil
        </a>
      </div>

      {/* Créneaux disponibles */}
      <h2 className="text-xl font-bold mb-4">📅 Créneaux disponibles</h2>
      <CreneauxDisponiblesGroup
        creneaux={creneauxLibres}

        onReserver={(c) => {
          console.log("✅ Clic sur réserver, créneau sélectionné :", c);
          setCreneauSelectionne(c);
        }}
      />


      {/* Mes réservations groupées par statut */}
      <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">📖 Mes réservations</h2>

      <ReservationGroupByStatut
        titre="✅ Confirmées / à venir"
        reservations={groupByStatut("RESERVE")}
        onUpdate={onRefresh}
      />

      <ReservationGroupByStatut
        titre="❌ Annulées par vous"
        reservations={groupByStatut("ANNULE_PAR_JOUEUR")}
      />
      <ReservationGroupByStatut
        titre="❌ Annulées par le club"
        reservations={groupByStatut("ANNULE_PAR_CLUB")}
      />

      {/* Modal politique */}
      {creneauSelectionne && (
        <ReservationModal
          creneau={creneauSelectionne}
          onClose={() => setCreneauSelectionne(null)}
          onReservation={async () => {
            await onRefresh();
            setCreneauSelectionne(null);
          }}
        />
      )}
    </div>
  );
};

export default JoueurDashboardLayout;
