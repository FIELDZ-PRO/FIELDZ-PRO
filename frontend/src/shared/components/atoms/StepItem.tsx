import React from 'react';
import './style/StepItem.css';

interface StepItemProps {
  icon: React.ReactNode;
  number: string;
  title: string;
  description: string;
  badge?: string;
}

const StepItem: React.FC<StepItemProps> = ({ 
  icon, 
  number, 
  title, 
  description,
  badge 
}) => {
  return (
    <div className="step-item">
      <div className="step-item__number">{number}</div>
      
      {badge && <div className="step-item__badge">{badge}</div>}
      
      <div className="step-item__icon">
        {icon}
      </div>
      
      <h3 className="step-item__title">{title}</h3>
      
      <p className="step-item__description">{description}</p>
    </div>
  );
};

export default StepItem;