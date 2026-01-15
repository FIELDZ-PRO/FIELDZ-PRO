import React from 'react';
import { ArrowLeft, MapPin, Phone, Home, Clock, Users, Trophy } from 'lucide-react';

interface AboutClubScreenProps {
  clubId: number;
  onBack: () => void;
}

const clubAboutData: Record<number, any> = {
  1: {
    name: 'Hydra Sports Club',
    location: 'Hydra, Alger',
    phone: '0609837382',
    email: 'contact@hydrasports.dz',
    academy: 'Non renseigné',
    hours: 'Lun-Dim 08:00-23:00',
    image: 'https://images.unsplash.com/photo-1734652246537-104c43a68942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBmaWVsZHxlbnwxfHx8fDE3NjY5Mjc4MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: `Hydra Sports Club est l'un des clubs sportifs les plus prestigieux d'Alger. Situé au cœur du quartier de Hydra, notre complexe offre des installations modernes et de qualité pour tous les amateurs de sport.

Avec plus de 10 ans d'expérience, nous nous engageons à fournir les meilleures infrastructures pour la pratique du football et du padel. Nos terrains sont entretenus quotidiennement pour garantir une expérience de jeu optimale.`,
    facilities: [
      '2 terrains de football synthétique',
      '3 courts de padel professionnels',
      'Vestiaires modernes avec douches',
      'Parking gratuit pour 50 véhicules',
      'Cafétéria et espace détente',
      'Éclairage nocturne LED'
    ],
    services: [
      'Réservation en ligne 24/7',
      'Location d\'équipement sportif',
      'Coaching professionnel disponible',
      'Organisation de tournois',
      'Programmes d\'entraînement jeunes'
    ]
  }
};

export function AboutClubScreen({ clubId, onBack }: AboutClubScreenProps) {
  const club = clubAboutData[clubId] || clubAboutData[1];

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
                fontSize: '24px',
                letterSpacing: '-0.02em',
                color: '#0E0E0E'
              }}
            >
              À propos
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Featured Image */}
        <div className="relative h-64">
          <img 
            src={club.image}
            alt={club.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Club Name */}
          <div>
            <h2 
              style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 900,
                fontSize: '28px',
                letterSpacing: '-0.02em',
                color: '#0E0E0E',
                lineHeight: '1.2',
                marginBottom: '8px'
              }}
            >
              {club.name}
            </h2>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: '#05602B' }} strokeWidth={2} />
              <span style={{ fontSize: '15px', color: '#6B7280', fontWeight: 600 }}>
                {club.location}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 card-shadow space-y-4">
            <h3 
              style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 800,
                fontSize: '18px',
                color: '#0E0E0E',
                marginBottom: '8px'
              }}
            >
              Contact
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" style={{ color: '#05602B' }} strokeWidth={2} />
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>Téléphone</p>
                  <p style={{ fontSize: '15px', color: '#0E0E0E', fontWeight: 700 }}>{club.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" style={{ color: '#05602B' }} strokeWidth={2} />
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>Horaires</p>
                  <p style={{ fontSize: '15px', color: '#0E0E0E', fontWeight: 700 }}>{club.hours}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
                  <Home className="w-5 h-5" style={{ color: '#05602B' }} strokeWidth={2} />
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>Académie</p>
                  <p style={{ fontSize: '15px', color: '#0E0E0E', fontWeight: 700 }}>{club.academy}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 card-shadow">
            <h3 
              style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 800,
                fontSize: '18px',
                color: '#0E0E0E',
                marginBottom: '12px'
              }}
            >
              Description
            </h3>
            <p 
              style={{ 
                color: '#374151',
                fontSize: '15px',
                lineHeight: '1.7',
                whiteSpace: 'pre-line'
              }}
            >
              {club.description}
            </p>
          </div>

          {/* Facilities */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 card-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5" style={{ color: '#05602B' }} strokeWidth={2} />
              <h3 
                style={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontWeight: 800,
                  fontSize: '18px',
                  color: '#0E0E0E'
                }}
              >
                Installations
              </h3>
            </div>
            <ul className="space-y-2">
              {club.facilities.map((facility: string, index: number) => (
                <li 
                  key={index}
                  className="flex items-start gap-3"
                >
                  <span style={{ color: '#05602B', fontSize: '18px', lineHeight: '1.5' }}>✓</span>
                  <span style={{ color: '#374151', fontSize: '15px', lineHeight: '1.5' }}>
                    {facility}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 card-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" style={{ color: '#05602B' }} strokeWidth={2} />
              <h3 
                style={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontWeight: 800,
                  fontSize: '18px',
                  color: '#0E0E0E'
                }}
              >
                Services
              </h3>
            </div>
            <ul className="space-y-2">
              {club.services.map((service: string, index: number) => (
                <li 
                  key={index}
                  className="flex items-start gap-3"
                >
                  <span style={{ color: '#05602B', fontSize: '18px', lineHeight: '1.5' }}>✓</span>
                  <span style={{ color: '#374151', fontSize: '15px', lineHeight: '1.5' }}>
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
