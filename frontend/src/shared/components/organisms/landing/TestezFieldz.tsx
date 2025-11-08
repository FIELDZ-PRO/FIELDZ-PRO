import React from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import './style/TestezFieldz.css'

const TestezFieldz: React.FC = () => {
  return (
    <section className="testez-fieldz">
      <div className="testez-fieldz__container">
        <div className="testez-fieldz__badge">
          <Sparkles size={16} />
          <span>Nouveau sur FIELDZ</span>
        </div>
        
        <h2 className="testez-fieldz__title">
          Prêt à réserver ton prochain terrain ?
        </h2>
        
        <p className="testez-fieldz__description">
          Rejoins des milliers de joueurs qui ont déjà trouvé leur terrain idéal. 
          Réserve en 2 minutes, paie en ligne, et profite de ton sport préféré sans contrainte.
        </p>

        <div className="testez-fieldz__features">
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <span>Inscription gratuite</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <span>Sans engagement</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <span>Annulation flexible</span>
          </div>
        </div>

        <div className="testez-fieldz__cta">
          <button className="btn-primary">
            <span>Commencer gratuitement</span>
            <ArrowRight size={20} />
          </button>
          <button className="btn-secondary">
            Découvrir les terrains
          </button>
        </div>

        <p className="testez-fieldz__note">
          Aucune carte bancaire requise · Accès immédiat à tous les terrains
        </p>
      </div>
    </section>
  )
}

export default TestezFieldz