import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const JoueurDashboard = () => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  const [creneauxLibres, setCreneauxLibres] = useState([]);
  const [mesReservations, setMesReservations] = useState([]);

  useEffect(() => {
    fetchCreneauxLibres();
    fetchMesReservations();
  }, []);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchCreneauxLibres = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/creneaux/disponibles", { headers });
      const data = await res.json();
      setCreneauxLibres(data);
    } catch (err) {
      console.error("Erreur fetch créneaux :", err);
    }
  };

  const fetchMesReservations = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/reservations/mes", { headers });
      const data = await res.json();
      setMesReservations(data);
    } catch (err) {
      console.error("Erreur fetch réservations :", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleReserver = async (creneauId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/reservations/creneau/${creneauId}`, {
        method: "POST",
        headers,
      });
      if (res.ok) {
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
        method: "DELETE",
        headers,
      });
      if (res.ok) {
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

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h1>
          <span role="img" aria-label="Padel">🎾</span>
          FIELDZ Joueur
        </h1>
        <button className="logout-btn" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>

      {/* Créneaux disponibles */}
      <div>
        <div className="section-title"><span role="img" aria-label="Calendar">📅</span> Créneaux disponibles</div>
        <div className="card-list">
          {creneauxLibres.length === 0 ? (
            <div className="card" style={{ textAlign: "center", color: "#aaa" }}>
              Aucun créneau libre pour le moment.
            </div>
          ) : (
            creneauxLibres.map((c) => (
              <div className="card" key={c.id}>
                <div className="card-title">{c.terrain?.nomTerrain || "Terrain inconnu"}</div>
                <div className="info">
                  <span role="img" aria-label="Calendar">📆</span>
                  {c.date}
                </div>
                <div className="info">
                  <span role="img" aria-label="Clock">⏰</span>
                  {c.heureDebut && c.heureFin ? `${c.heureDebut} – ${c.heureFin}` : ""}
                </div>
                <button className="reserver-btn" onClick={() => handleReserver(c.id)}>
                  Réserver
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mes réservations */}
      <div>
        <div className="section-title"><span role="img" aria-label="Book">📖</span> Mes réservations</div>
        <div className="card-list">
          {mesReservations.length === 0 ? (
            <div className="card" style={{ textAlign: "center", color: "#aaa" }}>
              Aucune réservation enregistrée.
            </div>
          ) : (
            mesReservations.map((r) => (
              <div className="card" key={r.id}>
                <div className="card-title">{r.creneau?.terrain?.nomTerrain || "Terrain"}</div>
                <div className="info">
                  <span role="img" aria-label="Calendar">📆</span>
                  {r.creneau?.date}
                </div>
                <div className="info">
                  <span role="img" aria-label="Clock">⏰</span>
                  {r.creneau?.heureDebut && r.creneau?.heureFin ? `${r.creneau.heureDebut} – ${r.creneau.heureFin}` : ""}
                </div>
                <div className="info" style={{ fontSize: ".94rem", color: "#a3a3a3" }}>
                  <span role="img" aria-label="Ticket">🎟️</span> Réservation #{r.id}
                </div>
                <button className="annuler-btn" onClick={() => handleAnnuler(r.id)}>
                  Annuler
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JoueurDashboard;
