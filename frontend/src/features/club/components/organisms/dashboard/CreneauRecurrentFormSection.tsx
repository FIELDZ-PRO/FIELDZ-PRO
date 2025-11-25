import React, { useState } from 'react';
import CreneauRecurrentForm from '../../molecules/CreneauRecurrentForm';
import CustomAlert, { AlertType } from '../../../../../shared/components/atoms/CustomAlert';

interface Props {
  terrains: any[];
  onSubmit: (data: any) => Promise<any>;
}

interface AlertState {
  show: boolean;
  type: AlertType;
  message: string;
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
    nomReservant: '',
    autoReserver: false,
  });
  const [alert, setAlert] = useState<AlertState>({ show: false, type: 'info', message: '' });

  const showAlert = (type: AlertType, message: string) => {
    setAlert({ show: true, type, message });
  };

  const handleSubmit = async () => {
    if (!terrainId || !formData.jourDeSemaine || !formData.heureDebut || !formData.dateDebut || !formData.dateFin || !formData.dureeMinutes) {
      showAlert('error', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation: if autoReserver is checked, nomReservant must be filled
    if (formData.autoReserver && (!formData.nomReservant || formData.nomReservant.trim() === '')) {
      showAlert('warning', 'Veuillez entrer le nom du réservant pour activer la réservation automatique');
      return;
    }

    try {
      const response = await onSubmit({
        ...formData,
        dureeMinutes: parseInt(formData.dureeMinutes),
        prix: parseFloat(formData.prix),
        terrainId: parseInt(terrainId),
        nomReservant: formData.nomReservant || null,
        autoReserver: formData.autoReserver,
      });

      // Show success message from backend
      if (response?.message) {
        showAlert('success', response.message);
      } else {
        showAlert('success', 'Créneaux récurrents générés avec succès !');
      }

      // Reset form
      setFormData({
        jourDeSemaine: '',
        heureDebut: '',
        dureeMinutes: '',
        dateDebut: '',
        dateFin: '',
        prix: '',
        nomReservant: '',
        autoReserver: false,
      });
      setTerrainId('');
    } catch (error: any) {
      showAlert('error', error?.response?.data?.message || 'Erreur lors de la création des créneaux');
    }
  };

  return (
    <section>
      {alert.show && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, show: false })}
          duration={5000}
        />
      )}
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
