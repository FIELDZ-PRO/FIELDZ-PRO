import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface PasswordSettingsScreenProps {
  onBack: () => void;
}

export function PasswordSettingsScreen({ onBack }: PasswordSettingsScreenProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic
    console.log('Password change submitted');
  };

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
                fontSize: '28px',
                letterSpacing: '-0.02em',
                color: '#0E0E0E'
              }}
            >
              Mot de passe
            </h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-md mx-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 card-shadow border border-[#E5E7EB] space-y-4">
            <div>
              <label 
                htmlFor="currentPassword"
                className="block mb-2 text-sm"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#6B7280' }}
              >
                Mot de passe actuel
              </label>
              <input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#05602B] text-[#0E0E0E]"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                placeholder="••••••••"
              />
            </div>
            
            <div>
              <label 
                htmlFor="newPassword"
                className="block mb-2 text-sm"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#6B7280' }}
              >
                Nouveau mot de passe
              </label>
              <input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#05602B] text-[#0E0E0E]"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                placeholder="••••••••"
              />
            </div>
            
            <div>
              <label 
                htmlFor="confirmPassword"
                className="block mb-2 text-sm"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#6B7280' }}
              >
                Confirmer le nouveau mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#05602B] text-[#0E0E0E]"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <Button fullWidth type="submit">
            Modifier le mot de passe
          </Button>
        </form>
      </div>
    </div>
  );
}
