// src/services/ClubService.ts
import { InvalidTokenError, jwtDecode } from "jwt-decode";

const UrlService = "http://localhost:8080/api";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

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
    sport?: string;
    sports?: string[];
};

/* =======================
 * Helpers
 * =======================
 */
function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    if (token) {
        return { "Authorization": `Bearer ${token}` };
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
                "Accept": "*/*",
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
                ...getAuthHeaders()
            }
        })
        return true;
    }
    catch (error) {
        console.error("The delete process didn't work check the logs");
        return false;
    }
}

async function ModifyTerrain(id: number, nomTerrain: string, typeSurface: string, ville: string, sport: string, politiqueClub: string): Promise<boolean> {
    try {
        await fetch(`${UrlService}/terrains/${id}`, {
            method: "PUT",
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify({ nomTerrain, typeSurface, ville, sport, politiqueClub }),

        })
        return true;
    }
    catch (error) {
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
            "Accept": "*/*",
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

async function getClubMe(): Promise<ClubDto> {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
        "Accept": "application/json",
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
    ModifyTerrain
};