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
  adresse?: string;
  telephone?: string;
  images?: ClubImage[];
  sports?: string[];
  ville?: string;
  locationLink?: string;
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
  };
  creneau: {
    id: number;
    dateDebut: string;
    dateFin: string;
    terrain: {
      nomTerrain: string;
      club?: {
        id?: number;
        nomClub?: string;
      };
    };
  };
  dateReservation: string;
  dateAnnulation?: string;
  motifAnnulation?: string;
}

// JWT Payload type
export interface JwtPayload {
  role?: Role;
  exp?: number;
  sub?: string;
}
