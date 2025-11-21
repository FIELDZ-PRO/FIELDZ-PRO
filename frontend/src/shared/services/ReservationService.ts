import apiClient from "../api/axiosClient";

export const ReservationService = {
  // Annuler une réservation avec motif
  cancelReservation: async (reservationId: number, motif?: string): Promise<string> => {
    try {
      console.log("🔵 Annulation réservation:", reservationId);
      console.log("📝 Motif:", motif);

      const response = await apiClient.put<string>(
        `/api/reservations/${reservationId}/annuler`,
        motif ? { motif } : {}
      );

      console.log("📡 Réponse status:", response.status);
      console.log("📡 Réponse data:", response.data);

      return typeof response.data === "string" ? response.data : "Annulation effectuée.";
    } catch (error: any) {
      console.error("❌ Erreur annulation:", error);
      if (error?.response) {
        const message =
          error.response.data?.message || error.response.data || `Erreur ${error.response.status}`;
        throw new Error(message);
      }
      throw new Error(error?.message || "Erreur de connexion au serveur");
    }
  },

  // Récupérer les réservations d'un joueur
  getReservationsByJoueur: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get<any[]>("/api/reservations/mes");
      return response.data;
    } catch (error: any) {
      console.error("Erreur récupération réservations:", error);
      if (error?.response) {
        const message =
          error.response.data?.message || error.response.data || `Erreur ${error.response.status}`;
        throw new Error(message);
      }
      throw new Error(error?.message || "Erreur de connexion au serveur");
    }
  },
};
