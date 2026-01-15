import React, { useState } from 'react';
import { ReservationCard } from '../ReservationCard';

const mockReservations = {
  upcoming: [
    {
      id: 1,
      clubName: 'Club Sportif d\'Alger',
      terrainName: 'Terrain A - Football',
      date: 'Lun 23 Déc 2024',
      time: '18:00 - 19:00',
      status: 'confirmed' as const
    },
    {
      id: 2,
      clubName: 'Basketball Arena',
      terrainName: 'Court Central',
      date: 'Mer 25 Déc 2024',
      time: '20:00 - 21:00',
      status: 'pending' as const
    }
  ],
  past: [
    {
      id: 3,
      clubName: 'Tennis Club Premium',
      terrainName: 'Court 2',
      date: 'Dim 15 Déc 2024',
      time: '16:00 - 17:00',
      status: 'confirmed' as const
    }
  ],
  cancelled: [
    {
      id: 4,
      clubName: 'Complexe Sportif Elite',
      terrainName: 'Terrain B',
      date: 'Sam 14 Déc 2024',
      time: '19:00 - 20:00',
      status: 'cancelled' as const
    }
  ]
};

export function MyReservationsScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  
  const tabs = [
    { id: 'upcoming' as const, label: 'À venir' },
    { id: 'past' as const, label: 'Passées' },
    { id: 'cancelled' as const, label: 'Annulées' }
  ];
  
  const currentReservations = mockReservations[activeTab];
  
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white px-6 py-6">
          <h1 
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 600,
              fontSize: '28px',
              color: '#0E0E0E',
              letterSpacing: '-0.02em'
            }}
          >
            Mes Réservations
          </h1>
        </div>
        
        {/* Tabs */}
        <div className="bg-white border-b border-[#E5E7EB] px-6">
          <div className="flex gap-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-[#05602B]' 
                    : 'border-transparent'
                }`}
                style={{ 
                  fontFamily: 'Inter, sans-serif', 
                  fontWeight: 500,
                  fontSize: '15px',
                  color: activeTab === tab.id ? '#05602B' : '#6B7280'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Reservations List */}
        <div className="px-6 py-6">
          {currentReservations.length > 0 ? (
            <div className="space-y-3">
              {currentReservations.map(reservation => (
                <ReservationCard
                  key={reservation.id}
                  {...reservation}
                  onCancel={activeTab === 'upcoming' ? () => console.log('Cancel', reservation.id) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p style={{ color: '#6B7280', fontSize: '15px' }}>
                Aucune réservation {activeTab === 'upcoming' ? 'à venir' : activeTab === 'past' ? 'passée' : 'annulée'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}