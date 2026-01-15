import apiClient from './client';
import { Club, ClubImage } from '../types';

/**
 * Récupère les informations du club connecté
 */
export const getMyClub = async (): Promise<Club> => {
  const response = await apiClient.get<Club>('/api/club/me');
  return response.data;
};

/**
 * Met à jour les informations du club
 */
export const updateClub = async (data: Partial<Club>): Promise<Club> => {
  const response = await apiClient.put<Club>('/api/utilisateur/update', data);
  return response.data;
};

/**
 * Upload une nouvelle image pour le club
 */
export const uploadClubImage = async (formData: FormData): Promise<ClubImage> => {
  const response = await apiClient.post<ClubImage>('/api/club/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Récupère toutes les images d'un club
 */
export const getClubImages = async (clubId: number): Promise<string[]> => {
  const response = await apiClient.get<string[]>(`/api/club/${clubId}/images`);
  return response.data;
};

/**
 * Supprime une image du club
 */
export const deleteClubImage = async (imageId: number): Promise<void> => {
  await apiClient.delete(`/api/club/images/${imageId}`);
};

/**
 * Met à jour l'ordre d'affichage d'une image
 */
export const updateImageOrder = async (imageId: number, order: number): Promise<void> => {
  await apiClient.put(`/api/club/images/${imageId}/order`, null, {
    params: { order },
  });
};
