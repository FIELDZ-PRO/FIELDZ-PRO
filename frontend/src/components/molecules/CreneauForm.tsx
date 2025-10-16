import React, { useState } from 'react';
import './style/CreneauForm.css'
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
    <form onSubmit={handleSubmit} className="creneau-form">
      <div className="creneau-form-group">
        <label>Terrain</label>
        <select value={terrainId} onChange={(e) => setTerrainId(e.target.value)}>
          <option value="">-- Sélectionner un terrain --</option>
          {terrains.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nomTerrain} ({t.typeSurface})
            </option>
          ))}
        </select>
      </div>

      <div className="creneau-form-group">
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="creneau-form-group">
        <label>Heure de début</label>
        <input type="time" value={heureDebut} onChange={(e) => setHeureDebut(e.target.value)} />
      </div>

      <div className="creneau-form-group">
        <label>Heure de fin</label>
        <input type="time" value={heureFin} onChange={(e) => setHeureFin(e.target.value)} />
      </div>

      <div className="creneau-form-group">
        <label>Prix (Da)</label>
        <input type="number" value={prix} onChange={(e) => setPrix(e.target.value)} />
      </div>

      <button type="submit">➕ Proposer</button>
    </form>
  );
};

export default CreneauForm;
