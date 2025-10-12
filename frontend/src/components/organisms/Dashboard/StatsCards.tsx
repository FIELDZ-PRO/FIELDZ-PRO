import React from 'react';
import '../style/StatsCards.css';

const StatsCards = () => {
    const stats = [
        {
            label: 'Réservations hebdomadal',
            value: '12',
            color: '#2563eb'
        },

        {
            label: 'Réservations cette semaine',
            value: '32',
            color: '#dc2626'
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