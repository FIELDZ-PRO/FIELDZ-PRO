import React from 'react';
import { Logo } from '../Logo';
import { Button } from '../ui/Button';

interface WelcomeScreenProps {
  onSignUp: () => void;
  onLogin: () => void;
}

// Social login icons as SVG
const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

interface WelcomeScreenProps {
  onSignUp: () => void;
  onLogin: () => void;
}

export function WelcomeScreen({ onSignUp, onLogin }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-8">
      {/* Logo */}
      <div className="flex justify-center mb-12 pt-4">
        <Logo size="lg" variant="dark" />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Main Message */}
      <div className="text-center mb-10">
        <h1 
          className="mb-4"
          style={{ 
            fontFamily: 'Poppins, sans-serif', 
            fontWeight: 900,
            fontSize: '36px',
            letterSpacing: '-0.02em',
            color: '#0E0E0E',
            lineHeight: '1.1'
          }}
        >
          Bienvenue sur<br />FIELDZ
        </h1>
        
        <p 
          className="max-w-sm mx-auto"
          style={{ 
            color: '#6B7280', 
            fontSize: '16px',
            lineHeight: '1.6',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500
          }}
        >
          Ton terrain, ton créneau,<br />
          en quelques clics
        </p>
      </div>

      {/* CTAs */}
      <div className="space-y-4 pb-6">
        <Button 
          fullWidth 
          onClick={onSignUp}
          className="shadow-lg hover:shadow-xl transition-shadow"
        >
          Créer un compte
        </Button>
        
        <button
          onClick={onLogin}
          className="w-full py-4 rounded-2xl border-2 border-[#05602B] transition-colors hover:bg-[#05602B]/5"
          style={{ 
            fontFamily: 'Poppins, sans-serif', 
            fontWeight: 700,
            fontSize: '16px',
            color: '#05602B'
          }}
        >
          Se connecter
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-[#E5E7EB]" />
        <span style={{ color: '#6B7280', fontSize: '14px', fontWeight: 500 }}>
          ou continuer avec
        </span>
        <div className="flex-1 h-px bg-[#E5E7EB]" />
      </div>

      {/* Social Login */}
      <div className="flex gap-4 pb-8">
        <button 
          className="flex-1 py-4 rounded-2xl border-2 border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB] transition-colors"
          onClick={() => console.log('Google login')}
        >
          <GoogleIcon />
        </button>
        
        <button 
          className="flex-1 py-4 rounded-2xl border-2 border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB] transition-colors"
          onClick={() => console.log('Facebook login')}
        >
          <FacebookIcon />
        </button>
        
        <button 
          className="flex-1 py-4 rounded-2xl border-2 border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB] transition-colors"
          onClick={() => console.log('Apple login')}
        >
          <AppleIcon />
        </button>
      </div>
    </div>
  );
}
