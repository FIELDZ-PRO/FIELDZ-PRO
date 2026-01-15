import apiClient from './client';
import { Reservation } from '../types';

/**
 * Récupère toutes les réservations du club
 */
export const getMyReservations = async (): Promise<Reservation[]> => {
  const response = await apiClient.get<Reservation[]>('/api/reservations/reservations');
  return response.data;
};

/**
 * Récupère les réservations pour une date spécifique
 */
export const getReservationsByDate = async (date: string): Promise<Reservation[]> => {
  const response = await apiClient.get<Reservation[]>('/api/reservations/reservations/date', {
    params: { date },
  });
  return response.data;
};

/**
 * Confirme la présence d'un joueur (marque comme présent)
 */
export const confirmReservation = async (reservationId: number): Promise<Reservation> => {
  const response = await apiClient.patch<Reservation>(`/api/reservations/${reservationId}/confirmer`);
  return response.data;
};

/**
 * Marque un joueur comme absent
 */
export const markAbsent = async (reservationId: number, motif?: string): Promise<Reservation> => {
  const response = await apiClient.put<Reservation>(`/api/reservations/${reservationId}/absent`, {
    motifAnnulation: motif,
  });
  return response.data;
};

/**
 * Annule une réservation
 */
export const cancelReservation = async (reservationId: number, motif?: string): Promise<Reservation> => {
  const response = await apiClient.put<Reservation>(`/api/reservations/${reservationId}/annuler`, {
    motifAnnulation: motif,
  });
  return response.data;
};

/**
 * Récupère les statistiques du jour
 */
export const getTodayStats = async (): Promise<{
  totalReservations: number;
  confirmedReservations: number;
  revenue: number;
}> => {
  const today = new Date().toISOString().split('T')[0];
  const reservations = await getReservationsByDate(today);

  const totalReservations = reservations.length;
  const confirmedReservations = reservations.filter(r => r.statut === 'CONFIRMEE').length;
  const revenue = reservations
    .filter(r => r.statut === 'CONFIRMEE' || r.statut === 'RESERVE')
    .reduce((sum, r) => sum + r.creneau.prix, 0);

  return {
    totalReservations,
    confirmedReservations,
    revenue,
  };
};
