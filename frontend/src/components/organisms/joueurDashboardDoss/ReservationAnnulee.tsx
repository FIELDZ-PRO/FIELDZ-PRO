import React, { useMemo, useState } from "react";
import { Calendar, Clock, MapPin, XCircle, AlertCircle } from "lucide-react";
import { Reservation } from "../../../types";
import "./style/ReservationAnnulee.css";

type Props = {
  reservations: Reservation[];
};

type FilterStatus = "all" | "ANNULE_PAR_JOUEUR" | "ANNULE_PAR_CLUB";

const ReservationAnnulees: React.FC<Props> = ({ reservations }) => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const filteredReservations = useMemo(() => {
    if (filterStatus === "all") return reservations;
    return reservations.filter((r) => r.statut === filterStatus);
  }, [reservations, filterStatus]);

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
      ANNULE_PAR_JOUEUR: {
        label: "Annulé par vous",
        icon: XCircle,
        className: "status-badge-cancelled-user",
      },
      ANNULE_PAR_CLUB: {
        label: "Annulé par le club",
        icon: AlertCircle,
        className: "status-badge-cancelled-club",
      },
    };

    const { label, icon: Icon, className } =
      config[statut as keyof typeof config] || config.ANNULE_PAR_JOUEUR;

    return (
      <div className={`status-badge ${className}`}>
        <Icon size={16} />
        {label}
      </div>
    );
  };

  const cancelledByUserCount = reservations.filter(
    (r) => r.statut === "ANNULE_PAR_JOUEUR"
  ).length;
  const cancelledByClubCount = reservations.filter(
    (r) => r.statut === "ANNULE_PAR_CLUB"
  ).length;

  return (
    <div className="reservations-annulees">
      {/* Filtres par statut */}
      <div className="status-filters">
        <button
          className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          Toutes ({reservations.length})
        </button>
        <button
          className={`filter-btn ${filterStatus === "ANNULE_PAR_JOUEUR" ? "active" : ""}`}
          onClick={() => setFilterStatus("ANNULE_PAR_JOUEUR")}
        >
          <XCircle size={16} />
          Annulées par vous ({cancelledByUserCount})
        </button>
        <button
          className={`filter-btn ${filterStatus === "ANNULE_PAR_CLUB" ? "active" : ""}`}
          onClick={() => setFilterStatus("ANNULE_PAR_CLUB")}
        >
          <AlertCircle size={16} />
          Annulées par le club ({cancelledByClubCount})
        </button>
      </div>

      {/* Liste des réservations */}
      {filteredReservations.length === 0 ? (
        <div className="empty-state-reservations">
          <div className="empty-icon">❌</div>
          <h3>Aucune réservation annulée</h3>
          <p>
            {filterStatus === "all"
              ? "Vous n'avez pas de réservations annulées"
              : filterStatus === "ANNULE_PAR_JOUEUR"
              ? "Aucune réservation annulée par vous"
              : "Aucune réservation annulée par le club"}
          </p>
        </div>
      ) : (
        <div className="reservations-list">
          {filteredReservations.map((reservation) => {
            const creneau = reservation.creneau;
            const terrain = creneau?.terrain;
            const dateDebut = creneau?.dateDebut || "";
            const dateFin = creneau?.dateFin || "";

            return (
              <div key={reservation.id} className="reservation-card-annulee">
                {/* Header avec fond rouge/orange */}
                <div className="reservation-header-annulee">
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

                {/* Body avec 3 colonnes */}
                <div className="reservation-body-annulee">
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

                  {/* Motif d'annulation si disponible */}
                  {reservation.motifAnnulation && (
                    <div className="annulation-motif">
                      <div className="motif-icon">
                        <AlertCircle size={18} />
                      </div>
                      <div className="motif-text">
                        <div className="motif-label">Raison de l'annulation</div>
                        <div className="motif-value">{reservation.motifAnnulation}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReservationAnnulees;