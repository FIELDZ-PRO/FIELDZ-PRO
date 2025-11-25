import React from 'react'
import { Clock, Phone, Shield, Gift } from 'lucide-react'
import './style/WhyFIELdZ.css'

const advantages = [
  {
    icon: <Clock size={32} className="why-icon" />,
    title: 'Réservation rapide',
    description: 'Réserve ton terrain en moins de 2 minutes, 24h/24.',
  },
  {
    icon: <Phone size={32} className="why-icon" />,
    title: 'Zéro appel, zéro paperasse',
    description: 'Tout se passe en ligne, pas besoin de téléphoner ou de se déplacer.',
  },
  {
    icon: <Shield size={32} className="why-icon" />,
    title: 'Terrains certifiés',
    description: 'Tous nos terrains sont vérifiés et répondent aux standards de qualité.',
  },
  {
    icon: <Gift size={32} className="why-icon" />,
    title: "100% gratuit pour l'utilisateur",
    description: 'Aucun frais supplémentaire, tu paies uniquement le terrain.',
  },
]

const WhyFIELdZ: React.FC = () => (
  <section id="about" className="why">
    <div className="why__header">
      <h2>Pourquoi FIELDZ ?</h2>
      <p>Découvre tous les avantages de notre plateforme de réservation</p>
    </div>
    <div className="why__grid">
      {advantages.map((adv, i) => (
        <div key={i} className="why__item">
          <div className="why__icon-wrapper">{adv.icon}</div>
          <h3 className="why__item-title">{adv.title}</h3>
          <p className="why__item-desc">{adv.description}</p>
        </div>
      ))}
    </div>
  </section>
)

export default WhyFIELdZ
