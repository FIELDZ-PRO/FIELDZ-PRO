import React, { useState } from "react";
import { Creneau } from "../../../types";
import { useAuth } from "../../../context/AuthContext";
import FullscreenModal from "./FullscreenModal";

type Props = {
  creneau: Creneau;
  onClose: () => void;
  onReservation: () => void;
};

const ReservationModal: React.FC<Props> = ({ creneau, onClose, onReservation }) => {
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
      alert("Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FullscreenModal onClose={onClose}>
      <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#15803d", marginBottom: "1rem" }}>
        📜 Politique du club
      </h2>
      <p style={{ marginBottom: "1.5rem", color: "#333" }}>
        {creneau.terrain?.politiqueClub || "Aucune politique définie."}
      </p>

      <label style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
        <input
          type="checkbox"
          checked={accepte}
          onChange={(e) => setAccepte(e.target.checked)}
          style={{ marginRight: "0.5rem" }}
        />
        J’ai lu et j’accepte la politique du club
      </label>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        <button onClick={onClose} style={{ padding: "0.5rem 1rem", background: "#ccc", borderRadius: "6px" }}>
          Annuler
        </button>
        <button
          disabled={!accepte || loading}
          onClick={confirmer}
          style={{
            padding: "0.5rem 1rem",
            background: accepte ? "#22c55e" : "#ccc",
            color: accepte ? "white" : "#666",
            borderRadius: "6px",
            cursor: accepte ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "Réservation..." : "Confirmer la réservation"}
        </button>
      </div>
    </FullscreenModal>
  );
};

export default ReservationModal;
