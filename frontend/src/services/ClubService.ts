import { InvalidTokenError, jwtDecode } from "jwt-decode";
import { Terrain, Creneau } from "../types";

const UrlService = "http://localhost:8080/api";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

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
  banniereUrl?: string;
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

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
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
      localStorage.setItem("token", data.token);
      return data;
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

async function DeleteTerrain(terrainId: number): Promise<boolean> {
  try {
    await fetch(`${UrlService}/terrains/${terrainId}`, {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        ...getAuthHeaders(),
      },
    });
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
  politiqueClub?: string
): Promise<boolean> {
  try {
    await fetch(`${UrlService}/terrains/${id}`, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ nomTerrain, typeSurface, ville, sport, politiqueClub }),
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

async function getTerrains(): Promise<Terrain[]> {
  try {
    const res = await fetch(`${UrlService}/terrains`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        ...getAuthHeaders(),
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function modifyInfoClub(ClubInfo: Omit<ClubDto, "id">) {
  try {
    await fetch(`${UrlService}/utilisateur/update`, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        nom: ClubInfo.nom,
        telephone: ClubInfo.telephone,
        ville: ClubInfo.ville,
        adresse: ClubInfo.adresse,
        banniereUrl: ClubInfo.banniereUrl,
        description: ClubInfo.description,
        politique: ClubInfo.politique,
      }),
    });
  } catch (error) {
    throw error;
  }
}

export async function fetchCreneaux(terrains: Terrain[]): Promise<Creneau[]> {
  const token = localStorage.getItem("token");
  try {
    if (!terrains.length) return [];

    const allCreneaux: Creneau[] = [];
    for (const terrain of terrains) {
      const res = await fetch(`${UrlService}/creneaux/terrains/${terrain.id}/creneaux`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error(`Erreur sur le terrain ${terrain.id}`);
        continue;
      }

      const data = await res.json();
      const validCreneaux = data.filter(
        (c: Creneau) => c.statut?.toUpperCase() !== "ANNULE"
      );
      allCreneaux.push(...validCreneaux);
    }
    return allCreneaux;
  } catch (err) {
    throw err;
  }
}

async function getCreneaux(terrains: Terrain[]): Promise<ReservationSummary[]> {
  try {
    const res = await fetch(`${UrlService}/creneaux/terrains`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        ...getAuthHeaders(),
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const uploadClubImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${UrlService}/upload-cloud`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Image upload failed");

    const data = await res.json();
    return data.url; // ✅ Cloudinary URL
  } catch (error) {
    console.error("❌ Upload failed:", error);
    throw error;
  }
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
    const res = await fetch(`${UrlService}/reservations/${id}/annuler`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ motif }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erreur ${res.status}: ${errorText}`);
    }

    return res;
  } catch (error) {
    console.error("Erreur lors de l’annulation :", error);
    throw error;
  }
}

export async function confirmReservations(id: number) {
  try {
    const res = await fetch(`${UrlService}/reservations/${id}/confirmer`, {
      method: "PATCH",
      headers: {
        Accept: "*/*",
        ...getAuthHeaders(),
      },
    });
    console.log(res);
  } catch (error) {
    console.log("error is : " + error);
    throw error;
  }
}

export async function getReservations(): Promise<ReservationSummary[]> {
  try {
    const res = await fetch(`${UrlService}/reservations/reservations`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch reservations: ${res.status}`);
    }

    const data = await res.json();
    const reservations: ReservationSummary[] = (Array.isArray(data) ? data : []).map(
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

    const res = await fetch(`${UrlService}/reservations/reservations/date?date=${date}`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch reservations: ${res.status}`);
    }

    const data = await res.json();
    const reservations: ReservationSummary[] = (Array.isArray(data) ? data : []).map(
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
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "*/*",
    };

    const token = localStorage.getItem("token");
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${UrlService}/terrains`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ nomTerrain, typeSurface, ville, sport }),
    });

    return jsonOrThrow(res);
  } catch (error) {
    console.error("AjouterUnTerrain error:", error);
    throw error;
  }
}

export async function getClubMe(): Promise<ClubDto> {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${UrlService}/club/me`, {
    headers: headers,
  });
  return jsonOrThrow(res);
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
  const res = await fetch(`${UrlService}/creneaux/terrains/${terrainId}/creneaux`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return jsonOrThrow(res);
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
