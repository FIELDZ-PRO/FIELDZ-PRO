import React, { useState } from 'react';

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

    setTerrainId('');
    setDate('');
    setHeureDebut('');
    setHeureFin('');
    setPrix('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md"
    >
      <div className="flex flex-wrap items-end gap-6 bg-gray-50 p-6 rounded-xl shadow-sm">

        <div className="flex flex-col min-w-[180px]">
          <select
            value={terrainId}
            onChange={(e) => setTerrainId(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white cursor-pointer"
          >
            <option value="">-- Sélectionner un terrain --</option>
            {terrains.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nomTerrain}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col min-w-[160px]">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white"
          />
        </div>

        <div className="flex flex-col min-w-[150px]">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Heure de début
          </label>
          <input
            type="time"
            value={heureDebut}
            onChange={(e) => setHeureDebut(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white"
          />
        </div>

        <div className="flex flex-col min-w-[150px]">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Heure de fin
          </label>
          <input
            type="time"
            value={heureFin}
            onChange={(e) => setHeureFin(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white"
          />
        </div>

        <div className="flex flex-col min-w-[120px]">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Prix (Da)
          </label>
          <input
            type="number"
            placeholder="Ex: 1500"
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2.5 rounded-lg mt-6"
        >
          ➕ Proposer
        </button>

      </div>


    </form>
  );
};

export default CreneauForm;
