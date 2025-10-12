// src/services/clubService.ts
import { InvalidTokenError, jwtDecode } from "jwt-decode";

const UrlService = "http://localhost:8080/api";

/* =======================
 * Types
 * =======================
 */
export type LoginResponse = {
    token: string;
};



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
    // Selon ton mapper côté back:
    sport?: string;     // ex: "PADEL, FOOT_5"
    sports?: string[];  // si un jour tu renvoies une liste
};

/* =======================
 * Helpers
 * =======================
 */
function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
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
            throw new InvalidTokenError("You don't have the authorization to access this side ")
        } else {
            localStorage.setItem("token", data.token);
            return data;
        }
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}

/* =======================
 * Recherche Clubs (public)
 * =======================
 */
// GET /api/club/search?ville=Alger&sport=PADEL
async function searchByVilleAndSport(ville: string, sport: string): Promise<ClubDto[]> {
    const url = `${UrlService}/club/search?ville=${encodeURIComponent(ville)}&sport=${encodeURIComponent(sport)}`;
    const res = await fetch(url);
    return jsonOrThrow(res);
}

// GET /api/club/search/by-ville?ville=Alger
async function searchByVille(ville: string): Promise<ClubDto[]> {
    const url = `${UrlService}/club/search/by-ville?ville=${encodeURIComponent(ville)}`;
    const res = await fetch(url);
    return jsonOrThrow(res);
}

// GET /api/club/search/by-sport?sport=PADEL
async function searchBySport(sport: string): Promise<ClubDto[]> {
    const url = `${UrlService}/club/search/by-sport?sport=${encodeURIComponent(sport)}`;
    const res = await fetch(url);
    return jsonOrThrow(res);
}

/* =======================
 * Endpoints protégés (exemples)
 * =======================
 */
// ⚠️ Ajuste l’URL si besoin (ex: POST /api/terrains)
async function AjouterUnTerrain(
    nomTerrain: string,
    typeSurface: string,
    ville: string,
    sport: string
) {
    try {
        const res = await fetch(`${UrlService}/terrains`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
                ...getAuthHeaders(), // Authorization: Bearer <token>
            },
            body: JSON.stringify({ nomTerrain, typeSurface, ville, sport }),
        });

        return jsonOrThrow(res);
    } catch (error) {
        console.error("AjouterUnTerrain error:", error);
        throw error;
    }
}

// GET /api/club/me (récupérer le club connecté)
async function getClubMe(): Promise<ClubDto> {
    const res = await fetch(`${UrlService}/club/me`, {
        headers: {
            Accept: "application/json",
            ...getAuthHeaders(),
        },
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
    AjouterUnTerrain,
    getClubMe,
};
