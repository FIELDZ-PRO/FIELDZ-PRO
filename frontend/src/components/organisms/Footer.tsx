import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import './style/Footer.css';

// Import TikTok icon (SVG custom)
const TikTokIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Footer: React.FC = () => {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Logo et description */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <div className="footer__logo-icon">Fz</div>
            <span className="footer__logo-text">FIELDZ</span>
          </Link>
          <p className="footer__description">
            La plateforme qui connecte joueurs et clubs sportifs pour réserver vos terrains en quelques clics.
          </p>
          
          {/* Réseaux sociaux */}
          <div className="footer__social">
            <a 
              href="https://facebook.com/fieldz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a 
              href="https://instagram.com/fieldz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a 
              href="https://linkedin.com/company/fieldz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="https://tiktok.com/@fieldz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="TikTok"
            >
              <TikTokIcon />
            </a>
          </div>
        </div>

        {/* Liens utiles */}
        <div className="footer__links">
          <h3 className="footer__links-title">Liens utiles</h3>
          <ul className="footer__links-list">
            <li>
              <a 
                href="#pourquoi-fieldz" 
                onClick={(e) => handleScrollTo(e, 'pourquoi-fieldz')}
                className="footer__link"
              >
                À propos
              </a>
            </li>
            <li>
              <a 
                href="#comment-ca-marche" 
                onClick={(e) => handleScrollTo(e, 'comment-ca-marche')}
                className="footer__link"
              >
                Comment ça marche
              </a>
            </li>
            <li>
              <a 
                href="#pour-les-clubs" 
                onClick={(e) => handleScrollTo(e, 'pour-les-clubs')}
                className="footer__link"
              >
                Devenir partenaire
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer__contact">
          <h3 className="footer__contact-title">Contact</h3>
          <p className="footer__contact-info">
            <strong>Email:</strong><br />
            <a href="mailto:contact.fieldz@gmail.com" className="footer__contact-link">
              contact.fieldz@gmail.com
            </a>
          </p>
          <p className="footer__contact-info">
            <strong>Téléphone:</strong><br />
            <a href="tel:+213555123456" className="footer__contact-link">
              +213 555 123 456
            </a>
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer__bottom">
        <p className="footer__copyright">
          © {new Date().getFullYear()} FIELDZ. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;