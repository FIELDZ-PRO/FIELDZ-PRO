// src/components/organisms/ClubsPartnership.tsx
import React, { useState } from 'react'
import { Users, TrendingUp, Handshake, Phone, Mail } from 'lucide-react'
import axios from 'axios'
import './style/ClubsPartnership.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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

const ClubsPartnership: React.FC = () => {
  const [formData, setFormData] = useState({
    nomClub: '',
    ville: '',
    nomResponsable: '',
    email: '',
    telephone: '',
    terrains: [] as string[],
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCheckbox = (terrain: string) => {
    setFormData(prev => ({
      ...prev,
      terrains: prev.terrains.includes(terrain)
        ? prev.terrains.filter(t => t !== terrain)
        : [...prev.terrains, terrain]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await axios.post(`${API_BASE}/api/contact/club-partnership`, formData)
      
      setSubmitMessage(response.data.message || '✅ Demande envoyée avec succès !')
      
      // Réinitialiser le formulaire
      setFormData({
        nomClub: '',
        ville: '',
        nomResponsable: '',
        email: '',
        telephone: '',
        terrains: [],
        message: '',
      })
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi:', error)
      const errorMsg = error.response?.data?.message || 'Erreur lors de l\'envoi. Veuillez réessayer.'
      setSubmitMessage('❌ ' + errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="clubs">
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
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form__row">
              <div>
                <label>Nom du club *</label>
                <input 
                  type="text" 
                  name="nomClub"
                  placeholder="Ex : Club Sportif d'Alger"
                  value={formData.nomClub}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Ville *</label>
                <input 
                  type="text" 
                  name="ville"
                  placeholder="Ex : Alger"
                  value={formData.ville}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <label>Nom du responsable *</label>
              <input 
                type="text" 
                name="nomResponsable"
                placeholder="Votre nom complet"
                value={formData.nomResponsable}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form__row">
              <div>
                <label>Email *</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="contact@votre-club.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Téléphone *</label>
                <input 
                  type="tel" 
                  name="telephone"
                  placeholder="+213 XX XX XX XX"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <label>Types de terrains</label>
              <div className="form__checkbox-grid">
                {['Football','Padel','Tennis','Basketball','Volleyball','Autre'].map(s => (
                  <label key={s}>
                    <input 
                      type="checkbox" 
                      checked={formData.terrains.includes(s)}
                      onChange={() => handleCheckbox(s)}
                    />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label>Message (optionnel)</label>
              <textarea 
                name="message"
                rows={4} 
                placeholder="Parlez-nous de votre club…"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            {submitMessage && (
              <div className={`submit-message ${submitMessage.startsWith('✅') ? 'success' : 'error'}`}>
                {submitMessage}
              </div>
            )}
            
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
            </button>
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
}

export default ClubsPartnership