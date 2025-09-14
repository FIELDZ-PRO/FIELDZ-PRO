import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function formatDateHeureFr(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  // Format “18/07/2025 à 14:12”
  return (
    d.toLocaleDateString("fr-FR") +
    " à " +
    d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  );
}

const JoueurDashboard = () => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  const [creneauxLibres, setCreneauxLibres] = useState([]);
  const [mesReservations, setMesReservations] = useState([]);
  const [joueur, setJoueur] = useState(null); // Nouvel état pour le joueur connecté
  const [creneauSelectionne, setCreneauSelectionne] = useState(null);
const [politiqueAcceptée, setPolitiqueAcceptée] = useState(false);


  useEffect(() => {
    fetchCreneauxLibres();
    fetchMesReservations();
    fetchJoueurConnecte();
    // eslint-disable-next-line
    fetchReservationsAnnulees();
  }, []);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // --- Nouveau fetch pour le joueur connecté
  const fetchJoueurConnecte = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/joueur/me", { headers });
      if (res.ok) {
        const data = await res.json();
        setJoueur(data);
      }
    } catch (err) {
      console.error("Erreur fetch joueur :", err);
    }
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
      const res = await fetch(
        `http://localhost:8080/api/reservations/creneau/${creneauId}`,
        {
          method: "POST",
          headers,
        }
      );
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

  const handleConfirmerReservation = async () => {
  const creneauId = creneauSelectionne?.id;
  if (!creneauId) return;

  try {
    const res = await fetch(
      `http://localhost:8080/api/reservations/creneau/${creneauId}`,
      {
        method: "POST",
        headers,
      }
    );
    if (res.ok) {
      fetchCreneauxLibres();
      fetchMesReservations();
      setCreneauSelectionne(null);
      setPolitiqueAcceptée(false);
    } else {
      const err = await res.text();
      alert("❌ Erreur : " + err);
    }
  } catch (err) {
    console.error("Erreur lors de la réservation :", err);
  }
};


  const handleAnnuler = async (reservationId) => {
  const confirmed = window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?");
  if (!confirmed) return;

  const motif = prompt("Motif d'annulation (facultatif)") || "";

  try {
    const res = await fetch(`http://localhost:8080/api/reservations/${reservationId}/annuler`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ motif }),
    });

    if (res.ok) {
      alert("✅ Réservation annulée");
      fetchMesReservations();
      fetchCreneauxLibres(); // pour remettre le créneau comme dispo
    } else {
      const err = await res.text();
      alert("❌ Erreur : " + err);
    }
  } catch (err) {
    console.error("Erreur annulation :", err);
  }
};

const [reservationsAnnulees, setReservationsAnnulees] = useState([]);

