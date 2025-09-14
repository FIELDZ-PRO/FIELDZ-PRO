export type Club = {
  id: number;
  nomClub: string;
  adresse?: string;
  telephone?: string;
};


export type Joueur = {
  id: number;
  nom?: string;
  prenom?: string;
  email: string;
  telephone?: string;
  // Autres champs hérités du backend
  typeRole?: "JOUEUR" | "CLUB" | "ADMIN";
};


export type Creneau = {
  id: number;
  dateDebut: string;   // Format ISO, ex: "2025-08-06T18:00:00"
  dateFin: string;
  prix: number;
  statut: Statut;
  disponible: boolean;
  terrain: {
    nomTerrain: string;
    typeSurface?: string;
    taille?: string;
    ville?: string;
    politiqueClub?: string;
    club?: {
      nom: string;
    };
  };
};



export interface Terrain {
  id: number;
  nomTerrain: string;
  typeSurface: string;
  ville: string;
  sport: string;
  politiqueClub?: string;
  club?: {
    id: number;
    nomClub: string;
  };
}


export type Statut =
  | 'RESERVE'
  | 'ANNULE'
  | 'ANNULE_PAR_JOUEUR'
  | 'ANNULE_PAR_CLUB'
  | 'CONFIRMEE'
  | 'LIBRE';

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
    };
  };
  dateReservation: string;
  dateAnnulation?: string;
  motifAnnulation?: string;
}
