// src/pages/ClubDetailsJoueur.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClubService, ClubDto, getCreneauxByClubDateSport } from "../../../shared/services/ClubService";
import ReservationModal from "../components/organisms/joueurDashboardDoss/ReservationModal";
import { Creneau } from "../../../shared/types";
import "./style/ClubDetailsJoueur.css";
import { ChevronDown, ChevronUp, MapPin, Phone, Info, Clock } from "lucide-react";

// ✅ Helpers pour parser/formatter en LOCAL (sans décalage)
import {
  parseYMDLocal,
  parseLocalDateTime,
  formatShortDate,
  formatRangeLocal,
} from "../../../utils/datetime";

const ClubDetailsJoueur: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [selectedCreneau, setSelectedCreneau] = useState<Creneau | null>(null);

  // États pour "Lire plus"
  const [showFullDescription, setShowFullDescription] = useState(false);

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

        // Initialise le sport sélectionné
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

  // ────────────────────────────────────────────────────────────────────────────────
  // Chargement des créneaux du club
  // ────────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCreneaux = async () => {
      if (!id || !selectedDate || !selectedSport) return;
      try {
        const data = await getCreneauxByClubDateSport(
          parseInt(id, 10),
          selectedDate,
          selectedSport
        );
        setCreneaux(data);
      } catch (err: any) {
        console.error("Erreur chargement créneaux:", err);
        setCreneaux([]);
      }
    };
    fetchCreneaux();
  }, [id, selectedDate, selectedSport]);

  // ────────────────────────────────────────────────────────────────────────────────
  // Helpers d’affichage
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
    };
    return emojis[s] || "🏅";
  };

  // Nom de terrain robuste (selon que l’API renvoie nom/nomTerrain)
  const getTerrainName = (cr: Creneau) =>
    (cr.terrain as any)?.nomTerrain || (cr.terrain as any)?.nom || "Terrain";

  // Label heure/date du créneau (lisible)
  const renderCreneauTime = (cr: Creneau) => {
    // Cas API “ancienne” : heureDebut/heureFin + dateDebut
    if (cr.heureDebut && cr.heureFin && cr.dateDebut) {
      const d = parseLocalDateTime(cr.dateDebut);
      const dateLbl = formatShortDate(d);
      return `${dateLbl} • ${cr.heureDebut}–${cr.heureFin}`;
    }
    // Cas API “nouvelle” : dateDebut/dateFin
    if (cr.dateDebut && cr.dateFin) {
      return formatRangeLocal(cr.dateDebut, cr.dateFin);
    }
    // Fallback
    return `${cr.heureDebut || cr.dateDebut} - ${cr.heureFin || cr.dateFin}`;
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
    // refresh des créneaux
    if (!id) return;
    try {
      const data = await getCreneauxByClubDateSport(
        parseInt(id, 10),
        selectedDate,
        selectedSport
      );
      setCreneaux(data || []);
    } catch (err) {
      console.error("Erreur rechargement:", err);
    }
  };
  const truncateText = (text: string, maxLength = 200) =>
    !text || text.length <= maxLength ? text : text.slice(0, maxLength) + "...";

  // ────────────────────────────────────────────────────────────────────────────────
  // Renders
  // ────────────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="club-details-loading">
        <div className="loading-spinner-modern"></div>
        <p>Chargement du club...</p>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="club-details-error">
        <div className="error-icon">⚠️</div>
        <h2>Oups !</h2>
        <p>{error || "Club introuvable"}</p>
        <button className="btn-primary" onClick={() => navigate(-1)}>
          Retour à la recherche
        </button>
      </div>
    );
  }
  console.log(creneaux)

  return (
    <div className="club-details-container">
      <div className="club-details-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Retour
        </button>
        <h1>Réserver chez {club.nom}</h1>
      </div>

      {/* Bannière */}
      <div className="club-banner">
        {club.images && club.images.length > 0 ? (
          <img src={club.images[0].imageUrl} alt={club.nom} />
        ) : (
          <div className="club-banner-placeholder">
            <h2>{club.nom}</h2>
          </div>
        )}
        <div className="club-banner-overlay">
          <h2>{club.nom}</h2>
          <p>
            <MapPin className="inline-icon" />
            {club.adresse}, {club.ville}
          </p>
        </div>
      </div>

      {/* Description & Contact */}
      <div className="club-info-section">
        <div className="info-card description-card">
          <div className="info-card-header">
            <Info className="card-icon" />
            <h3>À propos de {club.nom}</h3>
          </div>
          <div className="info-card-content">
            {club.description ? (
              <>
                <p className="description-text">
                  {showFullDescription ? club.description : truncateText(club.description, 200)}
                </p>
                {club.description.length > 200 && (
                  <button
                    className="btn-read-more"
                    onClick={() => setShowFullDescription((v) => !v)}
                  >
                    {showFullDescription ? (
                      <>
                        <ChevronUp className="btn-icon" /> Voir moins
                      </>
                    ) : (
                      <>
                        <ChevronDown className="btn-icon" /> Lire plus
                      </>
                    )}
                  </button>
                )}
              </>
            ) : (
              <p className="description-text no-description">
                Aucune description disponible pour ce club.
              </p>
            )}
          </div>
        </div>

        <div className="info-card contact-card">
          <div className="info-card-header">
            <Phone className="card-icon" />
            <h3>Informations de contact</h3>
          </div>
          <div className="info-card-content">
            <div className="contact-item">
              <Phone className="contact-icon" />
              <span>{club.telephone || "Non renseigné"}</span>
            </div>
            <div className="contact-item">
              <MapPin className="contact-icon" />
              <span>{club.adresse || "Non renseigné"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sports */}
      {(club.sport || club.sports) && (
        <div className="club-sports">
          <h3>Sports disponibles</h3>
          <div className="sports-filter">
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
                className="sport-badge active"
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

      {/* Créneaux */}
      <div className="creneaux-section">
        <h3>Créneaux disponibles le {formatDate(selectedDate)}</h3>

        {creneaux.length === 0 ? (
          <div className="no-creneaux">
            <div className="no-creneaux-icon">📅</div>
            <p>Aucun créneau disponible pour cette date.</p>
            <p className="no-creneaux-hint">Essayez une autre date ou un autre sport.</p>
          </div>
        ) : (
          <div className="creneaux-list">
            {creneaux.map((creneau) => (
              <div key={creneau.id} className="creneau-card">
                <div className="creneau-info">
                  {/* Display terrain image */}
                  {(creneau.terrain as any)?.photo ? (
                    <img
                      src={(creneau.terrain as any).photo}
                      alt={getTerrainName(creneau)}
                      className="creneau-image"
                    />
                  ) : (
                    <div className="creneau-image-placeholder">
                      {getSportEmoji((creneau.terrain as any)?.sport || "sport")}
                    </div>
                  )}
                  <div className="creneau-details">
                    <h4>{getTerrainName(creneau)}</h4>

                    {/* ✅ Affichage lisible et cohérent */}
                    <p className="creneau-time">
                      <Clock size={16} className="inline-icon text-emerald-700" />
                      {" "}
                      {renderCreneauTime(creneau)}
                    </p>

                    <p className="creneau-sport">
                      {(creneau.terrain as any)?.sport || "Sport"}
                    </p>
                  </div>
                </div>

                <div className="creneau-action">
                  <p className="creneau-prix">
                    {creneau.prix.toLocaleString("fr-DZ")} DA
                  </p>
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

      {/* Modal */}
      {selectedCreneau && (
        <ReservationModal
          creneau={selectedCreneau}
          onClose={() => setSelectedCreneau(null)}
          onReservation={handleReservationSuccess}
          politiqueClub={club.politique}
        />
      )}
    </div>
  );
};

export default ClubDetailsJoueur;
