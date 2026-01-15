import React, { useState } from 'react';
import { ReservationCard } from '../ReservationCard';
import { Calendar } from 'lucide-react';

const mockMatches = {
  upcoming: [
    {
      id: 1,
      clubName: 'Hydra Sports Club',
      terrainName: 'Terrain A',
      date: 'Lun 23 Déc 2024',
      time: '18:00 - 19:00',
      status: 'confirmed' as const
    },
    {
      id: 2,
      clubName: 'Ben Aknoun Elite',
      terrainName: 'Court Central',
      date: 'Mer 25 Déc 2024',
      time: '20:00 - 21:00',
      status: 'pending' as const
    }
  ],
  past: [
    {
      id: 3,
      clubName: 'Chéraga Stadium',
      terrainName: 'Terrain B',
      date: 'Dim 15 Déc 2024',
      time: '16:00 - 17:00',
      status: 'confirmed' as const
    }
  ]
};

export function MatchesScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  
  const tabs = [
    { id: 'upcoming' as const, label: 'À venir' },
    { id: 'past' as const, label: 'Passées' }
  ];
  
  const currentMatches = mockMatches[activeTab];
  
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-md mx-auto px-6 py-6">
          <h1 
            className="mb-2"
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 900,
              fontSize: '32px',
              letterSpacing: '-0.02em',
              color: '#0E0E0E'
            }}
          >
            Mes Réservations
          </h1>
          <p style={{ color: '#6B7280', fontSize: '15px' }}>
            Tes créneaux réservés
          </p>
        </div>
      </div>
      
      <div className="max-w-md mx-auto px-6">
        {/* Tabs */}
        <div className="py-4">
          <div className="flex gap-6">
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
                  fontFamily: 'Poppins, sans-serif', 
                  fontWeight: 700,
                  fontSize: '15px',
                  color: activeTab === tab.id ? '#05602B' : '#6B7280'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Matches List */}
        <div className="py-4">
          {currentMatches.length > 0 ? (
            <div className="space-y-3">
              {currentMatches.map(match => (
                <ReservationCard
                  key={match.id}
                  {...match}
                  onCancel={activeTab === 'upcoming' ? () => console.log('Cancel', match.id) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center card-shadow">
              <Calendar className="w-16 h-16 mx-auto mb-4" style={{ color: '#E5E7EB' }} strokeWidth={1.5} />
              <p className="mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px', color: '#0E0E0E' }}>
                Aucune réservation {activeTab === 'upcoming' ? 'à venir' : 'passée'}
              </p>
              <p style={{ color: '#6B7280', fontSize: '14px' }}>
                C'est le moment de réserver un terrain! 🎾
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}