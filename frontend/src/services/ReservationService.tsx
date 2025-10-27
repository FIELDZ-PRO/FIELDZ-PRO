import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/reservations';

export const ReservationService = {
  // Annuler une réservation avec motif
  cancelReservation: async (reservationId: number, motif?: string): Promise<string> => {
    try {
      const token = localStorage.getItem('token');
      
      console.log('🔵 Annulation réservation:', reservationId);
      console.log('📝 Motif:', motif);
      
      // ⚠️ Utiliser PUT au lieu de DELETE (backend utilise @PutMapping)
      const response = await axios.put(
        `${API_BASE_URL}/${reservationId}/annuler`,
        // Body avec le motif
        motif ? { motif } : {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          // Accepter tous les status codes
          validateStatus: () => true
        }
      );
      
      console.log('📡 Réponse status:', response.status);
      console.log('📡 Réponse data:', response.data);
      
      // Si la réponse est OK (200-299)
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
      
      // Sinon, c'est une erreur
      let errorMessage = "Erreur lors de l'annulation";
      
      // Parser la réponse d'erreur
      if (typeof response.data === 'string') {
        errorMessage = response.data;
      } else if (response.data?.message) {
        errorMessage = response.data.message;
      }
      
      throw new Error(errorMessage);
      
    } catch (error: any) {
      console.error('❌ Erreur annulation:', error);
      
      // Si c'est notre erreur custom, la relancer
      if (error.message && !error.response) {
        throw error;
      }
      
      // Gérer les erreurs Axios
      if (error.response) {
        const errorMessage = error.response.data?.message 
          || error.response.data 
          || `Erreur ${error.response.status}`;
        throw new Error(errorMessage);
      }
      
      throw new Error("Erreur de connexion au serveur");
    }
  },

  // Récupérer les réservations d'un joueur
  getReservationsByJoueur: async (): Promise<any[]> => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/mes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Erreur récupération réservations:', error);
      throw error;
    }
  }
};