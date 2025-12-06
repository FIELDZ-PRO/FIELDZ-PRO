import React, { useEffect, useState } from 'react';
import ReservationGroup from './ReservationGroup';
import { useAuth } from '../../../../../shared/context/AuthContext';
import { Reservation } from '../../../../../shared/types/index';
import HeaderClub from './HeaderClub';
import TerrainsSection from './TerrainsSection';
import CreneauFormSection from './CreneauFormSection';
import CreneauRecurrentFormSection from './CreneauRecurrentFormSection';
import CreneauxSection from './CreneauxSection';
import { Terrain } from '../../../../../shared/types/index';
import ReservationParDateSection from "./ReservationParDateSection";
import ReservationGroupByStatut from "./ReservationGroupByStatut";
import { Spinner } from '../../../../../shared/components/atoms';

const API_BASE = import.meta.env.VITE_API_URL || "https://prime-cherida-fieldzz-17996b20.koyeb.app/api";



function formatDateTimeFr(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}


const ClubDashboard: React.FC = () => {
  const { token } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationsDate, setReservationsDate] = useState<Reservation[]>([]);

  const [terrains, setTerrains] = useState<Terrain[]>([]);

  const [loading, setLoading] = useState(true);
  const [club, setClub] = useState<{ nom: string } | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  const handleVoirReservationsDate = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/reservations/reservations/date?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setReservationsDate(data);
    } catch (err) {
      console.error("Erreur lors du chargement des réservations à la date :", err);
    }
  };




  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await fetch(`${API_BASE}/club/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        const data = await res.json();
        setClub(data);
      } catch (err) {
        console.error("Erreur lors du chargement du club :", err);
      }
    };

    fetchClub();
  }, [token]);


  useEffect(() => {
    const fetchTerrains = async () => {
      try {
        const res = await fetch(`${API_BASE}/terrains`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log(data);
        setTerrains(data);
      } catch (err) {
        console.error('Erreur lors du chargement des terrains', err);
      } finally {
        setLoading(false); // 👈 ICI !
      }
    };

    fetchTerrains();
  }, [token]);


  const [showTodayReservations, setShowTodayReservations] = useState(false);
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch(`${API_BASE}/reservations/reservations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setReservations(data);
      } catch (err) {
        console.error("Erreur lors du chargement des réservations :", err);
      }
    };

    fetchReservations();
  }, [token]);

  console.log(terrains);
  const groupes = [
    { titre: '🔵 Réservations en attente', statut: 'RESERVE' },
    { titre: '🟢 Confirmées', statut: 'CONFIRMEE' },
    { titre: '🟠 Annulées par le joueur', statut: 'ANNULE_PAR_JOUEUR' },
    { titre: '🔴 Annulées par le club', statut: 'ANNULE_PAR_CLUB' },
  ];

  if (loading) return <Spinner loading={loading} text="Chargement du dashboard..." fullScreen />;

  return (
    <div className="p-4 space-y-6">
      <HeaderClub nomClub={club?.nom || '...'} />


      {/* ➕ Ajout de terrain et leur affichage*/}
      <TerrainsSection terrains={terrains} setTerrains={setTerrains} />

      {/* ➕ Ajout de créneaux ponctuels, récurrents et leur affichage*/}
      <CreneauxSection terrains={terrains} reservations={reservations} setReservations={setReservations} />

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">📋 Toutes les réservations du club</h2>

        <button
          onClick={() => setShowTodayReservations(!showTodayReservations)}
          className="w-full text-left font-bold text-lg py-2 bg-gray-200 rounded-md px-4"
        >
          {showTodayReservations ? "▼" : "▶"} 📆 Réservations du jour
        </button>

        {showTodayReservations && (
          <div className="mt-2">
            <ReservationGroupByStatut
              titre="✅ Confirmées"
              statut="CONFIRMEE"
              reservations={reservations}
            />
            <ReservationGroupByStatut
              titre="📌 Réservées (à confirmer)"
              statut="RESERVE"
              reservations={reservations}
            />
            <ReservationGroupByStatut
              titre="❌ Annulées par le joueur"
              statut="ANNULE_PAR_JOUEUR"
              reservations={reservations}
            />
            <ReservationGroupByStatut
              titre="🚫 Annulées par le club"
              statut="ANNULE_PAR_CLUB"
              reservations={reservations}
            />
          </div>
        )}
      </section>

      <ReservationParDateSection
        date={date}
        onDateChange={setDate}
        onVoir={handleVoirReservationsDate}
        reservations={reservationsDate}
      />


      <h1 className="text-2xl font-bold mb-4">📊 Dashboard du club</h1>

    </div>
  );


};

export default ClubDashboard;
