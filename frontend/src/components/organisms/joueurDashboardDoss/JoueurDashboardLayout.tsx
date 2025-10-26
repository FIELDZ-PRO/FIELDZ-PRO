import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/JoueurDashboardLayout.css";
import { Creneau, Reservation, Joueur } from "../../../types";
import ReservationModal from "./ReservationModal";
import ReservationAVenir from "./ReservationAvenir";
import ReservationAnnulees from "./ReservationAnnulee";
import { ClubService, ClubDto } from "../../../services/ClubService";

const SPORTS = ["Tous les sports", "PADEL", "FOOT5", "TENNIS", "BASKET", "VOLLEY"];
const VILLES = ["Alger", "Oran", "Tizi Ouzou", "Annaba", "Blida", "Béjaïa"];

type Props = {
  joueur: Joueur | null;
  reservations: Reservation[];
  creneauxLibres: Creneau[];
  onRefresh: () => void;
  onLogout: () => void;
  onNavigateToProfile: () => void;
};

const JoueurDashboardLayout: React.FC<Props> = ({
  joueur,
  reservations,
  creneauxLibres,
  onRefresh,
  onLogout,
  onNavigateToProfile,
}) => {
  const navigate = useNavigate();
  const [creneauSelectionne, setCreneauSelectionne] = useState<Creneau | null>(null);
  const [activeTab, setActiveTab] = useState<'recherche' | 'reservations' | 'annulees'>('recherche');

  // --- Recherche clubs ---
  const [sport, setSport] = useState<string>("Tous les sports");
  const [ville, setVille] = useState<string>(VILLES[0] || "");
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [errSearch, setErrSearch] = useState<string>("");
  const [clubs, setClubs] = useState<ClubDto[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const canSearch = useMemo(() => !!(sport || ville), [sport, ville]);

  const handleSearchClubs = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSearch) return;
    try {
      setLoadingSearch(true);
      setErrSearch("");
      setHasSearched(true);
      let data: ClubDto[] = [];

      // Si "Tous les sports" est sélectionné, chercher seulement par ville
      if (sport === "Tous les sports" && ville) {
        data = await ClubService.searchByVille(ville);
      } else if (sport && sport !== "Tous les sports" && ville) {
        // Recherche par sport ET ville spécifique
        data = await ClubService.searchByVilleAndSport(ville, sport);
      } else if (ville) {
        // Recherche par ville uniquement
        data = await ClubService.searchByVille(ville);
      } else if (sport && sport !== "Tous les sports") {
        // Recherche par sport uniquement
        data = await ClubService.searchBySport(sport);
      }

      setClubs(data || []);
    } catch (err: any) {
      console.error("Erreur recherche clubs:", err);
      setErrSearch(err?.message || "Erreur serveur");
      setClubs([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const reservationsActives = reservations.filter(
    (r) => r.statut === "RESERVE" || r.statut === "CONFIRMEE"
  );
  
  const reservationsAnnulees = reservations.filter(
    (r) => r.statut === "ANNULE_PAR_JOUEUR" || r.statut === "ANNULE_PAR_CLUB"
  );

  // Séparer les réservations actives en "à venir" et "passées"
  const reservationsAVenir = reservationsActives.filter((r) => {
    const dateDebut = r.creneau?.dateDebut;
    if (!dateDebut) return false;
    return new Date(dateDebut) >= new Date();
  });

  const reservationsPassees = reservationsActives.filter((r) => {
    const dateDebut = r.creneau?.dateDebut;
    if (!dateDebut) return true;
    return new Date(dateDebut) < new Date();
  });

  const getSportEmoji = (sport: string) => {
    const emojis: Record<string, string> = {
      PADEL: "🎾",
      FOOT5: "⚽",
      TENNIS: "🎾",
      BASKET: "🏀",
      VOLLEY: "🏐"
    };
    return emojis[sport] || "⚽";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recherche':
        return (
          <div className="tab-content-section">
            {/* Formulaire de recherche repensé */}
            <div className="search-card-enhanced">
              <div className="search-card-body">
                <form onSubmit={handleSearchClubs} className="search-form-enhanced">
                  <div className="search-inputs-grid">
                    <div className="input-wrapper">
                      <label className="input-label-red">
                        <span className="label-icon-red">🎯</span>
                        <span className="label-text-red">Sport</span>
                      </label>
                      <div className="select-container">
                        <select
                          className="select-enhanced"
                          value={sport}
                          onChange={(e) => setSport(e.target.value)}
                        >
                          {SPORTS.map((s) => (
                            <option key={s} value={s}>
                              {getSportEmoji(s)} {s.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                        <div className="select-arrow">
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="input-wrapper">
                      <label className="input-label-red">
                        <span className="label-icon-red">📍</span>
                        <span className="label-text-red">Ville</span>
                      </label>
                      <div className="select-container">
                        <select
                          className="select-enhanced"
                          value={ville}
                          onChange={(e) => setVille(e.target.value)}
                        >
                          {VILLES.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                        <div className="select-arrow">
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <button 
                      className="search-btn-modern" 
                      type="submit" 
                      disabled={!canSearch || loadingSearch}
                    >
                      <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span className="btn-text">
                        {loadingSearch ? "Recherche..." : "Rechercher"}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Messages / Résultats */}
            {errSearch && (
              <div className="error-message">
                ⚠️ Erreur : {errSearch}
              </div>
            )}

            {/* État initial avant recherche */}
            {!hasSearched && !loadingSearch && clubs.length === 0 && (
              <div className="search-empty-state">
                <div className="search-empty-icon">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="50" cy="50" r="30" stroke="#05612B" strokeWidth="6" fill="none"/>
                    <line x1="72" y1="72" x2="95" y2="95" stroke="#05612B" strokeWidth="6" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="search-empty-title">Recherche de terrains</h3>
                <p className="search-empty-text">Sélectionne un sport et une ville pour trouver les meilleurs terrains disponibles</p>
              </div>
            )}

            {/* Liste des clubs */}
            <div className="clubs-list">
              {clubs.map((club) => (
                <div key={club.id} className="club-card">
                  {/* Image à gauche */}
                  <div className="club-image">
                    {club.banniereUrl ? (
                      <img src={club.banniereUrl} alt={club.nom} />
                    ) : (
                      <div className="club-image-placeholder">📍</div>
                    )}
                  </div>
                  
                  {/* Contenu central */}
                  <div className="club-details">
                    <h3 className="club-title">{club.nom}</h3>
                    <p className="club-ville">📍 {club.ville || "Ville non spécifiée"}</p>
                    <p className="club-adresse"><strong>Adresse :</strong> {club.adresse || "—"}</p>
                    
                    {club.sport && (
                      <span className="club-badge">{getSportEmoji(club.sport)} {club.sport}</span>
                    )}
                    {!club.sport && club.sports && club.sports.length > 0 && (
                      <div className="club-badges">
                        {club.sports.map((s, idx) => (
                          <span key={idx} className="club-badge">{getSportEmoji(s)} {s}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bouton à droite */}
                  <button 
                    className="club-btn-voir"
                    onClick={() => navigate(`/club/${club.id}`)}
                  >
                    Voir les créneaux
                  </button>
                </div>
              ))}
            </div>

            {!loadingSearch && !errSearch && clubs.length === 0 && hasSearched && (
              <div className="empty-state">
                <div className="empty-state-icon">🏟️</div>
                <h3 className="empty-state-title">Aucun club trouvé</h3>
                <p className="empty-state-text">
                  Aucun club ne correspond à ta recherche 
                  {sport !== "Tous les sports" && ` pour ${sport.replace("_", " ")}`}
                  {` à ${ville}`}. 
                  Essaie avec d'autres filtres !
                </p>
              </div>
            )}
          </div>
        );

      case 'reservations':
        return (
          <div className="tab-content-section">
            <h2 className="page-title">Mes réservations ({reservationsActives.length})</h2>
            
            <ReservationAVenir 
              reservations={reservationsActives}
              onUpdate={onRefresh}
            />

            {reservationsActives.length === 0 && (
              <div className="empty-state">
                Vous n'avez aucune réservation active pour le moment.
              </div>
            )}
          </div>
        );

      case 'annulees':
        return (
          <div className="tab-content-section">
            <h2 className="page-title">Réservations annulées</h2>
            
            <ReservationAnnulees 
              reservations={reservationsAnnulees}
            />

            {reservationsAnnulees.length === 0 && (
              <div className="empty-state">
                Vous n'avez aucune réservation annulée.
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="jd-container">
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">FIELDZ</h1>
        </div>

        <div className="header-right">
          <div className="user-info" onClick={onNavigateToProfile}>
            <div className="user-avatar">
              {joueur?.nom?.charAt(0) || joueur?.email?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">
                {joueur?.nom ? `${joueur.nom} ${joueur.prenom || ''}` : joueur?.email}
              </span>
              <span className="user-role">Joueur actif</span>
            </div>
          </div>

          <button onClick={onLogout} className="btn-danger">
            Déconnexion
          </button>
        </div>
      </div>

      <div className="tab-navigation-modern">
        <button
          className={`tab-button-modern ${activeTab === 'recherche' ? 'active' : ''}`}
          onClick={() => setActiveTab('recherche')}
        >
          Rechercher un terrain
        </button>

        <button
          className={`tab-button-modern ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          Mes réservations ({reservationsActives.length})
        </button>

        <button
          className={`tab-button-modern ${activeTab === 'annulees' ? 'active' : ''}`}
          onClick={() => setActiveTab('annulees')}
        >
          Réservations annulées
        </button>
      </div>

      <div className="tab-content">{renderTabContent()}</div>

      {creneauSelectionne && (
        <div className="jd-modal-overlay">
          <div className="jd-modal">
            <ReservationModal
              creneau={creneauSelectionne}
              onClose={() => setCreneauSelectionne(null)}
              onReservation={async () => {
                await onRefresh();
                setCreneauSelectionne(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JoueurDashboardLayout;