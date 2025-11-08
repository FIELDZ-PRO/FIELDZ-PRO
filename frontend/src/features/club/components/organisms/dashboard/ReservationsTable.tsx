import React, { useEffect, useState } from 'react';
import './style/Reservations.css';
import { getReservations, ReservationSummary } from '../../../services/ClubService';

const ReservationsTable = () => {
  const [todayReservations, setTodayReservations] = useState<ReservationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayReservations = async () => {
      try {
        const data = await getReservations();

        // 🔹 YYYY-MM-DD aujourd’hui
        const today = new Date().toISOString().split('T')[0];

        // 🔹 On ne garde que les réservations du jour
        const todayData = data.filter(r => r.date?.startsWith(today));

        setTodayReservations(todayData);
      } catch (error) {
        console.error("Erreur lors du chargement des réservations :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayReservations();
  }, []);

  // 🔹 Couleurs de statut (ajout ABSENT, correction ANNULE_PAR_CLUB)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMEE': return '#059669';     // vert
      case 'RESERVE': return '#d97706';       // orange
      case 'ABSENT': return '#dc2626';        // rouge
      case 'ANNULE':
      case 'ANNULE_PAR_CLUB':
      case 'ANNULE_PAR_JOUEUR':
        return '#9ca3af';                     // gris pour "annulé"
      default: return '#6b7280';
    }
  };

  // 🔹 Libellés de statut (ajout ABSENT, correction ANNULE_PAR_CLUB)
  const translateStatus = (status: string) => {
    switch (status) {
      case 'CONFIRMEE': return 'Confirmée';
      case 'RESERVE': return 'À venir';
      case 'ABSENT': return 'Absent';
      case 'ANNULE': return 'Annulée';
      case 'ANNULE_PAR_CLUB': return 'Annulée (club)';
      case 'ANNULE_PAR_JOUEUR': return 'Annulée (joueur)';
      default: return status;
    }
  };

  return (
    <div className="reservations-section">
      <h3>Réservations d’aujourd’hui</h3>

      {loading ? (
        <p>Chargement...</p>
      ) : todayReservations.length === 0 ? (
        <p>Aucune réservation pour aujourd’hui.</p>
      ) : (
        <div className="reservations-list">
          {todayReservations.map((reservation, index) => (
            <div key={index} className="reservation-item">
              <div className="reservation-info">
                <div className="reservation-name">
                  {reservation.nom} {reservation.prenom}
                </div>
                <div className="reservation-date">
                  {reservation.heureDebut} - {reservation.heureFin}
                </div>
              </div>
              <div
                className="reservation-status"
                style={{ color: getStatusColor(reservation.status) }}
              >
                {translateStatus(reservation.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationsTable;
