import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, Filter, Search } from 'lucide-react';
import './style/ReservationPage.css';

const ReservationsPage = () => {
    const [reservations, setReservations] = useState([
        {
            id: 1,
            clientName: 'Pauline Dubois',
            terrain: 'Court 1',
            date: '2024-04-18',
            time: '14:00-15:00',
            status: 'Confirmée',
            price: 40,
            phone: '06 12 34 56 78'
        },
        {
            id: 2,
            clientName: 'Antoine Martin',
            terrain: 'Field 8',
            date: '2024-04-16',
            time: '16:00-17:00',
            status: 'En attente',
            price: 70,
            phone: '06 98 76 54 32'
        },
        {
            id: 3,
            clientName: 'Lucas Bernard',
            terrain: 'Court 3',
            date: '2024-04-17',
            time: '20:00-21:00',
            status: 'Annulée',
            price: 80,
            phone: '06 11 22 33 44'
        },
        {
            id: 4,
            clientName: 'Marie Leroy',
            terrain: 'Court 1',
            date: '2024-04-19',
            time: '10:00-11:00',
            status: 'Confirmée',
            price: 40,
            phone: '06 55 66 77 88'
        },
        {
            id: 5,
            clientName: 'Thomas Petit',
            terrain: 'Field 8',
            date: '2024-04-20',
            time: '18:00-19:00',
            status: 'En attente',
            price: 70,
            phone: '06 99 88 77 66'
        }
    ]);

    const [filterStatus, setFilterStatus] = useState('Toutes');
    const [searchTerm, setSearchTerm] = useState('');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmée': return '#059669';
            case 'En attente': return '#d97706';
            case 'Annulée': return '#dc2626';
            default: return '#64748b';
        }
    };

    const updateReservationStatus = (id: number, newStatus: string) => {
        setReservations(reservations.map(reservation =>
            reservation.id === id ? { ...reservation, status: newStatus } : reservation
        ));
    };

    const filteredReservations = reservations.filter(reservation => {
        const matchesStatus = filterStatus === 'Toutes' || reservation.status === filterStatus;
        const matchesSearch = reservation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reservation.terrain.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const totalRevenue = reservations
        .filter(r => r.status === 'Confirmée')
        .reduce((sum, r) => sum + r.price, 0);

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
                        <span className="stat-value">{reservations.filter(r => r.status === 'Confirmée').length}</span>
                        <span className="stat-label">Confirmées</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">€{totalRevenue}</span>
                        <span className="stat-label">Revenus</span>
                    </div>
                </div>
            </div>

            <div className="filters-section">
                <div className="search-box">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou terrain..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <Filter size={16} />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="Toutes">Toutes les réservations</option>
                        <option value="Confirmée">Confirmées</option>
                        <option value="En attente">En attente</option>
                        <option value="Annulée">Annulées</option>
                    </select>
                </div>
            </div>

            <div className="reservations-list">
                {filteredReservations.map((reservation) => (
                    <div key={reservation.id} className="reservation-card">
                        <div className="reservation-main">
                            <div className="client-info">
                                <div className="client-name">
                                    <User size={16} />
                                    {reservation.clientName}
                                </div>
                                <div className="client-phone">{reservation.phone}</div>
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
                                    {reservation.time}
                                </div>
                            </div>

                            <div className="reservation-price">
                                €{reservation.price}
                            </div>
                        </div>

                        <div className="reservation-actions">
                            <div
                                className="status-badge"
                                style={{ backgroundColor: getStatusColor(reservation.status) }}
                            >
                                {reservation.status}
                            </div>

                            <div className="action-buttons">
                                {reservation.status === 'En attente' && (
                                    <>
                                        <button
                                            className="btn2 btn2-success"
                                            onClick={() => updateReservationStatus(reservation.id, 'Confirmée')}
                                        >
                                            Confirmer
                                        </button>
                                        <button
                                            className="btn2 btn2-danger"
                                            onClick={() => updateReservationStatus(reservation.id, 'Annulée')}
                                        >
                                            Annuler
                                        </button>
                                    </>
                                )}
                                {reservation.status === 'Confirmée' && (
                                    <button
                                        className="btn2 btn2-danger"
                                        onClick={() => updateReservationStatus(reservation.id, 'Annulée')}
                                    >
                                        Annuler
                                    </button>
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