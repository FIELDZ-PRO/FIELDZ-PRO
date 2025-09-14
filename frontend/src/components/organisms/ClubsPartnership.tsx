// src/components/organisms/ClubsPartnership.tsx
import React from 'react'
import { Users, TrendingUp, Handshake, Phone, Mail, MapPin } from 'lucide-react'
import './style/ClubsPartnership.css'

const benefits = [
  {
    icon: <Users size={32} />,
    title: 'Plus de visibilité',
    description: 'Atteignez des milliers de joueurs actifs chaque mois',
  },
  {
    icon: <TrendingUp size={32} />,
    title: 'Augmentez vos réservations',
    description: 'Optimisez le taux d\'occupation de vos terrains',
  },
  {
    icon: <Handshake size={32} />,
    title: 'Partenariat gagnant-gagnant',
    description: 'Commission attractive et support marketing inclus',
  },
]

const ClubsPartnership: React.FC = () => (
  <section className="clubs">
    <div className="clubs__header">
      <h2>Propriétaire d'un club sportif ?</h2>
      <p>Rejoignez FIELdZ et développez votre activité avec la plateforme de référence</p>
    </div>

    <div className="clubs__grid">
      <div className="clubs__benefits">
        <h3>Pourquoi nous rejoindre ?</h3>
        {benefits.map((b, i) => (
          <div key={i} className="clubs__benefit">
            <div className="benefit__icon">{b.icon}</div>
            <div>
              <h4>{b.title}</h4>
              <p>{b.description}</p>
            </div>
          </div>
        ))}

        <div className="clubs__stats">
          <h4>Nos partenaires génèrent en moyenne :</h4>
          <div className="stats__grid">
            <div>
              <div className="stats__value">+40%</div>
              <div>de réservations</div>
            </div>
            <div>
              <div className="stats__value">+25%</div>
              <div>de chiffre d'affaires</div>
            </div>
          </div>
        </div>
      </div>

      <div className="clubs__contact-card">
        <h3>Contactez-nous</h3>
        <p>Remplissez ce formulaire et notre équipe vous contactera sous 24h</p>
        <form className="contact-form">
          <div className="form__row">
            <div>
              <label>Nom du club *</label>
              <input type="text" placeholder="Ex : Club Sportif d'Alger" />
            </div>
            <div>
              <label>Ville *</label>
              <input type="text" placeholder="Ex : Alger" />
            </div>
          </div>
          <div>
            <label>Nom du responsable *</label>
            <input type="text" placeholder="Votre nom complet" />
          </div>
          <div className="form__row">
            <div>
              <label>Email *</label>
              <input type="email" placeholder="contact@votre-club.com" />
            </div>
            <div>
              <label>Téléphone *</label>
              <input type="tel" placeholder="+213 XX XX XX XX" />
            </div>
          </div>
          <div>
            <label>Types de terrains</label>
            <div className="form__checkbox-grid">
              {['Football','Padel','Tennis','Basketball','Volleyball','Autre'].map(s => (
                <label key={s}>
                  <input type="checkbox" />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label>Message (optionnel)</label>
            <textarea rows={4} placeholder="Parlez-nous de votre club…" />
          </div>
          <button type="submit">Envoyer ma demande</button>
        </form>

        <div className="clubs__direct-contact">
          <p>Ou contactez-nous directement :</p>
          <div>
            <Mail size={16} /><span>partenaires@fieldz.dz</span>
          </div>
          <div>
            <Phone size={16} /><span>+213 XX XX XX XX</span>
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default ClubsPartnership
