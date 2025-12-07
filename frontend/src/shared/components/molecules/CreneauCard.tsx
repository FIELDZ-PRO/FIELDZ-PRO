// src/components/molecules/CreneauCard.tsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Creneau } from "../../types";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "../atoms/ConfirmModal";

const API_BASE = import.meta.env.VITE_API_URL || "https://prime-cherida-fieldzz-17996b20.koyeb.app/api";

type Props = {
  creneau: Creneau;
  onReserver?: () => void;
  onUpdate?: () => void;
  role?: 'joueur' | 'club';
};

const CreneauCard: React.FC<Props> = ({ creneau, onReserver, onUpdate, role }) => {
  const { token } = useAuth();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleOpenCancelModal = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    setShowCancelModal(false);

    try {
      // DELETE the creneau with force=true to cancel any reservations
      const res = await fetch(`${API_BASE}/creneaux/${creneau.id}?force=true`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de la suppression");
      }

      const result = await res.json();
      const reservationsAnnulees = result.reservationsAnnulees || 0;

      if (reservationsAnnulees > 0) {
        toast.success(`✅ Créneau supprimé ! ${reservationsAnnulees} réservation(s) annulée(s).`);
      } else {
        toast.success("✅ Créneau supprimé !");
      }

      onUpdate ? onUpdate() : window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "❌ Impossible de supprimer ce créneau");
      console.error(err);
    }
  };

  const terrainNom = creneau.terrain?.nomTerrain || "Terrain inconnu";
  const typeSurface = creneau.terrain?.typeSurface;
  const taille = creneau.terrain?.taille;
  const terrainPhoto = (creneau.terrain as any)?.photo;

  const dateStr = creneau.dateDebut
    ? new Date(creneau.dateDebut).toLocaleDateString("fr-FR")
    : "Date inconnue";

  const heureStr =
    creneau.dateDebut && creneau.dateFin
      ? `${new Date(creneau.dateDebut).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })} – ${new Date(creneau.dateFin).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
      : "Heure inconnue";

  const getSportEmoji = (sport: string) => {
    const s = (sport || "").toLowerCase();
    const emojis: Record<string, string> = {
      padel: "🎾",
      tennis: "🎾",
      foot: "⚽",
      football: "⚽",
      foot5: "⚽",
      basket: "🏀",
      basketball: "🏀",
      volley: "🏐",
      volleyball: "🏐",
      handball: "🤾",
    };
    return emojis[s] || "🏅";
  };

  return (
    <div className="creneau-card">
      {/* 🔹 Terrain Image */}
      {terrainPhoto ? (
        <div className="creneau-card-image">
          <img src={terrainPhoto} alt={terrainNom} />
        </div>
      ) : (
        <div className="creneau-card-image-placeholder">
          <span className="sport-emoji">{getSportEmoji((creneau.terrain as any)?.sport || "")}</span>
        </div>
      )}

      <div className="creneau-card-content">
        {/* 🔹 Titre : TERRAIN (plus de club ici) */}
        <div className="card-title">
          {terrainNom}
          {typeSurface && <span className="card-subtitle"> • {typeSurface}</span>}
        </div>



        {/* 🔹 Date */}
        <div className="card-info"> {dateStr}</div>

        {/* 🔹 Heure */}
        <div className="card-info"> {heureStr}</div>

        {/* 🔹 Prix */}
        <div className="card-prix">
          {creneau.prix != null ? `${creneau.prix} Da` : "Prix non défini"}
        </div>

        {/* 🔹 Actions */}
        <div className="card-actions">
          {role === "joueur" && onReserver && (
            <button onClick={onReserver} className="jd-btn-primary">
              Réserver
            </button>
          )}

          {role === "club" &&
            (creneau.statut === "LIBRE" || creneau.statut === "RESERVE") && (
              <button onClick={handleOpenCancelModal} className="jd-btn-danger">
                🗑️ Supprimer ce créneau
              </button>
            )}
        </div>
      </div>

      {/* Modal de confirmation - rendu via Portal pour éviter overflow:hidden */}
      {showCancelModal && createPortal(
        <ConfirmModal
          isOpen={showCancelModal}
          title="Supprimer ce créneau ?"
          message={`Voulez-vous vraiment supprimer ce créneau du ${dateStr} à ${heureStr} ? ${creneau.statut === 'RESERVE' ? 'Les réservations associées seront annulées. ' : ''}Cette action est irréversible.`}
          type="danger"
          confirmText="Supprimer le créneau"
          cancelText="Retour"
          onConfirm={handleConfirmCancel}
          onCancel={() => setShowCancelModal(false)}
        />,
        document.body
      )}
    </div>
  );
};

export default CreneauCard;
