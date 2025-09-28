import React, { useState } from "react";
import "./style/JoueurDashboardLayout.css";
import { Creneau, Reservation, Joueur } from "../../../types";
import ReservationGroupByStatut from "./ReservationGroupByStatut";
import ReservationModal from "./ReservationModal";
import CreneauxDisponiblesGroup from "./CreneauxDisponiblesGroup";

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

  const reservationsActives = reservations.filter(r => 
    r.statut === "RESERVE" || r.statut === "CONFIRMEE"
  );
  
  const reservationsAnnulees = reservations.filter(r => 
    r.statut === "ANNULE_PAR_JOUEUR" || r.statut === "ANNULE_PAR_CLUB"
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recherche':
        return (
          <div className="tab-content-section">
            <h2 className="page-title">Rechercher un terrain</h2>
            
            <div className="search-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Sport</label>
                  <select className="form-select">
                    <option>Choisir un sport</option>
                    <option>Padel</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Ville</label>
                  <select className="form-select">
                    <option>Choisir une ville</option>
                    <option>Alger</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>&nbsp;</label>
                  <button className="btn-search">
                    Rechercher
                  </button>
                </div>
              </div>
            </div>

            <CreneauxDisponiblesGroup
              creneaux={creneauxLibres}
              onReserver={(c) => {
                setCreneauSelectionne(c);
              }}
            />
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
                    {/* Utilisation de tes composants ReservationCard existants */}
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
                    {/* Utilisation de tes composants ReservationCard existants */}
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

      <div className="tab-content">
        {renderTabContent()}
      </div>

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