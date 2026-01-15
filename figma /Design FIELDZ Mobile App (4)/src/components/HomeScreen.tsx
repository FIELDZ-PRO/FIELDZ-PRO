import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Club {
  id: number;
  name: string;
  location: string;
  image: string;
  sports: string[];
  rating: number;
  pricePerHour: number;
}

interface HomeScreenProps {
  onClubClick: (club: Club) => void;
}

const SPORTS = [
  { id: 'football', name: 'Football', icon: '⚽' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
];

const CLUBS: Club[] = [
  {
    id: 1,
    name: 'Green Stadium',
    location: 'Alger Centre',
    image: 'https://images.unsplash.com/photo-1641029185333-7ed62a19d5f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmaWVsZCUyMGFlcmlhbHxlbnwxfHx8fDE3NjYyNzkxMTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    sports: ['Football', 'Basketball'],
    rating: 4.8,
    pricePerHour: 3000,
  },
  {
    id: 2,
    name: 'Arena Sports Complex',
    location: 'Hydra',
    image: 'https://images.unsplash.com/photo-1710378844976-93a6538671ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnQlMjBpbmRvb3J8ZW58MXx8fHwxNzY2MjkxOTU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    sports: ['Basketball', 'Volleyball'],
    rating: 4.9,
    pricePerHour: 3500,
  },
  {
    id: 3,
    name: 'Tennis Pro Club',
    location: 'Ben Aknoun',
    image: 'https://images.unsplash.com/photo-1566241121793-3e25f3586e43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjBjb3VydCUyMG91dGRvb3J8ZW58MXx8fHwxNzY2MzgxMzc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    sports: ['Tennis'],
    rating: 4.7,
    pricePerHour: 2500,
  },
  {
    id: 4,
    name: 'City Sports Park',
    location: 'Bab Ezzouar',
    image: 'https://images.unsplash.com/photo-1765121691574-4210c03a8f8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzcG9ydHMlMjBmYWNpbGl0eXxlbnwxfHx8fDE3NjYzODEzNzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    sports: ['Football', 'Tennis'],
    rating: 4.6,
    pricePerHour: 2800,
  },
];

export const HomeScreen = ({ onClubClick }: HomeScreenProps) => {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClubs = CLUBS.filter((club) => {
    const matchesSport = !selectedSport || club.sports.some((s) => s.toLowerCase() === selectedSport);
    const matchesSearch =
      !searchQuery ||
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-16 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[#0E0E0E] mb-1">Bonjour 👋</h2>
            <p className="text-[#6B7280] text-sm">Trouvez votre terrain</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#F9FAFB] flex items-center justify-center">
            <span className="text-xl">👤</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M19 19L15 15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher un club ou une ville"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-[#F9FAFB] border-0 rounded-2xl text-[#0E0E0E] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#05602B]/20 transition-all"
          />
        </div>
      </div>

      {/* Sports Filter */}
      <div className="px-6 py-6 overflow-x-auto">
        <div className="flex space-x-3">
          {SPORTS.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(selectedSport === sport.id ? null : sport.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-full whitespace-nowrap transition-all ${
                selectedSport === sport.id
                  ? 'bg-[#05602B] text-white'
                  : 'bg-white text-[#0E0E0E] hover:bg-white/80'
              }`}
            >
              <span className="text-lg">{sport.icon}</span>
              <span className="text-sm">{sport.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clubs List */}
      <div className="px-6 space-y-4">
        <h3 className="text-[#0E0E0E] mb-4">
          {filteredClubs.length} terrain{filteredClubs.length > 1 ? 's' : ''} disponible{filteredClubs.length > 1 ? 's' : ''}
        </h3>

        {filteredClubs.map((club) => (
          <button
            key={club.id}
            onClick={() => onClubClick(club)}
            className="w-full bg-white rounded-3xl overflow-hidden hover:scale-[0.98] transition-transform active:scale-95"
          >
            <div className="aspect-[16/9] overflow-hidden bg-gray-100">
              <ImageWithFallback
                src={club.image}
                alt={club.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-[#0E0E0E] text-left mb-1">{club.name}</h3>
                  <p className="text-[#6B7280] text-sm text-left">{club.location}</p>
                </div>
                <div className="flex items-center space-x-1 bg-[#F9FAFB] px-3 py-1.5 rounded-full">
                  <span className="text-sm">⭐</span>
                  <span className="text-sm text-[#0E0E0E]">{club.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F3F4F6]">
                <div className="flex gap-2">
                  {club.sports.map((sport) => (
                    <span key={sport} className="text-xs text-[#6B7280] bg-[#F9FAFB] px-3 py-1.5 rounded-full">
                      {sport}
                    </span>
                  ))}
                </div>
                <p className="text-[#05602B]">
                  {club.pricePerHour.toLocaleString()} DA<span className="text-[#6B7280]">/h</span>
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
