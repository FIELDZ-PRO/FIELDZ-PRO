import React from 'react';
import '../style/Reservations.css';

const ReservationsTable = () => {
    const reservations = [
        { name: 'Pauline', date: '18 avril 2024, 14h', status: 'Confirmée', statusColor: '#059669' },
        { name: 'Antoine', date: '16 avril 2024, 16h', status: 'En attente', statusColor: '#d97706' },
        { name: 'Lucas', date: '17 avril 2024, 20h', status: 'Annulée', statusColor: '#dc2626' },
    ];

    return (
        <div className="reservations-section">
            <h3>Réservations</h3>
            <div className="reservations-list">
                {reservations.map((reservation, index) => (
                    <div key={index} className="reservation-item">
                        <div className="reservation-info">
                            <div className="reservation-name">{reservation.name}</div>
                            <div className="reservation-date">{reservation.date}</div>
                        </div>
                        <div
                            className="reservation-status"
                            style={{ color: reservation.statusColor }}
                        >
                            {reservation.status}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReservationsTable;