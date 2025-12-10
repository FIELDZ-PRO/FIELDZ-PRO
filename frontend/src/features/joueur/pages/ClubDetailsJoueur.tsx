// src/pages/ClubDetailsJoueur.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ClubService, ClubDto, getCreneauxByClubDateSport } from "../../../shared/services/ClubService";
import ReservationModal from "../components/organisms/joueurDashboardDoss/ReservationModal";
import { Creneau } from "../../../shared/types";
import { Spinner } from "../../../shared/components/atoms";
import "./style/ClubDetailsJoueur.css";
import { ChevronLeft, ChevronRight, MapPin, Phone, Info, Clock, ExternalLink, MoreVertical, X, HomeIcon } from "lucide-react";

// ✅ Helpers pour parser/formatter en LOCAL (sans décalage)
import {
  parseYMDLocal,
  parseLocalDateTime,
  formatShortDate,
} from "../../../utils/datetime";

const ClubDetailsJoueur: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer les filtres de recherche passés depuis le dashboard
  const returnFilters = (location.state as any)?.returnFilters;

  const [club, setClub] = useState<ClubDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ On génère "YYYY-MM-DD" à la main (pas de toISOString qui bascule en UTC)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const t = new Date();
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, "0");
    const d = String(t.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  });

  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>(""); // "" = tous
  const [allCreneaux, setAllCreneaux] = useState<Creneau[]>([]); // Tous les créneaux
  const [selectedCreneau, setSelectedCreneau] = useState<Creneau | null>(null);

  // État pour la modal "À propos"
  const [showAboutModal, setShowAboutModal] = useState(false);

  // État pour le carousel d'images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ────────────────────────────────────────────────────────────────────────────────
  // Chargement des infos club
  // ────────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchClub = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await ClubService.getClubById(parseInt(id, 10));
        setClub(data);

        // Initialise avec "Tous les sports" (vide) pour montrer tous les créneaux
        // L'utilisateur pourra cliquer sur un sport spécifique s'il le souhaite
      } catch (err: any) {
        console.error("Erreur chargement club:", err);
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

  // ────────────────────────────────────────────────────────────────────────────────
  // Chargement des créneaux du club
  // ────────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCreneaux = async () => {
      if (!id || !selectedDate) return;
      try {
        // Récupère tous les créneaux (sans filtre de sport)
        const data = await getCreneauxByClubDateSport(
          parseInt(id, 10),
          selectedDate,
          undefined // On récupère tous les sports
        );
        setAllCreneaux(data);
      } catch (err: any) {
        console.error("Erreur chargement créneaux:", err);
        setAllCreneaux([]);
      }
    };
    fetchCreneaux();
  }, [id, selectedDate]); // Retire selectedSport des dépendances

  // ────────────────────────────────────────────────────────────────────────────────
  // Helper: Détermine la période de la journée pour un créneau
  // ────────────────────────────────────────────────────────────────────────────────
  const getTimePeriod = (dateDebut: string): string => {
    const date = new Date(dateDebut);
    const hours = date.getHours();

    if (hours >= 0 && hours < 11) return "matin";
    if (hours >= 11 && hours < 14) return "midi";
    if (hours >= 14 && hours < 17) return "après-midi";
    return "soir"; // 17:00 to 23:59
  };

  // ────────────────────────────────────────────────────────────────────────────────
  // Filtre les créneaux selon le sport et la période sélectionnés
  // ────────────────────────────────────────────────────────────────────────────────
  const creneaux = useMemo(() => {
    let filtered = allCreneaux;

    // Filtre par sport du terrain
    if (selectedSport) {
      filtered = filtered.filter((creneau) => {
        const terrainSport = (creneau.terrain as any)?.sport;
        return terrainSport?.toUpperCase() === selectedSport.toUpperCase();
      });
    }

    // Filtre par période de la journée
    if (selectedTimePeriod) {
      filtered = filtered.filter((creneau) => {
        return getTimePeriod(creneau.dateDebut) === selectedTimePeriod;
      });
    }

    return filtered;
  }, [allCreneaux, selectedSport, selectedTimePeriod]);

  // ────────────────────────────────────────────────────────────────────────────────
  // Helpers d'affichage
  // ────────────────────────────────────────────────────────────────────────────────
  const formatDate = (ymd: string) => {
    const d = parseYMDLocal(ymd); // évite le bug Date("YYYY-MM-DD") en UTC
    return formatShortDate(d);
  };

  const getSportEmoji = (sport: string) => {
    const s = (sport || "").toLowerCase();
    const emojis: Record<string, string> = {
      padel: "🎾",
      tennis: "🎾",
      foot: "⚽",
      football: "⚽",
      foot5: "⚽",
      basket: "🏀",
      basketball: "🏀",
      volley: "🏐",
      volleyball: "🏐",
      handball: "🤾",
    };
    return emojis[s] || "🏅";
  };

  // Fonctions de navigation du carousel
  const nextImage = () => {
    if (club?.images && club.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % club.images.length);
    }
  };

  const previousImage = () => {
    if (club?.images && club.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + club.images.length) % club.images.length);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Nom de terrain robuste (selon que l’API renvoie nom/nomTerrain)
  const getTerrainName = (cr: Creneau) =>
    (cr.terrain as any)?.nomTerrain || (cr.terrain as any)?.nom || "Terrain";

  // Label durée du créneau (ex: "1H 30 mins" or "2H")
  const renderCreneauTime = (cr: Creneau) => {
    // Cas API "nouvelle" : dateDebut/dateFin
    if (cr.dateDebut && cr.dateFin) {
      const debut = parseLocalDateTime(cr.dateDebut);
      const fin = parseLocalDateTime(cr.dateFin);

      // Calculate duration in milliseconds
      const durationMs = fin.getTime() - debut.getTime();

      // Convert to hours and minutes
      const totalMinutes = Math.floor(durationMs / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      // Format duration
      if (minutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${minutes} mins`;
      }
    }

    // Cas API "ancienne" : heureDebut/heureFin (fallback - format as time range)
    if (cr.heureDebut && cr.heureFin) {
      // Try to parse as time strings (e.g., "12:00" - "13:30")
      const [startHour, startMin] = cr.heureDebut.split(':').map(Number);
      const [endHour, endMin] = cr.heureFin.split(':').map(Number);

      if (!isNaN(startHour) && !isNaN(endHour)) {
        const totalMinutes = (endHour * 60 + (endMin || 0)) - (startHour * 60 + (startMin || 0));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (minutes === 0) {
          return `${hours}H`;
        } else {
          return `${hours}H ${minutes} mins`;
        }
      }

      return `${cr.heureDebut} - ${cr.heureFin}`;
    }

    // Fallback
    return "Durée non disponible";
  };

  // Format full date for card title (e.g., "Dimanche 14 décembre à 12h - Terrain 1")
  const renderFullDateWithTime = (cr: Creneau) => {
    if (cr.dateDebut) {
      const date = parseLocalDateTime(cr.dateDebut);
      const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      const dayName = days[date.getDay()];
      const day = date.getDate();
      const monthName = months[date.getMonth()];
      const hour = `${date.getHours()}h`;
      const terrainName = getTerrainName(cr);
      return `${dayName} ${day} ${monthName} à ${hour} - ${terrainName}`;
    }
    return "Date non disponible";
  };

  const generateDates = () => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 21; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      dates.push(`${y}-${m}-${d}`);
    }
    return dates;
  };

  const handleReserver = (creneau: Creneau) => setSelectedCreneau(creneau);

  const handleReservationSuccess = async () => {
    setSelectedCreneau(null);
    // refresh des créneaux (tous les sports)
    if (!id) return;
    try {
      const data = await getCreneauxByClubDateSport(
        parseInt(id, 10),
        selectedDate,
        undefined // Récupère tous les sports
      );
      setAllCreneaux(data || []);
    } catch (err) {
      console.error("Erreur rechargement:", err);
    }
  };

  // Fonction pour retourner au dashboard avec les filtres sauvegardés
  const handleGoBack = () => {
    if (returnFilters) {
      navigate('/joueur', {
        state: {
          searchFilters: returnFilters
        }
      });
    } else {
      navigate(-1);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────────
  // Renders
  // ────────────────────────────────────────────────────────────────────────────────
  if (loading) {
    return <Spinner loading={loading} text="Chargement du club..." fullScreen />;
  }

  if (error || !club) {
    return (
      <div className="club-details-error">
        <div className="error-icon">⚠️</div>
        <h2>Oups !</h2>
        <p>{error || "Club introuvable"}</p>
        <button className="btn-primary" onClick={handleGoBack}>
          Retour à la recherche
        </button>
      </div>
    );
  }
  console.log(creneaux)
  console.log(club)
  return (
    <div className="club-details-container">
      <div className="club-details-header">
        <button className="back-button" onClick={handleGoBack}>
          ← Retour
        </button>
        <h1>{club.nom}</h1>
        <button className="about-button" onClick={() => setShowAboutModal(true)}>
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Bannière */}
      <div className="club-banner">
        {club.images && club.images.length > 0 ? (
          <>
            <img src={club.images[currentImageIndex].imageUrl} alt={club.nom} />

            {/* Navigation arrows - afficher seulement s'il y a plus d'une image */}
            {club.images.length > 1 && (
              <>
                <button className="carousel-btn carousel-btn-prev" onClick={previousImage}>
                  <ChevronLeft size={32} />
                </button>
                <button className="carousel-btn carousel-btn-next" onClick={nextImage}>
                  <ChevronRight size={32} />
                </button>

                {/* Indicateurs de position */}
                <div className="carousel-indicators">
                  {club.images.map((_, index) => (
                    <button
                      key={index}
                      className={`carousel-indicator ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => goToImage(index)}
                      aria-label={`Image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="club-banner-placeholder">
            <h2>{club.nom}</h2>
          </div>
        )}
        <div className="club-banner-overlay">
          <p>
            <MapPin className="inline-icon" />
            {club.adresse}, {club.ville}
          </p>
        </div>
      </div>

      {/* Informations */}
      <div className="club-info-section">
        <div className="info-card contact-card">
          <div className="info-card-header">
            <Info className="card-icon" />
            <h3>Informations</h3>
          </div>
          <div className="info-card-content">
            <div className="contact-item">
              <Phone className="contact-icon" />
              <span>{club.telephone || "Non renseigné"}</span>
            </div>
            { !club.locationLink && (
            <div className="contact-item">
              <MapPin className="contact-icon" />
              <span>{club.adresse || "Non renseigné"}</span>
            </div>
            )}

            {club.locationLink && (
              <div className="contact-item">
                <MapPin className="contact-icon" />
                <a
                  href={club.locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="location-link"
                >
                  {club.adresse}
                </a>
              </div>
            )}
            <div className="contact-item">
              <HomeIcon className="contact-icon" />
              <span>Académie : Non renseigné</span>
            </div>
            <div className="contact-item">
              <Clock className="contact-icon" />
              <span>
                Horaires : {club.heureOuverture ? `${parseInt(club.heureOuverture.split(':')[0])}h` : ''}
                {club.heureOuverture && club.heureFermeture ? ' - ' : ''}
                {club.heureFermeture ? `${parseInt(club.heureFermeture.split(':')[0])}h` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sports */}
      {(club.sport || club.sports) && (
        <div className="club-sports">
          <h3>Filtrer par sport</h3>
          <div className="sports-filter">
            {/* Bouton "Tous les sports" */}
            <button
              className={`sport-badge ${!selectedSport ? "active" : ""}`}
              onClick={() => setSelectedSport("")}
            >
              🏆 Tous les sports
            </button>

            {/* Liste des sports disponibles */}
            {club.sports && club.sports.length > 0 ? (
              club.sports.map((sport) => (
                <button
                  key={sport}
                  className={`sport-badge ${selectedSport === sport ? "active" : ""}`}
                  onClick={() => setSelectedSport(sport)}
                >
                  {getSportEmoji(sport)} {sport}
                </button>
              ))
            ) : club.sport ? (
              <button
                className={`sport-badge ${selectedSport === club.sport ? "active" : ""}`}
                onClick={() => setSelectedSport(club.sport!)}
              >
                {getSportEmoji(club.sport)} {club.sport}
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Dates */}
      <div className="date-selector">
        <h3>Choisir une date</h3>
        <div className="dates-grid">
          {generateDates().map((date) => (
            <button
              key={date}
              className={`date-button ${selectedDate === date ? "active" : ""}`}
              onClick={() => setSelectedDate(date)}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
      </div>

      {/* Périodes de la journée */}
      <div className="time-period-selector">
        <h3>Filtrer par moment de la journée</h3>
        <div className="time-periods-grid">
          <button
            className={`time-period-button ${selectedTimePeriod === "matin" ? "active" : ""}`}
            onClick={() => setSelectedTimePeriod(selectedTimePeriod === "matin" ? "" : "matin")}
          >
            Matin
          </button>
          <button
            className={`time-period-button ${selectedTimePeriod === "midi" ? "active" : ""}`}
            onClick={() => setSelectedTimePeriod(selectedTimePeriod === "midi" ? "" : "midi")}
          >
            Midi
          </button>
          <button
            className={`time-period-button ${selectedTimePeriod === "après-midi" ? "active" : ""}`}
            onClick={() => setSelectedTimePeriod(selectedTimePeriod === "après-midi" ? "" : "après-midi")}
          >
            Après-midi
          </button>
          <button
            className={`time-period-button ${selectedTimePeriod === "soir" ? "active" : ""}`}
            onClick={() => setSelectedTimePeriod(selectedTimePeriod === "soir" ? "" : "soir")}
          >
            Soir
          </button>
        </div>
      </div>

      {/* Créneaux */}
      <div className="creneaux-section">
        <h3>
          Créneaux disponibles le {formatDate(selectedDate)}
          {creneaux.length > 0 && (
            <span style={{ color: 'var(--color-primary-green)', marginLeft: '8px' }}>
              ({creneaux.length} {creneaux.length === 1 ? 'créneau' : 'créneaux'})
            </span>
          )}
        </h3>

        {creneaux.length === 0 ? (
          <div className="no-creneaux">
            <div className="no-creneaux-icon">📅</div>
            <p>
              Aucun créneau disponible
              {selectedSport && ` pour ${selectedSport}`}
              {selectedTimePeriod && ` ${selectedTimePeriod === "matin" ? "le matin" : selectedTimePeriod === "midi" ? "à midi" : selectedTimePeriod === "après-midi" ? "l'après-midi" : "le soir"}`}
              {" "}le {formatDate(selectedDate)}.
            </p>
            <p className="no-creneaux-hint">
              {selectedSport || selectedTimePeriod
                ? "Essayez un autre filtre ou une autre date."
                : "Essayez une autre date."}
            </p>
          </div>
        ) : (
          <div className="creneaux-list">
            {creneaux.map((creneau) => (
              <div
                key={creneau.id}
                className="creneau-card-joueur"
              >
                {/* Black header with full date */}
                <div className="creneau-card-header">
                  <h3>{renderFullDateWithTime(creneau)}</h3>
                </div>

                {/* Green container with info - Clickable */}
                <div
                  className="creneau-card-body"
                  onClick={() => handleReserver(creneau)}
                >

                  <p className="creneau-time">
                    {renderCreneauTime(creneau)} - {(creneau.terrain as any)?.sport || "Sport"}
                  </p>

                  <div className="creneau-action-button">
                    <div>
                        Réserver
                    </div>
                    <div>
                        {creneau.prix.toLocaleString("fr-DZ")} DA
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Réservation */}
      {selectedCreneau && (
        <ReservationModal
          creneau={selectedCreneau}
          onClose={() => setSelectedCreneau(null)}
          onReservation={handleReservationSuccess}
          politiqueClub={club.politique}
        />
      )}

      {/* Modal À propos du club */}
      {showAboutModal && (
        <div className="modal-backdrop" onClick={() => setShowAboutModal(false)}>
          <div className="modal-content about-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>À propos de {club.nom}</h2>
              <button className="modal-close" onClick={() => setShowAboutModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              {club.description ? (
                <p className="description-text">{club.description}</p>
              ) : (
                <p className="description-text no-description">
                  Aucune description disponible pour ce club.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubDetailsJoueur;
