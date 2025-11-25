import React, { useState } from "react";
import { Creneau } from "../../../../../shared/types";
import { useAuth } from "../../../../../shared/context/AuthContext";
import FullscreenModal from "./FullscreenModal";
import { AlertTriangle } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirmer = async () => {
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
        {/* En-tête épuré */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon-wrapper">
              <AlertTriangle className="modal-icon" />
            </div>
            <h2 className="modal-title">Politique du club</h2>
          </div>
        </div>

        {/* Bandeau d'avertissement */}
        <div className="warning-banner">
          <p>
            <strong>Lecture obligatoire :</strong> Veuillez lire attentivement les conditions avant de confirmer votre réservation.
          </p>
        </div>

        {/* Contenu de la politique */}
        <div className="politique-content">
          {politiqueClub ? (
            <div className="politique-text">
              {politiqueClub}
            </div>
          ) : (
            <div className="no-politique">
              <p>Aucune politique d'annulation définie par ce club.</p>
            </div>
          )}
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="error-message">
            <AlertTriangle className="error-icon" />
            <span>{error}</span>
          </div>
        )}

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
            disabled={loading}
            onClick={confirmer}
            className={`btn-confirm ${!loading ? 'active' : 'disabled'}`}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Réservation en cours...
              </>
            ) : (
              "J'accepte et je réserve"
            )}
          </button>
        </div>
      </div>
    </FullscreenModal>
  );
};

export default ReservationModal;