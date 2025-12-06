import React from 'react';
import { RingLoader } from 'react-spinners';
import './Spinner.css';

interface SpinnerProps {
  size?: number;
  color?: string;
  loading?: boolean;
  fullScreen?: boolean;
  text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 60,
  color = '#4CAF50',
  loading = true,
  fullScreen = false,
  text = 'Chargement...',
}) => {
  if (!loading) return null;

  const spinnerContent = (
    <div className={`spinner-container ${fullScreen ? 'spinner-fullscreen' : ''}`}>
      <div className="spinner-content">
        <RingLoader
          color={color}
          loading={loading}
          size={size}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        {text && <p className="spinner-text">{text}</p>}
      </div>
    </div>
  );

  return spinnerContent;
};

export default Spinner;
