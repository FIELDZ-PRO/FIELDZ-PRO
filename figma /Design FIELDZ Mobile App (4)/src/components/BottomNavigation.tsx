import React from 'react';
import { Search, Calendar, Newspaper, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'home' | 'matches' | 'news' | 'profile';
  onTabChange: (tab: 'home' | 'matches' | 'news' | 'profile') => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'home' as const, icon: Search, label: 'Recherche' },
    { id: 'matches' as const, icon: Calendar, label: 'Réservations' },
    { id: 'news' as const, icon: Newspaper, label: 'News' },
    { id: 'profile' as const, icon: User, label: 'Profil' }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 py-2 px-3 min-w-[70px] transition-all active:scale-95 relative rounded-2xl"
            >
              {isActive && (
                <div className="absolute inset-0 bg-[#05602B]/5 rounded-2xl"></div>
              )}
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-[#05602B]' : 'text-[#6B7280]'
                  }`}
                  strokeWidth={2}
                />
              </div>
              <span 
                className="text-xs"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#05602B' : '#6B7280'
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}