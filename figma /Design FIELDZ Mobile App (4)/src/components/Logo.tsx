import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export function Logo({ size = 'md', variant = 'dark' }: LogoProps) {
  const fontSize = {
    sm: 22,
    md: 32,
    lg: 48
  };
  
  const textColor = variant === 'light' ? '#FFFFFF' : '#0E0E0E';
  
  return (
    <div className="flex items-center gap-1">
      <span 
        style={{ 
          fontFamily: 'Poppins, sans-serif', 
          fontWeight: 900,
          fontSize: fontSize[size],
          letterSpacing: '-0.03em',
          color: textColor
        }}
      >
        FIELD
      </span>
      <span 
        style={{ 
          fontFamily: 'Poppins, sans-serif', 
          fontWeight: 900,
          fontSize: fontSize[size],
          letterSpacing: '-0.03em',
          color: '#05602B'
        }}
      >
        Z
      </span>
    </div>
  );
}