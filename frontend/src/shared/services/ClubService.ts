import { InvalidTokenError, jwtDecode } from "jwt-decode";
import { Terrain, Creneau, ClubImage } from "../types";
import apiClient from "../api/axiosClient";

const UrlService = "http://localhost:8080/api";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const ACCESS_TOKEN_KEY = "access_token";

/* =======================
 * Types
 * =======================
 */
export type LoginResponse = {
  token: string;
};

export interface ReservationSummary {
  id: number;
  nom: string;
  prenom: string;
  date: string;
  status: string;
  prix: number;
  telephone: string;
  photoProfilUrl: string;
  terrain: string;
  heureDebut: string;
  heureFin: string;
  nomReservant?: string; // For manual reservations without a player account
}

interface TokenPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

export type ClubDto = {
  id: number;
  nom: string;
  ville?: string;
  adresse?: string;
  telephone?: string;
  images?: ClubImage[];  // Changed from imageUrls to images array with IDs for deletion
  description?: string;
  politique?: string;
  sport?: string;
  sports?: string[];
};

export type CreateCreneauPayload = {
  /**
   * ⚠️ Doit être une chaîne locale SANS timezone:
   * "YYYY-MM-DDTHH:mm:ss" (ex: "2025-12-25T10:00:00")
   */
  dateDebut: string;
  dateFin: string;
  prix: number;
};

/* =======================
 * Helpers
 * =======================
 */

// Découpe "YYYY-MM-DDTHH:mm:ss" -> "YYYY-MM-DD"
function toDatePart(iso?: string): string {
  if (!iso) return "";
  const i = iso.indexOf("T");
  return i > 0 ? iso.slice(0, i) : iso;
}

// Affiche l'heure locale à partir d'une chaîne sans 'Z'
function toTimePart(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso); // interprété en LOCAL s'il n'y a pas de 'Z'
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function normalizeReservationRaw(item: any): ReservationSummary {
  const c = item?.creneau ?? item;

  // Nouvelles sources
  const dateDebutISO = c?.dateDebut ?? null;
  const dateFinISO = c?.dateFin ?? null;
  const terrainNom = c?.terrain?.nomTerrain ?? c?.terrain?.nom ?? item?.terrain ?? "";

  // Anciennes sources (fallback)
  const legacyDate = item?.date ?? "";
  const legacyHeureDebut = item?.heureDebut ?? "";
  const legacyHeureFin = item?.heureFin ?? "";

  // Sorties "anciennes" attendues par AccueilClub
  const date = dateDebutISO ? toDatePart(dateDebutISO) : legacyDate;
  const heureDebut = dateDebutISO ? toTimePart(dateDebutISO) : legacyHeureDebut;
  const heureFin = dateFinISO ? toTimePart(dateFinISO) : legacyHeureFin;

  const terrain = terrainNom;

  const prix =
    typeof c?.prix === "number"
      ? c.prix
      : typeof item?.prix === "number"
        ? item.prix
        : 0;

  const status = item?.status ?? item?.statut ?? "";

  return {
    id: item.id,
    nom: item.joueur?.nom ?? item.nom ?? "",
    prenom: item.joueur?.prenom ?? item.prenom ?? "",
    date,
    status,
    prix,
    telephone: item.joueur?.telephone ?? item.telephone ?? "",
    photoProfilUrl: item.joueur?.photoProfilUrl ?? item.photoProfilUrl ?? "",
    terrain,
    heureDebut,
    heureFin,
    nomReservant: item.nomReservant ?? null,
  };
}

export function isTokenValid(token: string | null) {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token) as any;
    const currentTime = Date.now() / 1000;
    return decoded.exp && decoded.exp > currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
}

