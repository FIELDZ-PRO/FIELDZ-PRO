import axios from "axios";

// Utilise le proxy Vite → pas d'URL absolue
const API_BASE_URL = "/api/reservations";

// Helper: récupère le token où qu'il soit (nouveau + ancien code)
const getToken = () =>
  sessionStorage.getItem("access_token") || localStorage.getItem("token") || null;

// Helper: vérifie qu'on a bien un JWT "a.b.c"
const isJwt = (t: string | null) => !!t && t.split(".").length === 3;

// Construit les headers d'auth uniquement si on a un vrai JWT
const authHeaders = () => {
  const t = getToken();
  return isJwt(t) ? { Authorization: `Bearer ${t}` } : {};
};

export const ReservationService = {
  // Annuler une réservation avec motif
  cancelReservation: async (reservationId: number, motif?: string): Promise<string> => {
    try {
      const token = getToken();

      console.log("🔵 Annulation réservation:", reservationId);
      console.log("📝 Motif:", motif);

      if (!isJwt(token)) {
        // On évite d'envoyer "Bearer null/undefined" au back
        throw new Error("Vous n'êtes pas connecté ou la session a expiré.");
      }

      const response = await axios.put(
        `${API_BASE_URL}/${reservationId}/annuler`,
        motif ? { motif } : {},
        {
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
          },
          withCredentials: true, // important pour le refresh cookie si 401
        }
      );

      console.log("📡 Réponse status:", response.status);
      console.log("📡 Réponse data:", response.data);

      if (response.status >= 200 && response.status < 300) {
        return typeof response.data === "string" ? response.data : "Annulation effectuée.";
      }

      const message =
        (typeof response.data === "string" && response.data) ||
        response.data?.message ||
        `Erreur ${response.status}`;
      throw new Error(message);
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
      const token = getToken();
      if (!isJwt(token)) {
        throw new Error("Vous n'êtes pas connecté ou la session a expiré.");
      }

      const response = await axios.get(`${API_BASE_URL}/mes`, {
        headers: {
          ...authHeaders(),
        },
        withCredentials: true,
      });

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
