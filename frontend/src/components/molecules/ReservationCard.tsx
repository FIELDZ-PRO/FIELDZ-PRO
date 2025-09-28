import React, { useState } from 'react';
import { Reservation } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import MotifAnnulationModal from "./MotifAnnulationModal";

type Props = {
  reservation: Reservation;
  role: 'club' | 'joueur';
  onUpdate?: () => void;
};

const ReservationCard: React.FC<Props> = ({ reservation, role, onUpdate }) => {
  const { token } = useAuth();
  const [showMotifModal, setShowMotifModal] = useState(false);

  const {
    id,
    statut,
    joueur,
    creneau,
    dateAnnulation,
    motifAnnulation,
  } = reservation;

  const dateDebut = format(new Date(creneau.dateDebut), "EEEE dd MMMM yyyy 'à' HH:mm", { locale: fr });
  const dateFin = format(new Date(creneau.dateFin), "HH:mm", { locale: fr });
  const terrain = creneau.terrain.nomTerrain;

  const handleConfirmer = async () => {
    if (!token) {
      toast.error("❌ Utilisateur non authentifié");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/reservations/${id}/confirmer`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erreur lors de la confirmation");

      toast.success("✅ Réservation confirmée !");
      onUpdate ? onUpdate() : window.location.reload();
    } catch (err) {
      toast.error("❌ Erreur : impossible de confirmer");
      console.error(err);
    }
  };

  const handleAnnulerAvecMotif = async (motif: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/reservations/${id}/annuler`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ motif }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'annulation");

      toast.success("✅ Réservation annulée !");
      setShowMotifModal(false);
      onUpdate ? onUpdate() : window.location.reload();
    } catch (err) {
      toast.error("❌ Erreur : impossible d'annuler");
      console.error(err);
    }
  };

  const handleAnnulerSansMotif = async () => {
    if (!window.confirm("Annuler cette réservation ?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/reservations/${id}/annuler`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erreur lors de l'annulation");

      toast.success("✅ Réservation annulée !");
      onUpdate ? onUpdate() : window.location.reload();
    } catch (err) {
      toast.error("❌ Erreur : impossible d'annuler");
      console.error(err);
    }
  };

  const getStatutClass = () => {
    switch (statut) {
      case 'CONFIRMEE': return 'reservation-card confirmee';
      case 'RESERVE': return 'reservation-card reserve';
      case 'ANNULE_PAR_JOUEUR': return 'reservation-card annule-joueur';
      case 'ANNULE_PAR_CLUB': return 'reservation-card annule-club';
      default: return 'reservation-card';
    }
  };

  return (
    <div className={getStatutClass()}>
      <div className="card-title">👤 Joueur : {joueur.prenom} {joueur.nom}</div>
      <div className="card-info">📅 {dateDebut} → {dateFin}</div>
      <div className="card-info">📍 Terrain : {terrain}</div>

      {statut.startsWith('ANNULE') && dateAnnulation && (
        <div className="card-info">❌ Annulé le : {format(new Date(dateAnnulation), "dd/MM/yyyy à HH:mm")}</div>
      )}

      {motifAnnulation && (
        <div className="card-info">📝 Motif : {motifAnnulation}</div>
      )}

      {statut === 'RESERVE' && (
        <div className="card-actions">
          {role === 'club' && (
            <>
              <button
                onClick={handleConfirmer}
                className="jd-btn-success"
              >
                ✅ Confirmer
              </button>
              <button
                onClick={handleAnnulerSansMotif}
                className="jd-btn-danger"
              >
                ❌ Annuler
              </button>
            </>
          )}
          {role === 'joueur' && (
            <button
              onClick={() => setShowMotifModal(true)}
              className="jd-btn-danger"
            >
              ❌ Annuler
            </button>
          )}
        </div>
      )}

      {showMotifModal && (
        <MotifAnnulationModal
          onClose={() => setShowMotifModal(false)}
          onSubmit={handleAnnulerAvecMotif}
        />
      )}
    </div>
  );
};

export default ReservationCard;