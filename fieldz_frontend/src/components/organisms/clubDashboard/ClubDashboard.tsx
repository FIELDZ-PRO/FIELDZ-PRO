// src/components/organisms/ClubDashboard/ClubDashboard.tsx

import React, { useEffect, useState } from 'react';
import ReservationGroup from './ReservationGroup';
import { useAuth } from '../../../context/AuthContext';
import { Reservation } from '../../../types';

const ClubDashboard: React.FC = () => {
  const { token } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/reservations/club', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setReservations(data);
      } catch (err) {
        console.error('Erreur lors du chargement des réservations', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [token]);

  const groupes = [
    { titre: '🔵 Réservations en attente', statut: 'RESERVE' },
    { titre: '🟢 Confirmées', statut: 'CONFIRMEE' },
    { titre: '🟠 Annulées par le joueur', statut: 'ANNULE_PAR_JOUEUR' },
    { titre: '🔴 Annulées par le club', statut: 'ANNULE_PAR_CLUB' },
  ];

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard du club</h1>

      {groupes.map(({ titre, statut }) => (
        <ReservationGroup
          key={statut}
          titre={titre}
          reservations={reservations.filter(r => r.statut === statut)}
        />
      ))}
    </div>
  );
};

export default ClubDashboard;