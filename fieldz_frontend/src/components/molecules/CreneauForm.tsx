import React, { useState, useEffect } from 'react';

interface CreneauFormProps {
  terrains: { id: number; nomTerrain: string }[];
  onSubmit: (data: {
    dateDebut: string;
    dateFin: string;
    prix: number;
    terrainId: number;
  }) => void;
}

const CreneauForm: React.FC<CreneauFormProps> = ({ terrains, onSubmit }) => {
  const [terrainId, setTerrainId] = useState('');
  const [date, setDate] = useState('');
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [prix, setPrix] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!terrainId || !date || !heureDebut || !heureFin || !prix) {
    alert('Veuillez remplir tous les champs.');
    return;
  }

  const dateDebut = new Date(`${date}T${heureDebut}:00`);
  const dateFin = new Date(`${date}T${heureFin}:00`);

  if (dateFin <= dateDebut) {
    alert("L'heure de fin doit être après l'heure de début.");
    return;
  }

  onSubmit({
    dateDebut: dateDebut.toISOString(),
    dateFin: dateFin.toISOString(),
    prix: Number(prix),
    terrainId: Number(terrainId),
  });

  // Reset form
  setTerrainId('');
  setDate('');
  setHeureDebut('');
  setHeureFin('');
  setPrix('');
};


  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-3 bg-gray-100 p-4 rounded-md"
    >
      <select
        value={terrainId}
        onChange={(e) => setTerrainId(e.target.value)}
        className="border border-green-300 rounded px-3 py-2 text-sm text-gray-700"
      >
        <option value="">-- Sélectionner un terrain --</option>
        {terrains.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nomTerrain}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border border-green-300 rounded px-3 py-2 text-sm"
      />

      <input
        type="time"
        value={heureDebut}
        onChange={(e) => setHeureDebut(e.target.value)}
        className="border border-green-300 rounded px-3 py-2 text-sm"
      />

      <input
        type="time"
        value={heureFin}
        onChange={(e) => setHeureFin(e.target.value)}
        className="border border-green-300 rounded px-3 py-2 text-sm"
      />

      <input
        type="number"
        placeholder="Prix (Da)"
        value={prix}
        onChange={(e) => setPrix(e.target.value)}
        className="border border-green-300 rounded px-3 py-2 text-sm w-32"
      />

      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded"
      >
        ➕ Proposer
      </button>
    </form>
  );
};

export default CreneauForm;
