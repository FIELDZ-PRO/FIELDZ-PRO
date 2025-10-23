import React from 'react'
import { Smartphone, Zap, Bell, MapPin } from 'lucide-react'
import './style/MobileApp.css'

const MobileApp: React.FC = () => {
  return (
    <section className="mobile-app">
      <div className="mobile-app__container">
        <div className="mobile-app__content">
          <div className="mobile-app__badge">
            <Zap size={16} />
            <span>Bientôt disponible</span>
          </div>

          <h2 className="mobile-app__title">
            FIELDZ arrive bientôt sur mobile
          </h2>

          <p className="mobile-app__description">
            Emporte FIELDZ partout avec toi ! Notre application mobile sera très bientôt 
            disponible sur iOS et Android pour une expérience encore plus fluide.
          </p>

          <div className="mobile-app__features">
            <div className="feature">
              <div className="feature__icon">
                <Bell size={24} />
              </div>
              <h4>Notifications instantanées</h4>
              <p>Reçois des alertes pour tes réservations et les nouveaux terrains disponibles</p>
            </div>

            <div className="feature">
              <div className="feature__icon">
                <MapPin size={24} />
              </div>
              <h4>Géolocalisation</h4>
              <p>Trouve les terrains les plus proches de toi en un instant</p>
            </div>

            <div className="feature">
              <div className="feature__icon">
                <Smartphone size={24} />
              </div>
              <h4>Expérience native</h4>
              <p>Interface optimisée pour mobile, rapide et intuitive</p>
            </div>
          </div>

          <div className="mobile-app__notify">
            <p>Sois le premier informé du lancement !</p>
            <form className="notify-form">
              <input 
                type="email" 
                placeholder="Ton adresse email" 
                className="notify-input"
              />
              <button type="submit" className="notify-btn">
                Me notifier
              </button>
            </form>
          </div>

          <div className="mobile-app__stores">
            <div className="store-badge coming-soon">
              <div className="store-icon">🍎</div>
              <div>
                <div className="store-label">Bientôt sur</div>
                <div className="store-name">App Store</div>
              </div>
            </div>

            <div className="store-badge coming-soon">
              <div className="store-icon">🤖</div>
              <div>
                <div className="store-label">Bientôt sur</div>
                <div className="store-name">Google Play</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mobile-app__mockup">
          <div className="phone-frame">
            <div className="phone-screen">
              <div className="screen-header">
                <div className="screen-logo">FIELDZ</div>
              </div>
              <div className="screen-content">
                <div className="mockup-card"></div>
                <div className="mockup-card"></div>
                <div className="mockup-card"></div>
              </div>
            </div>
            <div className="phone-notch"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MobileApp