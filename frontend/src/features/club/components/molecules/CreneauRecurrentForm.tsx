import React from 'react';
import './style/CreneauRecurrentForm.css'
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
    nomReservant: string;
    autoReserver: boolean;
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
    { label: 'Lundi', value: 'MONDAY' },
    { label: 'Mardi', value: 'TUESDAY' },
    { label: 'Mercredi', value: 'WEDNESDAY' },
    { label: 'Jeudi', value: 'THURSDAY' },
    { label: 'Vendredi', value: 'FRIDAY' },
    { label: 'Samedi', value: 'SATURDAY' },
    { label: 'Dimanche', value: 'SUNDAY' },
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="creneau-form"
    >
      {/* Ligne du haut — terrain + jour de semaine */}
      <div className="creneau-form-group" style={{ flex: '1 1 45%' }}>
        <label>Terrain</label>
        <select
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
      </div>

      <div className="creneau-form-group" style={{ flex: '1 1 45%' }}>
        <label>Jour de la semaine</label>
        <select
          value={recurrent.jourDeSemaine}
          onChange={(e) =>
            setRecurrent({ ...recurrent, jourDeSemaine: e.target.value })
          }
        >
          <option value="">-- Sélectionner un jour --</option>
          {jours.map((j) => (
            <option key={j.value} value={j.value}>
              {j.label}
            </option>
          ))}
        </select>
      </div>

      {/* Ligne du bas — inputs identiques au style du CreneauForm */}
      <div className="creneau-form-group">
        <label>Heure de début</label>
        <input
          type="time"
          value={recurrent.heureDebut}
          onChange={(e) =>
            setRecurrent({ ...recurrent, heureDebut: e.target.value })
          }
        />
      </div>

      <div className="creneau-form-group">
        <label>Durée (en minutes)</label>
        <input
          type="number"
          min="15"
          step="15"
          value={recurrent.dureeMinutes}
          onChange={(e) =>
            setRecurrent({ ...recurrent, dureeMinutes: e.target.value })
          }
        />
      </div>

      <div className="creneau-form-group">
        <label>Date de début</label>
        <input
          type="date"
          value={recurrent.dateDebut}
          onChange={(e) =>
            setRecurrent({ ...recurrent, dateDebut: e.target.value })
          }
        />
      </div>

      <div className="creneau-form-group">
        <label>Date de fin</label>
        <input
          type="date"
          value={recurrent.dateFin}
          onChange={(e) =>
            setRecurrent({ ...recurrent, dateFin: e.target.value })
          }
        />
      </div>

      <div className="creneau-form-group">
        <label>Prix (Da)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={recurrent.prix}
          onChange={(e) =>
            setRecurrent({ ...recurrent, prix: e.target.value })
          }
        />
      </div>

      <div className="creneau-form-group">
        <label>Nom du réservant (optionnel)</label>
        <input
          type="text"
          placeholder="Nom et prénom"
          value={recurrent.nomReservant}
          onChange={(e) =>
            setRecurrent({ ...recurrent, nomReservant: e.target.value })
          }
        />
      </div>

      <div className="creneau-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="checkbox"
          id="autoReserver"
          checked={recurrent.autoReserver}
          onChange={(e) =>
            setRecurrent({ ...recurrent, autoReserver: e.target.checked })
          }
          style={{ width: 'auto', margin: 0 }}
        />
        <label htmlFor="autoReserver" style={{ margin: 0, cursor: 'pointer' }}>
          Réserver automatiquement avec ce nom
        </label>
      </div>

      <button type="submit">♻️ Générer les créneaux</button>
    </form>
  );
};

export default CreneauRecurrentForm;