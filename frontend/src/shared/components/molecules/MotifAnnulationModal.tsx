import React, { useState } from "react";
import { X } from "lucide-react";
import "./style/MotifAnnulationModal.css";

type Props = {
  onClose: () => void;
  onSubmit: (motif: string) => void;
};

const MotifAnnulationModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [motif, setMotif] = useState("");
  const maxLength = 500;

  const handleValider = () => {
    if (!motif.trim()) {
      alert("Veuillez saisir un motif d'annulation.");
      return;
    }
    onSubmit(motif);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="motif-modal-overlay" onClick={handleOverlayClick}>
      <div className="motif-modal-content">
        {/* Header */}
        <div className="motif-modal-header">
          <h2 className="motif-modal-title">
            <span className="motif-modal-title-icon">❌</span>
            Annulation
          </h2>
          <button className="motif-modal-close" onClick={onClose} aria-label="Fermer">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="motif-modal-body">
          {/* Warning box */}
          <div className="motif-modal-warning">
            <span className="motif-modal-warning-icon">⚠️</span>
            <p className="motif-modal-warning-text">
              Cette action est irréversible. Veuillez indiquer la raison de votre annulation.
            </p>
          </div>

          <label htmlFor="motif-textarea" className="motif-modal-label">
            Motif d'annulation *
          </label>
          <textarea
            id="motif-textarea"
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            className="motif-modal-textarea"
            placeholder="Ex: Imprévu personnel, changement de planning, blessure..."
            maxLength={maxLength}
          />
          <div className="motif-modal-counter">
            {motif.length} / {maxLength} caractères
          </div>
        </div>

        {/* Footer */}
        <div className="motif-modal-footer">
          <button
            className="motif-modal-btn motif-modal-btn-cancel"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="motif-modal-btn motif-modal-btn-submit"
            onClick={handleValider}
            disabled={!motif.trim()}
          >
            Confirmer l'annulation
          </button>
        </div>
      </div>
    </div>
  );
};

export default MotifAnnulationModal;