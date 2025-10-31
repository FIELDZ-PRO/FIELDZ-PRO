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
} from '../../../services/ClubService';

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

function hasStartedLocal(res: ReservationSummary) {
  return Date.now() >= combineStartDateLocal(res).getTime();
}

function startAtLocalString(res: ReservationSummary) {
  const start = combineStartDateLocal(res);
  const d = start.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const t = start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${d} à ${t}`;
}


function allowedAtLocalString(res: ReservationSummary) {
  const allowed = new Date(combineStartDateLocal(res).getTime() + GRACE_MINUTES * 60 * 1000);
  const d = allowed.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const t = allowed.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${d} à ${t}`;
}

function canUsePostStartAction(res: ReservationSummary) {
  const start = combineStartDateLocal(res).getTime();
  return Date.now() >= start + GRACE_MINUTES * 60 * 1000;
}

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<ReservationSummary[]>([]);
  const [filterStatus, setFilterStatus] = useState<'RESERVE' | 'Toutes' | 'CONFIRMEE' | 'ABSENT' | 'Annulées' | 'ANNULE_PAR_JOUEUR' | 'ANNULE_PAR_CLUB'>('RESERVE'); // ✅ défaut = À venir
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  // Boutons "Absent" et "Annuler" actifs à T0+15min
  const canMarkAbsent = (r: ReservationSummary) => {
    if (r.status !== 'RESERVE' && r.status !== 'CONFIRMEE') return false;
    const start = combineStartDateLocal(r).getTime();
    return Date.now() >= start + GRACE_MINUTES * 60 * 1000;
  };

  type Action = 'confirm' | 'cancel' | 'absent';

const handleReservationAction = async (id: number, action: Action) => {
  const res = reservations.find(r => r.id === id);
  if (!res) return;

  // Garde-fous UX (ne lancent PAS d'appel réseau)
  if (action === 'confirm' && !hasStartedLocal(res)) {
    alert(`“Présent” sera disponible au début du créneau (${startAtLocalString(res)}).`);
    return;
  }

  if (action === 'absent' && !canUsePostStartAction(res)) {
    alert(`“Absent” sera disponible à partir de ${allowedAtLocalString(res)} (soit ${GRACE_MINUTES} min après le début).`);
    return;
  }

  // Branche ANNULER : confirmations AVANT le spinner / l'API
  if (action === 'cancel') {
    const confirmed = window.confirm("Confirmer l’annulation de cette réservation ?");
    if (!confirmed) return;

    const motifInput = window.prompt("Motif d'annulation (visible par le joueur) :");
    if (motifInput === null) return; // l'utilisateur a annulé le prompt → on sort
    const motif = motifInput.trim() || "Annulé par le club";

    setLoadingId(id);
    try {
      await cancelReservationByClub(id, motif);
      updateReservationStatus(id, 'ANNULE_PAR_CLUB');
    } catch (error) {
      console.error('Erreur lors de l’annulation :', error);
      alert((error as Error).message || 'Une erreur est survenue lors de l’annulation.');
    } finally {
      setLoadingId(null);
    }
    return; // on sort : on a géré l’action cancel
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
    alert((error as Error).message || 'Une erreur est survenue. Veuillez réessayer.');
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

  return (
    <div className="reservations-page">
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
                  {reservation.nom} {reservation.prenom}
                </div>
                <div className="client-phone">{reservation.telephone}</div>
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
  className="btn2 btn2-success"
  disabled={loadingId === reservation.id}  // ❌ on ne bloque plus avant le début
  onClick={() => handleReservationAction(reservation.id, 'confirm')}
  title={
    !hasStartedLocal(reservation)
      ? `Disponible au début du créneau (${startAtLocalString(reservation)})`
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
                      className={`btn2 btn2-danger ${!canUsePostStartAction(reservation) ? 'btn2-disabled' : ''}`}
                      disabled={loadingId === reservation.id}
                      title={
                        !canUsePostStartAction(reservation)
                          ? `Disponible à partir de ${allowedAtLocalString(reservation)}`
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
  className="btn2 btn2-warning"
  disabled={loadingId === reservation.id}
  onClick={() => handleReservationAction(reservation.id, 'cancel')}
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
