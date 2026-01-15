// Types partagés avec le backend Spring Boot

export type Role = 'JOUEUR' | 'CLUB' | 'ADMIN';

export type ClubImage = {
  id: number;
  imageUrl: string;
  displayOrder: number;
};

export type Club = {
  id: number;
  nomClub: string;
  nom?: string;
  adresse?: string;
  telephone?: string;
  ville?: string;
  locationLink?: string;
  description?: string;
  politique?: string;
  images?: ClubImage[];
  sports?: string[];
  heureOuverture?: string;
  heureFermeture?: string;
};

export type Joueur = {
  id: number;
  nom?: string;
  prenom?: string;
  email: string;
  telephone?: string;
  typeRole?: Role;
};

export type Statut =
  | 'RESERVE'
  | 'ANNULE'
  | 'ANNULE_PAR_JOUEUR'
  | 'ANNULE_PAR_CLUB'
  | 'CONFIRMEE'
  | 'ABSENT'
  | 'LIBRE';

export interface Terrain {
  id: number;
  nomTerrain: string;
  typeSurface: string;
  ville: string;
  sport: string;
  photo?: string;
  politiqueClub?: string;
  club?: {
    id: number;
    nomClub: string;
  };
}

export type Creneau = {
  id: number;
  dateDebut: string;
  dateFin: string;
  date?: string;
  heureDebut?: string;
  heureFin?: string;
  prix: number;
  secondPrix?: number;
  statut: Statut;
  disponible: boolean;
  terrain: {
    id?: number;
    nom?: string;
    nomTerrain: string;
    sport?: string;
    typeSurface?: string;
    taille?: string;
    ville?: string;
    politiqueClub?: string;
    club?: {
      id?: number;
      nom?: string;
      nomClub?: string;
    };
  };
};

export interface Reservation {
  id: number;
  statut: Statut;
  joueur: {
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
  };
  creneau: {
    id: number;
    dateDebut: string;
    dateFin: string;
    prix: number;
    terrain: {
      nomTerrain: string;
      sport?: string;
      club?: {
        id?: number;
        nomClub?: string;
      };
    };
  };
  dateReservation: string;
  dateAnnulation?: string;
  motifAnnulation?: string;
  nomReservant?: string;
}

// Request types for creating entities
export interface CreateTerrainRequest {
  nomTerrain: string;
  typeSurface: string;
  ville: string;
  sport: string;
  photo?: string;
}

export interface UpdateTerrainRequest {
  nomTerrain?: string;
  typeSurface?: string;
  ville?: string;
  sport?: string;
  photo?: string;
}

export interface CreateCreneauRequest {
  dateDebut: string;
  dateFin: string;
  prix: number;
  secondPrix?: number;
}

export interface CreateCreneauRecurrentRequest {
  terrainId: number;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  heureDebut: string; // "HH:mm"
  dureeMinutes: number;
  prix: number;
  dateDebut: string; // Start date for recurrence
  dateFin: string; // End date for recurrence
  nomReservant?: string; // For auto-reservation
}

// JWT Payload type
export interface JwtPayload {
  role?: Role;
  exp?: number;
  sub?: string;
}

// Stats types
export interface DashboardStats {
  totalReservationsToday: number;
  totalConfirmedToday: number;
  totalRevenue: number;
  totalTerrains: number;
}
