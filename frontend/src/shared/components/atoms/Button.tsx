// src/components/atoms/Button.tsx
import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'text';
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  type = 'button',
  variant = 'primary',
  disabled = false,
}) => {
  const base =
    'px-4 py-2 font-semibold rounded transition-all duration-150 focus:outline-none';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    text: 'bg-transparent text-blue-600 hover:underline',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
