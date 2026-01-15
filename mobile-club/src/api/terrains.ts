import apiClient from './client';
import { Terrain, CreateTerrainRequest, UpdateTerrainRequest } from '../types';

/**
 * Récupère tous les terrains du club connecté
 */
export const getMyTerrains = async (): Promise<Terrain[]> => {
  const response = await apiClient.get<Terrain[]>('/api/terrains');
  return response.data;
};

/**
 * Crée un nouveau terrain
 */
export const createTerrain = async (data: CreateTerrainRequest): Promise<Terrain> => {
  const response = await apiClient.post<Terrain>('/api/terrains', data);
  return response.data;
};

/**
 * Met à jour un terrain existant
 */
export const updateTerrain = async (terrainId: number, data: UpdateTerrainRequest): Promise<Terrain> => {
  const response = await apiClient.put<Terrain>(`/api/terrains/${terrainId}`, data);
  return response.data;
};

/**
 * Supprime un terrain
 */
export const deleteTerrain = async (terrainId: number): Promise<void> => {
  await apiClient.delete(`/api/terrains/${terrainId}`);
};
