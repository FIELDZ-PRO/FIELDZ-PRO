import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin';

// Intercepteur pour ajouter le token automatiquement
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface AdminStats {
  totalClubs: number;
  totalJoueurs: number;
  reservationsHebdomadaires: number;
}

export interface ClubAdmin {
  id: number;
  nomClub: string;
  nom: string;
  adresse: string;
  telephone: string;
  emailResponsable: string;
  nomResponsable: string;
  login: string;
  password: string;
  sport: string;
  ville: string;
}

export interface CreateClubRequest {
  nomClub: string;
  adresse: string;
  telephone: string;
  sport: string;
  ville: string;
  nomResponsable: string;
  emailResponsable: string;
  telephoneResponsable: string;
}

export interface JoueurAdmin {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateInscription: string;
  actif: boolean;
}

// Services
export const adminService = {
  // Dashboard
  getStats: () => api.get<AdminStats>('/stats'),

  // Clubs
  getAllClubs: () => api.get<ClubAdmin[]>('/clubs'),
  searchClubs: (query: string) => api.get<ClubAdmin[]>(`/clubs/search?query=${query}`),
  getClubDetails: (id: number) => api.get<ClubAdmin>(`/clubs/${id}`),
  createClub: (data: CreateClubRequest) => api.post<ClubAdmin>('/clubs', data),

  // Joueurs
  getAllJoueurs: () => api.get<JoueurAdmin[]>('/joueurs'),
  searchJoueurs: (query: string) => api.get<JoueurAdmin[]>(`/joueurs/search?query=${query}`),
  getJoueurDetails: (id: number) => api.get<JoueurAdmin>(`/joueurs/${id}`),
  toggleJoueurStatus: (id: number) => api.patch<JoueurAdmin>(`/joueurs/${id}/toggle-status`),
};