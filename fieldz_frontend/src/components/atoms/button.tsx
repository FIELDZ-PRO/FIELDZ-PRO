// src/components/atoms/button.tsx
import React from 'react';
import './style/button.css';

type ButtonProps = {
  variant?: 'text' | 'primary';
  onClick?: () => void;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onClick,
  children,
}) => {
  return (
    <button
      className={`btn btn--${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
