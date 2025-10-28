// src/components/molecules/CreneauCard.tsx
import React from 'react';
import { Creneau } from "../../types";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

type Props = {
  creneau: Creneau;
  onReserver?: () => void;
  onUpdate?: () => void;
  role?: 'joueur' | 'club';
};

const CreneauCard: React.FC<Props> = ({ creneau, onReserver, onUpdate, role }) => {
  const { token } = useAuth();

  const handleAnnulerCreneau = async () => {
    if (!window.confirm("Voulez-vous vraiment annuler ce créneau ?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/creneaux/${creneau.id}/annuler`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erreur lors de l'annulation");

      toast.success("✅ Créneau annulé !");
      onUpdate ? onUpdate() : window.location.reload();
    } catch (err) {
      toast.error("❌ Impossible d'annuler ce créneau");
      console.error(err);
    }
  };

  const terrainNom = creneau.terrain?.nomTerrain || "Terrain inconnu";
  const typeSurface = creneau.terrain?.typeSurface;
  const taille = creneau.terrain?.taille;

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

  return (
    <div className="creneau-card">
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
            <button onClick={handleAnnulerCreneau} className="jd-btn-danger">
              ❌ Annuler ce créneau
            </button>
          )}
      </div>
    </div>
  );
};

export default CreneauCard;