async function jsonOrThrow(res: Response) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = data?.message || data || `HTTP ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return data;
}

/* =======================
 * Auth
 * =======================
 */
async function Login(email: string, motDePasse: string): Promise<LoginResponse> {
  try {
    const res = await fetch(`${UrlService}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({ email, motDePasse }),
    });

    const data: LoginResponse = await jsonOrThrow(res);
    const decoded = jwtDecode<TokenPayload>(data.token);
    if (decoded.role !== "CLUB") {
      throw new InvalidTokenError("You don't have the authorization to access this side");
    } else {
      //localStorage.setItem("token", data.token);
      return data;
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

async function DeleteTerrain(terrainId: number): Promise<boolean> {
  try {
    await apiClient.delete(`/api/terrains/${terrainId}`);
    return true;
  } catch (error) {
    console.error("The delete process didn't work check the logs");
    return false;
  }
}

async function ModifyTerrain(
  id: number,
  nomTerrain: string,
  typeSurface: string,
  ville: string,
  sport: string,
  politiqueClub?: string,
  photo?: string
): Promise<boolean> {
  try {
    await apiClient.put(`/api/terrains/${id}`, {
      nomTerrain,
      typeSurface,
      ville,
      sport,
      politiqueClub,
      photo
    });
    return true;
  } catch (error) {
    console.error("The delete process didn't work check the logs");
    return false;
  }
}

export const loginWithGoogle = () => {
  window.location.href = `${API_BASE}/oauth2/authorization/google`;
};

/* =======================
 * Recherche Clubs (public)
 * =======================
 */
async function searchByVilleAndSport(ville: string, sport: string): Promise<ClubDto[]> {
  const url = `${UrlService}/club/search?ville=${encodeURIComponent(ville)}&sport=${encodeURIComponent(sport)}`;
  const res = await fetch(url);
  return jsonOrThrow(res);
}

async function searchByVille(ville: string): Promise<ClubDto[]> {
  const url = `${UrlService}/club/search/by-ville?ville=${encodeURIComponent(ville)}`;
  const res = await fetch(url);
  return jsonOrThrow(res);
}

async function searchBySport(sport: string): Promise<ClubDto[]> {
  const url = `${UrlService}/club/search/by-sport?sport=${encodeURIComponent(sport)}`;
  const res = await fetch(url);
  return jsonOrThrow(res);
}

async function getClubById(id: number): Promise<ClubDto> {
  const url = `${UrlService}/club/${id}`;
  const res = await fetch(url);
  return jsonOrThrow(res);
}

/**
 * Get available creneaux for a club by date and sport
 * @param clubId - The club ID
 * @param date - Date in YYYY-MM-DD format
 * @param sport - Sport name (optional)
 * @returns Array of available creneaux
 */
export async function getCreneauxByClubDateSport(
  clubId: number,
  date?: string,
  sport?: string
): Promise<Creneau[]> {
  try {
    const params: Record<string, string> = {};
    if (date) params.date = date;
    if (sport) params.sport = sport;

    const res = await apiClient.get<Creneau[]>(`/api/creneaux/club/${clubId}`, { params });
    return res.data;
  } catch (error) {
    console.error("Error fetching creneaux:", error);
    return [];
  }
}

async function getTerrains(): Promise<Terrain[]> {
  try {
    const res = await apiClient.get<Terrain[]>("/api/terrains");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function modifyInfoClub(ClubInfo: Omit<ClubDto, "id">) {
  try {
    await apiClient.put("/api/utilisateur/update", {
      nom: ClubInfo.nom,
      telephone: ClubInfo.telephone,
      ville: ClubInfo.ville,
      adresse: ClubInfo.adresse,
      description: ClubInfo.description,
      politique: ClubInfo.politique,
      sports: ClubInfo.sports,
    });
  } catch (error) {
    throw error;
  }
}

export async function fetchCreneaux(terrains: Terrain[]): Promise<Creneau[]> {
  try {
    if (!terrains.length) return [];

    const allCreneaux: Creneau[] = [];
    for (const terrain of terrains) {
      try {
        const res = await apiClient.get<Creneau[]>(`/api/creneaux/terrains/${terrain.id}/creneaux`);
        const validCreneaux = res.data.filter(
          (c: Creneau) => c.statut?.toUpperCase() !== "ANNULE"
        );
        allCreneaux.push(...validCreneaux);
      } catch (error) {
        console.error(`Erreur sur le terrain ${terrain.id}`, error);
        continue;
      }
    }
    return allCreneaux;
  } catch (err) {
    throw err;
  }
}

async function getCreneaux(terrains: Terrain[]): Promise<ReservationSummary[]> {
  try {
    const res = await apiClient.get<ReservationSummary[]>("/api/creneaux/terrains");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// ===== Club Image Management =====

/**
 * Upload a new image to the club's image gallery
 * @param file - The image file to upload
 * @returns The ClubImage object with ID and URL
 */
export const addClubImage = async (file: File): Promise<ClubImage> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await apiClient.post<ClubImage>("/api/club/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("❌ Image upload failed:", error);
    throw error;
  }
};

/**
 * Get all images for a specific club
 * @param clubId - The ID of the club
 * @returns Array of image URLs
 */
export const getClubImages = async (clubId: number): Promise<string[]> => {
  try {
    const res = await apiClient.get<string[]>(`/api/club/${clubId}/images`);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to fetch club images:", error);
    throw error;
  }
};

/**
 * Delete a club image
 * @param imageId - The ID of the image to delete
 */
export const deleteClubImage = async (imageId: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/club/images/${imageId}`);
  } catch (error) {
    console.error("❌ Failed to delete club image:", error);
    throw error;
  }
};

/**
 * Update the display order of a club image
 * @param imageId - The ID of the image
 * @param order - The new display order
 */
export const updateClubImageOrder = async (imageId: number, order: number): Promise<void> => {
  try {
    await apiClient.put(`/api/club/images/${imageId}/order`, null, {
      params: { order }
    });
  } catch (error) {
    console.error("❌ Failed to update image order:", error);
    throw error;
  }
};

// Legacy function for backward compatibility - returns just the URL
export const uploadClubImage = async (file: File): Promise<string> => {
  const clubImage = await addClubImage(file);
  return clubImage.imageUrl;
};

async function GetCreneauSummary(): Promise<ReservationSummary[]> {
  try {
    const terrains = await getTerrains();
    const _creneaux = await getCreneaux(terrains);
    return []; // (tu peux brancher ici ta normalisation si besoin)
  } catch (error) {
    throw error;
  }
}

export async function cancelReservationByClub(id: number, motif: string) {
  try {
    const res = await apiClient.put(`/api/reservations/${id}/annuler`, { motif });
    return res;
  } catch (error) {
    console.error("Erreur lors de l'annulation :", error);
    throw error;
  }
}

export async function confirmReservations(id: number) {
  try {
    const res = await apiClient.patch(`/api/reservations/${id}/confirmer`);
    console.log(res);
  } catch (error) {
    console.log("error is : " + error);
    throw error;
  }
}

export async function markReservationAbsent(id: number, motif?: string) {
  try {
    const res = await apiClient.put<string>(`/api/reservations/${id}/absent`, {
      motif: motif ?? "",
    });
    return res.data; // "Réservation marquée comme ABSENT."
  } catch (error) {
    throw error;
  }
}

export async function getReservations(): Promise<ReservationSummary[]> {
  try {
    const res = await apiClient.get<any[]>("/api/reservations/reservations");
    const reservations: ReservationSummary[] = (Array.isArray(res.data) ? res.data : []).map(
      normalizeReservationRaw
    );
    return reservations;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }
}

export async function getReservationsByDate(date: string): Promise<ReservationSummary[]> {
  try {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error(`Invalid date format: ${date}. Expected YYYY-MM-DD.`);
    }

    const res = await apiClient.get<any[]>(`/api/reservations/reservations/date`, {
      params: { date }
    });

    const reservations: ReservationSummary[] = (Array.isArray(res.data) ? res.data : []).map(
      normalizeReservationRaw
    );
    return reservations;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }
}

/* =======================
 * Endpoints protégés
 * =======================
 */
async function AjouterUnTerrain(
  nomTerrain: string,
  typeSurface: string,
  ville: string,
  sport: string
) {
  try {
    const res = await apiClient.post("/api/terrains", {
      nomTerrain,
      typeSurface,
      ville,
      sport
    });
    return res.data;
  } catch (error) {
    console.error("AjouterUnTerrain error:", error);
    throw error;
  }
}

export async function getClubMe(): Promise<ClubDto> {
  const res = await apiClient.get<ClubDto>("/api/club/me");
  return res.data;
}

/* =======================
 * Création de créneau (NOUVEAU)
 * =======================
 */
/**
 * Envoie les heures LOCALES telles quelles (pas de Z, pas de fuseau).
 * Ex payload:
 * { dateDebut: "2025-12-25T10:00:00", dateFin: "2025-12-25T11:30:00", prix: 7000 }
 */
async function createCreneau(terrainId: number, payload: CreateCreneauPayload) {
  const res = await apiClient.post(`/api/creneaux/terrains/${terrainId}/creneaux`, payload);
  return res.data;
}

/* =======================
 * Export
 * =======================
 */
export const ClubService = {
  Login,
  searchByVilleAndSport,
  searchByVille,
  searchBySport,
  getClubById,
  AjouterUnTerrain,
  getClubMe,
  DeleteTerrain,
  loginWithGoogle,
  ModifyTerrain,
  modifyInfoClub,

  // 👇 nouveau
  createCreneau,
};


