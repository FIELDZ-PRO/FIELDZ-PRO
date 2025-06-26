import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ClubDashboard = () => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  const [terrain, setTerrain] = useState({ nomTerrain: '', typeSurface: '' });
  const [creneau, setCreneau] = useState({ date: '', heureDebut: '', heureFin: '' });
  const [terrainId, setTerrainId] = useState('');
  const [terrains, setTerrains] = useState([]);
  const [creneauxTerrain, setCreneauxTerrain] = useState([]);
  const [selectedTerrainCreneaux, setSelectedTerrainCreneaux] = useState('');

  // Date du jour par défaut
  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  const [date, setDate] = useState(today);

  const [reservations, setReservations] = useState([]);
  const [showTerrains, setShowTerrains] = useState(false);
  const [showReservations, setShowReservations] = useState(false);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // Charger la liste des terrains du club au démarrage
  useEffect(() => {
    const fetchTerrains = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/club/terrains', { headers });
        const data = await res.json();
        setTerrains(data);
      } catch (err) {
        console.error('Erreur lors du chargement des terrains', err);
      }
    };
    fetchTerrains();
    // Charger les réservations du jour automatiquement au démarrage
    fetchReservations(today);
    // eslint-disable-next-line
  }, []);

  // Fonction pour charger les réservations à une date donnée
  const fetchReservations = async (selectedDate) => {
    try {
      const res = await fetch(`http://localhost:8080/api/reservations/club?date=${selectedDate}`, { headers });
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error('Erreur lors du chargement des réservations', err);
    }
  };

  // Handler pour bouton "voir réservations" (date choisie)
  const handleVoirReservations = async () => {
    fetchReservations(date);
  };

  const handleAjouterTerrain = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/club/terrain', {
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

  const handleProposerCreneau = async () => {
    if (!terrainId) return alert('Veuillez sélectionner un terrain.');

    const res = await fetch(`http://localhost:8080/api/creneaux/terrain/${terrainId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(creneau),
    });

    if (res.ok) {
      alert('✅ Créneau proposé avec succès');
      setCreneau({ date: '', heureDebut: '', heureFin: '' });
      setTerrainId('');
    } else {
      const err = await res.text();
      alert(`❌ Erreur : ${err}`);
    }
  };

  const handleVoirCreneaux = async () => {
    if (!selectedTerrainCreneaux) return alert("Sélectionnez un terrain.");

    try {
      const res = await fetch(`http://localhost:8080/api/club/terrains/${selectedTerrainCreneaux}/creneaux`, { headers });
      const data = await res.json();
      setCreneauxTerrain(data);
    } catch (err) {
      alert("Erreur lors du chargement des créneaux.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="club-container">
      <h1>🎾 Espace Club</h1>

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
              color: '#3B82F6',
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
              📅 {c.date} – ⏰ {c.heureDebut} à {c.heureFin} – Statut : <strong>{c.statut}</strong>
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
        color: '#3B82F6',
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
      {/* Réservations du jour = date aujourd'hui */}
      {reservations.length === 0 ? (
        <div>Aucune réservation pour aujourd'hui.</div>
      ) : (
        reservations.map((r) => (
          <div key={r.id} className="list-card">
            <strong>Créneau #{r.creneau?.id}</strong> – Joueur : {r.joueur?.nom} – {r.dateReservation}
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
      onClick={handleVoirReservations}
      className="btn btn-view"
    >
      🔍 Voir les réservations
    </button>
  </div>
  <div>
    {/* Affiche la liste des réservations pour la date sélectionnée */}
    {reservations.length === 0 ? (
      <div>Aucune réservation pour cette date.</div>
    ) : (
      reservations.map((r) => (
        <div key={r.id} className="list-card">
          <strong>Créneau #{r.creneau?.id}</strong> – Joueur : {r.joueur?.nom} – {r.dateReservation}
        </div>
      ))
    )}
  </div>
</section>


      <div className="text-center mt-8">
        <button onClick={handleLogout} className="btn btn-logout">
          🚪 Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default ClubDashboard;
