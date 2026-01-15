import React from 'react';
import { X, Calendar, Clock, MapPin, DollarSign } from 'lucide-react';
import { Button } from './ui/Button';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reservationData: {
    clubName: string;
    terrainName: string;
    date: string;
    time: string;
    price: string;
  };
}

export function ReservationModal({ isOpen, onClose, onConfirm, reservationData }: ReservationModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl max-w-md w-full border border-[#E5E7EB] card-shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <h2 
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 800,
              fontSize: '20px',
              color: '#0E0E0E'
            }}
          >
            Confirmer la réservation
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F9FAFB] transition-colors"
          >
            <X className="w-5 h-5" style={{ color: '#6B7280' }} strokeWidth={2} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-[#F9FAFB] rounded-2xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#05602B' }} strokeWidth={2} />
              <div>
                <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Club</p>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0E0E0E' }}>
                  {reservationData.clubName}
                </p>
                <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>{reservationData.terrainName}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#05602B' }} strokeWidth={2} />
              <div>
                <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Date</p>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0E0E0E' }}>
                  {reservationData.date}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#05602B' }} strokeWidth={2} />
              <div>
                <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Horaire</p>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0E0E0E' }}>
                  {reservationData.time}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 pt-3 border-t border-[#E5E7EB]">
              <DollarSign className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#05602B' }} strokeWidth={2} />
              <div className="flex-1 flex items-center justify-between">
                <p className="text-sm" style={{ color: '#6B7280', fontWeight: 600 }}>Total</p>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '24px', color: '#05602B' }}>
                  {reservationData.price}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-[#E5E7EB]">
          <Button variant="outline" fullWidth onClick={onClose}>
            Annuler
          </Button>
          <Button fullWidth onClick={onConfirm}>
            Confirmer 🎾
          </Button>
        </div>
      </div>
    </div>
  );
}