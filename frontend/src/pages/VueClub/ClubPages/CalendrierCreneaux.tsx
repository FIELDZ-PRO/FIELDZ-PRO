import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import './style/CalendrierCreneaux.css';
import { fetchCreneaux } from '../../../services/ClubService';
import { Creneau, Terrain } from '../../../types';

const CalendrierCreneaux: React.FC = () => {
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [terrains, setTerrains] = useState<Terrain[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  // Générer les 7 jours de la semaine (Dimanche à Samedi)
  const getWeekDays = (date: Date) => {
    const days = [];
    const current = new Date(date);
    
    // Trouver le dimanche de la semaine
    const day = current.getDay();
    const diff = current.getDate() - day;
    current.setDate(diff);

    for (let i = 0; i < 7; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const weekDays = getWeekDays(selectedWeek);

  // Générer les heures de 08:00 à 00:00
  const generateHours = () => {
    const hours = [];
    for (let h = 8; h <= 23; h++) {
      hours.push(`${String(h).padStart(2, '0')}:00`);
    }
    hours.push('00:00');
    return hours;
  };

  const hours = generateHours();

  // Charger les terrains puis les créneaux
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8080/api/terrains', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Erreur chargement terrains');
        const terrainsData = await res.json();
        setTerrains(terrainsData);
        
        // Charger les créneaux
        const creneauxData = await fetchCreneaux(terrainsData);
        setCreneaux(creneauxData);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDayHeader = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      day: 'numeric' 
    });
  };

  // Naviguer entre les semaines
  const previousWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedWeek(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedWeek(newDate);
  };

  const goToToday = () => {
    setSelectedWeek(new Date());
  };

  // Extraire la date d'un ISO DateTime
  const getDatePart = (isoDateTime: string) => {
    if (!isoDateTime) return '';
    return isoDateTime.split('T')[0]; // "2025-10-27T15:00:00" -> "2025-10-27"
  };

  // Extraire l'heure d'un ISO DateTime
  const getTimePart = (isoDateTime: string) => {
    if (!isoDateTime) return '';
    const date = new Date(isoDateTime);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Convertir une heure en nombre pour comparaison
  const timeToNumber = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h + m / 60;
  };

  // Filtrer les créneaux de la semaine affichée
  const getWeekCreneaux = () => {
    const startDate = formatDate(weekDays[0]);
    const endDate = formatDate(weekDays[6]);
    
    return creneaux.filter(c => {
      const creneauDate = getDatePart(c.dateDebut);
      return creneauDate >= startDate && creneauDate <= endDate;
    });
  };

  const weekCreneaux = getWeekCreneaux();

  // Trouver les créneaux pour un jour et une heure spécifiques
  const getCreneauxForSlot = (date: Date, hour: string) => {
    const dateStr = formatDate(date);
    const slotHour = timeToNumber(hour);
    
    return weekCreneaux.filter(c => {
      const creneauDate = getDatePart(c.dateDebut);
      if (creneauDate !== dateStr) return false;
      
      const debutTime = getTimePart(c.dateDebut);
      const finTime = getTimePart(c.dateFin);
      
      const debutHour = timeToNumber(debutTime);
      const finHour = timeToNumber(finTime);
      
      return slotHour >= debutHour && slotHour < finHour;
    });
  };

  // Calculer la hauteur d'un créneau
  const calculateCreneauHeight = (creneau: Creneau) => {
    const debut = timeToNumber(getTimePart(creneau.dateDebut));
    const fin = timeToNumber(getTimePart(creneau.dateFin));
    return (fin - debut) * 60; // 60px par heure
  };

  // Vérifier si c'est le début du créneau
  const isCreneauStart = (creneau: Creneau, hour: string) => {
    const slotHour = timeToNumber(hour);
    const debutHour = timeToNumber(getTimePart(creneau.dateDebut));
    return Math.abs(slotHour - debutHour) < 0.1;
  };

  return (
    <div className="calendrier-creneaux-page">
      {/* Header avec navigation */}
      <div className="calendar-header">
        <h1>Planning hebdomadaire</h1>
        
        <div className="calendar-navigation">
          <button className="btn-nav" onClick={previousWeek}>
            <ChevronLeft size={20} />
          </button>
          
          <button className="btn-today" onClick={goToToday}>
            <CalendarIcon size={16} />
            Aujourd'hui
          </button>
          
          <button className="btn-nav" onClick={nextWeek}>
            <ChevronRight size={20} />
          </button>
          
          <span className="week-range">
            {weekDays[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
            {' - '}
            {weekDays[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <p>Chargement...</p>
        </div>
      )}

      {/* Planning */}
      <div className="calendar-grid-container">
        <div className="calendar-grid">
          {/* Header des jours */}
          <div className="calendar-header-row">
            <div className="time-column-header">Heure</div>
            {weekDays.map((day, idx) => (
              <div key={idx} className="day-header">
                {formatDayHeader(day)}
              </div>
            ))}
          </div>

          {/* Lignes du planning */}
          <div className="calendar-body">
            {hours.map((hour, hourIdx) => (
              <div key={hourIdx} className="calendar-row">
                {/* Colonne des heures */}
                <div className="time-cell">{hour}</div>

                {/* Colonnes des jours */}
                {weekDays.map((day, dayIdx) => {
                  const creneauxInSlot = getCreneauxForSlot(day, hour);
                  
                  return (
                    <div key={dayIdx} className="day-cell">
                      {creneauxInSlot.map(creneau => {
                        // N'afficher la carte que si c'est le début du créneau
                        if (!isCreneauStart(creneau, hour)) return null;

                        const height = calculateCreneauHeight(creneau);
                        
                        return (
                          <div
                            key={creneau.id}
                            className="creneau-card"
                            style={{ height: `${height}px` }}
                          >
                            <div className="creneau-time">
                              {getTimePart(creneau.dateDebut)} - {getTimePart(creneau.dateFin)}
                            </div>
                            <div className="creneau-terrain">
                              {creneau.terrain?.nomTerrain || 'Terrain'}
                            </div>
                            <div className="creneau-statut">
                              {creneau.statut}
                            </div>
                            <div className="creneau-prix">{creneau.prix} DZD</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="calendar-stats">
        <div className="stat-item">
          <span className="stat-value">{weekCreneaux.length}</span>
          <span className="stat-label">Créneaux cette semaine</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {weekCreneaux.filter(c => c.statut === 'LIBRE').length}
          </span>
          <span className="stat-label">Disponibles</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {weekCreneaux.filter(c => c.statut === 'RESERVE').length}
          </span>
          <span className="stat-label">Réservés</span>
        </div>
      </div>
    </div>
  );
};

export default CalendrierCreneaux;