import axios from "axios";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const http = axios.create({
  baseURL: apiBaseURL,
  withCredentials: false,
});

// Auth: ajoute le token si présent
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Log des erreurs (pour voir le vrai message 500)
http.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", {
      url: err.config?.url,
      method: err.config?.method,
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    });
    return Promise.reject(err);
  }
);

export type AdminStats = {
  totalClubs: number;
  totalJoueurs: number;
  reservationsHebdomadaires: number;
  croissanceClubs: number;      
  croissanceJoueurs: number; 
};

export type ClubAdmin = {
  id: number;
  nom: string;                 // plus de nomClub
  adresse?: string;
  telephone?: string;
  emailResponsable?: string;
  nomResponsable?: string;
  login?: string;              // renvoyé à la création
  password?: string;           // renvoyé à la création
  sport?: string;              // "PADEL, FOOT5"
  ville?: string;
};

export type JoueurAdmin = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateInscription?: string;
  actif: boolean;
};

export type CreateClubRequest = {
  nom: string;                 // remplace nomClub
  adresse: string;
  telephone: string;
  sport?: string;
  ville: string;
  nomResponsable: string;
  emailResponsable: string;
  telephoneResponsable: string;
};
export type RegisterRequest = {
  nom: string;
  email: string;
  motDePasse: string;
  role: string; // "JOUEUR"
};

export const adminService = {
  // Dashboard
  getStats: () => http.get<AdminStats>("/api/admin/stats"),

  // Clubs
  getAllClubs: () => http.get<ClubAdmin[]>("/api/admin/clubs"),
  searchClubs: (q: string) =>
    http.get<ClubAdmin[]>("/api/admin/clubs/search", { params: { query: q } }),
  createClub: (payload: CreateClubRequest) =>
    http.post<ClubAdmin>("/api/admin/clubs", payload),

  // Joueurs
  getAllJoueurs: () => http.get<JoueurAdmin[]>("/api/admin/joueurs"),
  searchJoueurs: (q: string) =>
    http.get<JoueurAdmin[]>("/api/admin/joueurs/search", { params: { query: q } }),
  getJoueurDetails: (id: number) => http.get<JoueurAdmin>("/api/admin/joueurs/" + id),
  toggleJoueurStatus: (id: number) =>
    http.patch<JoueurAdmin>("/api/admin/joueurs/" + id + "/toggle-status", {}),
  createJoueur: (payload: RegisterRequest) =>
    http.post<JoueurAdmin>("/api/admin/joueurs", payload),
};
