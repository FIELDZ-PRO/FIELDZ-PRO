import React, { useEffect, useMemo, useState } from 'react';
import { Search, CalendarDays, Filter, RotateCcw } from 'lucide-react';
import { Terrain, Creneau, Reservation } from '../../../../../shared/types';
import { fetchCreneaux } from '../../../../../shared/services/ClubService';
import CreneauCard from '../../../../../shared/components/molecules/CreneauCard';
import apiClient from '../../../../../shared/api/axiosClient';
import { LoadingSpinner } from '../LoadingScreen';
import './style/CreneauxManagement.css';

type Props = {
    terrains: Terrain[];
    reservations: Reservation[];
    setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
};

/* =========================
* Helpers robustes (BDD)
* ========================= */
const getTerrainId = (t: Terrain): number | string =>
    (t as any).id ?? (t as any).terrainId ?? (t as any).uuid ?? '';

const getTerrainName = (t: Terrain): string => {
    return (
        (t as any).nomTerrain ??
        (t as any).NOM_TERRAIN ??
        (t as any).name ??
        (t as any).nom ??
        (t as any).libelle ??
        (t as any).label ??
        `Terrain #${getTerrainId(t)}`
    );
};

const getTerrainSportRaw = (t: Terrain): string | undefined =>
    (t as any).sport ??
    (t as any).SPORT ??
    (t as any).typeSport ??
    (t as any).discipline ??
    (t as any).surface ??
    (t as any).TYPE_SURFACE;

const norm = (s?: string) => (s ? s.toString().trim() : '');

const getTerrainSport = (t: Terrain): string => {
    const val = norm(getTerrainSportRaw(t));
    if (!val) return '';
    const lower = val.toLowerCase();
    if (lower === 'padel') return 'Padel';
    if (lower === 'foot5' || lower === 'foot 5' || lower === 'foot') return 'Foot5';
    // Capitalisation simple par défaut
    return val.charAt(0).toUpperCase() + val.slice(1);
};

