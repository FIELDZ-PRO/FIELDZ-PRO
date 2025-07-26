import React, { FC, MouseEventHandler } from 'react';
import './style/button.css';

type ButtonProps = {
  variant?: 'primary' | 'text';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
};

const Button: FC<ButtonProps> = ({
  variant = 'primary',
  onClick,
  children,
}) => (
  <button className={`btn btn--${variant}`} onClick={onClick}>
    {children}
  </button>
);

export default Button;
