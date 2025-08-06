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
      toast.error("❌ Erreur : impossible d’annuler");
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
      toast.error("❌ Erreur : impossible d’annuler");
      console.error(err);
    }
  };

  const getStatutStyle = () => {
    switch (statut) {
      case 'CONFIRMEE': return 'bg-green-100 border-green-400 text-green-800';
      case 'RESERVE': return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'ANNULE_PAR_JOUEUR': return 'bg-orange-100 border-orange-400 text-orange-800';
      case 'ANNULE_PAR_CLUB': return 'bg-red-100 border-red-400 text-red-800';
      default: return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  return (
    <div className={`p-4 border-l-4 shadow-sm rounded-md ${getStatutStyle()}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">👤 Joueur : {joueur.prenom} {joueur.nom}</p>
          <p className="text-sm">📅 {dateDebut} → {dateFin}</p>
          <p className="text-sm">📍 Terrain : {terrain}</p>

          {statut.startsWith('ANNULE') && dateAnnulation && (
            <p className="text-sm">❌ Annulé le : {format(new Date(dateAnnulation), "dd/MM/yyyy à HH:mm")}</p>
          )}

          {motifAnnulation && (
            <p className="italic text-sm mt-1">📝 Motif : {motifAnnulation}</p>
          )}
        </div>

        {statut === 'RESERVE' && (
          <div className="flex gap-2 mt-3">
            {role === 'club' && (
              <>
                <button
                  onClick={handleConfirmer}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                >
                  ✅ Confirmer
                </button>
                <button
                  onClick={handleAnnulerSansMotif}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                  ❌ Annuler
                </button>
              </>
            )}
            {role === 'joueur' && (
              <button
                onClick={() => setShowMotifModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
              >
                ❌ Annuler
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modale pour saisir le motif (joueur uniquement) */}
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
