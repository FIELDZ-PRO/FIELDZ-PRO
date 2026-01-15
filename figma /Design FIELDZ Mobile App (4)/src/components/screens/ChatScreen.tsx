import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Input } from '../ui/Input';

const mockChats = [
  {
    id: 1,
    name: 'Hydra Sports Club',
    lastMessage: 'Votre réservation est confirmée',
    time: '10:30',
    unread: 1,
    avatar: '⚽'
  },
  {
    id: 2,
    name: 'Support FIELDZ',
    lastMessage: 'Comment pouvons-nous vous aider?',
    time: 'Hier',
    unread: 0,
    avatar: '💚'
  }
];

export function ChatScreen() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-md mx-auto px-6 py-6">
          <h1 
            className="mb-2"
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 900,
              fontSize: '32px',
              letterSpacing: '-0.02em',
              color: '#0E0E0E'
            }}
          >
            Messages
          </h1>
          <p style={{ color: '#6B7280', fontSize: '15px' }}>
            Tes conversations
          </p>
        </div>
      </div>
      
      <div className="max-w-md mx-auto">
        {/* Search */}
        <div className="px-6 py-4">
          <Input
            placeholder="🔍 Rechercher une conversation..."
          />
        </div>
        
        {/* Chat List */}
        <div className="px-6">
          {mockChats.map((chat, index) => (
            <button
              key={chat.id}
              className={`w-full flex items-center gap-4 py-4 hover:bg-white/50 active:bg-white transition-colors rounded-2xl px-3 ${
                index !== mockChats.length - 1 ? 'mb-2' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1ED760] to-[#05602B] flex items-center justify-center flex-shrink-0">
                <span className="text-lg">{chat.avatar}</span>
              </div>
              
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '15px', color: '#0E0E0E' }}>
                    {chat.name}
                  </h3>
                  <span className="text-xs" style={{ color: '#6B7280' }}>
                    {chat.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm flex-1 truncate" style={{ color: '#6B7280' }}>
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-[#05602B] flex items-center justify-center ml-2">
                      <span className="text-xs" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: 'white' }}>
                        {chat.unread}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Empty State (if no chats) */}
        {mockChats.length === 0 && (
          <div className="px-6 py-20 text-center">
            <div className="bg-white rounded-3xl p-10 card-shadow">
              <div className="text-6xl mb-4">💬</div>
              <p className="mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px', color: '#0E0E0E' }}>
                Aucune conversation
              </p>
              <p style={{ color: '#6B7280', fontSize: '14px' }}>
                Tes messages apparaîtront ici
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}