import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className="fixed top-6 left-6 right-6 max-w-md mx-auto z-50 animate-slide-down"
      style={{ animation: 'slideDown 0.3s ease-out' }}
    >
      <div className="bg-[#05602B] text-white rounded-2xl p-4 flex items-center justify-center card-shadow">
        <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '15px' }}>
          {message}
        </p>
      </div>
      
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}