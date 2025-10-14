import React, { useState } from 'react';
import { Reservation } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, MapPin, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import MotifAnnulationModal from "./MotifAnnulationModal";
import './style/ReservationCard.css';

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

  const dateDebut = new Date(creneau.dateDebut);
  const dateFin = new Date(creneau.dateFin);
  const terrain = creneau.terrain.nomTerrain;
  const club = creneau.terrain.club?.nom || 'Club';

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

  // Obtenir l'icône du sport
  const getSportIcon = () => {
    const sport = creneau.terrain.sport?.toLowerCase() || '';
    if (sport.includes('padel')) return 'P';
    if (sport.includes('tennis')) return 'T';
    if (sport.includes('foot')) return 'F';
    if (sport.includes('basket')) return 'B';
    return 'S';
  };

  // Obtenir le badge de statut
  const getStatutBadge = () => {
    switch (statut) {
      case 'CONFIRMEE':
        return <span className="status-badge confirmed"><CheckCircle size={16} /> Confirmé</span>;
      case 'RESERVE':
        return <span className="status-badge pending"><AlertCircle size={16} /> En attente</span>;
      case 'ANNULE_PAR_JOUEUR':
      case 'ANNULE_PAR_CLUB':
        return <span className="status-badge cancelled"><XCircle size={16} /> Annulé</span>;
      default:
        return null;
    }
  };

  const isAnnulee = statut.startsWith('ANNULE');

  return (
    <div className={`reservation-card-bolt ${isAnnulee ? 'cancelled' : ''}`}>
      <div className="reservation-left">
        <div className={`sport-icon ${isAnnulee ? 'cancelled' : ''}`}>
          {getSportIcon()}
        </div>
        
        <div className="reservation-details">
          <h4 className="terrain-name">{terrain}</h4>
          <p className="club-name">{club} • {creneau.terrain.sport || 'Sport'}</p>
          
          <div className="reservation-info">
            <div className="info-item">
              <Calendar size={16} />
              <span>{format(dateDebut, 'dd/MM/yyyy', { locale: fr })}</span>
            </div>
            <div className="info-item">
              <Clock size={16} />
              <span>{format(dateDebut, 'HH:mm')} - {format(dateFin, 'HH:mm')}</span>
            </div>
          </div>

          {isAnnulee && dateAnnulation && (
            <div className="cancellation-info">
              <XCircle size={14} />
              <span>Annulé le {format(new Date(dateAnnulation), 'dd/MM/yyyy à HH:mm')}</span>
              {motifAnnulation && (
                <span className="cancellation-reason"> • {motifAnnulation}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="reservation-right">
        {getStatutBadge()}
        <div className="reservation-price">{creneau.prix || 2500} DA</div>
        
        {!isAnnulee && (
          <div className="reservation-actions">
            {statut === 'RESERVE' && role === 'club' && (
              <>
                <button onClick={handleConfirmer} className="btn-confirm">
                  Confirmer
                </button>
                <button onClick={handleAnnulerSansMotif} className="btn-cancel">
                  Annuler
                </button>
              </>
            )}
            {statut === 'RESERVE' && role === 'joueur' && (
              <button onClick={() => setShowMotifModal(true)} className="btn-cancel">
                Annuler
              </button>
            )}
            {statut === 'CONFIRMEE' && role === 'joueur' && (
              <button onClick={() => setShowMotifModal(true)} className="btn-cancel">
                Annuler
              </button>
            )}
          </div>
        )}
      </div>

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