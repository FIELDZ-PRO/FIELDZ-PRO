import apiClient from './client';
import { Creneau, CreateCreneauRequest, CreateCreneauRecurrentRequest } from '../types';

/**
 * Récupère tous les créneaux du club avec pagination
 */
export const getMyCreneaux = async (page: number = 0, size: number = 20): Promise<{ content: Creneau[]; totalElements: number }> => {
  const response = await apiClient.get(`/api/creneaux`, {
    params: { page, size },
  });
  return response.data;
};

/**
 * Récupère les créneaux d'un terrain spécifique
 */
export const getTerrainCreneaux = async (terrainId: number, page: number = 0, size: number = 20): Promise<{ content: Creneau[]; totalElements: number }> => {
  const response = await apiClient.get(`/api/creneaux/terrains/${terrainId}`, {
    params: { page, size },
  });
  return response.data;
};

/**
 * Crée un créneau unique
 */
export const createCreneau = async (terrainId: number, data: CreateCreneauRequest): Promise<Creneau> => {
  const response = await apiClient.post<Creneau>(`/api/creneaux/terrains/${terrainId}/creneaux`, data);
  return response.data;
};

/**
 * Crée des créneaux récurrents
 */
export const createCreneauRecurrent = async (data: CreateCreneauRecurrentRequest): Promise<{ created: number; message: string }> => {
  const response = await apiClient.post('/api/creneaux/recurrent', data);
  return response.data;
};

/**
 * Met à jour un créneau existant
 */
export const updateCreneau = async (creneauId: number, data: Partial<CreateCreneauRequest>): Promise<Creneau> => {
  const response = await apiClient.put<Creneau>(`/api/creneaux/${creneauId}`, data);
  return response.data;
};

/**
 * Annule un créneau
 */
export const cancelCreneau = async (creneauId: number): Promise<void> => {
  await apiClient.put(`/api/creneaux/${creneauId}/annuler`);
};

/**
 * Supprime un créneau (avec option force pour annuler les réservations)
 */
export const deleteCreneau = async (creneauId: number, force: boolean = false): Promise<{ creneauId: number; reservationsAnnulees: number; deleted: boolean }> => {
  const response = await apiClient.delete(`/api/creneaux/${creneauId}`, {
    params: { force },
  });
  return response.data;
};
