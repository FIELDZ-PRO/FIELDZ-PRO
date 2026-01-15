import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface NotificationsSettingsScreenProps {
  onBack: () => void;
}

export function NotificationsSettingsScreen({ onBack }: NotificationsSettingsScreenProps) {
  const [notifications, setNotifications] = useState({
    reservations: true,
    matchUpdates: true,
    newsEvents: false,
    marketing: false
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationItems = [
    { 
      key: 'reservations' as const, 
      label: 'Réservations', 
      description: 'Confirmations et rappels de réservation' 
    },
    { 
      key: 'matchUpdates' as const, 
      label: 'Matchs', 
      description: 'Nouveaux joueurs et mises à jour de matchs' 
    },
    { 
      key: 'newsEvents' as const, 
      label: 'News & Événements', 
      description: 'Nouveautés et événements FIELDZ' 
    },
    { 
      key: 'marketing' as const, 
      label: 'Promotions', 
      description: 'Offres spéciales et promotions' 
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-md mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" style={{ color: '#0E0E0E' }} strokeWidth={2} />
            </button>
            <h1 
              style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 900,
                fontSize: '32px',
                letterSpacing: '-0.02em',
                color: '#0E0E0E'
              }}
            >
              Notifications
            </h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-md mx-auto px-6 py-6">
        <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden card-shadow">
          {notificationItems.map((item, index) => (
            <div
              key={item.key}
              className={`flex items-center justify-between p-4 ${
                index !== notificationItems.length - 1 ? 'border-b border-[#E5E7EB]' : ''
              }`}
            >
              <div className="flex-1">
                <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '15px', color: '#0E0E0E' }}>
                  {item.label}
                </p>
                <p className="text-sm" style={{ color: '#6B7280', fontWeight: 500 }}>
                  {item.description}
                </p>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={() => toggleNotification(item.key)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  notifications[item.key] ? 'bg-[#05602B]' : 'bg-[#E5E7EB]'
                }`}
              >
                <div 
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
