import React, { useState } from "react";
import { Creneau } from "../../../types";
import { useAuth } from "../../../context/AuthContext";
import FullscreenModal from "./FullscreenModal";
import "./style/ReservationModal.css";

type Props = {
  creneau: Creneau;
  onClose: () => void;
  onReservation: () => void;
  politiqueClub?: string; // ✅ ajout
};

const ReservationModal: React.FC<Props> = ({ creneau, onClose, onReservation, politiqueClub }) => {
  const { token } = useAuth();
  const [accepte, setAccepte] = useState(false);
  const [loading, setLoading] = useState(false);

  const confirmer = async () => {
    if (!accepte) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/reservations/creneau/${creneau.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur");
      await onReservation();
    } catch (e) {
      alert("Erreur lors de la réservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FullscreenModal onClose={onClose}>
  <div className="reservation-modal-container">
    <h2 className="reservation-modal-title">📜 Politique du club</h2>

    <div className="reservation-modal-text">
      {politiqueClub || "Aucune politique définie."}
    </div>

    <label className="reservation-modal-checkbox">
      <input
        type="checkbox"
        checked={accepte}
        onChange={(e) => setAccepte(e.target.checked)}
      />
      J’ai lu et j’accepte la politique du club
    </label>

    <div className="reservation-modal-actions">
      <button onClick={onClose} className="reservation-modal-btn cancel">
        Annuler
      </button>
      <button
        disabled={!accepte || loading}
        onClick={confirmer}
        className="reservation-modal-btn confirm"
      >
        {loading ? "Réservation..." : "Confirmer la réservation"}
      </button>
    </div>
  </div>
</FullscreenModal>

    
  
    
  );
};

export default ReservationModal;
