import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { Joueur, Reservation, Creneau } from '../../../shared/types';
import JoueurDashboardLayout from '../components/organisms/joueurDashboard/JoueurDashboardLayout';

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
        fetch('https://prime-cherida-fieldzz-17996b20.koyeb.app/api/utilisateur/me', { headers }),
        fetch("https://prime-cherida-fieldzz-17996b20.koyeb.app/api/reservations/mes", { headers }),
        fetch('https://prime-cherida-fieldzz-17996b20.koyeb.app/api/creneaux/disponibles', { headers }),
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
