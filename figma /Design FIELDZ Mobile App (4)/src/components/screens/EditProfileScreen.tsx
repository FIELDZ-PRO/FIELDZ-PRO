import React, { useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '../ui/Button';

interface EditProfileScreenProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

export function EditProfileScreen({ onBack, onSave }: EditProfileScreenProps) {
  const [formData, setFormData] = useState({
    firstName: 'Ahmed',
    lastName: 'Benali',
    email: 'ahmed.benali@email.com',
    phone: '+213 555 123 456'
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
                fontSize: '32px',
                letterSpacing: '-0.02em',
                color: '#0E0E0E'
              }}
            >
              Modifier le profil
            </h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-md mx-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1ED760] to-[#05602B] flex items-center justify-center">
                <span 
                  className="text-white"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif', 
                    fontWeight: 900,
                    fontSize: '36px'
                  }}
                >
                  AB
                </span>
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-[#E5E7EB] hover:border-[#05602B] transition-colors"
              >
                <User className="w-4 h-4" style={{ color: '#05602B' }} strokeWidth={2} />
              </button>
            </div>
          </div>
          
          {/* Form Fields */}
          <div className="bg-white rounded-3xl p-6 card-shadow border border-[#E5E7EB] space-y-4">
            <div>
              <label 
                htmlFor="firstName"
                className="block mb-2 text-sm"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#6B7280' }}
              >
                Prénom
              </label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#05602B] text-[#0E0E0E]"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              />
            </div>
            
            <div>
              <label 
                htmlFor="lastName"
                className="block mb-2 text-sm"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#6B7280' }}
              >
                Nom
              </label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#05602B] text-[#0E0E0E]"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              />
            </div>
            
            <div>
              <label 
                htmlFor="email"
                className="block mb-2 text-sm"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#6B7280' }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#05602B] text-[#0E0E0E]"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              />
            </div>
            
            <div>
              <label 
                htmlFor="phone"
                className="block mb-2 text-sm"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#6B7280' }}
              >
                Téléphone
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#05602B] text-[#0E0E0E]"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="space-y-3">
            <Button fullWidth type="submit">
              Enregistrer les modifications
            </Button>
            
            <Button fullWidth variant="outline" onClick={onBack}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
