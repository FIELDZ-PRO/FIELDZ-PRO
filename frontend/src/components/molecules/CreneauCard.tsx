import React from "react";
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

  return (
    <div className="creneau-card">
      <div className="card-title">
        {creneau.terrain?.club?.nom || "Club inconnu"}
        {creneau.terrain?.ville && (
          <span className="card-subtitle"> • {creneau.terrain.ville}</span>
        )}
      </div>

      <div className="card-info">
        {creneau.terrain?.nomTerrain || "Terrain inconnu"}
        {creneau.terrain?.typeSurface && ` • ${creneau.terrain.typeSurface}`}
        {creneau.terrain?.taille && ` • ${creneau.terrain.taille}`}
      </div>

      <div className="card-info">
        📅{" "}
        {creneau.dateDebut
          ? new Date(creneau.dateDebut).toLocaleDateString("fr-FR")
          : "Date inconnue"}
      </div>
      
      <div className="card-info">
        ⏰{" "}
        {creneau.dateDebut && creneau.dateFin
          ? `${new Date(creneau.dateDebut).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })} – ${new Date(creneau.dateFin).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : "Heure inconnue"}
      </div>

      <div className="card-prix">
        💶 {creneau.prix != null ? `${creneau.prix} Da` : "Prix non défini"}
      </div>

      <div className="card-actions">
        {role === "joueur" && onReserver && (
          <button
            onClick={onReserver}
            className="jd-btn-primary"
          >
            Réserver
          </button>
        )}

        {role === "club" && (creneau.statut === "LIBRE" || creneau.statut === "RESERVE") && (
          <button
            onClick={handleAnnulerCreneau}
            className="jd-btn-danger"
          >
            ❌ Annuler ce créneau
          </button>
        )}
      </div>
    </div>
  );
};

export default CreneauCard;