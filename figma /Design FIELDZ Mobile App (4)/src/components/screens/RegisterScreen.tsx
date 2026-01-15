import React, { useState } from 'react';
import { Logo } from '../Logo';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface RegisterScreenProps {
  onRegister: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterScreen({ onRegister, onSwitchToLogin }: RegisterScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister();
  };
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-6 pt-16 pb-24">
        <div className="mb-12">
          <Logo size="md" variant="dark" />
        </div>
        
        <div className="mb-10">
          <h1 
            className="mb-3"
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 900,
              fontSize: '36px',
              letterSpacing: '-0.02em',
              color: '#0E0E0E'
            }}
          >
            À toi de jouer! ⚽
          </h1>
          <p style={{ color: '#6B7280', fontSize: '16px', fontWeight: 500 }}>
            Crée ton compte et trouve ton terrain
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nom complet"
            type="text"
            placeholder="Nom Prénom"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <Input
            label="Email"
            type="email"
            placeholder="exemple@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          
          <Input
            label="Téléphone"
            type="tel"
            placeholder="555 12 34 56"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            hint="Format: 555 12 34 56"
            required
          />
          
          <Input
            label="Mot de passe"
            type="password"
            placeholder="Entrez votre mot de passe"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          
          <Input
            label="Confirmer le mot de passe"
            type="password"
            placeholder="Confirmez votre mot de passe"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
          
          <div className="pt-4">
            <Button type="submit" fullWidth>
              Créer mon compte
            </Button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <span style={{ color: '#6B7280' }}>Déjà un compte? </span>
          <button 
            onClick={onSwitchToLogin}
            className="hover:opacity-70 transition-opacity"
            style={{ color: '#05602B', fontWeight: 600 }}
          >
            Connecte-toi
          </button>
        </div>
      </div>
    </div>
  );
}