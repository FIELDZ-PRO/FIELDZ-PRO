// src/components/organisms/HeroSection.tsx
import React, { useState } from 'react'
import { Search, MapPin, Calendar, Play, ArrowRight } from 'lucide-react'
import './style/HeroSection.css'

interface HeroSectionProps {
  onNavigate: (view: 'landing' | 'player' | 'club') => void
}

const sports = ['Football', 'Padel', 'Tennis', 'Basketball', 'Volleyball']
const villes = ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif']

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [selectedSport, setSelectedSport] = useState('')
  const [selectedVille, setSelectedVille] = useState('')

  return (
    <section className="hero">
      {/* Background shapes (absolutes) */}
      <div className="hero__shapes">
        <div className="shape shape--1" />
        <div className="shape shape--2" />
        <div className="shape shape--3" />
        <div className="shape shape--grid" />
      </div>

      <div className="hero__content">
        {/* Gauche */}
        <div className="hero__left">
          <div className="hero__pill">
            <span className="hero__pill-icon" />
            Plateforme #1 en Algérie
          </div>

          <h1 className="hero__title">
            Joue quand tu veux.
            <br />
            <span className="hero__title-line2">Où tu veux.</span>
          </h1>

          <p className="hero__subtitle">
            Réserve ton terrain de padel, foot ou tennis en quelques clics.
          </p>

          <div className="hero__stats">
            <div className="hero__stat">
              <div className="hero__stat-value">5000+</div>
              <div className="hero__stat-label">Joueurs actifs</div>
            </div>
            <div className="hero__stats-separator" />
            <div className="hero__stat">
              <div className="hero__stat-value">130+</div>
              <div className="hero__stat-label">Terrains</div>
            </div>
            <div className="hero__stats-separator" />
            <div className="hero__stat">
              <div className="hero__stat-value">24/7</div>
              <div className="hero__stat-label">Disponible</div>
            </div>
          </div>

          <div className="hero__cta">
            <button
              onClick={() => onNavigate('player')}
              className="hero__btn-primary"
            >
              <span>RÉSERVER MAINTENANT</span>
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => onNavigate('landing')}
              className="hero__btn-secondary"
            >
              <Play size={20} />
              <span>Voir comment ça marche</span>
            </button>
          </div>
        </div>

        {/* Droite */}
        <div className="hero__right">
          <div className="hero__search-card">
            <div className="search-card__header">
              <h3>Trouve ton terrain</h3>
              <p>Recherche et réserve en quelques secondes</p>
            </div>

            <div className="search-card__fields">
              <div className="search-card__group">
                <label>Sport</label>
                <select
                  value={selectedSport}
                  onChange={e => setSelectedSport(e.target.value)}
                >
                  <option value="">Choisir un sport</option>
                  {sports.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="search-card__group">
                <label>Ville</label>
                <select
                  value={selectedVille}
                  onChange={e => setSelectedVille(e.target.value)}
                >
                  <option value="">Choisir une ville</option>
                  {villes.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => onNavigate('player')}
                className="search-card__btn"
              >
                <Search size={20} />
                <span>Rechercher</span>
              </button>
            </div>

            <div className="search-card__quick-access">
              <p>Accès rapide :</p>
              <div className="quick-access__buttons">
                {['Football','Padel','Tennis'].map(s => (
                  <button key={s}>{s}</button>
                ))}
              </div>
            </div>

            {/* Info cards */}
            <div className="search-card__info info--left">
              <Calendar size={24} />
              <div>
                <div>Réservation</div>
                <div>En 2 minutes</div>
              </div>
            </div>
            <div className="search-card__info info--right">
              <MapPin size={24} />
              <div>
                <div>130+ Terrains</div>
                <div>Partout en Algérie</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
