/**
 * Utilitaires pour transformer les données de l'API
 * et garantir que les types sont corrects pour React Native
 */

import { Creneau } from '../types';

/**
 * Convertit une valeur en vrai boolean
 * Gère les cas où l'API renvoie "true"/"false" comme strings
 */
export const toBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  if (typeof value === 'number') return value !== 0;
  return Boolean(value);
};

/**
 * Transforme un créneau pour garantir que disponible est un boolean
 */
export const transformCreneau = (creneau: any): Creneau => {
  return {
    ...creneau,
    disponible: toBoolean(creneau.disponible),
  };
};

/**
 * Transforme une liste de créneaux
 */
export const transformCreneaux = (creneaux: any[]): Creneau[] => {
  return creneaux.map(transformCreneau);
};

/**
 * Transforme une réponse paginée de créneaux
 */
export const transformCreneauxPage = (page: any): { content: Creneau[]; totalElements: number } => {
  return {
    content: transformCreneaux(page.content || []),
    totalElements: page.totalElements || 0,
  };
};
