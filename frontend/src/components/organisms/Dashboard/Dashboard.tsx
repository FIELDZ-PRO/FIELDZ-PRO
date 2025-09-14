import React from 'react';
import StatsCards from './StatsCards';
import TerrainSection from './TerrainSection';
import ReservationsTable from './ReservationsTable';
import '../style/Dashboard.css';

const Dashboard = () => {
    return (
        <main className="dashboard">
            <div className="dashboard-header">
                <h1>Tableau de bord</h1>
            </div>

            <div className="dashboard-content">
                <StatsCards />
                <TerrainSection />
                <ReservationsTable />
            </div>
        </main>
    );
};

export default Dashboard;