import React from 'react';
import { ArrowRight, Sparkles, Trophy, Users } from 'lucide-react';

interface NewsScreenProps {
  onNewsClick: (newsId: number) => void;
}

const newsData = [
  {
    id: 1,
    category: 'Nouveauté',
    icon: Sparkles,
    title: 'Réservation instantanée disponible',
    description: 'Réserve ton terrain en 3 clics. Plus besoin d\'attendre la confirmation, ton créneau est confirmé instantanément.',
    image: 'https://images.unsplash.com/photo-1705593813682-033ee2991df6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtJTIwYWVyaWFsfGVufDF8fHx8MTc2NjkyOTc5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    bgColor: 'from-purple-500/20 to-pink-500/20',
    textColor: '#9333EA'
  },
  {
    id: 2,
    category: 'Communauté',
    icon: Users,
    title: 'Rejoins des matchs près de chez toi',
    description: 'Trouve des équipes qui recherchent des joueurs pour compléter leur match. Pas besoin d\'avoir une équipe complète.',
    image: 'https://images.unsplash.com/photo-1760174012435-630a17a434ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBhY3Rpb24lMjB0ZWFtfGVufDF8fHx8MTc2NjkyOTcwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    bgColor: 'from-blue-500/20 to-cyan-500/20',
    textColor: '#0284C7'
  },
  {
    id: 3,
    category: 'Événement',
    icon: Trophy,
    title: 'Tournoi FIELDZ - Janvier 2025',
    description: 'Inscris-toi au premier tournoi national FIELDZ. 32 équipes, 3 jours de compétition intense à Alger.',
    image: 'https://images.unsplash.com/photo-1747423514926-5e368319effb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGZpZWxkJTIwbGlnaHRzfGVufDF8fHx8MTc2NjkyOTYwNHww&ixlib=rb-4.1.0&q=80&w=1080',
    bgColor: 'from-amber-500/20 to-orange-500/20',
    textColor: '#D97706'
  }
];

export function NewsScreen({ onNewsClick }: NewsScreenProps) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-md mx-auto px-6 py-6">
          <h1 
            className="mb-2"
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 900,
              fontSize: '32px',
              letterSpacing: '-0.02em',
              color: '#0E0E0E'
            }}
          >
            News FIELDZ
          </h1>
          <p style={{ color: '#6B7280', fontSize: '15px' }}>
            Nouveautés, événements et actualités
          </p>
        </div>
      </div>
      
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Featured News (Keynote Style) */}
        {newsData.map((news, index) => {
          const IconComponent = news.icon;
          
          return (
            <div 
              key={news.id}
              className={`bg-gradient-to-br ${news.bgColor} rounded-3xl overflow-hidden border border-[#E5E7EB] card-shadow hover:card-shadow-hover transition-all cursor-pointer`}
            >
              {/* Image */}
              <div className="relative h-56">
                <img 
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-xl flex items-center gap-2">
                  <IconComponent className="w-4 h-4" style={{ color: news.textColor }} strokeWidth={2.5} />
                  <span 
                    className="uppercase tracking-wider"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif', 
                      fontWeight: 700,
                      fontSize: '11px',
                      color: news.textColor,
                      letterSpacing: '0.05em'
                    }}
                  >
                    {news.category}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="bg-white p-6">
                <h2 
                  className="mb-3"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif', 
                    fontWeight: 800,
                    fontSize: '22px',
                    color: '#0E0E0E',
                    lineHeight: '1.2'
                  }}
                >
                  {news.title}
                </h2>
                
                <p 
                  className="mb-5"
                  style={{ 
                    color: '#6B7280', 
                    fontSize: '15px',
                    lineHeight: '1.6',
                    fontWeight: 500
                  }}
                >
                  {news.description}
                </p>
                
                <button 
                  onClick={() => onNewsClick(news.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full hover:bg-[#F9FAFB] transition-colors group"
                  style={{ color: news.textColor }}
                >
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                    En savoir plus
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          );
        })}
        
        {/* Coming Soon Teaser */}
        <div className="bg-white rounded-3xl p-8 text-center border border-[#E5E7EB] card-shadow">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1ED760] to-[#05602B] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          <h3 
            className="mb-2"
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 800,
              fontSize: '18px',
              color: '#0E0E0E'
            }}
          >
            Plus de nouveautés bientôt
          </h3>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            On prépare des surprises 👀
          </p>
        </div>
      </div>
    </div>
  );
}