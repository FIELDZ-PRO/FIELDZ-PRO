// src/components/organisms/ClubDashboard/ReservationCard.tsx
import React from 'react';
import { Reservation } from '../../../types';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';

type Props = {
  reservation: Reservation;
};

const ReservationCard: React.FC<Props> = ({ reservation }) => {
  const { token } = useAuth();

  const {
    id,
    statut,
    joueur,
    creneau,
    dateAnnulation,
    motifAnnulation,
  } = reservation;

  const dateDebut = creneau?.dateDebut ? format(new Date(creneau.dateDebut), "EEEE dd MMMM yyyy 'à' HH:mm", { locale: fr }) : "Date inconnue";

  const handleConfirmer = async () => {
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
      window.location.reload(); // ou mieux : refetch via props
    } catch (err) {
      toast.error("❌ Erreur : impossible de confirmer");
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
          <p className="font-semibold">👤 Joueur : {joueur?.prenom} {joueur?.nom}</p>
          <p className="text-sm">📅 Créneau : {dateDebut}</p>
          {statut.startsWith('ANNULE') && dateAnnulation && (
            <p className="text-sm">❌ Annulé le : {format(new Date(dateAnnulation), "dd/MM/yyyy à HH:mm")}</p>
          )}
          {motifAnnulation && (
            <p className="italic text-sm mt-1">📝 Motif : {motifAnnulation}</p>
          )}
        </div>

        {statut === 'RESERVE' && (
          <button
            onClick={handleConfirmer}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
          >
            ✅ Confirmer
          </button>
        )}
      </div>
    </div>
  );
};

export default ReservationCard;
