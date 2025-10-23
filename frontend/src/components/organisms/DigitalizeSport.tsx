import React from 'react';
import './style/DigitalizeSport.css';

const DigitalizeSport = () => {
  const features = [
    {
      emoji: "⚡",
      title: "En temps réel",
      description: "Vois les terrains disponibles instantanément. Plus besoin d'appeler 10 clubs pour trouver une place.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      emoji: "🎯",
      title: "Zéro friction",
      description: "Trois clics suffisent. Choisis ton terrain, ton créneau, confirme. C'est tout.",
      gradient: "from-red-500 to-pink-500"
    },
    {
      emoji: "🚀",
      title: "Pour tous",
      description: "Joueurs occasionnels ou passionnés, clubs amateurs ou pros. FIELDZ est pour tout le monde.",
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

      <div className="container">
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
          {features.map((feature, index) => (
            <div key={index} className="digitalize-card">
              <div className={`digitalize-icon digitalize-icon-${index + 1}`}>
                <span className="digitalize-emoji">{feature.emoji}</span>
              </div>
              
              <h3 className="digitalize-card-title">{feature.title}</h3>
              <p className="digitalize-card-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DigitalizeSport;