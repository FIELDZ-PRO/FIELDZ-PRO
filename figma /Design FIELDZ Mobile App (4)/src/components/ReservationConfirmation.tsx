import { useState } from 'react';

interface Club {
  id: number;
  name: string;
  location: string;
  image: string;
  sports: string[];
  rating: number;
  pricePerHour: number;
}

interface ReservationConfirmationProps {
  club: Club;
  timeSlot: string;
  date: string;
  onConfirm: () => void;
  onBack: () => void;
}

export const ReservationConfirmation = ({
  club,
  timeSlot,
  date,
  onConfirm,
  onBack,
}: ReservationConfirmationProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-32">
      {/* Header */}
      <div className="bg-white px-6 pt-16 pb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center mb-6 hover:bg-gray-100 transition-colors"
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
        <h1 className="text-[#0E0E0E] mb-2">Confirmer la réservation</h1>
        <p className="text-[#6B7280]">Vérifiez les détails</p>
      </div>

      <form onSubmit={handleConfirm} className="px-6 py-6">
        {/* Booking Details */}
        <div className="bg-white rounded-3xl p-6 mb-6">
          <h3 className="text-[#0E0E0E] mb-4">Détails de la réservation</h3>
          
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <span className="text-[#6B7280] text-sm">Club</span>
              <span className="text-[#0E0E0E] text-right">{club.name}</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-[#6B7280] text-sm">Lieu</span>
              <span className="text-[#0E0E0E] text-right">{club.location}</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-[#6B7280] text-sm">Date</span>
              <span className="text-[#0E0E0E] text-right capitalize">{formatDate(date)}</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-[#6B7280] text-sm">Heure</span>
              <span className="text-[#0E0E0E] text-right">{timeSlot}</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-[#6B7280] text-sm">Durée</span>
              <span className="text-[#0E0E0E] text-right">1 heure</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#F3F4F6] flex items-center justify-between">
            <span className="text-[#0E0E0E]">Total</span>
            <span className="text-[#05602B] text-2xl">{club.pricePerHour.toLocaleString()} DA</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-3xl p-6 mb-6">
          <h3 className="text-[#0E0E0E] mb-4">Mode de paiement</h3>
          
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                paymentMethod === 'card'
                  ? 'border-[#05602B] bg-[#05602B]/5'
                  : 'border-[#F3F4F6] bg-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-[#05602B]' : 'border-[#D1D5DB]'
                  }`}
                >
                  {paymentMethod === 'card' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#05602B]"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[#0E0E0E]">Carte bancaire</p>
                  <p className="text-[#6B7280] text-xs mt-0.5">Paiement en ligne sécurisé</p>
                </div>
                <span className="text-2xl">💳</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                paymentMethod === 'cash'
                  ? 'border-[#05602B] bg-[#05602B]/5'
                  : 'border-[#F3F4F6] bg-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'cash' ? 'border-[#05602B]' : 'border-[#D1D5DB]'
                  }`}
                >
                  {paymentMethod === 'cash' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#05602B]"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[#0E0E0E]">Paiement sur place</p>
                  <p className="text-[#6B7280] text-xs mt-0.5">En espèces au club</p>
                </div>
                <span className="text-2xl">💵</span>
              </div>
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-[#F9FAFB] rounded-2xl p-4 mb-6">
          <p className="text-xs text-[#6B7280] leading-relaxed">
            En confirmant cette réservation, vous acceptez les conditions d'annulation du club. 
            Les annulations doivent être effectuées au moins 2 heures avant le créneau réservé.
          </p>
        </div>
      </form>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F3F4F6] p-6">
        <button
          onClick={handleConfirm}
          className="w-full bg-[#05602B] text-white py-4 rounded-2xl hover:bg-[#05602B]/90 transition-all active:scale-[0.98]"
        >
          Confirmer et payer
        </button>
      </div>
    </div>
  );
};
