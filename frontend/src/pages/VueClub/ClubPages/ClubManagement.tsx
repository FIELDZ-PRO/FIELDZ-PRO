import React, { useState } from 'react';
import { Settings, User, MapPin, Mail, Phone, CreditCard, Bell, FileText } from 'lucide-react';
import './style/ClubManagement.css';

const ClubManagementPage = () => {
    const [clubInfo, setClubInfo] = useState({
        name: 'Club Sportif',
        address: '12a Rue du Stade, Paris',
        email: 'contact@clubsportif.fr',
        phone: '01 23 45 67 89',
        sports: 'Padel, Foot',
        description: 'Club sportif moderne avec installations de qualité'
    });

    const [notifications, setNotifications] = useState({
        emailReservations: true,
        smsReminders: false,
        weeklyReports: true,
        paymentAlerts: true
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically save to a backend
        console.log('Saving club info:', clubInfo);
    };

    const handleNotificationChange = (key: string, value: boolean) => {
        setNotifications(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="club-management-page">
            <div className="page-header">
                <h1>Gestion du club</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                    <Settings size={16} />
                    {isEditing ? 'Sauvegarder' : 'Modifier'}
                </button>
            </div>

            <div className="management-content">
                <div className="club-info-section">
                    <div className="section-header">
                        <h2>Informations du club</h2>
                    </div>

                    <div className="info-form">
                        <div className="form-group">
                            <label>
                                <User size={16} />
                                Nom du club
                            </label>
                            <input
                                type="text"
                                value={clubInfo.name}
                                onChange={(e) => setClubInfo({ ...clubInfo, name: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <MapPin size={16} />
                                Adresse
                            </label>
                            <input
                                type="text"
                                value={clubInfo.address}
                                onChange={(e) => setClubInfo({ ...clubInfo, address: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <Mail size={16} />
                                Email
                            </label>
                            <input
                                type="email"
                                value={clubInfo.email}
                                onChange={(e) => setClubInfo({ ...clubInfo, email: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <Phone size={16} />
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                value={clubInfo.phone}
                                onChange={(e) => setClubInfo({ ...clubInfo, phone: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <Settings size={16} />
                                Sports proposés
                            </label>
                            <input
                                type="text"
                                value={clubInfo.sports}
                                onChange={(e) => setClubInfo({ ...clubInfo, sports: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <FileText size={16} />
                                Description
                            </label>
                            <textarea
                                value={clubInfo.description}
                                onChange={(e) => setClubInfo({ ...clubInfo, description: e.target.value })}
                                disabled={!isEditing}
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                <div className="settings-sections">
                    <div className="notifications-section">
                        <div className="section-header">
                            <h2>
                                <Bell size={20} />
                                Notifications
                            </h2>
                        </div>

                        <div className="notification-settings">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Notifications de réservation</h3>
                                    <p>Recevoir un email pour chaque nouvelle réservation</p>
                                </div>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={notifications.emailReservations}
                                        onChange={(e) => handleNotificationChange('emailReservations', e.target.checked)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Rappels SMS</h3>
                                    <p>Envoyer des rappels SMS aux clients</p>
                                </div>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={notifications.smsReminders}
                                        onChange={(e) => handleNotificationChange('smsReminders', e.target.checked)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Rapports hebdomadaires</h3>
                                    <p>Recevoir un résumé des activités chaque semaine</p>
                                </div>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={notifications.weeklyReports}
                                        onChange={(e) => handleNotificationChange('weeklyReports', e.target.checked)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h3>Alertes de paiement</h3>
                                    <p>Notifications pour les paiements en retard</p>
                                </div>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={notifications.paymentAlerts}
                                        onChange={(e) => handleNotificationChange('paymentAlerts', e.target.checked)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="payment-section">
                        <div className="section-header">
                            <h2>
                                <CreditCard size={20} />
                                Paiements
                            </h2>
                        </div>

                        <div className="payment-methods">
                            <div className="payment-method">
                                <div className="method-info">
                                    <h3>Stripe</h3>
                                    <p>Paiements par carte bancaire en ligne</p>
                                    <span className="status active">Actif</span>
                                </div>
                                <button className="btn btn-outline">Configurer</button>
                            </div>

                            <div className="payment-method">
                                <div className="method-info">
                                    <h3>Chèques</h3>
                                    <p>Paiements par chèque sur place</p>
                                    <span className="status active">Actif</span>
                                </div>
                                <button className="btn btn-outline">Configurer</button>
                            </div>

                            <div className="payment-method">
                                <div className="method-info">
                                    <h3>Espèces</h3>
                                    <p>Paiements en espèces sur place</p>
                                    <span className="status active">Actif</span>
                                </div>
                                <button className="btn btn-outline">Configurer</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubManagementPage;