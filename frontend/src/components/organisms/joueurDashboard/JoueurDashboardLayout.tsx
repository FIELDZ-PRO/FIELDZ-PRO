import React, { useState } from "react";
import "./JoueurDashboardLayout.css";
import { Creneau, Reservation, Joueur } from "../../../types";
import CreneauCard from "../../molecules/CreneauCard";
import ReservationCard from "../../molecules/ReservationCard";
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
    <div className="jd-container">
      <h2 className="jd-section-title" style={{color:'#16a34a'}}>[TEST] Fonctionnalités du JoueurDashboard</h2>

      {/* Header */}
      <div className="jd-header">
        <h1 className="jd-title">
          🎾 FIELDZ Joueur
          {joueur && (
            <span style={{marginLeft:16,fontSize:16,color:'#374151'}}>
              | {joueur.nom ?? joueur.email} {joueur.prenom ?? ""}
            </span>
          )}
        </h1>
        <a href="/profil" className="jd-profile-link">
          👤 Mon profil
        </a>
      </div>

      {/* Créneaux disponibles */}
      <h2 className="jd-section-title">📅 Créneaux disponibles</h2>
      <CreneauxDisponiblesGroup
  creneaux={creneauxLibres}
  
  onReserver={(c) => {
    console.log("✅ Clic sur réserver, créneau sélectionné :", c);
    setCreneauSelectionne(c);
  }}
/>


      {/* Mes réservations groupées par statut */}
      <h2 className="jd-section-title">📖 Mes réservations</h2>

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
        <div className="jd-modal-overlay">
          <div className="jd-modal">
            <ReservationModal
              creneau={creneauSelectionne}
              onClose={() => setCreneauSelectionne(null)}
              onReservation={async () => {
                await onRefresh();
                setCreneauSelectionne(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JoueurDashboardLayout;
