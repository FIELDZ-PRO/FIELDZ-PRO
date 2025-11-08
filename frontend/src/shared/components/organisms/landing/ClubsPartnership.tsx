// src/components/organisms/ClubsPartnership.tsx
import React, { useState } from 'react'
import { Users, TrendingUp, Handshake, Phone, Mail } from 'lucide-react'
import axios from 'axios'
import './style/ClubsPartnership.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// ---- Mapping UI -> enum backend ----
const SPORT_LABELS = [
  'Foot',
  'Padel',
  'Tennis',
  'Basket',
  'Handball',
  'Volley',
  //'Autre',
] as const
type SportLabel = typeof SPORT_LABELS[number]

// Valeurs exactes du backend
type SportEnum = 'FOOT5' | 'PADEL' | 'TENNIS' | 'BASKET' | 'HANDBALL' | 'VOLLEY' // | 'AUTRE'

// Table de correspondance labels → enum
const MAP_LABEL_TO_ENUM: Record<SportLabel, SportEnum> = {
  'Foot': 'FOOT5',
  'Padel': 'PADEL',
  'Tennis': 'TENNIS',
  'Basket': 'BASKET',
  'Handball': 'HANDBALL',
  'Volley': 'VOLLEY',
  //'Autre': 'AUTRE',
}

const toEnumSafe = (label: SportLabel): SportEnum => MAP_LABEL_TO_ENUM[label] ?? 'AUTRE'

// ------------------------------------------------------------

const benefits = [
  { icon: <Users size={32} />, title: 'Plus de visibilité', description: 'Atteignez des milliers de joueurs actifs chaque mois' },
  { icon: <TrendingUp size={32} />, title: 'Augmentez vos réservations', description: "Optimisez le taux d'occupation de vos terrains" },
  { icon: <Handshake size={32} />, title: 'Partenariat gagnant-gagnant', description: 'Commission attractive et support marketing inclus' },
]

const ClubsPartnership: React.FC = () => {
  const [formData, setFormData] = useState({
    nomClub: '',
    ville: '',
    nomResponsable: '',
    email: '',
    telephone: '',
    sportsUI: [] as SportLabel[],
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCheckbox = (label: SportLabel) => {
    setFormData(prev => ({
      ...prev,
      sportsUI: prev.sportsUI.includes(label)
        ? prev.sportsUI.filter(l => l !== label)
        : [...prev.sportsUI, label],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setSubmitMessage('')

    if (!formData.nomClub || !formData.ville || !formData.nomResponsable || !formData.email || !formData.telephone) {
      setSubmitMessage('❌ Merci de remplir tous les champs obligatoires.')
      setIsSubmitting(false)
      return
    }

    if (formData.sportsUI.length === 0) {
      setSubmitMessage('❌ Sélectionnez au moins un sport.')
      setIsSubmitting(false)
      return
    }

    const payload = {
      nomClub: formData.nomClub.trim(),
      ville: formData.ville.trim(),
      nomResponsable: formData.nomResponsable.trim(),
      email: formData.email.trim(),
      telephone: formData.telephone.trim(),
      sports: formData.sportsUI.map(toEnumSafe),
      message: formData.message?.trim() || undefined,
    }

    try {
      // Appel API
      const { data } = await axios.post(`${API_BASE}/api/contact`, payload, {
        headers: { 'Content-Type': 'application/json' },
      })

      // Si la requête réussit
      setSubmitMessage(`✅ Demande envoyée avec succès ! Nous vous contacterons sous 24h.`)

      // Réinitialise le formulaire
      setFormData({
        nomClub: '',
        ville: '',
        nomResponsable: '',
        email: '',
        telephone: '',
        sportsUI: [],
        message: '',
      })
    } catch (error: any) {
      // Si une erreur survient (réseau, 500, 429, etc.)
      console.error("Erreur lors de l'envoi:", error)

      const status = error?.response?.status

      if (status === 429) {
        setSubmitMessage('❌ Vous avez atteint la limite : 2 demandes par 24h avec cette adresse.')
      } else {
        const msg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          `Erreur ${status ?? ''}`.trim()

        setSubmitMessage('❌ ' + (msg || "Une erreur s'est produite."))
      }
    } finally {
      // Ce code s'exécute TOUJOURS, succès ou erreur
      // Ici, on désactive le spinner/bouton de chargement
      setIsSubmitting(false)
    }

  }

  return (
    <section id="contact" className="clubs">
      <div className="clubs__header">
        <h2>Propriétaire d'un club sportif ?</h2>
        <p>Rejoignez FIELDZ et développez votre activité avec la plateforme de référence</p>
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
              <label>Types de terrains (Sports) *</label>
              <div className="form__checkbox-grid">
                {SPORT_LABELS.map(label => (
                  <label key={label}>
                    <input
                      type="checkbox"
                      checked={formData.sportsUI.includes(label)}
                      onChange={() => handleCheckbox(label)}
                    />
                    <span>{label}</span>
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
            <div><Mail size={16} /><span>contact.fieldz@gmail.com</span></div>
            <div><Phone size={16} /><span>+213 770 26 36 40</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ClubsPartnership