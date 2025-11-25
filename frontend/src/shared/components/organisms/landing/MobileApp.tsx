import React from 'react'
import { Zap, Bell, MapPin, Smartphone } from 'lucide-react'
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
        </div>

        <div className="mobile-app__mockup">
          <div className="phone-frame">
            <div className="phone-screen">
              <div className="screen-header">
                <div className="screen-logo">FIELDZ</div>
              </div>
              <div className="screen-content">
                {/* Feature 1 */}
                <div className="mockup-feature">
                  <div className="mockup-feature__icon">
                    <Bell size={20} />
                  </div>
                  <div className="mockup-feature__content">
                    <h4>Notifications instantanées</h4>
                    <p>Reçois des alertes pour tes réservations et les nouveaux terrains disponibles</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="mockup-feature">
                  <div className="mockup-feature__icon">
                    <MapPin size={20} />
                  </div>
                  <div className="mockup-feature__content">
                    <h4>Géolocalisation</h4>
                    <p>Trouve les terrains les plus proches de toi en un instant</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="mockup-feature">
                  <div className="mockup-feature__icon">
                    <Smartphone size={20} />
                  </div>
                  <div className="mockup-feature__content">
                    <h4>Expérience native</h4>
                    <p>Interface optimisée pour mobile, rapide et intuitive</p>
                  </div>
                </div>
              </div>

              {/* Store badges dans le mockup */}
              <div className="screen-footer">
                <div className="mockup-store-badge">
                  <svg className="store-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="currentColor"/>
                  </svg>
                  <div>
                    <div className="mockup-store-label">Bientôt sur</div>
                    <div className="mockup-store-name">App Store</div>
                  </div>
                </div>

                <div className="mockup-store-badge">
                  <svg className="store-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" fill="currentColor"/>
                  </svg>
                  <div>
                    <div className="mockup-store-label">Bientôt sur</div>
                    <div className="mockup-store-name">Google Play</div>
                  </div>
                </div>
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