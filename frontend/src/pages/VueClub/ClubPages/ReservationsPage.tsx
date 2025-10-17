import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Filter, Search, X } from 'lucide-react';
import './style/ReservationPage.css';
import {
    ReservationSummary,
    getReservations,
    getReservationsByDate,
    confirmReservations,
    cancelReservationByClub,
} from '../../../services/ClubService';

const ReservationsPage = () => {
    const [reservations, setReservations] = useState<ReservationSummary[]>([]);
    const [filterStatus, setFilterStatus] = useState('Toutes');
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // 🔹 Fetch reservations (daily or all)
    useEffect(() => {
        const fetchData = async () => {
            try {
                let data;
                if (selectedDate) {
                    data = await getReservationsByDate(selectedDate);
                } else {
                    data = await getReservations();
                }
                setReservations(data);
            } catch (error) {
                console.error('Erreur lors du chargement des réservations :', error);
            }
        };
        fetchData();
    }, [selectedDate]);

    // 🔹 Translate backend status → display text
    const translateStatus = (status: string) => {
        switch (status) {
            case 'RESERVE': return 'Réservé';
            case 'ANNULE': return 'Annulée';
            case 'ANNULE_PAR_JOUEUR': return 'Annulée par le joueur';
            case 'ANNULE_PAR_CLUB': return 'Absent';
            case 'CONFIRMEE': return 'Présent';
            default: return status;
        }
    };

    // 🔹 Colors for statuses
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'RESERVE': return '#005ca8ff';
            case 'ANNULE_PAR_CLUB': return '#c23400ff';
            case 'ANNULE_PAR_JOUEUR': return '#d80f00ff';
            case 'CONFIRMEE': return '#059622ff';
            case 'ANNULE': return '#dc2626';
            default: return '#64748b';
        }
    };

    // 🔹 Local state update helper
    const updateReservationStatus = (id: number, newStatus: string) => {
        setReservations(prev =>
            prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
        );
    };

    // 🔹 Backend action handler
    const handleReservationAction = async (id: number, action: 'confirm' | 'cancel') => {
        try {
            setLoadingId(id);

            if (action === 'confirm') {
                await confirmReservations(id);
                updateReservationStatus(id, 'CONFIRMEE');
            } else if (action === 'cancel') {
                const motif = prompt("Entrez le motif d'annulation :") || 'Annulé par le club';
                const data = await cancelReservationByClub(id, motif);
                updateReservationStatus(id, data.status ?? 'ANNULE_PAR_CLUB');
            }

        } catch (error) {
            console.error('Erreur lors de la mise à jour de la réservation :', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoadingId(null);
        }
    };

    // 🔹 Filters (updated for new statuses)
    const filteredReservations = reservations.filter(reservation => {
        const matchesStatus =
            filterStatus === 'Toutes' ||
            reservation.status === filterStatus ||
            (filterStatus === 'Annulées' &&
                ['ANNULE', 'ANNULE_PAR_JOUEUR', 'ANNULE_PAR_CLUB'].includes(reservation.status));

        const matchesSearch =
            (reservation.nom?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
            (reservation.terrain?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // 🔹 Revenue summary
    const totalRevenue = reservations
        .filter(r => r.status === 'CONFIRMEE')
        .reduce((sum, r) => sum + (r.prix || 0), 0);

    return (
        <div className="reservations-page">
            <div className="page-header">
                <h1>Gestion des réservations</h1>
                <div className="header-stats">
                    <div className="stat-item">
                        <span className="stat-value">{reservations.length}</span>
                        <span className="stat-label">Total</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">
                            {reservations.filter(r => r.status === 'CONFIRMEE').length}
                        </span>
                        <span className="stat-label">Présent</span>
                    </div>

                </div>
            </div>

            <div className="filters-section">
                {/* 🔍 Search */}
                <div className="search-box">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou terrain..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* 🔹 Status filter */}
                <div className="filter-group">
                    <Filter size={16} />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="Toutes">Toutes les réservations</option>
                        <option value="CONFIRMEE">Présent</option>
                        <option value="RESERVE">Réservées</option>
                        <option value="Annulées">Annulées</option>
                        <option value="ANNULE_PAR_JOUEUR">Annulées par joueur</option>
                        <option value="ANNULE_PAR_CLUB">Absent</option>
                    </select>
                </div>

                {/* 📅 Calendar filter */}
                <div className="filter-group calendar-filter">
                    <Calendar size={16} />
                    <input
                        type="date"
                        value={selectedDate || ''}
                        onChange={(e) => setSelectedDate(e.target.value || null)}
                    />
                    {selectedDate && (
                        <button
                            className="btn2 btn2-clear"
                            onClick={() => setSelectedDate(null)}
                            title="Afficher toutes les réservations"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* 🧾 Reservations list */}
            <div className="reservations-list">
                {filteredReservations.map((reservation) => (
                    <div key={reservation.id} className="reservation-card">
                        <div className="reservation-main">
                            <div className="client-info">
                                <div className="client-name">
                                    <User size={16} />
                                    {reservation.nom} {reservation.prenom}
                                </div>
                                <div className="client-phone">{reservation.telephone}</div>
                            </div>

                            <div className="reservation-details">
                                <div className="detail-item">
                                    <MapPin size={16} />
                                    {reservation.terrain}
                                </div>
                                <div className="detail-item">
                                    <Calendar size={16} />
                                    {new Date(reservation.date).toLocaleDateString('fr-FR')}
                                </div>
                                <div className="detail-item">
                                    <Clock size={16} />
                                    {reservation.heureDebut} - {reservation.heureFin}
                                </div>
                            </div>

                            <div className="reservation-price">{reservation.prix} Dzd</div>
                        </div>

                        <div className="reservation-actions">
                            <div
                                className="status-badge"
                                style={{ backgroundColor: getStatusColor(reservation.status) }}
                            >
                                {translateStatus(reservation.status)}
                            </div>

                            <div className="action-buttons">
                                {reservation.status === 'RESERVE' && (
                                    <>
                                        <button
                                            className="btn2 btn2-success"
                                            disabled={loadingId === reservation.id}
                                            onClick={() => handleReservationAction(reservation.id, 'confirm')}
                                        >
                                            {loadingId === reservation.id ? '...' : 'Présent'}
                                        </button>

                                        <button
                                            className="btn2 btn2-danger"
                                            disabled={loadingId === reservation.id}
                                            onClick={() => handleReservationAction(reservation.id, 'cancel')}
                                        >
                                            {loadingId === reservation.id ? '...' : 'Absent'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredReservations.length === 0 && (
                <div className="empty-state">
                    <Calendar size={48} />
                    <h3>Aucune réservation trouvée</h3>
                    <p>Aucune réservation ne correspond à vos critères de recherche.</p>
                </div>
            )}
        </div>
    );
};

export default ReservationsPage;
