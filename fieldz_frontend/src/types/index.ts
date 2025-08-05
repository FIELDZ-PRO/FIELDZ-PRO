export interface Creneau {
  id: number;
  dateDebut: string;   // format ISO ex: "2025-08-04T18:00:00"
  dateFin: string;
  prix: number;
  disponible: boolean;
  statut: Statut;
  terrain: {
    nomTerrain: string;
  };
}


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
    // Ajoute d’autres champs utiles ici si tu les utilises côté front
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
