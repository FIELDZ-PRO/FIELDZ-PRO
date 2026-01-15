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

interface ClubDetailScreenProps {
  club: Club;
  onBack: () => void;
  onReserve: (timeSlot: string, date: string) => void;
}

const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
];

const DATES = [
  { date: '2024-12-23', label: "Aujourd'hui" },
  { date: '2024-12-24', label: 'Demain' },
  { date: '2024-12-25', label: 'Mer 25' },
  { date: '2024-12-26', label: 'Jeu 26' },
  { date: '2024-12-27', label: 'Ven 27' },
];

export const ClubDetailScreen = ({ club, onBack, onReserve }: ClubDetailScreenProps) => {
  const [selectedDate, setSelectedDate] = useState(DATES[0].date);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleReserve = () => {
    if (selectedTime) {
      onReserve(selectedTime, selectedDate);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-32">
      {/* Header Image */}
      <div className="relative">
        <div className="aspect-[16/10] bg-gray-100">
          <ImageWithFallback
            src={club.image}
            alt={club.name}
            className="w-full h-full object-cover"
          />
        </div>
        <button
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12 16L6 10L12 4"
              stroke="#0E0E0E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="px-6 -mt-6">
        {/* Info Card */}
        <div className="bg-white rounded-3xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-[#0E0E0E] mb-2">{club.name}</h2>
              <div className="flex items-center space-x-2 text-[#6B7280] mb-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 5V8L10 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-sm">{club.location}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-[#F9FAFB] px-3 py-2 rounded-full">
              <span>⭐</span>
              <span className="text-[#0E0E0E]">{club.rating}</span>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            {club.sports.map((sport) => (
              <span key={sport} className="text-xs text-[#6B7280] bg-[#F9FAFB] px-3 py-2 rounded-full">
                {sport}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-[#F3F4F6]">
            <div className="flex items-baseline space-x-1">
              <span className="text-[#05602B] text-2xl">{club.pricePerHour.toLocaleString()}</span>
              <span className="text-[#6B7280]">DA / heure</span>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <h3 className="text-[#0E0E0E] mb-4 px-1">Sélectionner une date</h3>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {DATES.map((dateObj) => (
              <button
                key={dateObj.date}
                onClick={() => setSelectedDate(dateObj.date)}
                className={`flex-shrink-0 px-5 py-3 rounded-2xl transition-all ${
                  selectedDate === dateObj.date
                    ? 'bg-[#05602B] text-white'
                    : 'bg-white text-[#0E0E0E] hover:bg-white/80'
                }`}
              >
                <span className="text-sm whitespace-nowrap">{dateObj.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="mb-6">
          <h3 className="text-[#0E0E0E] mb-4 px-1">Créneaux disponibles</h3>
          <div className="grid grid-cols-3 gap-3">
            {TIME_SLOTS.map((time) => {
              const isAvailable = Math.random() > 0.3;
              const isSelected = selectedTime === time;

              return (
                <button
                  key={time}
                  onClick={() => isAvailable && setSelectedTime(time)}
                  disabled={!isAvailable}
                  className={`py-4 rounded-2xl text-sm transition-all ${
                    isSelected
                      ? 'bg-[#05602B] text-white'
                      : isAvailable
                      ? 'bg-white text-[#0E0E0E] hover:bg-white/80'
                      : 'bg-white text-[#D1D5DB] cursor-not-allowed'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      {selectedTime && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F3F4F6] p-6">
          <button
            onClick={handleReserve}
            className="w-full bg-[#05602B] text-white py-4 rounded-2xl hover:bg-[#05602B]/90 transition-all active:scale-[0.98]"
          >
            Réserver pour {selectedTime}
          </button>
        </div>
      )}
    </div>
  );
};
