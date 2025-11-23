import React, { useState } from 'react';
import { Reservation } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, MapPin, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import MotifAnnulationModal from "./MotifAnnulationModal";
import './style/ReservationCard.css';

const API_BASE = import.meta.env.VITE_API_URL || "https://fieldz-pro.koyeb.app/api";

type Props = {
  reservation: Reservation;
  role: 'club' | 'joueur';
  onUpdate?: () => void;
};

// Helpers sûrs
const isValidDate = (d: Date | null) => !!d && !Number.isNaN(d.getTime());
const safeFormat = (d: Date | null, fmt: string) =>
  isValidDate(d) ? format(d as Date, fmt, { locale: fr }) : '—';

const ReservationCard: React.FC<Props> = ({ reservation, role, onUpdate }) => {
  const { token } = useAuth();
  const [showMotifModal, setShowMotifModal] = useState(false);

  const {
    id,
    statut: _statut,
    joueur,
    creneau: _creneau,
    dateAnnulation,
    motifAnnulation,
  } = reservation || {};

  // Défauts robustes
  const creneau = _creneau ?? ({} as any);
  const statut = _statut ?? 'RESERVE';

  // Dates sûres
  const startRaw: string | null = creneau?.dateDebut ?? null;
  const endRaw: string | null = creneau?.dateFin ?? null;

  const dateDebut = startRaw ? new Date(startRaw) : null;
  const dateFin = endRaw ? new Date(endRaw) : null;

  // Terrain / Club sûrs
  const terrain: string = creneau?.terrain?.nomTerrain ?? 'Terrain';
  const club: string = creneau?.terrain?.club?.nom ?? 'Club';
  const sport: string = (creneau?.terrain?.sport as string) || 'Sport';

  const prix = typeof creneau?.prix === 'number' ? creneau.prix : 2500;

  const handleConfirmer = async () => {
    if (!token) {
      toast.error("❌ Utilisateur non authentifié");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/reservations/${id}/confirmer`, {
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
      const res = await fetch(`${API_BASE}/reservations/${id}/annuler`, {
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
      const res = await fetch(`${API_BASE}/reservations/${id}/annuler`, {
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

  // Icône sport
  const getSportIcon = () => {
    const s = sport.toLowerCase();
    if (s.includes('padel')) return 'P';
    if (s.includes('tennis')) return 'T';
    if (s.includes('foot')) return 'F';
    if (s.includes('basket')) return 'B';
    return 'S';
  };

  // Badge statut
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

  const isAnnulee = statut?.startsWith?.('ANNULE') ?? false;

  // Si les dates sont manquantes, on évite le crash et on affiche un fallback propre
  const hasDates = isValidDate(dateDebut) && isValidDate(dateFin);

  return (
    <div className={`reservation-card-bolt ${isAnnulee ? 'cancelled' : ''}`}>
      <div className="reservation-left">
        <div className={`sport-icon ${isAnnulee ? 'cancelled' : ''}`}>
          {getSportIcon()}
        </div>

        <div className="reservation-details">
          <h4 className="terrain-name">{terrain}</h4>
          <p className="club-name">{club} • {sport}</p>

          <div className="reservation-info">
            <div className="info-item">
              <Calendar size={16} />
              <span>
                {hasDates ? safeFormat(dateDebut, 'dd/MM/yyyy') : 'Date inconnue'}
              </span>
            </div>
            <div className="info-item">
              <Clock size={16} />
              <span>
                {hasDates
                  ? `${safeFormat(dateDebut, 'HH:mm')} - ${safeFormat(dateFin, 'HH:mm')}`
                  : '--:--'}
              </span>
            </div>
          </div>

          {isAnnulee && dateAnnulation && (
            <div className="cancellation-info">
              <XCircle size={14} />
              <span>
                Annulé le {safeFormat(new Date(dateAnnulation), 'dd/MM/yyyy à HH:mm')}
              </span>
              {motifAnnulation && (
                <span className="cancellation-reason"> • {motifAnnulation}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="reservation-right">
        {getStatutBadge()}
        <div className="reservation-price">{prix} DA</div>

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
