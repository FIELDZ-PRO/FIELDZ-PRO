import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClubService, ClubDto } from "../services/ClubService";
import ReservationModal from "../components/organisms/joueurDashboardDoss/ReservationModal";
import { Creneau } from "../types";
import "./style/ClubDetailsJoueur.css";

const ClubDetailsJoueur: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [club, setClub] = useState<ClubDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [selectedCreneau, setSelectedCreneau] = useState<Creneau | null>(null);

  // Charger les infos du club
  useEffect(() => {
    const fetchClub = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await ClubService.getClubById(parseInt(id));
        setClub(data);
        
        // Initialiser le sport sélectionné avec le premier sport disponible
        if (data.sports && data.sports.length > 0) {
          setSelectedSport(data.sports[0]);
        } else if (data.sport) {
          setSelectedSport(data.sport);
        }
      } catch (err: any) {
        console.error("Erreur chargement club:", err);
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

  // Charger les créneaux pour la date et le sport sélectionnés
  useEffect(() => {
    const fetchCreneaux = async () => {
      if (!id || !selectedDate || !selectedSport) return;
      try {
        const url = `http://localhost:8080/api/creneaux/club/${id}?date=${selectedDate}&sport=${encodeURIComponent(selectedSport)}`;
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();
        setCreneaux(data || []);
      } catch (err: any) {
        console.error("Erreur chargement créneaux:", err);
        setCreneaux([]);
      }
    };
    fetchCreneaux();
  }, [id, selectedDate, selectedSport]);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const getSportEmoji = (sport: string) => {
    const sportLower = sport.toLowerCase();
    const emojis: { [key: string]: string } = {
      'padel': '🎾',
      'tennis': '🎾',
      'foot': '⚽',
      'football': '⚽',
      'foot5': '⚽',
      'basket': '🏀',
      'basketball': '🏀',
      'volley': '🏐',
      'volleyball': '🏐',
    };
    return emojis[sportLower] || '🏅';
  };

  const generateDates = () => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 21; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }
    return dates;
  };

  const handleReserver = (creneau: Creneau) => {
    setSelectedCreneau(creneau);
  };

  const handleReservationSuccess = () => {
    setSelectedCreneau(null);
    // Recharger les créneaux pour mettre à jour la liste
    const url = `http://localhost:8080/api/creneaux/club/${id}?date=${selectedDate}&sport=${encodeURIComponent(selectedSport)}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setCreneaux(data || []))
      .catch(err => console.error("Erreur rechargement:", err));
  };

  if (loading) {
    return (
      <div className="club-details-loading">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="club-details-error">
        <p>Erreur : {error || "Club introuvable"}</p>
        <button onClick={() => navigate(-1)}>Retour</button>
      </div>
    );
  }

  return (
    <div className="club-details-container">
      {/* Header avec retour */}
      <div className="club-details-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Retour
        </button>
        <h1>Réserver chez {club.nom}</h1>
      </div>

      {/* Bannière du club */}
      <div className="club-banner">
        {club.banniereUrl ? (
          <img src={club.banniereUrl} alt={club.nom} />
        ) : (
          <div className="club-banner-placeholder">
            <h2>{club.nom}</h2>
          </div>
        )}
        <div className="club-banner-overlay">
          <h2>{club.nom}</h2>
          <p>📍 {club.adresse}, {club.ville}</p>
        </div>
      </div>

      {/* Informations du club */}
      <div className="club-info-section">
        <div className="club-info-card">
          <h3>Description</h3>
          <p>Bienvenue chez {club.nom}, votre destination pour le sport à {club.ville}.</p>
        </div>

        <div className="club-contact-card">
          <h3>Contact</h3>
          <p>📞 {club.telephone || "Non renseigné"}</p>
          <p>📍 {club.adresse || "Non renseigné"}</p>
        </div>
      </div>

      {/* Sports disponibles avec filtre */}
      {(club.sport || club.sports) && (
        <div className="club-sports">
          <h3>Sports disponibles</h3>
          <div className="sports-filter">
            {club.sports && club.sports.length > 0 ? (
              club.sports.map((sport) => (
                <button
                  key={sport}
                  className={`sport-badge ${selectedSport === sport ? 'active' : ''}`}
                  onClick={() => setSelectedSport(sport)}
                >
                  {getSportEmoji(sport)} {sport}
                </button>
              ))
            ) : club.sport ? (
              <button
                className="sport-badge active"
                onClick={() => setSelectedSport(club.sport)}
              >
                {getSportEmoji(club.sport)} {club.sport}
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Calendrier de dates */}
      <div className="date-selector">
        <h3>Choisir une date</h3>
        <div className="dates-grid">
          {generateDates().map((date) => (
            <button
              key={date}
              className={`date-button ${selectedDate === date ? 'active' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
      </div>

      {/* Créneaux disponibles */}
      <div className="creneaux-section">
        <h3>Créneaux disponibles le {formatDate(selectedDate)}</h3>
        {creneaux.length === 0 ? (
          <div className="no-creneaux">
            <p>Aucun créneau disponible pour cette date.</p>
          </div>
        ) : (
          <div className="creneaux-list">
            {creneaux.map((creneau) => (
              <div key={creneau.id} className="creneau-card">
                <div className="creneau-info">
                  <div className="creneau-icon">🎾</div>
                  <div className="creneau-details">
                    <h4>{creneau.terrain.nom}</h4>
                    
                    <p className="creneau-time">
                      ⏰ {creneau.heureDebut || creneau.dateDebut} - {creneau.heureFin || creneau.dateFin}
                    </p>
              
                    <p className="creneau-sport">
                      {creneau.terrain.sport || "Sport"}
                    </p>
                  </div>
                </div>
                <div className="creneau-action">
                  <p className="creneau-prix">{creneau.prix} DA</p>
                  <button 
                    className="btn-reserver"
                    onClick={() => handleReserver(creneau)}
                  >
                    Réserver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de réservation */}
      {selectedCreneau && (
        <ReservationModal
          creneau={selectedCreneau}
          onClose={() => setSelectedCreneau(null)}
          onReservation={handleReservationSuccess}
        />
      )}
    </div>
  );
};

export default ClubDetailsJoueur;