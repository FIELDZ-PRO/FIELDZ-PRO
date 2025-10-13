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

const [terrain, setTerrain] = useState({   nomTerrain: "",
  typeSurface: "",
  ville: "",
  sport: "",
  politiqueClub: ""  });
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

  const [showActives, setShowActives] = useState(false);
const [showAnnuleesClub, setShowAnnuleesClub] = useState(false);
const [showAnnuleesJoueur, setShowAnnuleesJoueur] = useState(false);
const [showConfirmees, setShowConfirmees] = useState(false);



  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
  fetchTerrains();
  fetchReservationsToday();
  fetchClubConnecte(); // <--- ajoute ceci
  // eslint-disable-next-line
}, []);


const [club, setClub] = useState(null);

const fetchClubConnecte = async () => {
  try {
    const res = await fetch('http://localhost:8080/api/club/me', { headers });
    if (res.ok) {
      const data = await res.json();
      setClub(data);
    }
  } catch (err) {
    console.error("Erreur fetch club :", err);
  }
};


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
      setTerrain({ nomTerrain: '', typeSurface: '',   sport: '', politiqueClub: '', });
    } catch (err) {
      alert("Erreur réseau ou serveur.");
    }
  };

  // Proposer un créneau
  const handleProposerCreneau = async () => {
  if (!terrainId) return alert('Veuillez sélectionner un terrain.');

  const { date, heureDebut, heureFin, prix } = creneau;

  if (!date || !heureDebut || !heureFin)
    return alert("Veuillez remplir tous les champs du créneau");

  // ✅ SOLUTION : Forcer le format sans timezone
  const dateDebut = `${date}T${heureDebut}:00`;  // Format: "2025-10-15T14:00:00"
  const dateFin = `${date}T${heureFin}:00`;
  const body = {
    dateDebut,
    dateFin,
    prix: prix ? parseFloat(prix) : 0,
    terrainId: parseInt(terrainId) // assure-toi que ton backend attend bien ça
  };

  try {
    const res = await fetch(`http://localhost:8080/api/creneaux/terrains/${terrainId}/creneaux`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch (err) {
      alert("❌ Réponse illisible du serveur.");
      return;
    }

    if (res.ok) {
      alert("✅ Créneau ajouté avec succès !");
      // Réinitialisation du formulaire
      setCreneau({ date: '', heureDebut: '', heureFin: '', prix: '' });
    } else {
      alert(`❌ Erreur : ${data.message || "Erreur lors de l'ajout du créneau."}`);
    }

  } catch (err) {
    alert("❌ Erreur réseau ou serveur : " + err.message);
    console.error(err);
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

  const handleAnnulerCreneau = async (creneauId) => {
  if (!window.confirm("Confirmer l’annulation de ce créneau ?")) return;

  try {
    const res = await fetch(`http://localhost:8080/api/creneaux/${creneauId}/annuler`, {
      method: "PUT",
      headers,
    });

    if (!res.ok) {
      const err = await res.text();
      alert("❌ Erreur : " + err);
      return;
    }

    alert("✅ Créneau annulé avec succès !");
    handleVoirCreneaux(); // refresh la liste des créneaux
  } catch (err) {
    alert("Erreur réseau ou serveur.");
    console.error(err);
  }
};


  const handleLogout = () => {
    logout();
    navigate('/');
  };
// 🎯 Séparation des réservations du jour
const reservationsActives = reservationsToday.filter(r => r.statut === "RESERVE");
const reservationsAnnulees = reservationsToday.filter(r => r.statut !== "RESERVE");
const annuleesParClub = reservationsAnnulees.filter(r => r.statut === "ANNULE_PAR_CLUB");
const annuleesParJoueur = reservationsAnnulees.filter(r => r.statut === "ANNULE_PAR_JOUEUR");
const reservationsConfirmees = reservationsToday.filter(r => r.statut === "CONFIRMEE");


const [recurrent, setRecurrent] = useState({
  jourDeSemaine: '',
  heureDebut: '',
  dureeMinutes: '',
  dateDebut: '',
  dateFin: '',
  prix: '',
});

const handleProposerCreneauxRecurrents = async () => {
  if (!terrainId) return alert('Veuillez sélectionner un terrain.');
  const {
    jourDeSemaine, heureDebut, dureeMinutes,
    dateDebut, dateFin, prix
  } = recurrent;

  if (!jourDeSemaine || !heureDebut || !dureeMinutes || !dateDebut || !dateFin)
    return alert("Veuillez remplir tous les champs.");

  const body = {
    jourDeSemaine,
    heureDebut,
    dureeMinutes: parseInt(dureeMinutes),
    dateDebut,
    dateFin,
    prix: parseFloat(prix),
    terrainId: parseInt(terrainId),
  };

  try {
    const res = await fetch("http://localhost:8080/api/creneaux/recurrent", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch (err) {
      alert("❌ Erreur : réponse du serveur invalide.");
      return;
    }

    const total = data.totalDemandes || 0;
    const crees = data.totalCrees || 0;
    const existants = data.dejaExistants || 0;
    const message = data.message || "Aucun message fourni.";

    const recap = `📅 Demandés : ${total}\n✅ Créés : ${crees}\n❗ Déjà existants : ${existants}`;

    if (crees > 0) {
      alert(`✅ Succès : ${message}\n\n${recap}`);
    } else if (existants > 0) {
      alert(`ℹ️ Info : ${message}\n\n${recap}`);
    } else {
      alert(`⚠️ Aucun créneau créé.\n\n${recap}`);
    }

    // Reset du formulaire
    setRecurrent({
      jourDeSemaine: '',
      heureDebut: '',
      dureeMinutes: '',
      dateDebut: '',
      dateFin: '',
      prix: '',
    });

  } catch (err) {
    alert("❌ Erreur réseau ou serveur : " + err.message);
    console.error(err);
  }
};

const handleConfirmerPresence = async (reservationId) => {
  if (!window.confirm("Confirmer la présence du joueur pour ce créneau ?")) return;

  try {
    const res = await fetch(`http://localhost:8080/api/reservations/${reservationId}/confirmer`, {
      method: "PATCH",
      headers,
    });

    if (!res.ok) {
      const err = await res.text();
      alert("❌ Erreur : " + err);
      return;
    }

    alert("✅ Présence confirmée !");
    fetchReservationsToday(); // 🔁 recharge la liste
  } catch (err) {
    alert("❌ Erreur réseau.");
    console.error(err);
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
  <h1>
    <span role="img" aria-label="Padel">🎾</span>
    FIELDZ Club
    {/* Affichage du nom du club connecté */}
    <span style={{ fontSize: "1.1em", color: "#1e88e5", marginLeft: 18 }}>
      {club && club.nom ? `| ${club.nom}` : ""}
    </span>
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
<textarea
      className="input-field"
      placeholder="Politique du club (facultatif)"
      rows={4}
      value={terrain.politiqueClub}
      onChange={(e) => setTerrain({ ...terrain, politiqueClub: e.target.value })}
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
<section>
  <div className="section-title">♻️ Créer des créneaux récurrents</div>
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

    <select
      className="input-field"
      value={recurrent.jourDeSemaine}
      onChange={(e) => setRecurrent({ ...recurrent, jourDeSemaine: e.target.value })}
    >
      <option value="">-- Jour de la semaine --</option>
      {[
  { label: "Lundi", value: "MONDAY" },
  { label: "Mardi", value: "TUESDAY" },
  { label: "Mercredi", value: "WEDNESDAY" },
  { label: "Jeudi", value: "THURSDAY" },
  { label: "Vendredi", value: "FRIDAY" },
  { label: "Samedi", value: "SATURDAY" },
  { label: "Dimanche", value: "SUNDAY" },
].map(j => (
  <option key={j.value} value={j.value}>{j.label}</option>
))}

    </select>

    <input
      type="time"
      className="input-field"
      value={recurrent.heureDebut}
      onChange={(e) => setRecurrent({ ...recurrent, heureDebut: e.target.value })}
    />
    <input
      type="number"
      className="input-field"
      placeholder="Durée (en minutes)"
      min="15"
      step="15"
      value={recurrent.dureeMinutes}
      onChange={(e) => setRecurrent({ ...recurrent, dureeMinutes: e.target.value })}
    />
    <input
      type="date"
      className="input-field"
      placeholder="Date de début"
      value={recurrent.dateDebut}
      onChange={(e) => setRecurrent({ ...recurrent, dateDebut: e.target.value })}
    />
    <input
      type="date"
      className="input-field"
      placeholder="Date de fin"
      value={recurrent.dateFin}
      onChange={(e) => setRecurrent({ ...recurrent, dateFin: e.target.value })}
    />
    <input
      type="number"
      className="input-field"
      placeholder="Prix (Da)"
      value={recurrent.prix}
      min="0"
      step="0.01"
      onChange={(e) => setRecurrent({ ...recurrent, prix: e.target.value })}
    />
    <button
      className="btn btn-creneau"
      onClick={handleProposerCreneauxRecurrents}
    >
      ♻️ Générer les créneaux
    </button>
  </div>
</section>


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

  {c.statut !== 'ANNULE' && (
      <button
        className="bg-red-500 text-white px-2 py-1 ml-4 rounded hover:bg-red-600"
        onClick={() => handleAnnulerCreneau(c.id)}
      >
        ❌ Annuler ce créneau
      </button>
    )}

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

{/* Réservations actives */}
<div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
  <button
    onClick={() => setShowActives((v) => !v)}
    style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2em', color: '#10b981' }}
  >
    {showActives ? '▼' : '►'}
  </button>
  <h6 className="text-green-600 font-semibold mb-1">✔️ Réservations actives</h6>
</div>
{showActives && (
  reservationsActives.length === 0 ? (
    <div>Aucune réservation active.</div>
  ) : (
    reservationsActives.map((r) => (
      <div key={r.id} className="list-card bg-green-100 opacity-80">
  <strong>Créneau #{r.creneau?.id}</strong>
  {" – "}{formatDateFr(r.creneau.date)} | {formatHour(r.creneau.heureDebut)}–{formatHour(r.creneau.heureFin)}
  {" – Joueur : "}{r.joueur?.nom || "-"}

  <button
    className="ml-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
    onClick={() => handleConfirmerPresence(r.id)}
  >
    ✅ Confirmer
  </button>
</div>

    ))
  )
)}

{/* Réservations confirmées */}
<div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
  <button
    onClick={() => setShowConfirmees((v) => !v)}
    style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2em', color: '#2563eb' }}
  >
    {showConfirmees ? '▼' : '►'}
  </button>
  <h6 className="text-blue-700 font-semibold mb-1">✅ Confirmées</h6>
</div>
{showConfirmees && (
  reservationsConfirmees.length === 0 ? (
    <div>Aucune réservation confirmée.</div>
  ) : (
    reservationsConfirmees.map((r) => (
      <div key={r.id} className="list-card bg-blue-100 opacity-80">
        <strong>Créneau #{r.creneau?.id}</strong>
        {" – "}{formatDateFr(r.creneau.date)} | {formatHour(r.creneau.heureDebut)}–{formatHour(r.creneau.heureFin)}
        {" – Joueur : "}{r.joueur?.nom || "-"}
      </div>
    ))
  )
)}


{/* Réservations annulées par le club */}
<div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
  <button
    onClick={() => setShowAnnuleesClub((v) => !v)}
    style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2em', color: '#ef4444' }}
  >
    {showAnnuleesClub ? '▼' : '►'}
  </button>
  <h6 className="text-red-700 font-semibold mb-1">🏢 Annulées par le club</h6>
</div>
{showAnnuleesClub && (
  annuleesParClub.length === 0 ? (
    <div>Aucune annulation du club.</div>
  ) : (
    annuleesParClub.map((r) => (
      <div key={r.id} className="list-card bg-red-100 opacity-80">
        <strong>Créneau #{r.creneau?.id}</strong>
        {" – "}{formatDateFr(r.creneau.date)} | {formatHour(r.creneau.heureDebut)}–{formatHour(r.creneau.heureFin)}
      </div>
    ))
  )
)}




{/* Réservations annulées par le joueur */}
<div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
  <button
    onClick={() => setShowAnnuleesJoueur((v) => !v)}
    style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2em', color: '#f97316' }}
  >
    {showAnnuleesJoueur ? '▼' : '►'}
  </button>
  <h6 className="text-orange-600 font-semibold mb-1">🙋 Annulées par le joueur</h6>
</div>
{showAnnuleesJoueur && (
  annuleesParJoueur.length === 0 ? (
    <div>Aucune annulation de joueur.</div>
  ) : (
    annuleesParJoueur.map((r) => (
      <div key={r.id} className="list-card bg-orange-100 opacity-80">
        <strong>Créneau #{r.creneau?.id}</strong>
        {" – "}{formatDateFr(r.creneau.date)} | {formatHour(r.creneau.heureDebut)}–{formatHour(r.creneau.heureFin)}
      </div>
    ))
  )
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
