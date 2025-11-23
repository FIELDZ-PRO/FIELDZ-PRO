import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://vital-nana-fieldz-11e3f995.koyeb.app";
const ACCESS_TOKEN_KEY = "access_token";

/**
 * Centralized axios instance for all API calls
 * Automatically adds authentication token from sessionStorage
 * Handles 401 errors by dispatching session expired event
 */
const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Important for refresh token cookies
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor: Add token to every request
 */
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Failed to get token from sessionStorage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Handle 401 errors (expired/invalid token)
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - dispatch custom event for AuthContext to handle
      window.dispatchEvent(new CustomEvent("auth:session-expired"));
    }

    // Log error details for debugging
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });

    return Promise.reject(error);
  }
);

export default apiClient;
