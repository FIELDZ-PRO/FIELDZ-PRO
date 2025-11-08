import React, { useEffect, useState } from 'react';
import './style/StatsCards.css';
import { getReservations, ReservationSummary } from '../../../services/ClubService';

const StatsCards = () => {
    const [reservations, setReservations] = useState<ReservationSummary[]>([]);
    const [confirmee, setConfirmee] = useState(0);
    const [reservationCount, setReservationCount] = useState(0);

    const CallReservations = async () => {
        try {
            const data = await getReservations();

            const today = new Date();
            const todayString = today.toISOString().split("T")[0];

            // ✅ Filter only today's reservations
            const todayReservations = data.filter(r => {
                const resDate = new Date(r.date).toISOString().split("T")[0];
                return resDate === todayString;
            });

            setReservations(todayReservations);

            // ✅ Compute statistics for today
            const confirmed = todayReservations.filter(r => r.status?.toLowerCase() === "confirmee").length;
            const total = todayReservations.length;

            setConfirmee(confirmed);
            setReservationCount(total);
        } catch (error) {
            alert("Getting the reservations didn't work");
            console.error(error);
        }
    };

    useEffect(() => {
        CallReservations();
    }, []); // ✅ Runs once when mounted

    const stats = [
        {
            label: 'Réservations Confirmées',
            value: confirmee,
            color: '#2563eb'
        },
        {
            label: 'Total Réservations',
            value: reservationCount,
            color: '#189000ff'
        }
    ];

    return (
        <div className="stats-cards">
            {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                    <div className="stat-value" style={{ color: stat.color }}>
                        {stat.value}
                    </div>
                    <div className="stat-label">
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
