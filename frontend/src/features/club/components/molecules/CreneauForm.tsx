import React, { useState } from 'react';
import './style/CreneauForm.css';
import CustomAlert, { AlertType } from '../../../../shared/components/atoms/CustomAlert';

interface AlertState {
  show: boolean;
  type: AlertType;
  message: string;
}

interface CreneauFormProps {
  terrains: { id: number; nomTerrain: string; typeSurface?: string }[];
  onSubmit: (data: {
    dateDebut: string;  // "YYYY-MM-DDTHH:mm:ss" (local, sans Z)
    dateFin: string;    // "YYYY-MM-DDTHH:mm:ss" (local, sans Z)
    prix: number;
    terrainId: number;
    nombreDuplications?: number;
  }) => void;
}

const CreneauForm: React.FC<CreneauFormProps> = ({ terrains, onSubmit }) => {
  const [terrainId, setTerrainId] = useState('');
  const [date, setDate] = useState('');
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [prix, setPrix] = useState('');
  const [nombreDuplications, setNombreDuplications] = useState('');

  const [alertState, setAlertState] = useState<AlertState>({ show: false, type: 'info', message: '' });

  const showAlert = (type: AlertType, message: string) => {
    setAlertState({ show: true, type, message });
  };

  // ✅ petit helper: ajoute ":00" si l'input time renvoie HH:mm
  const addSeconds = (t: string) => (t && t.length === 5 ? `${t}:00` : t);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!terrainId || !date || !heureDebut || !heureFin || !prix) {
      showAlert('warning', 'Veuillez remplir tous les champs.');
      return;
    }

    // ✅ IMPORTANT : on construit des chaînes locales SANS créer d'objet Date
    // et SANS toISOString() (qui convertirait en UTC et décale d'1h)
    const dateDebut = `${date}T${addSeconds(heureDebut)}`; // ex: "2025-12-25T10:00:00"
    const dateFin   = `${date}T${addSeconds(heureFin)}`;   // ex: "2025-12-25T11:30:00"

    // ✅ vérif simple : comparaison lexicographique OK sur ce format
    if (dateFin <= dateDebut) {
      showAlert('warning', "L'heure de fin doit être après l'heure de début.");
      return;
    }

    onSubmit({
      dateDebut,               // ✅ chaîne locale (pas de Z)
      dateFin,                 // ✅ chaîne locale (pas de Z)
      prix: Number(prix),
      terrainId: Number(terrainId),
      nombreDuplications: Number(nombreDuplications),
    });

    // Reset du formulaire
    setTerrainId('');
    setDate('');
    setHeureDebut('');
    setHeureFin('');
    setPrix('');
  };

  return (
    <>
      {alertState.show && (
        <CustomAlert
          type={alertState.type}
          message={alertState.message}
          onClose={() => setAlertState({ ...alertState, show: false })}
          duration={5000}
        />
      )}

      <form onSubmit={handleSubmit} className="creneau-form">
        <div className="creneau-form-group">
        <label>Terrain</label>
        <select value={terrainId} onChange={(e) => setTerrainId(e.target.value)}>
          <option value="">-- Sélectionner un terrain --</option>
          {terrains.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nomTerrain} {t.typeSurface ? `(${t.typeSurface})` : ''}
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
      
      <div className="creneau-form-group">
        <label>Nombre de Créneaux</label>
        <input type="number" value={nombreDuplications} onChange={(e) => setNombreDuplications(e.target.value)} />
      </div>

      <button type="submit">Générer le créneau</button>
    </form>
    </>
  );
};

export default CreneauForm;
