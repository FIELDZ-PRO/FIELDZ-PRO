import React, { useState } from 'react';
import { Logo } from '../Logo';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface LoginScreenProps {
  onLogin: () => void;
  onSwitchToRegister: () => void;
}

export function LoginScreen({ onLogin, onSwitchToRegister }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-6 pt-16 pb-8">
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
            Let's go 💚
          </h1>
          <p style={{ color: '#6B7280', fontSize: '16px', fontWeight: 500 }}>
            Connecte-toi pour trouver ton terrain
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="exemple@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            label="Mot de passe"
            type="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div className="flex justify-end pt-1">
            <button 
              type="button"
              className="text-sm hover:opacity-70 transition-opacity"
              style={{ color: '#05602B', fontWeight: 600 }}
            >
              Mot de passe oublié?
            </button>
          </div>
          
          <div className="pt-4">
            <Button type="submit" fullWidth>
              Se connecter
            </Button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <span style={{ color: '#6B7280' }}>Pas encore de compte? </span>
          <button 
            onClick={onSwitchToRegister}
            className="hover:opacity-70 transition-opacity"
            style={{ color: '#05602B', fontWeight: 600 }}
          >
            Inscris-toi
          </button>
        </div>
      </div>
    </div>
  );
}