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
      toast.error("❌ Impossible d’annuler ce créneau");
      console.error(err);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-md bg-white space-y-2">
      {/* Club + Ville */}
      <div className="font-semibold text-green-700">
        {creneau.terrain?.club?.nom || "Club inconnu"}
        {creneau.terrain?.ville && (
          <span className="text-blue-600 ml-2">• {creneau.terrain.ville}</span>
        )}
      </div>

      {/* Terrain + surface */}
      <div className="text-sm text-gray-700">
        {creneau.terrain?.nomTerrain || "Terrain inconnu"}
        {creneau.terrain?.typeSurface && <> • {creneau.terrain.typeSurface}</>}
        {creneau.terrain?.taille && <> • {creneau.terrain.taille}</>}
      </div>

      {/* Date + heure */}
      <div className="text-sm">
        📅{" "}
        {creneau.dateDebut
          ? new Date(creneau.dateDebut).toLocaleDateString("fr-FR")
          : "Date inconnue"}
        <br />
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

      {/* Prix */}
      <div className="text-sm text-green-800">
        💶 {creneau.prix != null ? `${creneau.prix} Da` : "Prix non défini"}
      </div>

      {/* Boutons */}
      <div className="pt-2 flex gap-2 flex-wrap">
        {role === "joueur" && onReserver && (
          <button
            onClick={onReserver}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Réserver
          </button>
        )}

        {role === "club" && (creneau.statut === "LIBRE" || creneau.statut === "RESERVE") && (

          <button
            onClick={handleAnnulerCreneau}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            ❌ Annuler ce créneau
          </button>
        )}
      </div>
    </div>
  );
};

export default CreneauCard;
