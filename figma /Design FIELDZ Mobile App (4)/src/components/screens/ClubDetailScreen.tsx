import React, { useState } from 'react';
import { ArrowLeft, MapPin, Phone, Home, Clock, MoreVertical } from 'lucide-react';
import { Button } from '../ui/Button';

interface ClubDetailScreenProps {
  clubId: number;
  onBack: () => void;
  onReserve: (data: any) => void;
  onAboutClub: () => void;
}

const clubData = {
  1: {
    name: 'Hydra Sports Club',
    location: 'Hydra, Alger',
    phone: '0609837382',
    academy: 'Non renseigné',
    hours: 'Lun-Dim 08:00-23:00',
    image: 'https://images.unsplash.com/photo-1734652246537-104c43a68942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBmaWVsZHxlbnwxfHx8fDE3NjY5Mjc4MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    sports: ['Football', 'Padel'],
    terrains: [
      {
        id: 1,
        name: 'Terrain 1',
        sport: 'Football',
        type: 'Synthétique',
        slots: [
          { time: '10h-11h (1h 30 mins)', price: '5000 DZD', period: 'matin', date: '2026-01-06' },
          { time: '14h-15h (1h 30 mins)', price: '5000 DZD', period: 'apres-midi', date: '2026-01-06' },
          { time: '18h-19h (1h 30 mins)', price: '6000 DZD', period: 'soir', date: '2026-01-06' },
          { time: '09h-10h (1h 30 mins)', price: '4500 DZD', period: 'matin', date: '2026-01-07' },
          { time: '19h-20h (1h 30 mins)', price: '6000 DZD', period: 'soir', date: '2026-01-07' }
        ]
      },
      {
        id: 2,
        name: 'Court Central',
        sport: 'Padel',
        type: 'Gazon artificiel',
        slots: [
          { time: '11h-12h (1h)', price: '4000 DZD', period: 'matin', date: '2026-01-06' },
          { time: '13h-14h (1h)', price: '4500 DZD', period: 'midi', date: '2026-01-06' },
          { time: '15h-16h (1h)', price: '4500 DZD', period: 'apres-midi', date: '2026-01-06' },
          { time: '20h-21h (1h)', price: '5000 DZD', period: 'soir', date: '2026-01-06' }
        ]
      }
    ]
  }
};

// Generate dates for 3 weeks
const generateDates = () => {
  const dates = [];
  const today = new Date('2026-01-03');
  
  for (let i = 0; i < 21; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
    });
  }
  
  return dates;
};

