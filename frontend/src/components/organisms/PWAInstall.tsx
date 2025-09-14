import React from 'react'
import { Smartphone, Download, Home } from 'lucide-react'
import './style/PWAInstall.css'

const installSteps = [
  {
    platform: 'Android (Chrome)',
    steps: [
      "Ouvre FIELdZ dans Chrome",
      "Clique sur le menu (⋮) en haut à droite",
      "Sélectionne \"Ajouter à l'écran d'accueil\"",
      "Confirme l'installation",
    ],
  },
  {
    platform: 'iPhone (Safari)',
    steps: [
      "Ouvre FIELdZ dans Safari",
      "Clique sur le bouton de partage (□↗)",
      "Sélectionne \"Sur l'écran d'accueil\"",
      "Appuie sur \"Ajouter\"",
    ],
  },
]

const PWAInstall: React.FC = () => (
  <section className="pwa-install">
    <div className="pwa-install__header">
      <h2 className="pwa-install__title">Installer FIELdZ</h2>
      <p className="pwa-install__subtitle">Emporte FIELdZ partout avec toi</p>
      <p className="pwa-install__description">
        Accès direct depuis ton écran d'accueil pour plus de rapidité et de fluidité
      </p>
    </div>

    <div className="pwa-install__content">
      <div className="pwa-install__instructions">
        {installSteps.map((platform, idx) => (
          <div key={idx} className="pwa-install__card">
            <h3 className="pwa-install__platform">
              <Smartphone className="pwa-install__icon" size={28} />
              {platform.platform}
            </h3>
            <ol className="pwa-install__steps-list">
              {platform.steps.map((step, i) => (
                <li key={i} className="pwa-install__step-item">
                  <span className="pwa-install__step-number">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="pwa-install__mockup">
        <div className="pwa-install__phone-frame">
          <div className="pwa-install__phone-screen">
            <div className="pwa-install__phone-header">FIELdZ</div>
            <div className="pwa-install__phone-body">
              <div className="pwa-install__phone-icon">
                <Home size={40} />
              </div>
              <p>Accès direct depuis ton écran d'accueil</p>
            </div>
          </div>
        </div>
        <div className="pwa-install__app-icon">FIELdZ</div>
      </div>
    </div>

    <div className="pwa-install__benefits">
      <div className="pwa-install__benefit">
        <Download className="pwa-install__benefit-icon" size={32} />
        <h4>Installation rapide</h4>
        <p>En quelques secondes seulement</p>
      </div>
      <div className="pwa-install__benefit">
        <Smartphone className="pwa-install__benefit-icon" size={32} />
        <h4>Expérience native</h4>
        <p>Comme une vraie application</p>
      </div>
      <div className="pwa-install__benefit">
        <Home className="pwa-install__benefit-icon" size={32} />
        <h4>Accès instantané</h4>
        <p>Directement depuis l'écran d'accueil</p>
      </div>
    </div>
  </section>
)

export default PWAInstall
