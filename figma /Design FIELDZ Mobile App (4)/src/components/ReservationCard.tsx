import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Button } from './ui/Button';

interface ReservationCardProps {
  clubName: string;
  terrainName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  onCancel?: () => void;
}

export function ReservationCard({ 
  clubName, 
  terrainName, 
  date, 
  time, 
  status,
  onCancel 
}: ReservationCardProps) {
  const statusConfig = {
    confirmed: { label: 'Confirmée', color: '#05602B', bg: 'rgba(5, 96, 43, 0.1)' },
    pending: { label: 'En attente', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
    cancelled: { label: 'Annulée', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' }
  };
  
  const config = statusConfig[status];
  
  return (
    <div className="bg-white rounded-3xl p-5 border border-[#E5E7EB] card-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 
            className="mb-1"
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 700,
              fontSize: '16px',
              color: '#0E0E0E'
            }}
          >
            {clubName}
          </h3>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            {terrainName}
          </p>
        </div>
        
        <span 
          className="px-3 py-1.5 rounded-xl text-xs flex-shrink-0 ml-3"
          style={{ 
            fontWeight: 700,
            color: config.color,
            backgroundColor: config.bg
          }}
        >
          {config.label}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2" style={{ color: '#6B7280' }}>
          <Calendar className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm" style={{ fontWeight: 500 }}>{date}</span>
        </div>
        <div className="flex items-center gap-2" style={{ color: '#6B7280' }}>
          <Clock className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm" style={{ fontWeight: 500 }}>{time}</span>
        </div>
      </div>
      
      {status === 'confirmed' && onCancel && (
        <Button variant="outline" fullWidth onClick={onCancel} className="!text-red-600 !border-red-200 hover:!bg-red-50">
          Annuler la réservation
        </Button>
      )}
    </div>
  );
}