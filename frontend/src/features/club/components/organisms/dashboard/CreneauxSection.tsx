import React, { useEffect, useMemo, useState } from 'react';
import CreneauFormSection from './CreneauFormSection';
import CreneauRecurrentFormSection from './CreneauRecurrentFormSection';
import { Reservation, Terrain } from '../../../../../shared/types/index';
import { useAuth } from '../../../../../shared/context/AuthContext';
import { Creneau } from '../../../../../shared/types/index';
import CreneauGroup from './CreneauGroup';
import './CreneauxSection.css';
import { fetchCreneaux } from '../../../../../shared/services/ClubService';
import { Search, CalendarDays, Filter } from 'lucide-react';
import apiClient from '../../../../../shared/api/axiosClient';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

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

const CreneauxSection: React.FC<Props> = ({ terrains, reservations, setReservations }) => {
  const { token } = useAuth();
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);

  /* ========= Etats de filtres ========= */
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
  const waitCreneaux = async () => {
    try {
      const data: Creneau[] = await fetchCreneaux(terrains);
      setCreneaux(data);
    } catch (error) {
      console.error('Erreur lors du chargement des créneaux', error);
    }
  };

  useEffect(() => {
    waitCreneaux();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ========= Date du jour (00:00) ========= */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /* ========= Tri "à venir" ========= */
  const upcomingCreneaux = useMemo(() => {
    return creneaux
      .filter(c => new Date(c.dateDebut) >= today)
      .sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime());
  }, [creneaux]);

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

      const matchesSearch =
        !searchTerm || terrainName.toLowerCase().includes(searchTerm.toLowerCase());

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
  }, [upcomingCreneaux, searchTerm, selectedSport, selectedTerrainId, selectedDate, terrainById]);

  /* ========= Ajout ponctuel ========= */
  const handleAddCreneauPonctuel = async (data: any) => {
    try {
      const { terrainId, dateDebut, dateFin, prix } = data;

      const res = await fetch(`${API_BASE}/creneaux/terrains/${terrainId}/creneaux`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dateDebut, dateFin, prix: Number(prix) }),
      });

      const text = await res.text();

      if (!res.ok) {
        if (res.status === 409) {
          alert('❌ Ce créneau chevauche un créneau déjà existant.');
        } else {
          alert('❌' + text);
        }
        return;
      }

      const created = JSON.parse(text);
      alert(`✅ Créneau ajouté pour le ${new Date(created.dateDebut).toLocaleString('fr-FR')}`);
      await waitCreneaux();
    } catch (err) {
      console.error(err);
      alert('❌ Erreur inconnue lors de l’ajout du créneau');
    }
  };

  /* ========= Ajout récurrent ========= */
  const handleAddCreneauxRecurrents = async (data: any) => {
    try {
      const { data: response } = await apiClient.post('/api/creneaux/recurrent', data);

      await waitCreneaux();

      // Return the response for the custom alert
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  /* ========= Reset filtres ========= */
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSport('Tous');
    setSelectedTerrainId('Tous');
    setSelectedDate('');
  };

  return (
    <div className="flex flex-col gap-10">
      {/* 🏟️ Section 1: Créneaux ponctuels */}
      <div className="section-wrapper">
        <section>
          <div className="section-title">Ajout de créneaux ponctuels</div>
          <CreneauFormSection terrains={terrains} onSubmit={handleAddCreneauPonctuel} />
        </section>
      </div>

      {/* ♻️ Section 2: Créneaux récurrents */}
      <div className="section-wrapper">
        <section>
          <div className="section-title">Ajout de créneaux récurrents</div>
          <CreneauRecurrentFormSection terrains={terrains} onSubmit={handleAddCreneauxRecurrents} />
        </section>
      </div>

      {/* 📅 Section 3: Créneaux à venir + Filtres */}
      <div className="section-wrapper">
        <section>
          <h2 className="text-2xl font-bold mb-4">Créneaux à venir</h2>

          {/* Barre de filtres — style FIELDZ unifié */}
          <div className="filters-bar">
            {/* Recherche */}
            <label className="fz-control">
              <span className="fz-icon"><Search size={18} /></span>
              <input
                type="text"
                placeholder="Rechercher par nom de terrain…"
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
              Réinitialiser
            </button>
          </div>

          {/* Liste filtrée */}
          <CreneauGroup
            titre="Tous les créneaux à venir"
            creneaux={filteredCreneaux}
            UpdateCreneaux={waitCreneaux}
          />
        </section>
      </div>
    </div>
  );
};

export default CreneauxSection;
