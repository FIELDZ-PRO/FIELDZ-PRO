import React from 'react';

interface Props {
  terrains: any[];
  terrainId: string;
  setTerrainId: (id: string) => void;
  recurrent: {
    jourDeSemaine: string;
    heureDebut: string;
    dureeMinutes: string;
    dateDebut: string;
    dateFin: string;
    prix: string;
  };
  setRecurrent: (r: any) => void;
  onSubmit: () => void;
}

const CreneauRecurrentForm: React.FC<Props> = ({
  terrains,
  terrainId,
  setTerrainId,
  recurrent,
  setRecurrent,
  onSubmit,
}) => {
  const jours = [
    { label: "Lundi", value: "MONDAY" },
    { label: "Mardi", value: "TUESDAY" },
    { label: "Mercredi", value: "WEDNESDAY" },
    { label: "Jeudi", value: "THURSDAY" },
    { label: "Vendredi", value: "FRIDAY" },
    { label: "Samedi", value: "SATURDAY" },
    { label: "Dimanche", value: "SUNDAY" },
  ];

  return (
    <div className="form-group">
      <select className="input-field" value={terrainId} onChange={(e) => setTerrainId(e.target.value)}>
        <option value="">-- Sélectionner un terrain --</option>
        {terrains.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nomTerrain} ({t.typeSurface})
          </option>
        ))}
      </select>

      <select
        className="input-field"
        value={recurrent.jourDeSemaine}
        onChange={(e) => setRecurrent({ ...recurrent, jourDeSemaine: e.target.value })}
      >
        <option value="">-- Jour de la semaine --</option>
        {jours.map((j) => (
          <option key={j.value} value={j.value}>{j.label}</option>
        ))}
      </select>
      <div className="flex flex-col flex-1 min-w-[160px]">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Heure de début
        </label>
        <input
          type="time"
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white"
          value={recurrent.heureDebut}
          onChange={(e) => setRecurrent({ ...recurrent, heureDebut: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1">
          Temps de jeu
        </label>
        <input
          type="number"
          className="input-field"
          placeholder="Durée (en minutes)"
          min="15"
          step="15"
          value={recurrent.dureeMinutes}
          onChange={(e) => setRecurrent({ ...recurrent, dureeMinutes: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1">
          Date de début
        </label>
        <input
          type="date"
          className="input-field"
          value={recurrent.dateDebut}
          onChange={(e) => setRecurrent({ ...recurrent, dateDebut: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1">
          Date de Fin
        </label>
        <input
          type="date"
          className="input-field"
          value={recurrent.dateFin}
          onChange={(e) => setRecurrent({ ...recurrent, dateFin: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1">
          Prix en Dinar
        </label>
        <input
          type="number"
          className="input-field"
          placeholder="Prix (Dzd)"
          min="0"
          step="0.01"
          value={recurrent.prix}
          onChange={(e) => setRecurrent({ ...recurrent, prix: e.target.value })}
        />
      </div>
      <button className="btn btn-creneau" onClick={onSubmit}>
        ♻️ Générer les créneaux
      </button>
    </div>
  );
};

export default CreneauRecurrentForm;
