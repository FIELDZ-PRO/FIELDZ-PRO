import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './style/SportCarousel.css';

const SportsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=80",
      sport: "Football",
      location: "Alger",
      price: "5000 DZD/h",
      emoji: "⚽"
    },
    {
      image: "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=1400&q=80",
      sport: "Padel",
      location: "Oran",
      price: "3500 DZD/h",
      emoji: "🎾"
    },
    {
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1400&q=80",
      sport: "Basketball",
      location: "Constantine",
      price: "4000 DZD/h",
      emoji: "🏀"
    },
    {
      image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1400&q=80",
      sport: "Tennis",
      location: "Annaba",
      price: "3000 DZD/h",
      emoji: "🎾"
    },
    {
      image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1400&q=80",
      sport: "Volleyball",
      location: "Blida",
      price: "2500 DZD/h",
      emoji: "🏐"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="sports-carousel">
      <div className="sports-container">
        <div className="carousel-wrapper">
          <div className="carousel-container">
            <div className="carousel-slides">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                >
                  <img
                    src={slide.image}
                    alt={slide.sport}
                    className="carousel-image"
                  />
                  <div className="carousel-overlay"></div>
                  <div className="carousel-content">
                    <div className="carousel-badge">
                      <span className="carousel-emoji">{slide.emoji}</span>
                      <span className="carousel-badge-text">Disponible maintenant</span>
                    </div>
                    <div className="carousel-sport">{slide.sport}</div>
                    <div className="carousel-info">{slide.location} • {slide.price}</div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={prevSlide} className="carousel-btn carousel-btn-prev">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextSlide} className="carousel-btn carousel-btn-next">
              <ChevronRight size={24} />
            </button>

            <div className="carousel-dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SportsCarousel;