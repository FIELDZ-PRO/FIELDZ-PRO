import React, { useMemo, useState } from "react";
import { Calendar, Clock, MapPin, CheckCircle, Loader } from "lucide-react";
import { Reservation } from "../../../types";
import { ReservationService } from "../../../services/ReservationService";
import MotifAnnulationModal from "../../molecules/MotifAnnulationModal";
import "./style/ReservationAvenir.css";

type Props = {
  reservations: Reservation[];
  onUpdate?: () => void;
};

type FilterStatus = "all" | "CONFIRMEE" | "RESERVE";

const ReservationAVenir: React.FC<Props> = ({ reservations, onUpdate }) => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [loadingCancel, setLoadingCancel] = useState<number | null>(null);
  const [showMotifModal, setShowMotifModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<number | null>(null);

  // Filtrer les réservations
  const filteredReservations = useMemo(() => {
    if (filterStatus === "all") return reservations;
    return reservations.filter((r) => r.statut === filterStatus);
  }, [reservations, filterStatus]);

  const openMotifModal = (reservationId: number) => {
    setReservationToCancel(reservationId);
    setShowMotifModal(true);
  };

  const closeMotifModal = () => {
    setShowMotifModal(false);
    setReservationToCancel(null);
  };

  const handleCancelWithMotif = async (motif: string) => {
    if (!reservationToCancel) return;

    try {
      setLoadingCancel(reservationToCancel);
      await ReservationService.cancelReservation(reservationToCancel, motif);
      
      alert("Réservation annulée avec succès !");
      closeMotifModal();
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      console.error("Erreur lors de l'annulation:", error);
      
      const errorMessage = error.message || "Erreur inconnue";
      
      if (errorMessage.includes("déjà annulée") || errorMessage.includes("already cancelled")) {
        alert("Cette réservation est déjà annulée.");
        closeMotifModal();
        if (onUpdate) {
          onUpdate();
        }
      } else {
        alert("Erreur lors de l'annulation : " + errorMessage);
      }
    } finally {
      setLoadingCancel(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getStatusBadge = (statut: string) => {
    const config = {
      CONFIRMEE: {
        label: "Passée",
        icon: CheckCircle,
        className: "status-badge-confirmed",
      },
      RESERVE: {
        label: "À venir",
        icon: Loader,
        className: "status-badge-pending",
      },
    };

    const { label, icon: Icon, className } =
      config[statut as keyof typeof config] || config.RESERVE;

    return (
      <div className={`status-badge ${className}`}>
        <Icon size={16} />
        {label}
      </div>
    );
  };

  const confirmedCount = reservations.filter((r) => r.statut === "CONFIRMEE").length;
  const pendingCount = reservations.filter((r) => r.statut === "RESERVE").length;

  return (
    <div className="reservations-a-venir">
      {/* Filtres - SANS TITRE */}
      <div className="status-filters">
        <button
          className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          Toutes ({reservations.length})
        </button>
        <button
          className={`filter-btn ${filterStatus === "CONFIRMEE" ? "active" : ""}`}
          onClick={() => setFilterStatus("CONFIRMEE")}
        >
          <CheckCircle size={16} />
          Passées ({confirmedCount})
        </button>
        <button
          className={`filter-btn ${filterStatus === "RESERVE" ? "active" : ""}`}
          onClick={() => setFilterStatus("RESERVE")}
        >
          <Loader size={16} />
          À venir ({pendingCount})
        </button>
      </div>

      {/* Liste des réservations */}
      {filteredReservations.length === 0 ? (
        <div className="empty-state-reservations">
          <div className="empty-icon">📅</div>
          <h3>Aucune réservation</h3>
          <p>
            {filterStatus === "all"
              ? "Recherchez un terrain pour réserver"
              : filterStatus === "CONFIRMEE"
              ? "Aucune réservation passée"
              : "Aucune réservation à venir"}
          </p>
        </div>
      ) : (
        <div className="reservations-list">
          {filteredReservations.map((reservation) => {
            const creneau = reservation.creneau;
            const terrain = creneau?.terrain;
            const dateDebut = creneau?.dateDebut || "";
            const dateFin = creneau?.dateFin || "";
            const isPassee = reservation.statut === "CONFIRMEE";

            return (
              <div key={reservation.id} className={`reservation-card-avenir ${isPassee ? 'reservation-past' : ''}`}>
                {/* Header */}
                <div className="reservation-header-avenir">
                  <div className="reservation-header-left">
                    <div className="terrain-icon">🏟️</div>
                    <div>
                      <h4 className="reservation-terrain-name">
                        {terrain?.nomTerrain || "Terrain"}
                      </h4>
                      <div className="reservation-location">
                        <MapPin size={16} />
                        <span>Terrain sportif</span>
                      </div>
                    </div>
                  </div>
                  <div className="reservation-header-right">
                    {getStatusBadge(reservation.statut)}
                  </div>
                </div>

                {/* Body */}
                <div className="reservation-body-avenir">
                  <div className="reservation-info-row">
                    {/* Date */}
                    <div className="info-item">
                      <div className="info-icon-box green">
                        <Calendar size={20} />
                      </div>
                      <div className="info-text">
                        <div className="info-label">Date</div>
                        <div className="info-value">{formatDate(dateDebut)}</div>
                      </div>
                    </div>

                    {/* Horaire */}
                    <div className="info-item">
                      <div className="info-icon-box blue">
                        <Clock size={20} />
                      </div>
                      <div className="info-text">
                        <div className="info-label">Horaire</div>
                        <div className="info-value">
                          {formatTime(dateDebut)} - {formatTime(dateFin)}
                        </div>
                      </div>
                    </div>

                    {/* Prix */}
                    <div className="info-item">
                      <div className="info-icon-box purple">
                        <span className="dzd-label">DZD</span>
                      </div>
                      <div className="info-text">
                        <div className="info-label">Prix total</div>
                        <div className="info-value price">
                          {creneau?.prix || 0} DZD
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bouton annuler - seulement pour réservations à venir */}
                  {!isPassee && (
                    <div className="reservation-actions-avenir">
                      <button
                        onClick={() => openMotifModal(reservation.id)}
                        disabled={loadingCancel === reservation.id}
                        className="btn-cancel"
                      >
                        {loadingCancel === reservation.id
                          ? "Annulation..."
                          : "Annuler la réservation"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal d'annulation */}
      {showMotifModal && (
        <MotifAnnulationModal
          onClose={closeMotifModal}
          onSubmit={handleCancelWithMotif}
        />
      )}
    </div>
  );
};

export default ReservationAVenir;