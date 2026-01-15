import { ImageWithFallback } from './figma/ImageWithFallback';

interface Reservation {
  id: number;
  clubName: string;
  clubLocation: string;
  clubImage: string;
  date: string;
  timeSlot: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
}

const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 1,
    clubName: 'Green Stadium',
    clubLocation: 'Alger Centre',
    clubImage: 'https://images.unsplash.com/photo-1641029185333-7ed62a19d5f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmaWVsZCUyMGFlcmlhbHxlbnwxfHx8fDE3NjYyNzkxMTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    date: '2024-12-25',
    timeSlot: '15:00',
    status: 'upcoming',
    price: 3000,
  },
  {
    id: 2,
    clubName: 'Tennis Pro Club',
    clubLocation: 'Ben Aknoun',
    clubImage: 'https://images.unsplash.com/photo-1566241121793-3e25f3586e43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjBjb3VydCUyMG91dGRvb3J8ZW58MXx8fHwxNzY2MzgxMzc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    date: '2024-12-20',
    timeSlot: '18:00',
    status: 'completed',
    price: 2500,
  },
];

export const MyReservationsScreen = () => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const getStatusInfo = (status: Reservation['status']) => {
    switch (status) {
      case 'upcoming':
        return { label: 'À venir', color: 'bg-[#05602B]/10 text-[#05602B]' };
      case 'completed':
        return { label: 'Terminée', color: 'bg-[#F3F4F6] text-[#6B7280]' };
      case 'cancelled':
        return { label: 'Annulée', color: 'bg-red-50 text-red-600' };
    }
  };

  const upcomingReservations = MOCK_RESERVATIONS.filter((r) => r.status === 'upcoming');
  const pastReservations = MOCK_RESERVATIONS.filter((r) => r.status !== 'upcoming');

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-16 pb-6">
        <h1 className="text-[#0E0E0E] mb-2">Mes réservations</h1>
        <p className="text-[#6B7280]">Gérez vos réservations</p>
      </div>

      <div className="px-6 py-6">
        {/* Upcoming */}
        {upcomingReservations.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[#0E0E0E] mb-4">À venir</h3>
            <div className="space-y-4">
              {upcomingReservations.map((reservation) => (
                <div key={reservation.id} className="bg-white rounded-3xl overflow-hidden">
                  <div className="flex">
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100">
                      <ImageWithFallback
                        src={reservation.clubImage}
                        alt={reservation.clubName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-[#0E0E0E] mb-1">{reservation.clubName}</h4>
                          <p className="text-[#6B7280] text-sm">{reservation.clubLocation}</p>
                        </div>
                        <span
                          className={`text-xs px-3 py-1.5 rounded-full ${
                            getStatusInfo(reservation.status).color
                          }`}
                        >
                          {getStatusInfo(reservation.status).label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F3F4F6]">
                        <div className="flex items-center space-x-3 text-sm text-[#6B7280]">
                          <span>{formatDate(reservation.date)}</span>
                          <span>•</span>
                          <span>{reservation.timeSlot}</span>
                        </div>
                        <p className="text-[#05602B]">{reservation.price.toLocaleString()} DA</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <button className="w-full py-3 bg-[#F9FAFB] text-[#0E0E0E] rounded-2xl text-sm hover:bg-gray-100 transition-colors">
                      Annuler la réservation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past */}
        {pastReservations.length > 0 && (
          <div>
            <h3 className="text-[#0E0E0E] mb-4">Historique</h3>
            <div className="space-y-4">
              {pastReservations.map((reservation) => (
                <div key={reservation.id} className="bg-white rounded-3xl overflow-hidden">
                  <div className="flex">
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100">
                      <ImageWithFallback
                        src={reservation.clubImage}
                        alt={reservation.clubName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-[#0E0E0E] mb-1">{reservation.clubName}</h4>
                          <p className="text-[#6B7280] text-sm">{reservation.clubLocation}</p>
                        </div>
                        <span
                          className={`text-xs px-3 py-1.5 rounded-full ${
                            getStatusInfo(reservation.status).color
                          }`}
                        >
                          {getStatusInfo(reservation.status).label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F3F4F6]">
                        <div className="flex items-center space-x-3 text-sm text-[#6B7280]">
                          <span>{formatDate(reservation.date)}</span>
                          <span>•</span>
                          <span>{reservation.timeSlot}</span>
                        </div>
                        <p className="text-[#6B7280]">{reservation.price.toLocaleString()} DA</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {upcomingReservations.length === 0 && pastReservations.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-[#0E0E0E] mb-2">Aucune réservation</h3>
            <p className="text-[#6B7280] text-sm">
              Commencez à réserver vos terrains préférés
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
