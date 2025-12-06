import React, { useEffect, useState } from 'react';
import ReservationGroup from '../../../components/organisms/dashboard/ReservationGroup';
import { Reservation, Terrain } from '../../../../../shared/types';
import CreneauxSection from '../../../components/organisms/dashboard/CreneauxSection';
import apiClient from '../../../../../shared/api/axiosClient';
import { Spinner } from '../../../../../shared/components/atoms';
import './style/CreateReservation.css';

export const CreateReservationPage: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [reservationsDate, setReservationsDate] = useState<Reservation[]>([]);
    const [terrains, setTerrains] = useState<Terrain[]>([]);
    const [loading, setLoading] = useState(true);
    const [club, setClub] = useState<{ nom: string } | null>(null);

    const today = new Date().toISOString().slice(0, 10); // format: YYYY-MM-DD
    const [date, setDate] = useState(today);
    const [showTodayReservations, setShowTodayReservations] = useState(false);

    // 🔍 Fetch reservations for a given date
    const handleVoirReservationsDate = async () => {
        try {
            const { data } = await apiClient.get(
                `/api/reservations/reservations/date?date=${date}`
            );
            setReservationsDate(data);
        } catch (err) {
            console.error("Erreur lors du chargement des réservations à la date :", err);
        }
    };

    // 📦 Fetch club info
    useEffect(() => {
        const fetchClub = async () => {
            try {
                const { data } = await apiClient.get('/api/club/me');
                setClub(data);
            } catch (err) {
                console.error("Erreur lors du chargement du club :", err);
            }
        };

        fetchClub();
    }, []);

    // 🏟️ Fetch terrains
    useEffect(() => {
        const fetchTerrains = async () => {
            try {
                const { data } = await apiClient.get('/api/terrains');
                console.log(data);
                setTerrains(data);
            } catch (err) {
                console.error('Erreur lors du chargement des terrains', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTerrains();
    }, []);

    // 📅 Fetch all reservations
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const { data } = await apiClient.get("/api/reservations/reservations");
                setReservations(data);
            } catch (err) {
                console.error("Erreur lors du chargement des réservations :", err);
            }
        };

        fetchReservations();
    }, []);

    if (loading) {
        return <Spinner loading={loading} text="Chargement des données..." fullScreen />;
    }

    const todayReservations = reservations.filter(r => {
        const resDate = new Date(r.creneau.dateDebut).toISOString().slice(0, 10);
        return resDate === today;
    });

    const todayConfirmedReservations = todayReservations.filter(
        r => r.statut === 'CONFIRMEE'
    );

    return (
        <div className="club-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <h1 className="dashboard-title">
                  Club :  {club?.nom || '...'}
                </h1>
            </div>

            {/* Créneaux Section */}
            <div>
                <CreneauxSection
                    terrains={terrains}
                    reservations={reservations}
                    setReservations={setReservations}
                />
            </div>

            {/* 📊 Dashboard Stats (only for today) */}
            <div className="card-section">
                <h1 className="stats-title">
                    Dashboard du club — {new Date(today).toLocaleDateString('fr-FR')}
                </h1>
                <div className="stats-container">
                    {/* Terrains */}
                    <div className="stat-card">
                        <div className="stat-value">
                            {terrains.length}
                        </div>
                        <div className="stat-label">
                            Terrains
                        </div>
                    </div>
                    {/* Today's Reservations */}
                    <div className="stat-card">
                        <div className="stat-value">
                            {todayReservations.length}
                        </div>
                        <div className="stat-label">
                            Réservations du jour
                        </div>
                    </div>
                    {/* Today's Confirmed Reservations */}
                    <div className="stat-card stat-card-success">
                        <div className="stat-value stat-value-success">
                            {todayConfirmedReservations.length}
                        </div>
                        <div className="stat-label">
                            Confirmées aujourd'hui
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
