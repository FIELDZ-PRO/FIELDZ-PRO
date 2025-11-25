import React from 'react';
import { UserPlus, Search, Calendar } from 'lucide-react';
import './style/DigitalizeSport.css';

const DigitalizeSport = () => {
  const steps = [
    {
      icon: <UserPlus size={32} strokeWidth={2} />,
      number: "01",
      title: "Crée ton compte",
      description: "Inscris-toi gratuitement en quelques secondes avec ton email ou Google.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Search size={32} strokeWidth={2} />,
      number: "02",
      title: "Choisis ton terrain",
      description: "Parcours les terrains disponibles dans ta ville et sélectionne celui qui te convient.",
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: <Calendar size={32} strokeWidth={2} />,
      number: "03",
      title: "Réserve en un clic",
      description: "Choisis ton créneau horaire, reserve directement le terrain et creneau que tu veux et reçois ta confirmation instantanément.",
      gradient: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <section className="digitalize-sport">
      {/* Background Effects */}
      <div className="digitalize-bg">
        <div className="digitalize-bg-shape-1"></div>
        <div className="digitalize-bg-shape-2"></div>
      </div>

      <div className="digitalize-container">
        <div className="digitalize-header">
          <div className="digitalize-badge">
            <span>🇩🇿 Made in Algeria</span>
          </div>
          
          <h2 className="digitalize-title">
            On digitalise<br />
            <span className="digitalize-title-highlight">le sport algérien</span>
          </h2>
          
          <p className="digitalize-subtitle">
            Fini les appels sans réponse, les déplacements inutiles.<br />
            Bienvenue dans l'ère du sport connecté.
          </p>
        </div>

        <div className="digitalize-features">
          {steps.map((step, index) => (
            <div key={index} className="digitalize-card">
              <div className="digitalize-step-number">{step.number}</div>
              
              <div className={`digitalize-icon digitalize-icon-${index + 1}`}>
                {step.icon}
              </div>
              
              <h3 className="digitalize-card-title">{step.title}</h3>
              <p className="digitalize-card-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DigitalizeSport;