import React, { useEffect } from 'react';
import { Logo } from '../Logo';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [onFinish]);
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Green circles animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#05602B] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#1ED760] rounded-full animate-pulse delay-100"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-[#05602B] rounded-full animate-pulse delay-200"></div>
      </div>
      
      {/* Logo with bounce */}
      <div className="relative z-10 animate-bounce">
        <Logo size="lg" variant="dark" />
      </div>
      
      {/* Tagline */}
      <div className="mt-8 relative z-10">
        <p className="text-[#05602B]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '16px', letterSpacing: '0.05em' }}>
          Cliki Tiri Marki
        </p>
      </div>
    </div>
  );
}