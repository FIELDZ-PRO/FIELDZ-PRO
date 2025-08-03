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
