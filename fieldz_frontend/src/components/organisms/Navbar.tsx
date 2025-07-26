import React, { FC } from 'react';
import Logo from '../atoms/Logo';
import Link from '../atoms/Link';
import Button from '../atoms/Button';
import './style/navbar.css';

const Navbar: FC = () => (
  <nav className="navbar">
    <div className="navbar__logo">
      <Logo />
    </div>
    <ul className="navbar__links">
      <li><Link href="#about">À propos</Link></li>
      <li><Link href="#tutorial">Tutoriel</Link></li>
      <li><Link href="#contact">Nous contacter</Link></li>
    </ul>
    <div className="navbar__auth">
      <Button variant="text" onClick={() => {/* navigate('/login') */}}>
        Connexion
      </Button>
      <Button variant="primary" onClick={() => {/* navigate('/register') */}}>
        Inscription
      </Button>
    </div>
  </nav>
);

export default Navbar;