const fetchReservationsAnnulees = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/reservations/annulees", { headers });
    const data = await res.json();
    setReservationsAnnulees(data);
  } catch (err) {
    console.error("Erreur fetch annulations :", err);
  }
};

  
  return (
    <div className="dashboard-container">
      {/* Header */}
      <button
  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 ml-4"
  onClick={() => navigate("/profil")}
>
  👤 Mon profil
</button>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <h1>
          <span role="img" aria-label="Padel">
            🎾
          </span>
          FIELDZ Joueur
          {/* Affichage nom/prénom du joueur connecté */}
          <span style={{ fontSize: "1.1em", color: "#1e88e5", marginLeft: 18 }}>
            {joueur
              ? joueur.nom
                ? `| ${joueur.nom} ${joueur.prenom ?? ""}`
                : joueur.email
              : ""}
          </span>
        </h1>
        <button className="logout-btn" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>

      {/* Créneaux disponibles */}
      <div className="card-list">
        {creneauxLibres.length === 0 ? (
          <div className="card" style={{ textAlign: "center", color: "#aaa" }}>
            Aucun créneau libre pour le moment.
          </div>
        ) : (
          creneauxLibres.map((c) => (
            <div className="card" key={c.id}>
              {/* Titre : nom du club */}
              <div
                className="card-title"
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <span style={{ color: "#009e5f", fontWeight: 700 }}>
                  {c.terrain?.club?.nom || "Club inconnu"}
                </span>
                <span
                  style={{
                    fontSize: ".98em",
                    color: "#1e88e5",
                    fontWeight: 500,
                    marginLeft: 8,
                  }}
                >
                  {c.terrain?.ville && <>• {c.terrain.ville}</>}
                </span>
              </div>

              {/* Jour et Horaire */}
              <div className="info">
                <span role="img" aria-label="Calendar">
                  📆
                </span>
                {c.date}
              </div>
              <div className="info">
                <span role="img" aria-label="Clock">
                  ⏰
                </span>
                {c.heureDebut && c.heureFin
                  ? `${c.heureDebut} – ${c.heureFin}`
                  : ""}
              </div>

              {/* Nom du terrain et surface */}
              <div
                className="info"
                style={{ color: "#15803d", fontSize: "1rem", fontWeight: 400 }}
              >
                {c.terrain?.nomTerrain || "Terrain inconnu"}
                {c.terrain?.typeSurface && <> • {c.terrain.typeSurface}</>}
                {c.terrain?.taille ? c.terrain.taille : " • Taille non renseignée"}
              </div>

              {/* Prix */}
              <div
                className="info"
                style={{ color: "#15803d", fontSize: "1rem", fontWeight: 400 }}
              >
                <span role="img" aria-label="Money">
                  💶
                </span>
                {c.prix != null ? `${c.prix} Da` : "Prix non renseigné"}
              </div>

              {/* Bouton Réserver */}
              <button
                className="reserver-btn"
                onClick={() => setCreneauSelectionne(c)}

              >
                Réserver
              </button>
            </div>
          ))
        )}
      </div>

      {/* Mes réservations */}
      <div>
        <div className="section-title">
          <span role="img" aria-label="Book">
            📖
          </span>{" "}
          Mes réservations
        </div>
        <div className="card-list">
          {mesReservations.length === 0 ? (
            <div className="card" style={{ textAlign: "center", color: "#aaa" }}>
              Aucune réservation enregistrée.
            </div>
          ) : (
            mesReservations.map((r) => (
              <div className="card" key={r.id}>
                {/* Titre : nom du club */}
                <div
                  className="card-title"
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <span style={{ color: "#009e5f", fontWeight: 700 }}>
                    {r.creneau?.terrain?.club?.nom || "Club inconnu"}
                  </span>
                  <span
                    style={{
                      fontSize: ".98em",
                      color: "#1e88e5",
                      fontWeight: 500,
                      marginLeft: 8,
                    }}
                  >
                    {r.creneau?.terrain?.ville && <>• {r.creneau.terrain.ville}</>}
                  </span>
                </div>

                {/* Jour et Horaire */}
                <div className="info">
                  <span role="img" aria-label="Calendar">
                    📆
                  </span>
                  {r.creneau?.date}
                </div>
                <div className="info">
                  <span role="img" aria-label="Clock">
                    ⏰
                  </span>
                  {r.creneau?.heureDebut && r.creneau?.heureFin
                    ? `${r.creneau.heureDebut} – ${r.creneau.heureFin}`
                    : ""}
                </div>

                {/* Nom du terrain et surface */}
                <div
                  className="info"
                  style={{ color: "#15803d", fontSize: "1rem", fontWeight: 400 }}
                >
                  {r.creneau?.terrain?.nomTerrain || "Terrain inconnu"}
                  {r.creneau?.terrain?.typeSurface && <> • {r.creneau.terrain.typeSurface}</>}
                  {r.creneau?.terrain?.taille
                    ? r.creneau.terrain.taille
                    : " • Taille non renseignée"}
                </div>

                {/* Prix */}
                <div
                  className="info"
                  style={{ color: "#15803d", fontSize: "1rem", fontWeight: 400 }}
                >
                  <span role="img" aria-label="Money">
                    💶
                  </span>
                  {r.creneau?.prix != null
                    ? `${r.creneau.prix} Da`
                    : "Prix non renseigné"}
                </div>

                {/* Date de réservation */}
                <div
                  className="info"
                  style={{ fontSize: ".96rem", color: "#d50000" }}
                >
                  <span role="img" aria-label="Ticket">
                    🎟️
                  </span>
                  {`Réservé le ${formatDateHeureFr(r.dateReservation)}`}
                </div>

                {/* Bouton Annuler */}
                <button className="annuler-btn" onClick={() => handleAnnuler(r.id)}>
                  Annuler
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <div>
  <div className="section-title">
    <span role="img" aria-label="Cancel">❌</span>{" "}
    Réservations annulées
  </div>
  <div className="card-list">
    {reservationsAnnulees.length === 0 ? (
      <div className="card" style={{ textAlign: "center", color: "#aaa" }}>
        Aucune annulation enregistrée.
      </div>
    ) : (
      reservationsAnnulees.map((r) => (
        <div className="card" key={r.id}>
          <div className="card-title">
            {r.creneau?.terrain?.club?.nom || "Club inconnu"} – {r.creneau?.terrain?.nomTerrain}
          </div>
          <div className="info">📆 {r.creneau?.date}</div>
          <div className="info">⏰ {r.creneau?.heureDebut} – {r.creneau?.heureFin}</div>
          <div className="info">💶 {r.creneau?.prix} Da</div>
          <div className="info">🗓️ Annulée le {formatDateHeureFr(r.dateAnnulation)}</div>
          {r.motifAnnulation && (
            <div className="info">📝 Motif : {r.motifAnnulation}</div>
          )}
        </div>
      ))
    )}
  </div>
</div>
{creneauSelectionne && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Politique du club</h2>
      <p>{creneauSelectionne.terrain?.politiqueClub || "Aucune politique définie."}</p>

      <label style={{ marginTop: "1rem", display: "block" }}>
        <input
          type="checkbox"
          checked={politiqueAcceptée}
          onChange={(e) => setPolitiqueAcceptée(e.target.checked)}
        />
        {" "}J’ai lu et j’accepte la politique du club
      </label>

      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => handleConfirmerReservation()}
          disabled={!politiqueAcceptée}
          className={politiqueAcceptée ? "reserver-btn" : "btn-disabled"}
        >
          Confirmer la réservation
        </button>
        <button
          onClick={() => {
            setCreneauSelectionne(null);
            setPolitiqueAcceptée(false);
          }}
          className="annuler-btn"
          style={{ marginLeft: "1rem" }}
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default JoueurDashboard;
