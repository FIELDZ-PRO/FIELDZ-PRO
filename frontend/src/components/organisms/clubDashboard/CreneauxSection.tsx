// src/components/organisms/clubDashboard/CreneauxSection.tsx
import React, { useEffect, useState } from 'react';
import CreneauFormSection from './CreneauFormSection';
import CreneauRecurrentFormSection from './CreneauRecurrentFormSection';
import ReservationGroup from './ReservationGroup';
import { Reservation, Terrain } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { Creneau } from '../../../types';
import CreneauGroup from './CreneauGroup';
import './CreneauxSection.css'

type Props = {
  terrains: Terrain[];
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
};

const CreneauxSection: React.FC<Props> = ({ terrains, reservations, setReservations }) => {
  const { token } = useAuth();
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);

  // 🟡 CHARGER LES CRENEAUX PAR TERRAIN
  useEffect(() => {
    const fetchCreneaux = async () => {
      try {
        if (!terrains.length) return;

        const allCreneaux: Creneau[] = [];

        for (const terrain of terrains) {
          const res = await fetch(`http://localhost:8080/api/creneaux/terrains/${terrain.id}/creneaux`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            console.error(`Erreur sur le terrain ${terrain.id}`);
            continue;
          }

          const data = await res.json();
          allCreneaux.push(...data);
        }

        setCreneaux(allCreneaux);
      } catch (err) {
        console.error('Erreur lors du chargement des créneaux', err);
      }
    };

    fetchCreneaux();
  }, [terrains, token]);

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
    } catch (err) {
      console.error(err);
      alert('❌ Erreur inconnue lors de l’ajout du créneau');
    }
  };

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
    } catch (err) {
      console.error(err);
      alert('❌ Erreur lors de la création des créneaux récurrents');
    }
  };

  return (
    <div className="flex flex-col gap-10">  {/* ⬅️ adds nice vertical space between sections */}

      {/* 🏟️ Section 1: Créneaux ponctuels */}
      <div className="section-wrapper">
        <section>
          <div className="section-title">🏟️ Ajout de créneaux ponctuels</div>
          <CreneauFormSection terrains={terrains} onSubmit={handleAddCreneauPonctuel} />
        </section>
      </div>

      {/* 📅 Section 2: Créneaux à venir */}
      <div className="section-wrapper">
        <section>
          <h2 className="text-2xl font-bold mb-4">📅 Créneaux à venir</h2>
          <CreneauGroup titre="📍 Tous les créneaux" creneaux={creneaux} />
        </section>
      </div>

      {/* ♻️ Section 3: Créneaux récurrents */}
      <div className="section-wrapper">
        <section>
          <div className="section-title">♻️ Ajout de créneaux récurrents</div>
          <CreneauRecurrentFormSection terrains={terrains} onSubmit={handleAddCreneauxRecurrents} />
        </section>
      </div>

    </div>
  );

};

export default CreneauxSection;
