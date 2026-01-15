import React from 'react';
import { ArrowLeft, MessageCircle, Book } from 'lucide-react';

interface HelpScreenProps {
  onBack: () => void;
}

export function HelpScreen({ onBack }: HelpScreenProps) {
  const helpItems = [
    { icon: Book, label: 'FAQ', description: 'Questions fréquemment posées' },
    { icon: MessageCircle, label: 'Contacter le support', description: 'support@fieldz.dz' }
  ];
  
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-md mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" style={{ color: '#0E0E0E' }} strokeWidth={2} />
            </button>
            <h1 
              style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 900,
                fontSize: '32px',
                letterSpacing: '-0.02em',
                color: '#0E0E0E'
              }}
            >
              Aide & Support
            </h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-md mx-auto px-6 py-6">
        <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden card-shadow">
          {helpItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => console.log(item.label)}
              className={`w-full flex items-center gap-4 p-4 hover:bg-[#F9FAFB] transition-colors ${
                index !== helpItems.length - 1 ? 'border-b border-[#E5E7EB]' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5" style={{ color: '#05602B' }} strokeWidth={2} />
              </div>
              <div className="flex-1 text-left">
                <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '15px', color: '#0E0E0E' }}>
                  {item.label}
                </p>
                <p className="text-sm" style={{ color: '#6B7280', fontWeight: 500 }}>
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
