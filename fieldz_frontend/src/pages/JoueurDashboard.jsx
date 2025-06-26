import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const JoueurDashboard = () => {
  const { logout, role, token } = useAuth();
  const navigate = useNavigate();

  const [creneauxLibres, setCreneauxLibres] = useState([]);
  const [mesReservations, setMesReservations] = useState([]);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 🔁 Charger les créneaux disponibles
  const fetchCreneauxLibres = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/creneaux/disponibles', { headers });

      const data = await res.json();
      setCreneauxLibres(data);
    } catch (err) {
      console.error("Erreur fetch créneaux :", err);
    }
  };

  // 🔁 Charger mes réservations
  const fetchMesReservations = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/reservations/mes', {
        headers,
      });
      const data = await res.json();
      setMesReservations(data);
    } catch (err) {
      console.error("Erreur fetch réservations :", err);
    }
  };

  const handleReserver = async (creneauId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/reservations/creneau/${creneauId}`, {
        method: 'POST',
        headers,
      });
      if (res.ok) {
        alert("✅ Réservation confirmée !");
        fetchCreneauxLibres();
        fetchMesReservations();
      } else {
        const err = await res.text();
        alert("❌ Erreur : " + err);
      }
    } catch (err) {
      console.error("Erreur lors de la réservation :", err);
    }
  };

  const handleAnnuler = async (reservationId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/reservations/${reservationId}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) {
        alert("❌ Réservation annulée.");
        fetchCreneauxLibres();
        fetchMesReservations();
      } else {
        const err = await res.text();
        alert("Erreur : " + err);
      }
    } catch (err) {
      console.error("Erreur annulation :", err);
    }
  };

  useEffect(() => {
    fetchCreneauxLibres();
    fetchMesReservations();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bienvenue Joueur 🎮</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          🚪 Se déconnecter
        </button>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-3">📅 Créneaux disponibles</h2>
        <ul className="space-y-2">
          {creneauxLibres.length === 0 && (
            <p className="text-gray-500">Aucun créneau libre pour le moment.</p>
          )}
          {creneauxLibres.map((c) => (
            <li key={c.id} className="border p-3 rounded flex justify-between items-center">
              <span>
{c.terrain?.nomTerrain || 'Terrain inconnu'} – {c.date} de {c.heureDebut} à {c.heureFin}
              </span>
              <button
                onClick={() => handleReserver(c.id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Réserver
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">📖 Mes réservations</h2>
        <ul className="space-y-2">
          {mesReservations.length === 0 && (
            <p className="text-gray-500">Aucune réservation enregistrée.</p>
          )}
          {mesReservations.map((r) => (
            <li key={r.id} className="border p-3 rounded flex justify-between items-center">
              <span>
                Créneau #{r.creneau?.id} – {r.creneau?.date} de {r.creneau?.heureDebut} à {r.creneau?.heureFin}
              </span>
              <button
                onClick={() => handleAnnuler(r.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Annuler
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default JoueurDashboard;