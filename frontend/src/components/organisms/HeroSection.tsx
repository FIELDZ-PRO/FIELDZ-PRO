import React, { useState } from 'react';
import { Search, MapPin, Calendar, Play, ArrowRight, CheckCircle2, Shield, Clock } from 'lucide-react';
import './style/HeroSection.css';

interface HeroProps {
  onNavigate: (view: 'landing' | 'player' | 'club') => void;
}

const Hero = ({ onNavigate }: HeroProps) => {
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedVille, setSelectedVille] = useState('');

  const sports = ['Football', 'Padel', 'Tennis', 'Basketball', 'Volleyball'];
  const villes = ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif'];

  return (
    <section className="hero">
      {/* Background Elements */}
      <div className="hero-bg">
        {/* Geometric shapes */}
        <div className="hero-bg-shape-1"></div>
        <div className="hero-bg-shape-2"></div>
        <div className="hero-bg-shape-3"></div>
        
        {/* Grid pattern */}
        <div className="hero-grid">
          <div></div>
        </div>
      </div>

      <div className="container">
        <div className="hero-content">
          {/* Left Content */}
          <div className="hero-left">
            {/* Badge */}
            <div className="hero-badge">
              <div className="hero-badge-dot"></div>
              <span>Plateforme #1 en Algérie</span>
            </div>

            {/* Main heading */}
            <div className="hero-heading">
              <h1 className="hero-title">
                CLIKI TIRI MARKI
              </h1>
              
              <p className="hero-subtitle">
                Réserve ton terrain de padel, foot ou tennis en quelques clics.
                Plateforme #1 en Algérie pour réserver sa séance de sport.
              </p>
            </div>
            <ul className="hero-benefits">
            <li><CheckCircle2 size={18}/> Clubs vérifiés</li>
             <li><Shield size={18}/> Paiement sécurisé</li>
            <li><Clock size={18}/> Annulation flexible</li>
            </ul>
            


            {/* CTA Buttons */}
            <div className="hero-cta">
              <button 
                onClick={() => onNavigate('player')}
                className="btn-primary"
              >
                <span>RÉSERVER MAINTENANT</span>
                <ArrowRight size={20} />
              </button>
              
              <button className="btn-secondary">
                <Play size={20} />
                <span>Voir comment ça marche</span>
              </button>
            </div>
          </div>

          {/* Right Content - Search Card */}
          <div className="hero-right">
            {/* Floating elements */}
            <div className="hero-floating-1"></div>
            <div className="hero-floating-2"></div>
            
            {/* Main search card */}
            <div className="search-card">
              <div className="search-card-header">
                <h3 className="search-card-title">Trouve ton terrain</h3>
                <p className="search-card-subtitle">Recherche et réserve en quelques secondes</p>
              </div>

              <div className="search-form">
                {/* Sport selection */}
                <div className="form-group">
                  <label className="form-label">Sport</label>
                  <select 
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Choisir un sport</option>
                    {sports.map(sport => (
                      <option key={sport} value={sport}>{sport}</option>
                    ))}
                  </select>
                </div>

                {/* City selection */}
                <div className="form-group">
                  <label className="form-label">Ville</label>
                  <select 
                    value={selectedVille}
                    onChange={(e) => setSelectedVille(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Choisir une ville</option>
                    {villes.map(ville => (
                      <option key={ville} value={ville}>{ville}</option>
                    ))}
                  </select>
                </div>

                {/* Search button */}
                <button 
                  onClick={() => onNavigate('player')}
                  className="btn-search"
                >
                  <Search size={20} />
                  <span>Rechercher</span>
                </button>
              </div>

              {/* Quick access */}
              <div className="quick-access">
                <p className="quick-access-title">Accès rapide :</p>
                <div className="quick-access-buttons">
                  {['Football', 'Padel', 'Tennis'].map(sport => (
                    <button key={sport} className="quick-btn">
                      {sport}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating info cards */}
            <div className="floating-card floating-card-left">
              <div className="floating-card-content">
                <div className="floating-card-icon">
                  <Calendar className="text-fieldz-green" size={24} />
                </div>
                <div className="floating-card-text">
                  <div className="floating-card-title">Réservation</div>
                  <div className="floating-card-subtitle">En 2 minutes</div>
                </div>
              </div>
            </div>

            <div className="floating-card floating-card-right">
              <div className="floating-card-content">
                <div className="floating-card-icon">
                  <MapPin className="text-fieldz-green" size={24} />
                </div>
                <div className="floating-card-text">
                  <div className="floating-card-title">130+ Terrains</div>
                  <div className="floating-card-subtitle">Partout en Algérie</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;