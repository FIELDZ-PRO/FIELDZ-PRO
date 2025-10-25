import React, { useEffect, useState } from 'react';
import CreneauFormSection from './CreneauFormSection';
import CreneauRecurrentFormSection from './CreneauRecurrentFormSection';
import { Reservation, Terrain } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { Creneau } from '../../../types';
import CreneauGroup from './CreneauGroup';
import './CreneauxSection.css'
import { fetchCreneaux } from '../../../services/ClubService';

type Props = {
  terrains: Terrain[];
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
};

const CreneauxSection: React.FC<Props> = ({ terrains, reservations, setReservations }) => {
  const { token } = useAuth();
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);

  // ⏳ Fonction pour charger les créneaux depuis l’API
  const waitCreneaux = async () => {
    try {
      const data: Creneau[] = await fetchCreneaux(terrains);
      setCreneaux(data);
    } catch (error) {
      console.error('Erreur lors du chargement des créneaux', error);
    }
  };

  // 🟡 Charger les créneaux dès le montage du composant
  useEffect(() => {
    waitCreneaux();
  }, []);

  // 📅 Obtenir la date du jour (remise à 00h00 pour comparer uniquement les jours)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filtrer les créneaux à venir (aujourd’hui et après)
  // Les trier du plus tôt au plus tard
  const upcomingCreneaux = creneaux
    .filter(c => new Date(c.dateDebut) >= today)
    .sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime());

  // ➕ Ajouter un créneau ponctuel
  const handleAddCreneauPonctuel = async (data: any) => {
    try {
      const { terrainId, dateDebut, dateFin, prix } = data;

      const res = await fetch(`http://localhost:8080/api/creneaux/terrains/${terrainId}/creneaux`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dateDebut, dateFin, prix: Number(prix) }),
      });

      const text = await res.text();

      if (!res.ok) {
        if (res.status === 409) {
          alert("❌ Ce créneau chevauche un créneau déjà existant.");
        } else {
          alert("❌" + text);
        }
        return;
      }

      const created = JSON.parse(text);
      alert(`✅ Créneau ajouté pour le ${new Date(created.dateDebut).toLocaleString('fr-FR')}`);

      // 🔁 Rafraîchir la liste après ajout
      waitCreneaux();
    } catch (err) {
      console.error(err);
      alert('❌ Erreur inconnue lors de l’ajout du créneau');
    }
  };

  // ♻️ Ajouter des créneaux récurrents
  const handleAddCreneauxRecurrents = async (data: any) => {
    try {
      const res = await fetch('http://localhost:8080/api/creneaux/recurrent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const text = await res.text();
      const response = JSON.parse(text);

      alert(`✅ ${response.message ?? "Créneaux traités"}\n📅 Demandés : ${response.totalDemandes}\n✔️ Créés : ${response.totalCrees}\n❗ Déjà existants : ${response.dejaExistants}`);

      // 🔁 Rafraîchir la liste après création
      waitCreneaux();
    } catch (err) {
      console.error(err);
      alert('❌ Erreur lors de la création des créneaux récurrents');
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* 🏟️ Section 1: Créneaux ponctuels */}
      <div className="section-wrapper">
        <section>
          <div className="section-title">Ajout de créneaux ponctuels</div>
          <CreneauFormSection terrains={terrains} onSubmit={handleAddCreneauPonctuel} />
        </section>
      </div>

      {/* 📅 Section 2: Créneaux à venir */}
      <div className="section-wrapper">
        <section>
          <h2 className="text-2xl font-bold mb-4">Créneaux à venir</h2>
          <CreneauGroup
            titre="Tous les créneaux à venir"
            creneaux={upcomingCreneaux}
            UpdateCreneaux={waitCreneaux}
          />
        </section>
      </div>

      {/* ♻️ Section 3: Créneaux récurrents */}
      <div className="section-wrapper">
        <section>
          <div className="section-title">Ajout de créneaux récurrents</div>
          <CreneauRecurrentFormSection terrains={terrains} onSubmit={handleAddCreneauxRecurrents} />
        </section>
      </div>
    </div>
  );
};

export default CreneauxSection;
