import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/JoueurDashboardLayout.css";
import { Creneau, Reservation, Joueur } from "../../../types";
import ReservationModal from "./ReservationModal";
import ReservationGroupByStatut from "./ReservationGroupByStatut";
import { ClubService, ClubDto } from "../../../services/ClubService";

const SPORTS = ["PADEL", "FOOT5", "TENNIS", "BASKET", "VOLLEY"];
const VILLES = ["Alger", "Oran", "Constantine", "Annaba", "Blida", "Béjaïa"];

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
              <div 
                className="form-row" 
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'end'
                }}
              >
                <div className="form-group">
                  <label>Sport</label>
                  <select
                    className="form-select"
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    style={{ height: '48px', padding: '0 1rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
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
                    style={{ height: '48px', padding: '0 1rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
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
                  <button 
                    className="btn-search" 
                    type="submit" 
                    disabled={!canSearch || loadingSearch}
                    style={{ height: '48px', padding: '0 2rem' }}
                  >
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

            {/* Liste des clubs */}
            <div className="clubs-list">
              {clubs.map((club) => (
                <div key={club.id} className="club-item">
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
                      <span className="club-badge">{club.sport}</span>
                    )}
                    {!club.sport && club.sports && club.sports.length > 0 && (
                      <div className="club-badges">
                        {club.sports.map((s, idx) => (
                          <span key={idx} className="club-badge">{s}</span>
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

            {!loadingSearch && !errSearch && clubs.length === 0 && (
              <div className="empty-state">
                Aucun club trouvé pour {sport.replace("_", " ")} à {ville}.
              </div>
            )}
          </div>
        );

      case 'reservations':
        return (
          <div className="tab-content-section">
            <h2 className="page-title">Mes réservations ({reservationsActives.length})</h2>
            
            <ReservationGroupByStatut
              titre="Réservations confirmées"
              reservations={reservationsActives.filter(r => r.statut === "CONFIRMEE")}
              onUpdate={onRefresh}
            />
            
            <ReservationGroupByStatut
              titre="Réservations en attente"
              reservations={reservationsActives.filter(r => r.statut === "RESERVE")}
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
            
            <ReservationGroupByStatut
              titre="Annulées par vous"
              reservations={reservationsAnnulees.filter(r => r.statut === "ANNULE_PAR_JOUEUR")}
              onUpdate={onRefresh}
            />
            
            <ReservationGroupByStatut
              titre="Annulées par le club"
              reservations={reservationsAnnulees.filter(r => r.statut === "ANNULE_PAR_CLUB")}
              onUpdate={onRefresh}
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