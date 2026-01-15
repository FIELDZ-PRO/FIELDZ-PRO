import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import { ClubCarousel } from './ClubCarousel';

interface ClubCardProps {
  id: number;
  name: string;
  location: string;
  sports: string[];
  nextAvailable: string;
  image: string;
  images?: string[];
  onViewSlots: () => void;
}

export function ClubCard({ 
  name, 
  location, 
  sports, 
  nextAvailable,
  image,
  images,
  onViewSlots 
}: ClubCardProps) {
  const displayImages = images && images.length > 0 ? images : [image];
  
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#E5E7EB] hover:border-[#05602B] transition-all card-shadow hover:card-shadow-hover">
      {/* Image Carousel */}
      <div className="relative">
        <ClubCarousel images={displayImages} clubName={name} />
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          {sports.map((sport, i) => (
            <span 
              key={i}
              className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-xl text-xs"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#05602B' }}
            >
              {sport}
            </span>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 
          className="mb-2"
          style={{ 
            fontFamily: 'Poppins, sans-serif', 
            fontWeight: 800,
            fontSize: '18px',
            color: '#0E0E0E'
          }}
        >
          {name}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2" style={{ color: '#6B7280' }}>
            <MapPin className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm" style={{ fontWeight: 500 }}>{location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: '#1ED760' }} strokeWidth={2} />
            <span className="text-sm" style={{ fontWeight: 600, color: '#05602B' }}>
              Prochain créneau: {nextAvailable}
            </span>
          </div>
        </div>
        
        <Button fullWidth onClick={onViewSlots}>
          Voir les créneaux
        </Button>
      </div>
    </div>
  );
}