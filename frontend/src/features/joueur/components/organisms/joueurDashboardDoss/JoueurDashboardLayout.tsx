import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/JoueurDashboardLayout.css";
import { Creneau, Reservation, Joueur } from "../../../../../shared/types";
import ReservationModal from "./ReservationModal";
import ReservationAVenir from "./ReservationAvenir";
import ReservationAnnulees from "./ReservationAnnulee";
import { ClubService, ClubDto } from "../../../../club/services/ClubService";
import { Search, MapPin, Calendar, LogOut, User } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState<string>("");
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

      if (sport === "Tous les sports" && ville) {
        data = await ClubService.searchByVille(ville);
      } else if (sport && sport !== "Tous les sports" && ville) {
        data = await ClubService.searchByVilleAndSport(ville, sport);
      } else if (ville) {
        data = await ClubService.searchByVille(ville);
      } else if (sport && sport !== "Tous les sports") {
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

  const getSportEmoji = (sport: string) => {
    const emojis: Record<string, string> = {
      PADEL: "🎾",
      FOOT5: "⚽",
      TENNIS: "🎾",
      BASKET: "🏀",
      VOLLEY: "🏐",
      "Tous les sports": "🏆"
    };
    return emojis[sport] || "⚽";
  };

  // Filtrer les clubs selon le terme de recherche
  const filteredClubs = clubs.filter(club => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      club.nom?.toLowerCase().includes(searchLower) ||
      club.ville?.toLowerCase().includes(searchLower) ||
      club.adresse?.toLowerCase().includes(searchLower)
    );
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recherche':
        return (
          <div className="tab-content-section">
            {/* En-tête de recherche */}
            <div className="search-header">
              <h1 className="search-main-title">Trouve ton prochain Défis!</h1>
              {hasSearched && (
                <p className="search-subtitle">
                  {filteredClubs.length} {filteredClubs.length > 1 ? 'clubs disponibles' : 'club disponible'}
                </p>
              )}
            </div>

            {/* Carte de filtres moderne */}
            <div className="filters-card">
              <form onSubmit={handleSearchClubs} className="filters-form">
                <div className="filters-grid">
                  {/* Barre de recherche */}
                  <div className="filter-input-wrapper">
                    <div className="input-icon-wrapper">
                      <Search className="input-icon" />
                      <input
                        type="text"
                        placeholder="Rechercher un club..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                    </div>
                  </div>

                  {/* Sélecteur de ville */}
                  <div className="filter-select-wrapper">
                    <div className="select-with-icon">
                      <MapPin className="select-icon" />
                      <select
                        className="modern-select"
                        value={ville}
                        onChange={(e) => setVille(e.target.value)}
                      >
                        {VILLES.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Sélecteur de sport */}
                  <div className="filter-select-wrapper">
                    <div className="select-with-icon">
                      <span className="select-emoji">{getSportEmoji(sport)}</span>
                      <select
                        className="modern-select"
                        value={sport}
                        onChange={(e) => setSport(e.target.value)}
                      >
                        {SPORTS.map((s) => (
                          <option key={s} value={s}>
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Bouton de recherche */}
                  <button
                    className="search-button"
                    type="submit"
                    disabled={!canSearch || loadingSearch}
                  >
                    <Search className="button-icon" />
                    <span>{loadingSearch ? "Recherche..." : "Rechercher"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Message d'erreur */}
            {errSearch && (
              <div className="error-alert">
                <span className="error-icon">⚠️</span>
                <span>{errSearch}</span>
              </div>
            )}

            {/* État initial - Avant recherche */}
            {!hasSearched && !loadingSearch && (
              <div className="empty-state-modern">
                <div className="empty-icon-container">
                  <div className="empty-icon-circle">
                    <Search className="empty-icon" />
                  </div>
                </div>
                <h3 className="empty-title">Commence ta recherche</h3>
                <p className="empty-description">
                  Sélectionne une ville et un sport pour découvrir les meilleurs terrains près de chez toi
                </p>
              </div>
            )}

            {/* État de chargement */}
            {loadingSearch && (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p className="loading-text">Recherche en cours...</p>
              </div>
            )}

            {/* Liste des clubs */}
            {hasSearched && !loadingSearch && filteredClubs.length > 0 && (
              <div className="clubs-grid">
                {filteredClubs.map((club) => (
                  <div key={club.id} className="club-card-modern">
                    {/* Image du club */}
                    <div className="club-card-image">
                      {club.banniereUrl ? (
                        <img src={club.banniereUrl} alt={club.nom} />
                      ) : (
                        <div className="club-card-placeholder">
                          <MapPin className="placeholder-icon" />
                        </div>
                      )}
                      {/* Badge sport */}
                      {club.sport && (
                        <div className="club-sport-badge">
                          <span>{getSportEmoji(club.sport)}</span>
                          <span>{club.sport}</span>
                        </div>
                      )}
                    </div>

                    {/* Contenu de la carte */}
                    <div className="club-card-content">
                      <h3 className="club-card-title">{club.nom}</h3>

                      <div className="club-card-location">
                        <MapPin className="location-icon" />
                        <span>{club.ville || "Ville non spécifiée"}</span>
                      </div>

                      {club.adresse && (
                        <p className="club-card-address">{club.adresse}</p>
                      )}

                      {/* Badges multisports */}
                      {!club.sport && club.sports && club.sports.length > 0 && (
                        <div className="club-sports-badges">
                          {club.sports.slice(0, 3).map((s, idx) => (
                            <span key={idx} className="sport-badge-small">
                              {getSportEmoji(s)} {s}
                            </span>
                          ))}
                          {club.sports.length > 3 && (
                            <span className="sport-badge-more">+{club.sports.length - 3}</span>
                          )}
                        </div>
                      )}

                      {/* Bouton d'action */}
                      <button
                        className="club-card-button"
                        onClick={() => navigate(`/club/${club.id}`)}
                      >
                        <Calendar className="button-icon-small" />
                        <span>Voir les créneaux</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Aucun résultat */}
            {hasSearched && !loadingSearch && filteredClubs.length === 0 && !errSearch && (
              <div className="empty-state-modern">
                <div className="empty-icon-container">
                  <div className="empty-icon-circle no-results">
                    <span className="empty-emoji">🏟️</span>
                  </div>
                </div>
                <h3 className="empty-title">Aucun club trouvé</h3>
                <p className="empty-description">
                  Aucun club ne correspond à ta recherche
                  {sport !== "Tous les sports" && ` pour ${sport.replace("_", " ")}`}
                  {` à ${ville}`}. Essaie avec d'autres filtres !
                </p>
              </div>
            )}
          </div>
        );

      case 'reservations':
        return (
          <div className="tab-content-section">
            <div className="section-header">
              <h2 className="section-title">Mes réservations</h2>
              <span className="section-badge">{reservationsActives.length}</span>
            </div>

            <ReservationAVenir
              reservations={reservationsActives}
              onUpdate={onRefresh}
            />

            {reservationsActives.length === 0 && (
              <div className="empty-state-modern">
                <div className="empty-icon-container">
                  <div className="empty-icon-circle">
                    <Calendar className="empty-icon" />
                  </div>
                </div>
                <h3 className="empty-title">Aucune réservation</h3>
                <p className="empty-description">
                  Tu n'as aucune réservation active pour le moment. Commence par rechercher un terrain !
                </p>
              </div>
            )}
          </div>
        );

      case 'annulees':
        return (
          <div className="tab-content-section">
            <div className="section-header">
              <h2 className="section-title">Réservations annulées</h2>
              <span className="section-badge">{reservationsAnnulees.length}</span>
            </div>

            <ReservationAnnulees
              reservations={reservationsAnnulees}
            />

            {reservationsAnnulees.length === 0 && (
              <div className="empty-state-modern">
                <div className="empty-icon-container">
                  <div className="empty-icon-circle">
                    <Calendar className="empty-icon" />
                  </div>
                </div>
                <h3 className="empty-title">Aucune annulation</h3>
                <p className="empty-description">
                  Tu n'as aucune réservation annulée.
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="joueur-dashboard">
      {/* Header moderne */}
      <header className="dashboard-header-modern">
        <div className="header-container">
          <div className="header-logo">
            <h1 className="logo-text">FIELDZ</h1>
          </div>

          <div className="header-actions">
            <button
              className="user-profile-button"
              onClick={onNavigateToProfile}
              aria-label="Mon profil"
            >
              <div className="user-avatar-modern">
                {joueur?.nom?.charAt(0) || joueur?.email?.charAt(0) || 'U'}
              </div>
              <div className="user-info-modern">
                <span className="user-name-modern">
                  {joueur?.nom ? `${joueur.nom} ${joueur.prenom || ''}` : joueur?.email}
                </span>
                <span className="user-role-modern">Joueur</span>
              </div>
            </button>

            <button
              onClick={onLogout}
              className="logout-button"
              aria-label="Déconnexion"
            >
              <LogOut className="logout-icon" />
              <span className="logout-text">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation par onglets moderne */}
      <nav className="tabs-navigation">
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'recherche' ? 'active' : ''}`}
            onClick={() => setActiveTab('recherche')}
          >
            <Search className="tab-icon" />
            <span className="tab-text">Rechercher</span>
          </button>

          <button
            className={`tab-button ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            <Calendar className="tab-icon" />
            <span className="tab-text">Mes réservations</span>
            {reservationsActives.length > 0 && (
              <span className="tab-count">{reservationsActives.length}</span>
            )}
          </button>

          <button
            className={`tab-button ${activeTab === 'annulees' ? 'active' : ''}`}
            onClick={() => setActiveTab('annulees')}
          >
            <span className="tab-text">Annulées</span>
            {reservationsAnnulees.length > 0 && (
              <span className="tab-count secondary">{reservationsAnnulees.length}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="dashboard-content">
        {renderTabContent()}
      </main>

      {/* Modal de réservation */}
      {creneauSelectionne && (
        <div className="modal-overlay">
          <div className="modal-container">
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