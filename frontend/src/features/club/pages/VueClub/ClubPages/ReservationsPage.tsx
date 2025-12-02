import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, User, MapPin, Filter, Search, X } from 'lucide-react';
import './style/ReservationPage.css';
import {
  ReservationSummary,
  getReservations,
  getReservationsByDate,
  confirmReservations,
  cancelReservationByClub,
  markReservationAbsent,
} from '../../../../../shared/services/ClubService';
import ConfirmModal from '../../../../../shared/components/atoms/ConfirmModal';
import MotifAnnulationModal from '../../../../../shared/components/molecules/MotifAnnulationModal';
import CustomAlert, { AlertType } from '../../../../../shared/components/atoms/CustomAlert';

interface AlertState {
  show: boolean;
  type: AlertType;
  message: string;
}

const GRACE_MINUTES = 15;

/* =========================
   Utils date/heure (local)
   ========================= */
// Construit un Date local depuis "YYYY-MM-DD" + "HH:mm"
function combineStartDateLocal(res: ReservationSummary): Date {
  const [y, m, d] = (res.date ?? '').split('-').map(Number);
  const [hh, mm] = (res.heureDebut ?? '00:00').split(':').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0, 0);
}


const ReservationsPage = () => {
  const [reservations, setReservations] = useState<ReservationSummary[]>([]);
  const [filterStatus, setFilterStatus] = useState<'RESERVE' | 'Toutes' | 'CONFIRMEE' | 'ABSENT' | 'Annulées' | 'ANNULE_PAR_JOUEUR' | 'ANNULE_PAR_CLUB'>('RESERVE'); // ✅ défaut = À venir
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // États pour les modals
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showMotifModal, setShowMotifModal] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState<number | null>(null);

  // État pour les alertes
  const [alertState, setAlertState] = useState<AlertState>({ show: false, type: 'info', message: '' });

  const showAlert = (type: AlertType, message: string) => {
    setAlertState({ show: true, type, message });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = selectedDate ? await getReservationsByDate(selectedDate) : await getReservations();
        setReservations(data);
      } catch (error) {
        console.error('Erreur lors du chargement des réservations :', error);
      }
    };
    fetchData();
  }, [selectedDate]);

  const translateStatus = (status: string) => {
    switch (status) {
      case 'RESERVE': return 'À venir';
      case 'CONFIRMEE': return 'Confirmée';
      case 'ABSENT': return 'Absent';
      case 'ANNULE': return 'Annulée';
      case 'ANNULE_PAR_JOUEUR': return 'Annulée par le joueur';
      case 'ANNULE_PAR_CLUB': return 'Annulée par le club';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESERVE': return '#005ca8ff';
      case 'CONFIRMEE': return '#059622ff';
      case 'ABSENT': return '#dc2626';
      case 'ANNULE':
      case 'ANNULE_PAR_CLUB':
      case 'ANNULE_PAR_JOUEUR': return '#9ca3af';
      default: return '#64748b';
    }
  };

  const updateReservationStatus = (id: number, newStatus: string) => {
    setReservations(prev => prev.map(r => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  // Boutons "Présent" et "Absent" actifs à partir de 15 min AVANT le début
  const canMarkPresenceOrAbsent = (r: ReservationSummary) => {
    if (r.status !== 'RESERVE' && r.status !== 'CONFIRMEE') return false;
    const start = combineStartDateLocal(r).getTime();
    const availableTime = start - GRACE_MINUTES * 60 * 1000; // 15 min avant le début
    return Date.now() >= availableTime;
  };

  // Bouton "Annuler" disponible jusqu'à 15 minutes AVANT le début
  const canCancelReservation = (r: ReservationSummary) => {
    if (r.status !== 'RESERVE' && r.status !== 'CONFIRMEE') return false;
    const start = combineStartDateLocal(r).getTime();
    const cutoffTime = start - GRACE_MINUTES * 60 * 1000; // 15 min avant le début
    return Date.now() <= cutoffTime;
  };

  // Gestion du modal de confirmation d'annulation
  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    setShowMotifModal(true);
  };

  const handleCancelModal = () => {
    setShowCancelModal(false);
    setPendingCancelId(null);
  };

  // Gestion du modal du motif d'annulation
  const handleSubmitMotif = async (motif: string) => {
    if (!pendingCancelId) return;

    setShowMotifModal(false);
    setLoadingId(pendingCancelId);
    try {
      await cancelReservationByClub(pendingCancelId, motif);
      updateReservationStatus(pendingCancelId, 'ANNULE_PAR_CLUB');
      showAlert('success', 'Réservation annulée avec succès !');
    } catch (error) {
      console.error("Erreur lors de l'annulation : ", error);
      showAlert('error', (error as Error).message || "Une erreur est survenue lors de l'annulation.");
    } finally {
      setLoadingId(null);
      setPendingCancelId(null);
    }
  };

  const handleCloseMotifModal = () => {
    setShowMotifModal(false);
    setPendingCancelId(null);
  };

  type Action = 'confirm' | 'cancel' | 'absent';

  const handleReservationAction = async (id: number, action: Action) => {
    const res = reservations.find(r => r.id === id);
    if (!res) return;

    // Garde-fous UX (ne lancent PAS d'appel réseau)
    if ((action === 'confirm' || action === 'absent') && !canMarkPresenceOrAbsent(res)) {
      const start = combineStartDateLocal(res);
      const availableTime = new Date(start.getTime() - GRACE_MINUTES * 60 * 1000);
      const availableStr = availableTime.toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      showAlert('warning', `"Présent" et "Absent" seront disponibles à partir de ${availableStr} (soit ${GRACE_MINUTES} minutes avant le début du créneau).`);
      return;
    }

    // Branche ANNULER : confirmations AVANT le spinner / l'API
    if (action === 'cancel') {
      // Vérifier si l'annulation est encore autorisée (15 min avant le début)
      if (!canCancelReservation(res)) {
        const start = combineStartDateLocal(res);
        const cutoffTime = new Date(start.getTime() - GRACE_MINUTES * 60 * 1000);
        const cutoffStr = cutoffTime.toLocaleString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        showAlert('warning', `L'annulation n'est plus possible. Vous pouviez annuler jusqu'à ${cutoffStr} (soit ${GRACE_MINUTES} minutes avant le début du créneau).`);
        return;
      }

      // Ouvrir le modal de confirmation
      setPendingCancelId(id);
      setShowCancelModal(true);
      return; // on sort : on a géré l'action cancel
    }

    // Autres actions (confirm / absent)
    setLoadingId(id);
    try {
      if (action === 'confirm') {
        await confirmReservations(id);
        updateReservationStatus(id, 'CONFIRMEE');
      } else if (action === 'absent') {
        const motif = window.prompt("Motif d'absence (optionnel) :") || "Le joueur ne s'est pas présenté.";
        await markReservationAbsent(id, motif);
        updateReservationStatus(id, 'ABSENT');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réservation :', error);
      showAlert('error', (error as Error).message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoadingId(null);
    }
  };



  // =======================
  // Filtrage + tri (mémo)
  // =======================
  const filteredReservations = useMemo(() => {
    const now = Date.now();

    const byStatus = reservations.filter((reservation) => {
      // Filtre “À venir” : statut RESERVE ET créneau non commencé
      if (filterStatus === 'RESERVE') {
        return (
          reservation.status === 'RESERVE' &&
          combineStartDateLocal(reservation).getTime() >= now
        );
      }

      if (filterStatus === 'Toutes') return true;

      if (filterStatus === 'Annulées') {
        return ['ANNULE', 'ANNULE_PAR_JOUEUR', 'ANNULE_PAR_CLUB'].includes(reservation.status);
      }

      // Autres filtres directs (CONFIRMEE, ABSENT, ANNULE_PAR_JOUEUR, ANNULE_PAR_CLUB)
      return reservation.status === filterStatus;
    });

    const bySearch = byStatus.filter((reservation) => {
      const q = searchTerm.toLowerCase();
      return (
        (reservation.nom?.toLowerCase() ?? '').includes(q) ||
        (reservation.prenom?.toLowerCase() ?? '').includes(q) ||
        (reservation.nomReservant?.toLowerCase() ?? '').includes(q) ||
        (reservation.terrain?.toLowerCase() ?? '').includes(q)
      );
    });

    // Tri par début croissant
    return bySearch.sort(
      (a, b) =>
        combineStartDateLocal(a).getTime() - combineStartDateLocal(b).getTime()
    );
  }, [reservations, filterStatus, searchTerm]);

  const totalRevenue = useMemo(
    () => reservations.filter(r => r.status === 'CONFIRMEE').reduce((sum, r) => sum + (r.prix || 0), 0),
    [reservations]
  );
  console.log(reservations)
  return (
    <div className="reservations-page">
      {/* Modals */}
      <ConfirmModal
        isOpen={showCancelModal}
        title="Annuler cette réservation ?"
        message="Cette action est irréversible. Le joueur sera notifié de l'annulation."
        type="danger"
        confirmText="Continuer"
        cancelText="Retour"
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelModal}
      />

      {showMotifModal && (
        <MotifAnnulationModal
          onClose={handleCloseMotifModal}
          onSubmit={handleSubmitMotif}
        />
      )}

      {/* Alert personnalisée */}
      {alertState.show && (
        <CustomAlert
          type={alertState.type}
          message={alertState.message}
          onClose={() => setAlertState({ ...alertState, show: false })}
          duration={5000}
        />
      )}

      <div className="page-header">
        <h1>Gestion des réservations</h1>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value2">{reservations.length}</span>
            <span className="stat-label2">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value2">
              {reservations.filter(r => r.status === 'CONFIRMEE').length}
            </span>
            <span className="stat-label2">Présent</span>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Rechercher par nom ou terrain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={16} />
          {/* ✅ Ordre demandé + défaut “À venir” */}
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as typeof filterStatus)
            }
          >
            <option value="RESERVE">À venir</option>
            <option value="Toutes">Toutes les réservations</option>
            <option value="CONFIRMEE">Confirmées</option>
            <option value="ABSENT">Absents</option>
            <option value="Annulées">Annulées</option>
            <option value="ANNULE_PAR_JOUEUR">Annulées par joueur</option>
            <option value="ANNULE_PAR_CLUB">Annulées par le club</option>
          </select>
        </div>

        <div className="filter-group calendar-filter">
          <Calendar size={16} />
          <input
            type="date"
            value={selectedDate || ''}
            onChange={(e) => setSelectedDate(e.target.value || null)}
          />
          {selectedDate && (
            <button
              className="btn2 btn2-clear"
              onClick={() => setSelectedDate(null)}
              title="Afficher toutes les réservations"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="reservations-list">
        {filteredReservations.map((reservation) => (
          <div key={reservation.id} className="reservation-card">
            <div className="reservation-main">
              <div className="client-info">
                <div className="client-name">
                  <User size={16} />
                  {reservation.nomReservant || `${reservation.nom} ${reservation.prenom}`}
                </div>
                <div className="client-phone">{reservation.telephone || '—'}</div>
              </div>

              <div className="reservation-details">
                <div className="detail-item">
                  <MapPin size={16} />
                  {reservation.terrain}
                </div>
                <div className="detail-item">
                  <Calendar size={16} />
                  {new Date(reservation.date).toLocaleDateString('fr-FR')}
                </div>
                <div className="detail-item">
                  <Clock size={16} />
                  {reservation.heureDebut} - {reservation.heureFin}
                </div>
              </div>

              <div className="reservation-price">{reservation.prix} Dzd</div>
            </div>

            <div className="reservation-actions">
              <div
                className="status-badge"
                style={{ backgroundColor: getStatusColor(reservation.status) }}
              >
                {translateStatus(reservation.status)}
              </div>

              <div className="action-buttons">
                {reservation.status === 'RESERVE' && (
                  <>
                    <button
                      className={`btn2 btn2-success ${!canMarkPresenceOrAbsent(reservation) ? 'btn2-disabled' : ''}`}
                      disabled={loadingId === reservation.id}
                      onClick={() => handleReservationAction(reservation.id, 'confirm')}
                      title={
                        !canMarkPresenceOrAbsent(reservation)
                          ? `Disponible à partir de ${GRACE_MINUTES} minutes avant le début du créneau`
                          : undefined
                      }
                    >
                      {loadingId === reservation.id ? (
                        <span className="btn2-loading">
                          <span className="spinner-club"></span> Envoi...
                        </span>
                      ) : (
                        'Présent'
                      )}
                    </button>



                    <button
                      className={`btn2 btn2-danger ${!canMarkPresenceOrAbsent(reservation) ? 'btn2-disabled' : ''}`}
                      disabled={loadingId === reservation.id}
                      title={
                        !canMarkPresenceOrAbsent(reservation)
                          ? `Disponible à partir de ${GRACE_MINUTES} minutes avant le début du créneau`
                          : undefined
                      }
                      onClick={() => handleReservationAction(reservation.id, 'absent')}
                    >
                      {loadingId === reservation.id ? (
                        <span className="btn2-loading">
                          <span className="spinner-club"></span> Envoi...
                        </span>
                      ) : (
                        'Absent'
                      )}
                    </button>

                    <button
                      className={`btn2 btn2-warning ${!canCancelReservation(reservation) ? 'btn2-disabled' : ''}`}
                      disabled={loadingId === reservation.id}
                      onClick={() => handleReservationAction(reservation.id, 'cancel')}
                      title={
                        !canCancelReservation(reservation)
                          ? `L'annulation n'est possible que jusqu'à ${GRACE_MINUTES} minutes avant le début du créneau`
                          : undefined
                      }
                    >
                      {loadingId === reservation.id ? (
                        <span className="btn2-loading">
                          <span className="spinner-club"></span> Envoi...
                        </span>
                      ) : (
                        'Annuler'
                      )}
                    </button>

                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReservations.length === 0 && (
        <div className="empty-state">
          <Calendar size={48} />
          <h3>Aucune réservation trouvée</h3>
          <p>Aucune réservation ne correspond à vos critères de recherche.</p>
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;
