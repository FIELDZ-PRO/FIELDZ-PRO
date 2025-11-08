import React from 'react';
import './style/Logo.css';

const Logo: React.FC = () => (
  <div className="logo-container">
    <svg className="logo-icon" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield */}
      <path d="M20 5L28 8L28 20C28 26 20 32 20 32C20 32 12 26 12 20L12 8L20 5Z" fill="currentColor"/>
      {/* Check mark */}
      <path d="M15 19L18 22L25 15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Diagonal line */}
      <path d="M16 27L24 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    </svg>
    <span className="logo-text">FIELDZ</span>
  </div>
);

export default Logo;