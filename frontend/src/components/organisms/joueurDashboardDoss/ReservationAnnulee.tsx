import React from "react";
import { Calendar, Clock, MapPin, XCircle, AlertCircle } from "lucide-react";
import { Reservation } from "../../../types";
import "./style/ReservationAnnulee.css";

type Props = {
  reservations: Reservation[];
};

const ReservationAnnulees: React.FC<Props> = ({ reservations }) => {
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

  return (
    <div className="reservations-annulees">
      {/* Liste des réservations - SANS FILTRES NI TITRE */}
      {reservations.length === 0 ? (
        <div className="empty-state-reservations">
          <div className="empty-icon">❌</div>
          <h3>Aucune réservation annulée</h3>
          <p>Vous n'avez pas de réservations annulées</p>
        </div>
      ) : (
        <div className="reservations-list">
          {reservations.map((reservation) => {
            const creneau = reservation.creneau;
            const terrain = creneau?.terrain;
            const dateDebut = creneau?.dateDebut || "";
            const dateFin = creneau?.dateFin || "";

            return (
              <div key={reservation.id} className="reservation-card-annulee">
                {/* Header */}
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

                {/* Body */}
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

                  {/* Motif d'annulation */}
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