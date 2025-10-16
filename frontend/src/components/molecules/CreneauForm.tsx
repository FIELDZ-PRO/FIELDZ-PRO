import React, { useState } from 'react';

interface CreneauFormProps {
  terrains: { id: number; nomTerrain: string; typeSurface?: string }[];
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
    <form onSubmit={handleSubmit} className="form-group">
      <select
        className="input-field"
        value={terrainId}
        onChange={(e) => setTerrainId(e.target.value)}
      >
        <option value="">-- Sélectionner un terrain --</option>
        {terrains.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nomTerrain} ({t.typeSurface})
          </option>
        ))}
      </select>

      <input
        type="date"
        className="input-field"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        type="time"
        className="input-field"
        value={heureDebut}
        onChange={(e) => setHeureDebut(e.target.value)}
      />

      <input
        type="time"
        className="input-field"
        value={heureFin}
        onChange={(e) => setHeureFin(e.target.value)}
      />

      <input
        type="number"
        className="input-field"
        placeholder="Prix (Da)"
        min="0"
        step="0.01"
        value={prix}
        onChange={(e) => setPrix(e.target.value)}
      />

      <button type="submit" className="btn btn-creneau">
        ➕ Proposer
      </button>
    </form>
  );
};

export default CreneauForm;
