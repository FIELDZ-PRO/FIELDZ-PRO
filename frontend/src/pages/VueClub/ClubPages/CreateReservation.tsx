import React, { useEffect, useState } from 'react';
import ReservationGroup from '../../../components/organisms/clubDashboard/ReservationGroup';
import { useAuth } from '../../../context/AuthContext';
import { Reservation } from '../../../types';
import HeaderClub from '../../../components/organisms/clubDashboard/HeaderClub';
import TerrainsSection from '../../../components/organisms/clubDashboard/TerrainsSection';
import CreneauFormSection from '../../../components/organisms/clubDashboard/CreneauFormSection';
import CreneauRecurrentFormSection from '../../../components/organisms/clubDashboard/CreneauRecurrentFormSection';
import CreneauxSection from '../../../components/organisms/clubDashboard/CreneauxSection';
import { Terrain } from '../../../types';
import ReservationParDateSection from '../../../components/organisms/clubDashboard/ReservationParDateSection';
import ReservationGroupByStatut from '../../../components/organisms/clubDashboard/ReservationGroupByStatut';
import './style/CreateReservation.css';

export const CreateReservationPage: React.FC = () => {
    const { token } = useAuth();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [reservationsDate, setReservationsDate] = useState<Reservation[]>([]);
    const [terrains, setTerrains] = useState<Terrain[]>([]);
    const [loading, setLoading] = useState(true);
    const [club, setClub] = useState<{ nom: string } | null>(null);

    const today = new Date().toISOString().slice(0, 10);
    const [date, setDate] = useState(today);
    const [showTodayReservations, setShowTodayReservations] = useState(false);

    const handleVoirReservationsDate = async () => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/reservations/reservations/date?date=${date}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setReservationsDate(data);
        } catch (err) {
            console.error("Erreur lors du chargement des réservations à la date :", err);
        }
    };

    useEffect(() => {
        const fetchClub = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/club/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
                const data = await res.json();
                setClub(data);
            } catch (err) {
                console.error("Erreur lors du chargement du club :", err);
            }
        };

        fetchClub();
    }, [token]);

    useEffect(() => {
        const fetchTerrains = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/terrains', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                console.log(data);
                setTerrains(data);
            } catch (err) {
                console.error('Erreur lors du chargement des terrains', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTerrains();
    }, [token]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/reservations/reservations", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setReservations(data);
            } catch (err) {
                console.error("Erreur lors du chargement des réservations :", err);
            }
        };

        fetchReservations();
    }, [token]);

    if (loading) {
        return (
            <div className="loading-container">
                <p className="loading-text">Chargement...</p>
            </div>
        );
    }

    return (
        <div className="club-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <h1 className="dashboard-title">
                    {club?.nom || '...'}
                </h1>
            </div>

            {/* Terrains Section */}


            {/* Créneaux Section */}
            <div >
                <CreneauxSection
                    terrains={terrains}
                    reservations={reservations}
                    setReservations={setReservations}
                />
            </div>


            {/* Reservation par date Section */}
            <div className="card-section">
                <ReservationParDateSection
                    date={date}
                    onDateChange={setDate}
                    onVoir={handleVoirReservationsDate}
                    reservations={reservationsDate}
                />
            </div>

            {/* Dashboard Stats */}
            <div className="card-section">
                <h1 className="stats-title">
                    📊 Dashboard du club
                </h1>

                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-value">
                            {terrains.length}
                        </div>
                        <div className="stat-label">
                            Terrains
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-value">
                            {reservations.length}
                        </div>
                        <div className="stat-label">
                            Réservations
                        </div>
                    </div>

                    <div className="stat-card stat-card-success">
                        <div className="stat-value stat-value-success">
                            {reservations.filter(r => r.statut === 'CONFIRMEE').length}
                        </div>
                        <div className="stat-label">
                            Confirmées
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};