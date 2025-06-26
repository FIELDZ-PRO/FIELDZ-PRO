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
  const [reservations, setReservations] = useState([]);
  const [date, setDate] = useState('');
  const [creneauxTerrain, setCreneauxTerrain] = useState([]);
const [selectedTerrainCreneaux, setSelectedTerrainCreneaux] = useState('');


  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 🔁 Charger la liste des terrains du club
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
  }, []);


const handleAjouterTerrain = async () => {
  try {
    const res = await fetch('http://localhost:8080/api/club/terrain', {
      method: 'POST',
      headers,
      body: JSON.stringify(terrain),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("❌ Erreur ajout terrain :", error);
      alert("❌ Erreur : " + error);
      return;
    }

    const data = await res.json();
    console.log("✅ Terrain ajouté :", data);
    alert(`✅ Terrain ajouté (ID: ${data.id})`);

    setTerrains((prev) => [...prev, data]);
    setTerrain({ nomTerrain: '', typeSurface: '' });
  } catch (err) {
    console.error("❌ Erreur réseau :", err);
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

  const handleVoirReservations = async () => {
    const res = await fetch(`http://localhost:8080/api/reservations/club?date=${date}`, {
      headers,
    });
    const data = await res.json();
    setReservations(data);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const handleVoirCreneaux = async () => {
  if (!selectedTerrainCreneaux) return alert("Sélectionnez un terrain.");

  try {
    const res = await fetch(`http://localhost:8080/api/club/terrains/${selectedTerrainCreneaux}/creneaux`, {
      headers,
    });
    const data = await res.json();
    setCreneauxTerrain(data);
  } catch (err) {
    console.error("Erreur lors du chargement des créneaux :", err);
  }
};


  return (
    <div className="p-8 max-w-3xl mx-auto space-y-12">
      <h1 className="text-3xl font-bold text-center">🎾 Espace Club</h1>

      {/* Ajouter un terrain */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Ajouter un terrain</h2>
        <div className="flex flex-col gap-3">
          <input
            className="border p-2"
            placeholder="Nom du terrain"
            value={terrain.nomTerrain}
            onChange={(e) => setTerrain({ ...terrain, nomTerrain: e.target.value })}
          />
          <input
            className="border p-2"
            placeholder="Type de surface"
            value={terrain.typeSurface}
            onChange={(e) => setTerrain({ ...terrain, typeSurface: e.target.value })}
          />
          <button
            onClick={handleAjouterTerrain}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            ➕ Ajouter le terrain
          </button>
        </div>
      </section>
      

      {/* Proposer un créneau */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Proposer un créneau</h2>
        <div className="flex flex-col gap-3">
          <select
            className="border p-2"
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
            className="border p-2"
            value={creneau.date}
            onChange={(e) => setCreneau({ ...creneau, date: e.target.value })}
          />
          <input
            type="time"
            className="border p-2"
            value={creneau.heureDebut}
            onChange={(e) => setCreneau({ ...creneau, heureDebut: e.target.value })}
          />
          <input
            type="time"
            className="border p-2"
            value={creneau.heureFin}
            onChange={(e) => setCreneau({ ...creneau, heureFin: e.target.value })}
          />
          <button
            onClick={handleProposerCreneau}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            📅 Proposer le créneau
          </button>
        </div>
      </section>
<section>
  <h2 className="text-xl font-semibold mb-4">Voir les créneaux d’un terrain</h2>
  <div className="flex gap-3 mb-4">
    <select
      className="border p-2"
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
      className="bg-indigo-600 text-white px-4 py-2 rounded"
    >
      🔍 Voir les créneaux
    </button>
  </div>

  <ul className="space-y-2">
    {creneauxTerrain.map((c) => (
      <li key={c.id} className="border p-3 rounded">
        📅 {c.date} – ⏰ {c.heureDebut} à {c.heureFin} – Statut : <strong>{c.statut}</strong>
      </li>
    ))}
  </ul>
</section>

      {/* Voir les réservations */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Voir les réservations d’un jour</h2>
        <div className="flex gap-3 items-center mb-4">
          <input
            type="date"
            className="border p-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            onClick={handleVoirReservations}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            🔍 Voir les réservations
          </button>
        </div>
        <ul className="space-y-2">
          {reservations.map((r) => (
            <li key={r.id} className="border p-3 rounded">
              <strong>Créneau #{r.creneau?.id}</strong> – Joueur : {r.joueur?.nom} –{' '}
              {r.dateReservation}
            </li>
          ))}
        </ul>
      </section>

      {/* Déconnexion */}
      <div className="text-center mt-8">
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          🚪 Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default ClubDashboard;
