import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './style/Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          FIELDZ
        </Link>

        {/* Menu Desktop */}
        <ul className={`navbar__menu ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="#comment-ca-marche">Comment ça marche</a></li>
          <li><a href="#pourquoi-fieldz">Pourquoi FIELdZ</a></li>
          <li><a href="#pour-les-clubs">Pour les clubs</a></li>
          
          {/* Liens de connexion DANS le menu burger sur mobile */}
          <li className="navbar__menu-actions">
            <Link to="/login" className="navbar-btn login">
              Connexion
            </Link>
            <Link to="/register" className="navbar-btn register">
              Inscription
            </Link>
            <Link to="/LoginClub" className="navbar-btn club-login">
              Connexion Club
            </Link>
          </li>
        </ul>

        {/* Actions Desktop (cachées sur mobile) */}
        <div className="navbar__actions navbar__actions-desktop">
          <Link to="/login" className="navbar-btn login">
            Connexion
          </Link>
          <Link to="/register" className="navbar-btn register">
            Inscription
          </Link>
          <Link to="/LoginClub" className="navbar-btn club-login">
            Connexion Club
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