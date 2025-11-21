import React from 'react';
import './CustomAlert.css';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

interface CustomAlertProps {
  type: AlertType;
  message: string;
  onClose: () => void;
  duration?: number; // Auto-close after duration (ms)
}

const CustomAlert: React.FC<CustomAlertProps> = ({ type, message, onClose, duration = 5000 }) => {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div className={`custom-alert custom-alert-${type}`}>
      <div className="custom-alert-content">
        <span className="custom-alert-icon">{getIcon()}</span>
        <span className="custom-alert-message">{message}</span>
      </div>
      <button className="custom-alert-close" onClick={onClose} aria-label="Fermer">
        ×
      </button>
    </div>
  );
};

export default CustomAlert;