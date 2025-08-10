// src/components/organisms/Footer.tsx
import React from 'react'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import './style/Footer.css'

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer__container">
      <div className="footer__brand">
        <h3>FIELDZ</h3>
        <p>
          La plateforme de référence pour réserver tes terrains de sport en Algérie.
        </p>
        <div className="footer__socials">
          <a href="#"><Facebook size={20}/></a>
          <a href="#"><Instagram size={20}/></a>
          <a href="#"><Twitter size={20}/></a>
        </div>
      </div>

      <div className="footer__links">
        <h4>Liens utiles</h4>
        <ul>
          <li><a href="#about">À propos</a></li>
          <li><a href="#how-it-works">Comment ça marche</a></li>
          <li><a href="#clubs">Devenir partenaire</a></li>
          <li><a href="#help">Centre d'aide</a></li>
        </ul>
      </div>

      <div className="footer__legal">
        <h4>Légal</h4>
        <ul>
          <li><a href="#">Conditions générales</a></li>
          <li><a href="#">Politique de confidentialité</a></li>
          <li><a href="#">Mentions légales</a></li>
          <li><a href="#">Cookies</a></li>
        </ul>
      </div>

      <div className="footer__contact">
        <h4>Contact</h4>
        <div className="footer__contact-item">
          <Mail size={18}/>
          <span>contact@fieldz.dz</span>
        </div>
        <div className="footer__contact-item">
          <Phone size={18}/>
          <span>+213 XX XX XX XX</span>
        </div>
        <div className="footer__contact-item">
          <MapPin size={18}/>
          <span>Alger, Algérie</span>
        </div>
      </div>
    </div>

    <div className="footer__bottom">
      © 2024 FIELDZ. Tous droits réservés.
    </div>
  </footer>
)

export default Footer
