import React, { useMemo, useState } from "react";
import "./style/JoueurDashboardLayout.css";
import { Creneau, Reservation, Joueur } from "../../../types";
import ReservationModal from "./ReservationModal";
import CreneauxDisponiblesGroup from "./CreneauxDisponiblesGroup";

// 👉 endpoints via fetch (déjà fournis)
import { ClubService, ClubDto } from "../../../services/ClubService";

// ⚠️ Doit correspondre à ton enum backend com.fieldz.model.Sport (UPPERCASE)
const SPORTS = ["PADEL", "FOOT5", "TENNIS", "BASKET", "VOLLEY"];
// Remplace par tes vraies villes si tu as une source
const VILLES = ["Alger", "Oran", "Constantine", "Annaba", "Blida","Béjaïa"];

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
  const [creneauSelectionne, setCreneauSelectionne] = useState<Creneau | null>(null);
  const [activeTab, setActiveTab] = useState<'recherche' | 'reservations' | 'annulees'>('recherche');

  // --- Recherche clubs (nouveau) ---
  const [sport, setSport] = useState<string>(SPORTS[0] || "");
  const [ville, setVille] = useState<string>(VILLES[0] || "");
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [errSearch, setErrSearch] = useState<string>("");
  const [clubs, setClubs] = useState<ClubDto[]>([]);

  const canSearch = useMemo(() => !!(sport || ville), [sport, ville]);

  const handleSearchClubs = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSearch) return;
    try {
      setLoadingSearch(true);
      setErrSearch("");
      let data: ClubDto[] = [];

      if (sport && ville) {
        data = await ClubService.searchByVilleAndSport(ville, sport);
      } else if (ville) {
        data = await ClubService.searchByVille(ville);
      } else if (sport) {
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recherche':
        return (
          <div className="tab-content-section">
            <h2 className="page-title">Rechercher un terrain</h2>

            {/* Formulaire de recherche Clubs */}
            <form onSubmit={handleSearchClubs} className="search-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Sport</label>
                  <select
                    className="form-select"
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

                <div className="form-group">
                  <label>Ville</label>
                  <select
                    className="form-select"
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

                <div className="form-group">
                  <label>&nbsp;</label>
                  <button className="btn-search" type="submit" disabled={!canSearch || loadingSearch}>
                    {loadingSearch ? "Recherche..." : "Rechercher"}
                  </button>
                </div>
              </div>
            </form>

            {/* Messages / Résultats */}
            {errSearch && (
              <div className="mt-3" style={{ color: "tomato", fontSize: 14 }}>
                Erreur : {errSearch}
              </div>
            )}

            <div className="clubs-results-grid">
              {clubs.map((club) => (
                <div key={club.id} className="club-card">
                  <div className="club-card-header">
                    {club.banniereUrl ? (
                      <img src={club.banniereUrl} alt={club.nom} className="club-banner" />
                    ) : (
                      <div className="club-banner placeholder" />
                    )}
                    <div className="club-title">
                      <h3>{club.nom}</h3>
                      <span className="club-city">{club.ville || "—"}</span>
                    </div>
                  </div>
                  <div className="club-card-body">
                    <p><strong>Adresse :</strong> {club.adresse || "—"}</p>
                    <p><strong>Téléphone :</strong> {club.telephone || "—"}</p>
                    {club.sport && <p><strong>Sports :</strong> {club.sport}</p>}
                    {!club.sport && club.sports && (
                      <p><strong>Sports :</strong> {club.sports.join(", ")}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!loadingSearch && !errSearch && clubs.length === 0 && (
              <div className="empty-state mt-4">
                Aucun club trouvé pour {sport.replace("_", " ")} à {ville}.
              </div>
            )}

            {/* Liste de créneaux (comme avant) */}
            <div className="mt-8">
              <CreneauxDisponiblesGroup
                creneaux={creneauxLibres}
                onReserver={(c) => setCreneauSelectionne(c)}
              />
            </div>
          </div>
        );

      case 'reservations':
        return (
          <div className="tab-content-section">
            <h2 className="page-title">Mes réservations</h2>
            <div className="reservations-container">
              {reservationsActives.length === 0 ? (
                <div className="empty-state">Aucune réservation active</div>
              ) : (
                reservationsActives.map((r) => (
                  <div key={r.id} className="reservation-item">
                    {/* Place tes cartes de réservation ici */}
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'annulees':
        return (
          <div className="tab-content-section">
            <h2 className="page-title">Réservations annulées</h2>
            <div className="reservations-container">
              {reservationsAnnulees.length === 0 ? (
                <div className="empty-state">Aucune réservation annulée</div>
              ) : (
                reservationsAnnulees.map((r) => (
                  <div key={r.id} className="reservation-item">
                    {/* Place tes cartes de réservation ici */}
                  </div>
                ))
              )}
            </div>
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

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'recherche' ? 'active' : ''}`}
          onClick={() => setActiveTab('recherche')}
        >
          Rechercher un terrain
        </button>

        <button
          className={`tab-button ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          Mes réservations ({reservationsActives.length})
        </button>

        <button
          className={`tab-button ${activeTab === 'annulees' ? 'active' : ''}`}
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
