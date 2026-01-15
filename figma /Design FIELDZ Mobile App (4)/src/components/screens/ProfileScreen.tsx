import React from 'react';
import { User, ChevronRight, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

interface ProfileScreenProps {
  onLogout: () => void;
  onEditProfile: () => void;
  onSettings: () => void;
  onHelp: () => void;
}

const userData = {
  name: 'Ahmed Benali',
  email: 'ahmed.benali@email.com',
  initials: 'AB'
};

export function ProfileScreen({ onLogout, onEditProfile, onSettings, onHelp }: ProfileScreenProps) {
  const menuItems = [
    { icon: Settings, label: 'Paramètres', onClick: onSettings },
    { icon: HelpCircle, label: 'Aide & Support', onClick: onHelp }
  ];
  
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-md mx-auto px-6 py-6">
          <h1 
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 900,
              fontSize: '32px',
              letterSpacing: '-0.02em',
              color: '#0E0E0E'
            }}
          >
            Profil
          </h1>
        </div>
      </div>
      
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Player Card */}
        <div className="bg-white rounded-3xl p-6 card-shadow border border-[#E5E7EB]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1ED760] to-[#05602B] flex items-center justify-center flex-shrink-0">
              <span 
                className="text-white"
                style={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontWeight: 900,
                  fontSize: '28px'
                }}
              >
                {userData.initials}
              </span>
            </div>
            <div className="flex-1">
              <h2 
                className="mb-1"
                style={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontWeight: 800,
                  fontSize: '22px',
                  color: '#0E0E0E'
                }}
              >
                {userData.name}
              </h2>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                {userData.email}
              </p>
            </div>
          </div>
          
          <Button fullWidth variant="outline" onClick={onEditProfile}>
            Modifier le profil
          </Button>
        </div>
        
        {/* Menu Items */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden card-shadow">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`w-full flex items-center justify-between p-4 hover:bg-[#F9FAFB] transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-[#E5E7EB]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" style={{ color: '#6B7280' }} strokeWidth={2} />
                <span style={{ color: '#0E0E0E', fontWeight: 600 }}>
                  {item.label}
                </span>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: '#6B7280' }} strokeWidth={2} />
            </button>
          ))}
        </div>
        
        {/* Logout Button */}
        <Button variant="outline" fullWidth onClick={onLogout} className="!text-red-600 !border-red-200 hover:!bg-red-50">
          <LogOut className="w-5 h-5 mr-2 inline" strokeWidth={2} />
          Se déconnecter
        </Button>
        
        {/* Version */}
        <div className="text-center pt-4">
          <p className="text-xs" style={{ color: '#6B7280' }}>
            FIELDZ v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}