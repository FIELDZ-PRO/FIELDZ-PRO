import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ====== AJOUT UTILITAIRES DATES ET HEURES ======
function formatDateFr(isoString) {       // AJOUTÉ
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString('fr-FR');
}
function formatDateTimeFr(isoString) {   // AJOUTÉ
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}
function formatHour(timeString) {        // AJOUTÉ
  if (!timeString) return "";
  const [h, m] = timeString.split(":");
  return `${h}h${m}`;
}

const ClubDashboard = () => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();

const [terrain, setTerrain] = useState({ nomTerrain: '', typeSurface: '', ville: '' });
const [creneau, setCreneau] = useState({ date: '', heureDebut: '', heureFin: '', prix: '' }); // <-- prix ajouté
  const [terrainId, setTerrainId] = useState('');
  const [terrains, setTerrains] = useState([]);
  const [creneauxTerrain, setCreneauxTerrain] = useState([]);
  const [selectedTerrainCreneaux, setSelectedTerrainCreneaux] = useState('');

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  const [reservationsToday, setReservationsToday] = useState([]);
  const [reservationsDate, setReservationsDate] = useState([]);
  const [showTerrains, setShowTerrains] = useState(false);
  const [showReservations, setShowReservations] = useState(false);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchTerrains();
    fetchReservationsToday();
    // eslint-disable-next-line
  }, []);

  // Terrains du club
  const fetchTerrains = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/terrains', { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTerrains(data);
    } catch (err) {
      console.error('Erreur lors du chargement des terrains', err);
    }
  };

  // Réservations du jour
  const fetchReservationsToday = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/reservations/reservations/date?date=${today}`,
        { headers }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setReservationsToday(data);
    } catch (err) {
      console.error('Erreur lors du chargement des réservations du jour', err);
    }
  };

  // Réservations à une date
  const fetchReservationsDate = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/reservations/reservations/date?date=${date}`,
        { headers }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setReservationsDate(data);
    } catch (err) {
      console.error('Erreur lors du chargement des réservations à la date', err);
    }
  };

  // Ajout d'un terrain
  const handleAjouterTerrain = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/terrains', {
        method: 'POST',
        headers,
        body: JSON.stringify(terrain),
      });

      if (!res.ok) {
        const error = await res.text();
        alert("❌ Erreur : " + error);
        return;
      }

      const data = await res.json();
      alert(`✅ Terrain ajouté (ID: ${data.id})`);
      setTerrains((prev) => [...prev, data]);
      setTerrain({ nomTerrain: '', typeSurface: '' });
    } catch (err) {
      alert("Erreur réseau ou serveur.");
    }
  };

  // Proposer un créneau
  const handleProposerCreneau = async () => {
    if (!terrainId) return alert('Veuillez sélectionner un terrain.');

    const res = await fetch(
      `http://localhost:8080/api/creneaux/terrains/${terrainId}/creneaux`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(creneau),
      }
    );

    if (res.ok) {
      alert('✅ Créneau proposé avec succès');
      setCreneau({ date: '', heureDebut: '', heureFin: '' });
      setTerrainId('');
    } else {
      const err = await res.text();
      alert(`❌ Erreur : ${err}`);
    }
  };

  // Voir les créneaux d’un terrain
  const handleVoirCreneaux = async () => {
    if (!selectedTerrainCreneaux) return alert("Sélectionnez un terrain.");

    try {
      const res = await fetch(
        `http://localhost:8080/api/creneaux/terrains/${selectedTerrainCreneaux}/creneaux`,
        { headers }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCreneauxTerrain(data);
    } catch (err) {
      alert("Erreur lors du chargement des créneaux.");
    }
  };

  const handleVoirReservationsDate = () => {
    fetchReservationsDate();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h1>
          <span role="img" aria-label="Padel">🎾</span>
          FIELDZ Club
        </h1>
        <button className="logout-btn" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
      {/* Ajouter un terrain */}
      <section>
        <div className="section-title">🏟️ Ajouter un terrain</div>
        <div className="form-group">
          <input
            className="input-field"
            placeholder="Nom du terrain"
            value={terrain.nomTerrain}
            onChange={(e) => setTerrain({ ...terrain, nomTerrain: e.target.value })}
          />
          <input
            className="input-field"
            placeholder="Type de surface"
            value={terrain.typeSurface}
            onChange={(e) => setTerrain({ ...terrain, typeSurface: e.target.value })}
          />
          <input
  className="input-field"
  placeholder="Ville"
  value={terrain.ville}
  onChange={(e) => setTerrain({ ...terrain, ville: e.target.value })}
/>

          <button
            onClick={handleAjouterTerrain}
            className="btn btn-add"
          >
            ➕ Ajouter le terrain
          </button>
        </div>
      </section>

      {/* Mes terrains déroulable */}
      <section>
        <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
          <button
            onClick={() => setShowTerrains((v) => !v)}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '1.2em',
              cursor: 'pointer',
              color: '#22c55e',
              outline: 'none'
            }}
            aria-label={showTerrains ? "Cacher les terrains" : "Afficher les terrains"}
          >
            {showTerrains ? '▼' : '►'}
          </button>
          <span>🏟️ Mes terrains</span>
        </div>
        {showTerrains && (
          <div>
            {terrains.length === 0 ? (
              <div>Aucun terrain enregistré.</div>
            ) : (
              terrains.map((t) => (
                <div key={t.id} className="list-card">
                  <span role="img" aria-label="terrain">📍</span> <strong>{t.nomTerrain}</strong> – {t.typeSurface}
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Proposer un créneau */}
      <section>
        <div className="section-title">📅 Proposer un créneau</div>
        <div className="form-group">
          <select
            className="input-field"
            value={terrainId}
            onChange={(e) => setTerrainId(e.target.value)}
          >
            <option value="">-- Sélectionner un terrain --</option>
            {terrains.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nomTerrain} ({t.typeSurface})
              </option>
            ))}
          </select>
          <input
            type="date"
            className="input-field"
            value={creneau.date}
            onChange={(e) => setCreneau({ ...creneau, date: e.target.value })}
          />
          <input
            type="time"
            className="input-field"
            value={creneau.heureDebut}
            onChange={(e) => setCreneau({ ...creneau, heureDebut: e.target.value })}
          />
          <input
            type="time"
            className="input-field"
            value={creneau.heureFin}
            onChange={(e) => setCreneau({ ...creneau, heureFin: e.target.value })}
          />
          <input
  type="number"
  className="input-field"
  placeholder="Prix (Da)"
  value={creneau.prix}
  min="0"
  step="0.01"
  onChange={(e) => setCreneau({ ...creneau, prix: e.target.value })}
/>

          <button
            onClick={handleProposerCreneau}
            className="btn btn-creneau"
          >
            📅 Proposer le créneau
          </button>
        </div>
      </section>

      {/* Voir les créneaux d’un terrain */}
      <section>
        <div className="section-title">👀 Voir les créneaux d’un terrain</div>
        <div className="form-group">
          <select
            className="input-field"
            value={selectedTerrainCreneaux}
            onChange={(e) => setSelectedTerrainCreneaux(e.target.value)}
          >
            <option value="">-- Sélectionner un terrain --</option>
            {terrains.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nomTerrain} ({t.typeSurface})
              </option>
            ))}
          </select>
          <button
            onClick={handleVoirCreneaux}
            className="btn btn-view"
          >
            🔍 Voir les créneaux
          </button>
        </div>
        <div>
          {creneauxTerrain.map((c) => (
            <div key={c.id} className="list-card">
  📅 {c.date} – ⏰ {c.heureDebut} à {c.heureFin}
  {" | "}Prix : {c.prix} €
  {" | "}Ville : {c.terrain?.ville}
  {" | "}Statut : <strong>{c.statut}</strong>
</div>
          ))}
        </div>
      </section>

      {/* Réservations du jour déroulantes */}
      <section>
        <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
          <button
            onClick={() => setShowReservations((v) => !v)}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '1.2em',
              cursor: 'pointer',
              color: '#22c55e',
              outline: 'none'
            }}
            aria-label={showReservations ? "Cacher les réservations" : "Afficher les réservations"}
          >
            {showReservations ? '▼' : '►'}
          </button>
          <span>📋 Réservations du jour</span>
        </div>
        {showReservations && (
          <div>
            {reservationsToday.length === 0 ? (
              <div>Aucune réservation pour aujourd'hui.</div>
            ) : (
              reservationsToday.map((r) => (
                <div key={r.id} className="list-card">
  <strong>Créneau #{r.creneau?.id}</strong>
  {/* Ajoute infos du créneau */}
  {r.creneau && (
    <>
      {" – "}
      <span>
        {formatDateFr(r.creneau.date)}
        {" | "}
        {formatHour(r.creneau.heureDebut)}–{formatHour(r.creneau.heureFin)}
        {" | "}
        {r.creneau.terrain?.nomTerrain && <>Terrain : {r.creneau.terrain.nomTerrain}</>}
      </span>
    </>
  )}
  {" – Joueur : "}{r.joueur?.nom || "-"}
  {/* Optionnel : date de réservation */}
  {/* <span style={{ color: "#aaa", fontSize: ".92em" }}> | Réservé le {formatDateTimeFr(r.dateReservation)}</span> */}
</div>

              ))
            )}
          </div>
        )}
      </section>

      {/* Voir les réservations pour une date donnée */}
      <section>
        <div className="section-title">📅 Voir les réservations pour une date donnée</div>
        <div className="form-group">
          <input
            type="date"
            className="input-field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            onClick={handleVoirReservationsDate}
            className="btn btn-view"
          >
            🔍 Voir les réservations
          </button>
        </div>
        <div>
          {reservationsDate.length === 0 ? (
            <div>Aucune réservation pour cette date.</div>
          ) : (
            reservationsDate.map((r) => (
              <div key={r.id} className="list-card">
  <strong>Créneau #{r.creneau?.id}</strong>
  {/* Ajoute infos du créneau */}
  {r.creneau && (
    <>
      {" – "}
      <span>
        {formatDateFr(r.creneau.date)}
        {" | "}
        {formatHour(r.creneau.heureDebut)}–{formatHour(r.creneau.heureFin)}
        {" | "}
        {r.creneau.terrain?.nomTerrain && <>Terrain : {r.creneau.terrain.nomTerrain}</>}
      </span>
    </>
  )}
  {" – Joueur : "}{r.joueur?.nom || "-"}
  {/* Optionnel : date de réservation */}
  {/* <span style={{ color: "#aaa", fontSize: ".92em" }}> | Réservé le {formatDateTimeFr(r.dateReservation)}</span> */}
</div>
            ))
          )}
        </div>
      </section>

    </div>
  );
};

export default ClubDashboard;
