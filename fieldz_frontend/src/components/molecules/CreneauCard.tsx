import React from "react";
import { Creneau } from "../../types";

type Props = {
  creneau: Creneau;
  onReserver: () => void;
};

const CreneauCard: React.FC<Props> = ({ creneau, onReserver }) => {
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

      {/* Bouton réserver */}
      <div className="pt-2">
        <button
          onClick={() => {
  console.log("✅ Bouton Réserver cliqué pour :", creneau.id);
  onReserver();
}}

          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Réserver
        </button>
      </div>
    </div>
  );
};

export default CreneauCard;