const dateKeyLocal = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const CreneauxManagement: React.FC<Props> = ({ reservations, setReservations }) => {
    const [creneaux, setCreneaux] = useState<Creneau[]>([]);
    const [terrains, setTerrains] = useState<Terrain[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    /* ========= états de filtres ========= */
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedSport, setSelectedSport] = useState<string>('Tous');
    const [selectedTerrainId, setSelectedTerrainId] = useState<string>('Tous');
    const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD

    /* ========= Index terrains ========= */
    const terrainById = useMemo(() => {
        const m = new Map<string, Terrain>();
        terrains.forEach(t => m.set(String(getTerrainId(t)), t));
        return m;
    }, [terrains]);

    /* ========= Liste des sports (normalisés) ========= */
    const sports = useMemo(() => {
        const set = new Set<string>();
        terrains.forEach(t => {
            const s = getTerrainSport(t);
            if (s) set.add(s);
        });
        return Array.from(set);
    }, [terrains]);

    /* ========= Chargement des créneaux ========= */
    const loadCreneaux = async (terrainsToFetch: Terrain[]) => {
        try {
            if (terrainsToFetch.length === 0) {
                console.log('No terrains available to fetch creneaux');
                setCreneaux([]);
                return;
            }
            const data: Creneau[] = await fetchCreneaux(terrainsToFetch);
            setCreneaux(data);
        } catch (error) {
            console.error('Erreur lors du chargement des créneaux', error);
            setCreneaux([]);
        }
    };

    const refreshCreneaux = async () => {
        await loadCreneaux(terrains);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data } = await apiClient.get('/api/terrains');
                console.log('Terrains loaded:', data);
                setTerrains(data);
                await loadCreneaux(data);
            } catch (err) {
                console.error('Erreur lors du chargement des données', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ========= Date du jour (00:00) ========= */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /* ========= Tri "é venir" ========= */
    const upcomingCreneaux = useMemo(() => {
        return creneaux
            .filter(c => new Date(c.dateDebut) >= today)
            .sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime());
    }, [creneaux]);

    /* ========= Get reservation name for creneau ========= */
    const getReservantName = (creneauId: number): string | null => {
        const reservation = reservations.find(r => (r.creneau as any)?.id === creneauId);
        if (!reservation) return null;

        // Check for manual reservation name first
        if ((reservation as any).nomReservant) {
            return (reservation as any).nomReservant;
        }

        // Fall back to player name
        const nom = (reservation.joueur as any)?.nom || '';
        const prenom = (reservation.joueur as any)?.prenom || '';
        return nom || prenom ? `${nom} ${prenom}`.trim() : null;
    };

    /* ========= Application des filtres ========= */
    const filteredCreneaux = useMemo(() => {
        return upcomingCreneaux.filter((c) => {
            const tId =
                (c as any).terrainId ??
                (c as any).terrain_id ??
                (c as any).terrain?.id;

            const terrain = tId != null ? terrainById.get(String(tId)) : undefined;

            const terrainName =
                (c as any).terrainNom ??
                (terrain ? getTerrainName(terrain) : '');

            const sport =
                (c as any).sport ??
                (terrain ? getTerrainSport(terrain) : '');

            // Get reservation name for this creneau
            const reservantName = getReservantName((c as any).id);

            const matchesSearch =
                !searchTerm ||
                terrainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (reservantName && reservantName.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesSport =
                selectedSport === 'Tous' || sport.toLowerCase() === selectedSport.toLowerCase();

            const matchesTerrain =
                selectedTerrainId === 'Tous' ||
                (tId != null && String(tId) === selectedTerrainId);

            const matchesDate =
                !selectedDate ||
                dateKeyLocal(new Date(c.dateDebut)) === selectedDate;

            return matchesSearch && matchesSport && matchesTerrain && matchesDate;
        });
    }, [upcomingCreneaux, searchTerm, selectedSport, selectedTerrainId, selectedDate, terrainById, reservations]);

    /* ========= Reset filtres ========= */
    const resetFilters = () => {
        setSearchTerm('');
        setSelectedSport('Tous');
        setSelectedTerrainId('Tous');
        setSelectedDate('');
    };

    if (loading) {
        return (
            <div className="creneaux-management-page">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="creneaux-management-page">
            <div className="page-header">
                <h1>Gestion des créneaux</h1>
                <div className="header-stats">
                    <div className="stat-item">
                        <span className="stat-value2">{upcomingCreneaux.length}</span>
                        <span className="stat-label2">Créneaux à venir</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value2">{filteredCreneaux.length}</span>
                        <span className="stat-label2">Affichés</span>
                    </div>
                </div>
            </div>

            {/* Barre de filtres  style FIELDZ unifié */}
            <div className="filters-bar">
                {/* Recherche */}
                <label className="fz-control">
                    <span className="fz-icon"><Search size={18} /></span>
                    <input
                        type="text"
                        placeholder="Rechercher par terrain ou réservant..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="fz-input"
                    />
                </label>

                {/* Sport */}
                <label className="fz-control">
                    <span className="fz-icon"><Filter size={18} /></span>
                    <select
                        value={selectedSport}
                        onChange={(e) => setSelectedSport(e.target.value)}
                        className="fz-select"
                    >
                        <option value="Tous">Tous les sports</option>
                        {sports.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </label>

                {/* Terrain */}
                <label className="fz-control">
                    <span className="fz-icon"><Filter size={18} /></span>
                    <select
                        value={selectedTerrainId}
                        onChange={(e) => setSelectedTerrainId(e.target.value)}
                        className="fz-select"
                    >
                        <option value="Tous">Tous les terrains</option>
                        {terrains.map((t) => (
                            <option key={String(getTerrainId(t))} value={String(getTerrainId(t))}>
                                {getTerrainName(t)}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Date */}
                <label className="fz-control">
                    <span className="fz-icon"><CalendarDays size={18} /></span>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="fz-input"
                    />
                </label>

                <button
                    onClick={resetFilters}
                    className="btn-reset"
                    type="button"
                >
                    <RotateCcw size={16} />
                    <span>Réinitialiser</span>
                </button>
            </div>

            {/* Liste filtrée - Only show if there are creneaux */}
            {upcomingCreneaux.length > 0 ? (
                <div className="creneaux-list-container">
                    {filteredCreneaux.length > 0 ? (
                        <div className="creneaux-grid">
                            {filteredCreneaux.map((creneau) => (
                                <CreneauCard
                                    key={creneau.id}
                                    creneau={creneau}
                                    role="club"
                                    onUpdate={refreshCreneaux}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <CalendarDays size={48} />
                            <h3>Aucun créneau trouvé</h3>
                            <p>Aucun créneau ne correspond à vos critères de recherche.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="empty-state">
                    <CalendarDays size={48} />
                    <h3>Aucun créneau à venir</h3>
                    <p>Il n'y a actuellement aucun créneau disponible. Créez-en un pour commencer.</p>
                </div>
            )}
        </div>
    );
};

export default CreneauxManagement;
