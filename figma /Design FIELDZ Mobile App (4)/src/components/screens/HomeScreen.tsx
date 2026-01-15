import React, { useState, useEffect } from 'react';
import { Logo } from '../Logo';
import { Button } from '../ui/Button';
import { ClubCard } from '../ClubCard';
import { Zap } from 'lucide-react';

interface HomeScreenProps {
  onViewClub: (clubId: number) => void;
  onLogoClick: () => void;
  onProfileClick: () => void;
}

const mockClubs = [
  {
    id: 1,
    name: 'Hydra Sports Club',
    location: 'Hydra, Alger',
    sports: ['Football', 'Padel'],
    nextAvailable: 'Aujourd\'hui 18:00',
    image: 'https://images.unsplash.com/photo-1734652246537-104c43a68942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBmaWVsZHxlbnwxfHx8fDE3NjY5Mjc4MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1734652246537-104c43a68942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBmaWVsZHxlbnwxfHx8fDE3NjY5Mjc4MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1712325485668-6b6830ba814e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBpbmRvb3IlMjBmaWVsZHxlbnwxfHx8fDE3NjczNjYyNjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1699117686612-ece525e4f91a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWRlbCUyMHRlbm5pcyUyMGNvdXJ0fGVufDF8fHx8MTc2NzM2NjI2OXww&ixlib=rb-4.1.0&q=80&w=1080'
    ]
  },
  {
    id: 2,
    name: 'Ben Aknoun Elite',
    location: 'Ben Aknoun, Alger',
    sports: ['Padel'],
    nextAvailable: 'Demain 10:00',
    image: 'https://images.unsplash.com/photo-1657709288025-06d5eaa41757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWRlbCUyMGNvdXJ0JTIwdGVubmlzfGVufDF8fHx8MTc2NjkyNzgzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1657709288025-06d5eaa41757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWRlbCUyMGNvdXJ0JTIwdGVubmlzfGVufDF8fHx8MTc2NjkyNzgzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1699117686612-ece525e4f91a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWRlbCUyMHRlbm5pcyUyMGNvdXJ0fGVufDF8fHx8MTc2NzM2NjI2OXww&ixlib=rb-4.1.0&q=80&w=1080'
    ]
  },
  {
    id: 3,
    name: 'Chéraga Stadium',
    location: 'Chéraga, Alger',
    sports: ['Football'],
    nextAvailable: 'Aujourd\'hui 20:00',
    image: 'https://images.unsplash.com/photo-1705593136686-d5f32b611aa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjb21wbGV4JTIwb3V0ZG9vcnxlbnwxfHx8fDE3NjY5Mjc4MzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1705593136686-d5f32b611aa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjb21wbGV4JTIwb3V0ZG9vcnxlbnwxfHx8fDE3NjY5Mjc4MzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1712325485668-6b6830ba814e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBpbmRvb3IlMjBmaWVsZHxlbnwxfHx8fDE3NjczNjYyNjl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ]
  }
];

const heroImages = [
  'https://images.unsplash.com/photo-1642506539297-6021bf65badc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBhY3Rpb24lMjBlbmVyZ3l8ZW58MXx8fHwxNzY3MzY3Mzc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1651043421470-88b023bb9636?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBhZXJpYWx8ZW58MXx8fHwxNzY3MzI1MDgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1760114852799-159fe9dccfa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRlcyUyMHRyYWluaW5nfGVufDF8fHx8MTc2NzMzOTE1MHww&ixlib=rb-4.1.0&q=80&w=1080'
];

export function HomeScreen({ onViewClub, onLogoClick, onProfileClick }: HomeScreenProps) {
  const [sport, setSport] = useState('Tous');
  const [city, setCity] = useState('Alger');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Hero Section with Background Carousel */}
      <div className="relative h-[450px] overflow-hidden">
        {/* Background Images Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: index === currentImageIndex ? 1 : 0 }}
            >
              <img 
                src={image}
                alt={`Sports background ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <button 
              onClick={onLogoClick}
              className="w-10 h-10 rounded-full bg-[#1ED760] flex items-center justify-center hover:bg-[#05602B] transition-colors"
            >
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '18px', color: '#FFFFFF' }}>
                F
              </span>
            </button>
            
            <Logo size="sm" variant="light" />
            
            <button 
              onClick={onProfileClick}
              className="w-10 h-10 rounded-full bg-[#1ED760] flex items-center justify-center hover:bg-[#05602B] transition-colors"
            >
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '18px', color: '#FFFFFF' }}>
                A
              </span>
            </button>
          </div>
          
          {/* Hero Text */}
          <div className="flex-1 flex flex-col justify-center px-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5" style={{ color: '#1ED760' }} fill="#1ED760" strokeWidth={2} />
              <span 
                className="uppercase tracking-wider"
                style={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontWeight: 700,
                  fontSize: '13px',
                  color: '#1ED760',
                  letterSpacing: '0.1em'
                }}
              >
                JOUE MAINTENANT
              </span>
            </div>
            
            <h1 
              className="mb-3"
              style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 900,
                fontSize: '38px',
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                lineHeight: '1.1',
                textTransform: 'uppercase'
              }}
            >
              Trouve ton prochain défi
            </h1>
            
            <p className="mb-6" style={{ color: '#E5E7EB', fontSize: '16px', fontWeight: 500 }}>
              Réserve un terrain dans un club près de toi
            </p>
            
            {/* Search Bar */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-1.5 mb-3">
              <input
                type="text"
                placeholder="🔍 Rechercher un club..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-transparent text-[#0E0E0E] focus:outline-none placeholder:text-[#6B7280]"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
              />
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="px-4 py-3.5 bg-[#05602B] rounded-2xl text-white focus:outline-none appearance-none cursor-pointer"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '15px' }}
              >
                <option>Tous</option>
                <option>Football</option>
                <option>Padel</option>
                <option>Tennis</option>
              </select>
              
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="px-4 py-3.5 bg-[#05602B] rounded-2xl text-white focus:outline-none appearance-none cursor-pointer"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '15px' }}
              >
                <option>Alger</option>
                <option>Oran</option>
                <option>Constantine</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Clubs List */}
      <div className="max-w-md mx-auto px-6 py-6">
        <h2 
          className="mb-4"
          style={{ 
            fontFamily: 'Poppins, sans-serif', 
            fontWeight: 800,
            fontSize: '22px',
            color: '#0E0E0E'
          }}
        >
          Clubs disponibles
        </h2>
        
        <div className="space-y-4">
          {mockClubs.map(club => (
            <ClubCard
              key={club.id}
              {...club}
              onViewSlots={() => onViewClub(club.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}