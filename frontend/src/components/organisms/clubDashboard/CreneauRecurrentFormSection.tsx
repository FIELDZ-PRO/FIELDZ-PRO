import React, { useState } from 'react';
import CreneauRecurrentForm from '../../molecules/CreneauRecurrentForm';

interface Props {
  terrains: any[];
  onSubmit: (data: any) => void;
}

const CreneauRecurrentFormSection: React.FC<Props> = ({ terrains, onSubmit }) => {
  const [terrainId, setTerrainId] = useState('');
  const [formData, setFormData] = useState({
    jourDeSemaine: '',
    heureDebut: '',
    dureeMinutes: '',
    dateDebut: '',
    dateFin: '',
    prix: '',
  });

  const handleSubmit = () => {
    if (!terrainId || !formData.jourDeSemaine || !formData.heureDebut || !formData.dateDebut || !formData.dateFin || !formData.dureeMinutes) {
      alert("❌ Veuillez remplir tous les champs");
      return;
    }

    onSubmit({
      ...formData,
      dureeMinutes: parseInt(formData.dureeMinutes),
      prix: parseFloat(formData.prix),
      terrainId: parseInt(terrainId),
    });

    setFormData({
      jourDeSemaine: '',
      heureDebut: '',
      dureeMinutes: '',
      dateDebut: '',
      dateFin: '',
      prix: '',
    });
    setTerrainId('');
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Créneaux récurrents</h2>
      <CreneauRecurrentForm
        terrains={terrains}
        terrainId={terrainId}
        setTerrainId={setTerrainId}
        recurrent={formData}
        setRecurrent={setFormData}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

export default CreneauRecurrentFormSection;
