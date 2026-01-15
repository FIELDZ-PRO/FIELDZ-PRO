import apiClient, { setToken as saveToken, removeToken } from './client';

interface LoginResponse {
  token?: string;
  accessToken?: string;
}

interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  nom: string;
  email: string;
  password: string;
  telephone: string;
}

/**
 * Connexion d'un joueur (système FIELDZ)
 */
export const login = async (data: LoginData): Promise<string> => {
  const response = await apiClient.post<LoginResponse>('/api/auth/login', {
    email: data.email.trim(),
    motDePasse: data.password.trim(),
    rememberMe: data.rememberMe || false,
  }, {
    withCredentials: true,
  });

  const token = response.data.token || response.data.accessToken;
  if (!token) {
    throw new Error('Réponse invalide du serveur (token manquant)');
  }

  await saveToken(token);
  return token;
};

/**
 * Inscription d'un nouveau joueur (système FIELDZ)
 * Note: Le backend redirige vers login après inscription (pas de token retourné)
 */
export const register = async (data: RegisterData): Promise<void> => {
  await apiClient.post('/api/auth/register', {
    nom: data.nom.trim(),
    email: data.email.trim(),
    motDePasse: data.password.trim(),
    telephone: data.telephone.trim(),
    role: 'JOUEUR',
    adresse: '',
    nomClub: '',
  });
  // Le frontend web redirige vers login après register
  // L'app mobile devra faire login après register
};

/**
 * Déconnexion
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/api/auth/logout', {}, {
      withCredentials: true,
    });
  } catch (error) {
    console.warn('Logout API error:', error);
  } finally {
    await removeToken();
  }
};

/**
 * Demande de réinitialisation de mot de passe
 */
export const forgotPassword = async (email: string): Promise<void> => {
  await apiClient.post('/api/auth/forgot-password', { email });
};

/**
 * Réinitialisation du mot de passe
 */
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await apiClient.post('/api/auth/reset-password', { token, newPassword });
};
