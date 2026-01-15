import React, { useState } from 'react';
import { Search, MapPin, Clock, Zap, ChevronRight } from 'lucide-react';
import { Logo } from '../Logo';
import { Button } from '../ui/Button';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Search,
    title: 'Trouve ton club',
    description: 'Recherche parmi les meilleurs clubs sportifs près de toi'
  },
  {
    icon: Clock,
    title: 'Vois les créneaux',
    description: 'Tous les horaires disponibles en temps réel'
  },
  {
    icon: Zap,
    title: 'Réserve en un clic',
    description: 'Confirme ta réservation instantanément'
  }
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-[#05602B] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Right Circle */}
        <div 
          className="absolute w-64 h-64 rounded-full border-2 border-white/10"
          style={{ top: '-100px', right: '-100px' }}
        />
        
        {/* Bottom Left Circle */}
        <div 
          className="absolute w-48 h-48 rounded-full bg-white/5"
          style={{ bottom: '60px', left: '-60px' }}
        />
        
        {/* Floating Dots */}
        <div className="absolute" style={{ top: '30%', left: '10%' }}>
          <div className="w-2 h-2 rounded-full bg-white/20 mb-3" />
          <div className="w-2 h-2 rounded-full bg-white/20 mb-3" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
        
        <div className="absolute" style={{ bottom: '30%', right: '15%' }}>
          <div className="w-2 h-2 rounded-full bg-white/20 mb-3" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-6 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8 pt-4">
          <Logo size="md" variant="light" />
        </div>

        {/* Skip Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleSkip}
            className="px-4 py-2 rounded-xl transition-colors hover:bg-white/10"
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 600,
              fontSize: '14px',
              color: '#FFFFFF'
            }}
          >
            Passer
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div 
            className="w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center"
          >
            <Icon className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-center mb-12">
          <h1 
            className="mb-4"
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 900,
              fontSize: '36px',
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              lineHeight: '1.1'
            }}
          >
            {slide.title}
          </h1>
          
          <p 
            className="max-w-sm mx-auto"
            style={{ 
              color: '#FFFFFF', 
              opacity: 0.9,
              fontSize: '17px',
              lineHeight: '1.6',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500
            }}
          >
            {slide.description}
          </p>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-white flex items-center justify-center gap-2 hover:bg-white/95 transition-colors"
          style={{ 
            fontFamily: 'Poppins, sans-serif', 
            fontWeight: 700,
            fontSize: '16px',
            color: '#05602B'
          }}
        >
          {currentSlide === slides.length - 1 ? 'Commencer' : 'Suivant'}
          <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
        </button>

        {/* Spacer */}
        <div className="h-8" />
      </div>
    </div>
  );
}
