import React from 'react';
import { Users, MapPin, Clock, Zap } from 'lucide-react';

interface MatchCardProps {
  id: number;
  sport: string;
  location: string;
  time: string;
  date: string;
  playersJoined: number;
  playersNeeded: number;
  level: string;
  price: string;
  onJoin: () => void;
}

export function MatchCard({ 
  sport, 
  location, 
  time, 
  date,
  playersJoined, 
  playersNeeded, 
  level,
  price,
  onJoin 
}: MatchCardProps) {
  const spotsLeft = playersNeeded - playersJoined;
  const isFilling = spotsLeft <= 2;
  
  return (
    <button 
      onClick={onJoin}
      className="w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-5 border-2 border-white/10 hover:border-[#1ED760]/50 transition-all active:scale-98 text-left relative overflow-hidden"
    >
      {/* Glow effect when filling */}
      {isFilling && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1ED760]/10 to-transparent pointer-events-none"></div>
      )}
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="px-3 py-1 bg-[#1ED760] rounded-full text-xs"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0B0B0B' }}
              >
                {sport}
              </span>
              <span 
                className={`px-3 py-1 rounded-full text-xs ${
                  level === 'A' ? 'bg-yellow-500/20 text-yellow-500' :
                  level === 'B' ? 'bg-blue-500/20 text-blue-500' :
                  level === 'C' ? 'bg-purple-500/20 text-purple-500' :
                  'bg-white/10 text-white'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
              >
                NIV. {level}
              </span>
            </div>
            
            <h3 
              className="text-white mb-2"
              style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 800,
                fontSize: '18px'
              }}
            >
              Match {sport}
            </h3>
          </div>
          
          {isFilling && (
            <div className="flex items-center gap-1 bg-[#1ED760] px-3 py-1.5 rounded-full animate-pulse">
              <Zap className="w-3 h-3 fill-[#0B0B0B]" style={{ color: '#0B0B0B' }} />
              <span className="text-xs" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0B0B0B' }}>
                SE REMPLIT
              </span>
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2" style={{ color: '#F2F4F7' }}>
            <MapPin className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm" style={{ fontWeight: 500 }}>{location}</span>
          </div>
          
          <div className="flex items-center gap-2" style={{ color: '#F2F4F7' }}>
            <Clock className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm" style={{ fontWeight: 500 }}>{date} • {time}</span>
          </div>
          
          <div className="flex items-center gap-2" style={{ color: '#1ED760' }}>
            <Users className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm" style={{ fontWeight: 600 }}>
              {playersJoined}/{playersNeeded} joueurs • {spotsLeft} place{spotsLeft > 1 ? 's' : ''} restante{spotsLeft > 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span 
            className="text-white"
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 800,
              fontSize: '20px'
            }}
          >
            {price}
          </span>
          
          <span 
            className="px-5 py-2 bg-[#1ED760] rounded-xl text-sm green-glow"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0B0B0B' }}
          >
            Rejoindre →
          </span>
        </div>
      </div>
    </button>
  );
}
