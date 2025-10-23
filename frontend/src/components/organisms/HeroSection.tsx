import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import './style/HeroSection.css';

interface HeroProps {
  onNavigate: (view: 'landing' | 'player' | 'club') => void;
}

const HeroSection = ({ onNavigate }: HeroProps) => {
  return (
    <section className="hero">
      {/* Background Elements */}
      <div className="hero-bg">
        <div className="hero-bg-shape-1"></div>
        <div className="hero-bg-shape-2"></div>
      </div>

      <div className="container">
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <Sparkles size={16} className="hero-badge-icon" />
            <span>Nouveau en Algérie</span>
          </div>

          {/* Main heading */}
          <h1 className="hero-title">
            Le sport,<br />
            <span className="hero-title-highlight">réservé en un clic</span>
          </h1>
          
          <p className="hero-subtitle">
            Trouve et réserve ton terrain sportif instantanément.<br />
            Simple. Rapide. Algérien.
          </p>

          {/* CTA Button */}
          <div className="hero-cta">
            <button 
              onClick={() => onNavigate('player')}
              className="btn-primary"
            >
              <span>Réserver maintenant</span>
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Benefits */}
          <div className="hero-benefits">
            <div className="hero-benefit-item">
              <div className="hero-benefit-dot"></div>
              <span>Réservation instantanée</span>
            </div>
            <div className="hero-benefit-item">
              <div className="hero-benefit-dot"></div>
              <span>Sans frais cachés</span>
            </div>
            <div className="hero-benefit-item">
              <div className="hero-benefit-dot"></div>
              <span>Support 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;