import apiClient from './client';
import { Reservation, Creneau, Club } from '../types';

/**
 * Récupère les réservations du joueur connecté
 */
export const getMyReservations = async (): Promise<Reservation[]> => {
  const response = await apiClient.get<Reservation[]>('/api/reservations/mes-reservations');
  return response.data;
};

/**
 * Créer une nouvelle réservation
 */
export const createReservation = async (creneauId: number): Promise<Reservation> => {
  const response = await apiClient.post<Reservation>('/api/reservations', { creneauId });
  return response.data;
};

/**
 * Annuler une réservation
 */
export const cancelReservation = async (
  reservationId: number,
  motif?: string
): Promise<Reservation> => {
  const response = await apiClient.put<Reservation>(
    `/api/reservations/${reservationId}/annuler`,
    { motifAnnulation: motif }
  );
  return response.data;
};

/**
 * Récupère les créneaux disponibles
 */
export const getCreneauxDisponibles = async (
  date?: string,
  sport?: string,
  ville?: string
): Promise<Creneau[]> => {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  if (sport) params.append('sport', sport);
  if (ville) params.append('ville', ville);

  const response = await apiClient.get<Creneau[]>(
    `/api/creneaux/disponibles?${params.toString()}`
  );
  return response.data;
};

/**
 * Récupère la liste des clubs par ville
 */
export const getClubsByVille = async (ville: string): Promise<Club[]> => {
  const response = await apiClient.get<Club[]>('/api/club/search/by-ville', {
    params: { ville }
  });
  return response.data;
};

/**
 * Récupère la liste des clubs par sport
 */
export const getClubsBySport = async (sport: string): Promise<Club[]> => {
  const response = await apiClient.get<Club[]>('/api/club/search/by-sport', {
    params: { sport }
  });
  return response.data;
};

/**
 * Récupère les détails d'un club
 */
export const getClubById = async (clubId: number): Promise<Club> => {
  const response = await apiClient.get<Club>(`/api/club/${clubId}`);
  return response.data;
};

/**
 * Récupère les créneaux disponibles d'un club
 * @param clubId - ID du club
 * @param date - Date au format YYYY-MM-DD (optionnel)
 * @param sport - Sport (ex: PADEL, FOOTBALL) (optionnel)
 */
export const getClubCreneaux = async (
  clubId: number,
  date?: string,
  sport?: string
): Promise<Creneau[]> => {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  if (sport) params.append('sport', sport);

  const response = await apiClient.get<Creneau[]>(
    `/api/creneaux/club/${clubId}${params.toString() ? `?${params.toString()}` : ''}`
  );
  return response.data;
};
