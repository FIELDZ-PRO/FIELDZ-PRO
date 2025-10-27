import React, { useState } from "react";
import { Creneau } from "../../../types";
import { useAuth } from "../../../context/AuthContext";
import FullscreenModal from "./FullscreenModal";
import { FileText, CheckCircle, AlertCircle } from "lucide-react";
import "./style/ReservationModal.css";

type Props = {
  creneau: Creneau;
  onClose: () => void;
  onReservation: () => void;
  politiqueClub?: string;
};

const ReservationModal: React.FC<Props> = ({ 
  creneau, 
  onClose, 
  onReservation, 
  politiqueClub 
}) => {
  const { token } = useAuth();
  const [accepte, setAccepte] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirmer = async () => {
    if (!accepte) return;
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(
        `http://localhost:8080/api/reservations/creneau/${creneau.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (!res.ok) {
        throw new Error("Erreur lors de la réservation");
      }
      
      await onReservation();
    } catch (e: any) {
      console.error("Erreur réservation:", e);
      setError(e.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FullscreenModal onClose={onClose}>
      <div className="reservation-modal-content">
        {/* En-tête */}
        <div className="modal-header">
          <h2 className="modal-title">Politique du club</h2>
          <p className="modal-subtitle">
            Veuillez <span className="highlight-read">lire</span> et accepter les conditions avant de réserver
          </p>
        </div>

        {/* Contenu de la politique */}
        <div className="politique-content">
          {politiqueClub ? (
            <div className="politique-text">
              {politiqueClub.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          ) : (
            <div className="no-politique">
              <AlertCircle className="no-politique-icon" />
              <p>Aucune politique d'annulation définie par ce club.</p>
            </div>
          )}
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="error-message">
            <AlertCircle className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Checkbox d'acceptation */}
        <label className="acceptance-checkbox">
          <input
            type="checkbox"
            checked={accepte}
            onChange={(e) => setAccepte(e.target.checked)}
            className="checkbox-input"
          />
          <span className="checkbox-custom">
            {accepte && <CheckCircle className="checkbox-icon" />}
          </span>
          <span className="checkbox-label">
            J'ai lu et j'accepte la politique du club
          </span>
        </label>

        {/* Boutons d'action */}
        <div className="modal-actions">
          <button 
            onClick={onClose} 
            className="btn-cancel"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            disabled={!accepte || loading}
            onClick={confirmer}
            className={`btn-confirm ${accepte ? 'active' : 'disabled'}`}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Réservation en cours...
              </>
            ) : (
              <>
                <CheckCircle className="btn-icon" />
                Confirmer la réservation
              </>
            )}
          </button>
        </div>
      </div>
    </FullscreenModal>
  );
};

export default ReservationModal;