export function ClubDetailScreen({ clubId, onBack, onReserve, onAboutClub }: ClubDetailScreenProps) {
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date('2026-01-06').toISOString().split('T')[0]);
  
  const club = clubData[clubId as keyof typeof clubData] || clubData[1];
  const dates = generateDates();
  
  const periods = [
    { id: 'matin', label: 'Matin (~12h)', value: 'matin' },
    { id: 'midi', label: 'Midi (12h-14h)', value: 'midi' },
    { id: 'apres-midi', label: 'Après-midi (14h-18h)', value: 'apres-midi' },
    { id: 'soir', label: 'Soir (18h~)', value: 'soir' }
  ];
  
  // Filter terrains
  const filteredTerrains = club.terrains.filter(terrain => {
    const sportMatch = selectedSport === 'all' || terrain.sport === selectedSport;
    return sportMatch;
  });
  
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header with Image */}
      <div className="relative h-64">
        <img 
          src={club.image}
          alt={club.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" strokeWidth={2} />
        </button>
        
        {/* About Club Button (3 dots) */}
        <button
          onClick={onAboutClub}
          className="absolute top-6 right-6 w-10 h-10 bg-[#05602B] rounded-xl flex items-center justify-center hover:bg-[#044d23] transition-colors"
        >
          <MoreVertical className="w-6 h-6 text-white" strokeWidth={2} />
        </button>
        
        {/* Club Info */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 
            className="mb-2"
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 900,
              fontSize: '32px',
              color: '#FFFFFF',
              lineHeight: '1.1'
            }}
          >
            {club.name}
          </h1>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-white" strokeWidth={2} />
            <span style={{ color: '#E5E7EB', fontSize: '15px', fontWeight: 500 }}>
              {club.location}
            </span>
          </div>
        </div>
      </div>
      
      <div className="max-w-md mx-auto px-6">
        {/* Informations Section - Compact 2x2 Grid */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 my-5 card-shadow">
          <div className="flex items-center gap-2 mb-3">
            <span style={{ fontSize: '16px' }}>ℹ️</span>
            <h3 
              style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 800,
                fontSize: '15px',
                color: '#0E0E0E'
              }}
            >
              Informations
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#05602B' }} strokeWidth={2} />
              <p style={{ fontSize: '12px', color: '#0E0E0E', fontWeight: 600 }}>
                {club.phone}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#05602B' }} strokeWidth={2} />
              <p style={{ fontSize: '12px', color: '#0E0E0E', fontWeight: 600 }}>
                {club.location.split(',')[0]}
              </p>
            </div>
            
            <div className="flex items-center gap-2 col-span-2">
              <Clock className="w-4 h-4 flex-shrink-0" style={{ color: '#05602B' }} strokeWidth={2} />
              <p style={{ fontSize: '12px', color: '#0E0E0E', fontWeight: 600 }}>
                {club.hours}
              </p>
            </div>
          </div>
        </div>
        
        {/* Date Filter - Horizontal Scroll */}
        <div className="pb-4">
          <h3 
            className="mb-3"
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 800,
              fontSize: '16px',
              color: '#0E0E0E'
            }}
          >
            Choisir une date
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {dates.map((date, index) => (
              <button
                key={date.value}
                onClick={() => setSelectedDate(date.value)}
                className={`flex-shrink-0 px-4 py-3 rounded-2xl transition-all ${
                  selectedDate === date.value 
                    ? 'bg-[#05602B] text-white' 
                    : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#05602B]'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '13px', minWidth: '140px' }}
              >
                {date.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Sport Filter */}
        <div className="pb-4">
          <h3 
            className="mb-3"
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 800,
              fontSize: '16px',
              color: '#0E0E0E'
            }}
          >
            Sport
          </h3>
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="w-full px-4 py-3.5 bg-white border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#05602B] appearance-none cursor-pointer"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '15px', color: '#0E0E0E' }}
          >
            <option value="all">Tous les sports</option>
            {club.sports.map(sport => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </div>
        
        {/* Time Period Filter */}
        <div className="pb-5">
          <h3 
            className="mb-3"
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 800,
              fontSize: '16px',
              color: '#0E0E0E'
            }}
          >
            Filtrer par moment de la journée
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {periods.map(period => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(selectedPeriod === period.value ? '' : period.value)}
                className={`px-4 py-3.5 rounded-2xl transition-all ${
                  selectedPeriod === period.value 
                    ? 'bg-[#05602B] text-white' 
                    : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#05602B]'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px' }}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Terrains List */}
        <div className="space-y-4 pb-6">
          {filteredTerrains.map(terrain => {
            const displaySlots = terrain.slots.filter(slot => {
              const dateMatch = slot.date === selectedDate;
              const periodMatch = !selectedPeriod || slot.period === selectedPeriod;
              return dateMatch && periodMatch;
            });
              
            if (displaySlots.length === 0) return null;
            
            return displaySlots.map((slot, idx) => (
              <div 
                key={`${terrain.id}-${idx}`}
                className="bg-white rounded-3xl overflow-hidden border border-[#E5E7EB] card-shadow"
              >
                <div className="relative h-40">
                  <img 
                    src={club.image}
                    alt={terrain.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-xl">
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', color: '#0E0E0E' }}>
                      {terrain.name}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p 
                        className="mb-1"
                        style={{ 
                          fontFamily: 'Poppins, sans-serif', 
                          fontWeight: 800,
                          fontSize: '18px',
                          color: '#0E0E0E'
                        }}
                      >
                        {slot.time}
                      </p>
                      <p className="text-sm" style={{ color: '#6B7280', fontWeight: 500 }}>
                        {terrain.sport}
                      </p>
                    </div>
                    <div className="text-right">
                      <p 
                        style={{ 
                          fontFamily: 'Poppins, sans-serif', 
                          fontWeight: 900,
                          fontSize: '22px',
                          color: '#05602B'
                        }}
                      >
                        {slot.price}
                      </p>
                    </div>
                  </div>
                  
                  <p 
                    className="mb-4 text-sm"
                    style={{ color: '#6B7280', fontWeight: 600 }}
                  >
                    {terrain.type}
                  </p>
                  
                  <Button 
                    fullWidth 
                    onClick={() => onReserve({
                      clubName: club.name,
                      terrainName: terrain.name,
                      date: dates.find(d => d.value === selectedDate)?.label || '',
                      time: slot.time,
                      price: slot.price
                    })}
                  >
                    Réserver
                  </Button>
                </div>
              </div>
            ));
          })}
        </div>
        
        {filteredTerrains.every(terrain => 
          terrain.slots.filter(slot => {
            const dateMatch = slot.date === selectedDate;
            const periodMatch = !selectedPeriod || slot.period === selectedPeriod;
            return dateMatch && periodMatch;
          }).length === 0
        ) && (
          <div className="bg-white rounded-3xl p-10 text-center card-shadow">
            <div className="text-6xl mb-4">😅</div>
            <p className="mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px', color: '#0E0E0E' }}>
              Aucun créneau disponible
            </p>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>
              Essaye un autre filtre ou une autre date
            </p>
          </div>
        )}
      </div>
    </div>
  );
}