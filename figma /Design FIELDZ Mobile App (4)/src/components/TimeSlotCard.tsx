import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Button } from './ui/Button';

interface TimeSlotCardProps {
  date: string;
  timeRange: string;
  price: string;
  onBook: () => void;
  isBooked?: boolean;
}

export function TimeSlotCard({ date, timeRange, price, onBook, isBooked = false }: TimeSlotCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2" style={{ color: '#6B7280' }}>
            <Calendar className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm" style={{ fontWeight: 500 }}>{date}</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: '#0E0E0E' }}>
            <Clock className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm" style={{ fontWeight: 500 }}>{timeRange}</span>
          </div>
        </div>
        
        <div className="text-right flex flex-col items-end gap-3">
          <div 
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 600,
              fontSize: '20px',
              color: '#05602B'
            }}
          >
            {price}
          </div>
          <Button 
            onClick={onBook}
            disabled={isBooked}
            className="!px-5 !py-2 !text-sm"
          >
            {isBooked ? 'Réservé' : 'Réserver'}
          </Button>
        </div>
      </div>
    </div>
  );
}