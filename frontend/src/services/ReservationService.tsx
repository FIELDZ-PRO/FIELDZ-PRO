// src/services/ReservationService.tsx

const API_BASE = "http://localhost:8080/api";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  };
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

/**
 * Annuler une réservation (côté joueur)
 */
async function cancelReservation(reservationId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/reservations/${reservationId}/annuler`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ motif: "Annulée par le joueur" }),
  });
  return jsonOrThrow(res);
}

export const ReservationService = {
  cancelReservation,
};