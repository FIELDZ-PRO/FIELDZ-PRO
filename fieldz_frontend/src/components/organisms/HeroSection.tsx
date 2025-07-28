// src/components/organisms/HeroSection.tsx
import React from 'react'
import './style/HeroSection.css'

const HeroSection: React.FC = () => {
  const onReserve = () => {
    // ta fonction de navigation vers la page de réservation
  }

  const onVoirComment = () => {
    // ta fonction pour afficher le tutoriel
  }

  return (
    <section className="hero">
      {/* Gauche : pastille, titre, sous-titre, stats, CTA */}
      <div className="hero__left">
        <div className="hero__pill">
          <span className="hero__pill-icon" />
          Plateforme #1 en Algérie
        </div>

        <h1 className="hero__title">
          <span className="hero__title-line1">Joue quand tu veux.</span>
        </h1>
        <h2 className="hero2__title">
          <span className="hero__title-line2">Où tu veux.</span>
        </h2>
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
          <button className="hero__btn-primary" onClick={onReserve}>
            <span>RÉSERVER MAINTENANT</span>
          </button>
          <button className="hero__btn-secondary" onClick={onVoirComment}>
            <span>Voir comment ça marche</span>
          </button>
        </div>
      </div>

      {/* Droite : formulaire de recherche */}
      <div className="hero__right">
        {/* Ici ton composant FormSearch */}
      </div>
    </section>
  )
}

export default HeroSection
