import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './style/Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo avec symbole SVG + texte FIELDZ - SÉPARÉS */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-text">FIELDZ</span>
        </Link>

        {/* Menu Desktop */}
        <ul className={`navbar__menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <a 
              href="#comment-ca-marche" 
              onClick={(e) => handleScrollTo(e, 'comment-ca-marche')}
              className="navbar__link"
            >
              Comment ça marche
            </a>
          </li>
          <li>
            <a 
              href="#pourquoi-fieldz" 
              onClick={(e) => handleScrollTo(e, 'pourquoi-fieldz')}
              className="navbar__link"
            >
              Pourquoi FIELDZ
            </a>
          </li>
          <li>
            <a 
              href="#pour-les-clubs" 
              onClick={(e) => handleScrollTo(e, 'pour-les-clubs')}
              className="navbar__link"
            >
              Pour les clubs
            </a>
          </li>
          
          {/* Liens de connexion DANS le menu burger sur mobile */}
          <li className="navbar__menu-actions">
            <Link to="/login" className="navbar-btn login">
              Connexion
            </Link>
            <Link to="/register" className="navbar-btn register">
              Inscription
            </Link>
            <Link to="/LoginClub" className="navbar-btn club-login">
              Espace Club
            </Link>
          </li>
        </ul>

        {/* Actions Desktop */}
        <div className="navbar__actions navbar__actions-desktop">
          <Link to="/login" className="navbar-btn login">
            Connexion
          </Link>
          <Link to="/register" className="navbar-btn register">
            Inscription
          </Link>
          <Link to="/LoginClub" className="navbar-btn club-login">
            Espace Club
          </Link>
        </div>

        {/* Bouton burger mobile */}
        <button 
          className="navbar__mobile-toggle" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;