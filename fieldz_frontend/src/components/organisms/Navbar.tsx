import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../atoms/Logo';
import Button from '../atoms/button';
import './style/Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo à gauche */}
        <Link to="/home" className="navbar__logo">
          <Logo />
        </Link>

        {/* Liens centraux */}
        <ul className="navbar__menu">
          <li><a href="#about">À propos</a></li>
          <li><a href="#tutorial">Tutoriel</a></li>
          <li><a href="#contact">Nous contacter</a></li>
        </ul>

        {/* Actions à droite */}
        <div className="navbar__actions">
          <Button
            variant="text"
            className="navbar__btn-text"
            onClick={() => navigate('/login')}
          >
            Connexion
          </Button>
          <Button
            variant="primary"
            className="navbar__btn-primary"
            onClick={() => navigate('/register')}
          >
            Inscription
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
