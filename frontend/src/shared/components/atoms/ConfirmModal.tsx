import React from 'react';
import './ConfirmModal.css';
import { AlertTriangle, Info, X } from 'lucide-react';

export type ConfirmType = 'danger' | 'warning' | 'info';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: ConfirmType;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle size={48} />;
      case 'warning':
        return <AlertTriangle size={48} />;
      case 'info':
        return <Info size={48} />;
      default:
        return <AlertTriangle size={48} />;
    }
  };

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className={`confirm-modal confirm-modal-${type}`} onClick={(e) => e.stopPropagation()}>
        <button className="confirm-modal-close" onClick={onCancel} aria-label="Fermer">
          <X size={20} />
        </button>

        <div className="confirm-modal-icon">
          {getIcon()}
        </div>

        <div className="confirm-modal-content">
          <h2 className="confirm-modal-title">{title}</h2>
          <p className="confirm-modal-message">{message}</p>
        </div>

        <div className="confirm-modal-actions">
          <button className="confirm-modal-btn confirm-modal-btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`confirm-modal-btn confirm-modal-btn-confirm confirm-modal-btn-${type}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
