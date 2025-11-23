import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { Joueur, Reservation, Creneau } from '../../../shared/types';
import JoueurDashboardLayout from '../components/organisms/joueurDashboard/JoueurDashboardLayout';

const API_BASE = import.meta.env.VITE_API_URL || "https://fieldz-pro.koyeb.app/api";

const JoueurDashboard2: React.FC = () => {
  const { token } = useAuth();
  const [joueur, setJoueur] = useState<Joueur | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [creneauxLibres, setCreneauxLibres] = useState<Creneau[]>([]);

  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [resJoueur, resReservations, resCreneaux] = await Promise.all([
        fetch(`${API_BASE}/utilisateur/me`, { headers }),
        fetch(`${API_BASE}/reservations/mes`, { headers }),
        fetch(`${API_BASE}/creneaux/disponibles`, { headers }),
      ]);

      if (!resJoueur.ok || !resReservations.ok || !resCreneaux.ok) throw new Error("Erreur lors du chargement");

      const joueurData = await resJoueur.json();
      const reservationsData = await resReservations.json();
      const creneauxData = await resCreneaux.json();

      setJoueur(joueurData);
      setReservations(reservationsData);
      setCreneauxLibres(creneauxData);
    } catch (err) {
      console.error("❌ Erreur de chargement :", err);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  return (

    <JoueurDashboardLayout
      joueur={joueur}
      reservations={reservations}
      creneauxLibres={creneauxLibres}
      onRefresh={fetchData}
    />

  );
};

export default JoueurDashboard2;
