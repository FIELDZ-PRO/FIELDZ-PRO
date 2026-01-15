import apiClient from './client';
import { Joueur } from '../types';

/**
 * Récupère le profil du joueur connecté
 */
export const getMyProfile = async (): Promise<Joueur> => {
  const response = await apiClient.get<Joueur>('/api/joueurs/me');
  return response.data;
};

/**
 * Met à jour le profil du joueur
 */
export const updateProfile = async (data: Partial<Joueur>): Promise<Joueur> => {
  const response = await apiClient.put<Joueur>('/api/joueurs/me', data);
  return response.data;
};

/**
 * Met à jour le mot de passe
 */
export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  await apiClient.put('/api/joueurs/me/password', {
    currentPassword,
    newPassword,
  });
};
