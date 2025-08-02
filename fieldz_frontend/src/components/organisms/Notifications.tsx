import React from 'react';
import { Bell, Settings } from 'lucide-react';
import './style/Notifications.css';

const Notifications = () => {
    return (
        <div className="notifications-section">
            <div className="notifications-header">
                <div className="notifications-title">
                    <Bell size={16} />
                    <span>Notifications</span>
                </div>
                <div className="settings-title">
                    <Settings size={16} />
                    <span>Paramètres</span>
                </div>
            </div>

            <div className="notifications-content">
                <div className="notification-item">
                    <div className="notification-text">Alerte de nom du club</div>
                </div>
                <div className="notification-item">
                    <div className="notification-text">Modifier les informations de chaque</div>
                </div>
                <div className="notification-item">
                    <div className="notification-text">Modifier le nom du club</div>
                </div>
                <div className="notification-item">
                    <div className="notification-text">Modifier des club teste kek</div>
                </div>
            </div>

            <div className="payments-section">
                <h4>Paiements</h4>
                <div className="payment-item">
                    <span>Paiements sur stripe</span>
                </div>
                <div className="payment-item">
                    <span>Paiements sur chèques</span>
                </div>
            </div>
        </div>
    );
};

export default Notifications;