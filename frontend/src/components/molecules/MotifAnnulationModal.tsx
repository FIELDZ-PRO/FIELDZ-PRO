import React, { useState } from "react";
import FullscreenModal from "../organisms/joueurDashboardDoss/FullscreenModal"; // ou adapte le chemin

type Props = {
  onClose: () => void;
  onSubmit: (motif: string) => void; // 👈 nécessaire pour corriger l'erreur
};

const MotifAnnulationModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [motif, setMotif] = useState("");

  const handleValider = () => {
    if (!motif.trim()) {
      alert("Veuillez saisir un motif.");
      return;
    }
    onSubmit(motif);
  };

  return (
    <FullscreenModal onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-red-700">❌ Annulation de réservation</h2>
      <p className="mb-2 text-gray-800">Merci d’indiquer un motif :</p>
      <textarea
        value={motif}
        onChange={(e) => setMotif(e.target.value)}
        className="w-full h-24 border rounded p-2 mb-4"
        placeholder="Ex: Imprévu, blessure, etc."
      />
      <div className="flex justify-end gap-4">
        <button
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          onClick={onClose}
        >
          Annuler
        </button>
        <button
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          onClick={handleValider}
        >
          Valider le motif
        </button>
      </div>
    </FullscreenModal>
  );
};

export default MotifAnnulationModal;
