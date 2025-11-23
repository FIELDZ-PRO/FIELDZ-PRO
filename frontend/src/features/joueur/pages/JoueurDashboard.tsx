import React, { useEffect, useState } from "react";
import { useAuth } from "../../../shared/context/AuthContext";
import { useNavigate } from "react-router-dom";
import JoueurDashboardLayout from "../components/organisms/joueurDashboardDoss/JoueurDashboardLayout";
import { Creneau, Reservation, Joueur } from "../../../shared/types";

const API_BASE = import.meta.env.VITE_API_URL || "https://vital-nana-fieldz-11e3f995.koyeb.app/api";

const JoueurDashboard: React.FC = () => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  const [joueur, setJoueur] = useState<Joueur | null>(null);
  const [creneauxLibres, setCreneauxLibres] = useState<Creneau[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [joueurRes, creneauxRes, reservationsRes] = await Promise.all([
        fetch(`${API_BASE}/joueur/me`, { headers }),
        fetch(`${API_BASE}/creneaux/disponibles`, { headers }),
        fetch(`${API_BASE}/reservations/mes`, { headers }),
      ]);

      if (joueurRes.ok) {
        const joueurData = await joueurRes.json();
        setJoueur(joueurData);
      }

      if (creneauxRes.ok) {
        const creneauxData = await creneauxRes.json();
        setCreneauxLibres(creneauxData);
      }

      if (reservationsRes.ok) {
        const reservationsData = await reservationsRes.json();
        setReservations(reservationsData);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div>Chargement des données...</div>
      </div>
    );
  }

  return (
    <JoueurDashboardLayout
      joueur={joueur}
      reservations={reservations}
      creneauxLibres={creneauxLibres}
      onRefresh={fetchAllData}
      onLogout={() => {
        logout();
        navigate("/");
      }}
      onNavigateToProfile={() => navigate("/profil-joueur")}
    />
  );
};

export default JoueurDashboard;