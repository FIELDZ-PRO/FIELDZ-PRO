import React, { useState } from 'react';
import { Terrain } from '../../../../shared/types';

type TerrainFormProps = {
  onAddTerrain: (terrain: Omit<Terrain, 'id'>) => void;
};

const TerrainForm: React.FC<TerrainFormProps> = ({ onAddTerrain }) => {
  const [terrain, setTerrain] = useState<Omit<Terrain, 'id'>>({
    nomTerrain: '',
    typeSurface: '',
    ville: '',
    sport: 'padel', // valeur par défaut
    politiqueClub: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTerrain({ ...terrain, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTerrain(terrain);
    setTerrain({ nomTerrain: '', typeSurface: '', ville: '', sport: 'padel', politiqueClub: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-center">
      <input name="nomTerrain" value={terrain.nomTerrain} onChange={handleChange} placeholder="Nom du terrain" className="input-field" />
      <input name="typeSurface" value={terrain.typeSurface} onChange={handleChange} placeholder="Type de surface" className="input-field" />
      <input name="ville" value={terrain.ville} onChange={handleChange} placeholder="Ville" className="input-field" />
      <textarea name="politiqueClub" value={terrain.politiqueClub} onChange={handleChange} placeholder="Politique du club (facultatif)" className="textarea-field" />
      <button type="submit" className="btn-green">➕ Ajouter le terrain</button>
    </form>
  );
};

export default TerrainForm;
