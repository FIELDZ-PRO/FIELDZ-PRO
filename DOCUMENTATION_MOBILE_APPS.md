# Documentation Complète - Applications Mobiles FIELDZ

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Application Joueur (mobile/)](#application-joueur)
3. [Application Club (mobile-club/)](#application-club)
4. [Architecture Technique Commune](#architecture-technique-commune)
5. [Guide de Déploiement](#guide-de-déploiement)

---

## Vue d'ensemble

FIELDZ est une plateforme de réservation de terrains sportifs composée de deux applications mobiles :

| Application | Cible | Dossier | Description |
|-------------|-------|---------|-------------|
| **FIELDZ Player** | Joueurs | `mobile/` | Recherche et réservation de terrains |
| **FIELDZ Club** | Gestionnaires de clubs | `mobile-club/` | Gestion des terrains et réservations |

### Stack Technique Partagée

- **Framework** : React Native 0.81.5 avec Expo SDK 54
- **Langage** : TypeScript 5.9.2
- **Navigation** : React Navigation v7
- **HTTP Client** : Axios 1.13.2
- **État Global** : React Context API
- **Stockage Sécurisé** : expo-secure-store (mobile) / localStorage (web)

---

# Application Joueur

## 1. Présentation

L'application FIELDZ Player permet aux joueurs de :
- Découvrir des clubs sportifs
- Rechercher des terrains par sport et ville
- Réserver des créneaux horaires
- Gérer leurs réservations
- Consulter les actualités de la plateforme

## 2. Structure du Projet

```
mobile/
├── src/
│   ├── api/                    # Services API
│   │   ├── client.ts           # Instance Axios avec intercepteurs
│   │   ├── auth.ts             # Authentification
│   │   ├── joueur.ts           # Profil joueur
│   │   └── reservations.ts     # Réservations & clubs
│   ├── components/             # Composants réutilisables
│   │   ├── ui/
│   │   │   ├── Button.tsx      # Boutons (primary/outline)
│   │   │   └── Input.tsx       # Champs de saisie
│   │   ├── ClubCard.tsx        # Carte club
│   │   ├── ReservationCard.tsx # Carte réservation
│   │   └── ReservationModal.tsx # Modal de réservation
│   ├── hooks/
│   │   └── useAuth.tsx         # Hook d'authentification
│   ├── navigation/
│   │   ├── RootNavigator.tsx   # Navigation racine
│   │   ├── AuthNavigator.tsx   # Stack authentification
│   │   └── MainNavigator.tsx   # Navigation principale (tabs)
│   ├── screens/
│   │   ├── auth/               # Écrans d'authentification
│   │   └── main/               # Écrans principaux
│   ├── theme/
│   │   └── index.ts            # Système de design
│   └── types/
│       └── index.ts            # Types TypeScript
├── App.tsx
├── app.json
└── package.json
```

## 3. Écrans de l'Application

### 3.1 Flux d'Authentification

| Écran | Fichier | Description |
|-------|---------|-------------|
| **Splash** | `SplashScreen.tsx` | Écran de chargement initial (2.5s) |
| **Onboarding** | `OnboardingScreen.tsx` | Carrousel d'introduction (3 slides) |
| **Bienvenue** | `WelcomeScreen.tsx` | Choix connexion/inscription |
| **Connexion** | `LoginScreen.tsx` | Email + mot de passe |
| **Inscription** | `RegisterScreen.tsx` | Formulaire complet (nom, email, téléphone, mdp) |
| **Mot de passe oublié** | `ForgotPasswordScreen.tsx` | Récupération par email |

### 3.2 Navigation Principale (Bottom Tabs)

| Onglet | Écran | Icône | Description |
|--------|-------|-------|-------------|
| **Recherche** | `HomeScreen.tsx` | `search` | Recherche de clubs avec filtres |
| **Réservations** | `MatchsScreen.tsx` | `calendar` | Liste des réservations (à venir/passées) |
| **News** | `NewsScreen.tsx` | `newspaper` | Actualités de la plateforme |
| **Profil** | `ProfileScreen.tsx` | `person` | Informations et paramètres |

### 3.3 Écrans Détaillés

| Écran | Description |
|-------|-------------|
| `ClubDetailScreen.tsx` | Détails du club + créneaux disponibles |
| `EditProfileScreen.tsx` | Modification du profil |
| `SettingsScreen.tsx` | Menu des paramètres |
| `PasswordSettingsScreen.tsx` | Changement de mot de passe |
| `PrivacyScreen.tsx` | Politique de confidentialité |
| `HelpScreen.tsx` | Aide et support |
| `AboutClubScreen.tsx` | À propos du club |

## 4. Fonctionnalités Détaillées

### 4.1 Recherche de Clubs

```
Filtres disponibles :
├── Sport : Tous, Football, Padel, Tennis
├── Ville : Alger, Oran, Constantine
└── Recherche textuelle (nom du club)
```

**Affichage des clubs :**
- Image du club (carrousel si plusieurs)
- Nom et localisation
- Sports proposés (badges)
- Prochain créneau disponible

### 4.2 Système de Réservation

**Processus de réservation :**
1. Sélection du club
2. Visualisation des créneaux disponibles
3. Sélection du créneau souhaité
4. Confirmation via modal avec récapitulatif
5. Validation de la réservation

**Informations affichées :**
- Date et heure
- Nom du terrain
- Prix (en DA)
- Statut (Confirmée, En attente, Annulée)

### 4.3 Gestion des Réservations

**Onglets :**
- **À venir** : Réservations futures
- **Passées** : Historique des réservations

**Actions possibles :**
- Voir les détails
- Annuler une réservation (avec confirmation)

### 4.4 Profil Joueur

**Informations affichées :**
- Avatar (initiales)
- Nom complet
- Email
- Téléphone

**Options :**
- Modifier le profil
- Paramètres
- Déconnexion

## 5. Endpoints API Joueur

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/auth/login` | Connexion |
| `POST` | `/api/auth/register` | Inscription |
| `POST` | `/api/auth/logout` | Déconnexion |
| `POST` | `/api/auth/forgot-password` | Mot de passe oublié |

### Profil Joueur

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/joueurs/me` | Récupérer le profil |
| `PUT` | `/api/joueurs/me` | Mettre à jour le profil |
| `PUT` | `/api/joueurs/me/password` | Changer le mot de passe |

### Réservations

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/reservations/mes-reservations` | Mes réservations |
| `POST` | `/api/reservations` | Créer une réservation |
| `PUT` | `/api/reservations/{id}/annuler` | Annuler une réservation |

### Clubs & Créneaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/club/{id}` | Détails d'un club |
| `GET` | `/api/club/search/by-ville?ville={city}` | Recherche par ville |
| `GET` | `/api/club/search/by-sport?sport={sport}` | Recherche par sport |
| `GET` | `/api/creneaux/disponibles?date&sport&ville` | Créneaux disponibles |
| `GET` | `/api/creneaux/club/{clubId}?date&sport` | Créneaux d'un club |

---

# Application Club

## 1. Présentation

L'application FIELDZ Club permet aux gestionnaires de clubs de :
- Gérer les informations du club
- Créer et gérer les terrains
- Définir les créneaux horaires
- Suivre et gérer les réservations
- Consulter les statistiques

## 2. Structure du Projet

```
mobile-club/
├── src/
│   ├── api/                    # Services API
│   │   ├── client.ts           # Instance Axios
│   │   ├── auth.ts             # Authentification
│   │   ├── club.ts             # Gestion du club
│   │   ├── terrains.ts         # Gestion des terrains
│   │   ├── creneaux.ts         # Gestion des créneaux
│   │   └── reservations.ts     # Gestion des réservations
│   ├── components/             # Composants réutilisables
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   ├── StatCard.tsx        # Carte statistique
│   │   ├── TerrainCard.tsx     # Carte terrain
│   │   ├── CreneauCard.tsx     # Carte créneau
│   │   ├── ReservationCard.tsx # Carte réservation (aperçu)
│   │   ├── ReservationDetailCard.tsx # Carte réservation (détaillée)
│   │   ├── TerrainModal.tsx    # Modal terrain
│   │   ├── CreneauModal.tsx    # Modal créneau simple
│   │   └── CreneauRecurrentModal.tsx # Modal créneau récurrent
│   ├── contexts/
│   │   └── AuthContext.tsx     # Contexte d'authentification
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── screens/
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx
│   │   └── main/
│   │       ├── DashboardScreen.tsx
│   │       ├── TerrainsScreen.tsx
│   │       ├── CreneauxScreen.tsx
│   │       ├── ReservationsScreen.tsx
│   │       └── SettingsScreen.tsx
│   ├── theme/
│   │   └── index.ts
│   └── types/
│       └── index.ts
├── App.tsx
├── app.json
└── package.json
```

## 3. Écrans de l'Application

### 3.1 Authentification

| Écran | Description |
|-------|-------------|
| **LoginScreen** | Connexion club (email + mot de passe) |

**Mode développement :**
- Auto-login disponible via variables d'environnement
- Bouton "DEV LOGIN" pour connexion rapide

### 3.2 Navigation Principale (Bottom Tabs)

| Onglet | Écran | Icône | Description |
|--------|-------|-------|-------------|
| **Dashboard** | `DashboardScreen.tsx` | `home` | Vue d'ensemble et statistiques |
| **Terrains** | `TerrainsScreen.tsx` | `football` | Gestion des terrains |
| **Créneaux** | `CreneauxScreen.tsx` | `calendar` | Gestion des créneaux |
| **Réservations** | `ReservationsScreen.tsx` | `list` | Gestion des réservations |
| **Paramètres** | `SettingsScreen.tsx` | `settings` | Paramètres du club |

## 4. Fonctionnalités Détaillées

### 4.1 Dashboard

**Statistiques du jour :**

| Indicateur | Description |
|------------|-------------|
| **Réservations totales** | Nombre de réservations du jour |
| **Confirmées** | Réservations avec présence confirmée |
| **Revenus** | Somme des prix (en Dzd) |
| **Terrains** | Nombre total de terrains |

**Sections :**
- Réservations d'aujourd'hui (5 premières)
- Aperçu des terrains (3 premiers)
- Pull-to-refresh pour actualiser

### 4.2 Gestion des Terrains

**Actions CRUD :**
- **Créer** : Bouton FAB (+)
- **Modifier** : Bouton sur la carte terrain
- **Supprimer** : Avec confirmation

**Informations d'un terrain :**
- Nom du terrain
- Type de surface (béton, gazon, etc.)
- Sport (Padel, Football, Tennis, etc.)
- Ville
- Photo (optionnelle)

### 4.3 Gestion des Créneaux

**Types de création :**

| Type | Description |
|------|-------------|
| **Simple** | Un seul créneau (date, heure début/fin, prix) |
| **Récurrent** | Série de créneaux (jour de semaine, durée, plage de dates) |

**Informations d'un créneau :**
- Terrain associé
- Date et heure
- Prix (et prix secondaire optionnel)
- Statut (Libre, Réservé, Confirmé)
- Disponibilité

### 4.4 Gestion des Réservations

**Filtres par statut :**

| Statut | Couleur | Description |
|--------|---------|-------------|
| Toutes | - | Toutes les réservations |
| Réservées | Jaune | En attente de confirmation |
| Confirmées | Vert | Présence confirmée |
| Absents | Rouge | Joueur absent |
| Annulées | Gris | Réservations annulées |

**Recherche :**
- Par nom du joueur
- Par nom du terrain

**Actions disponibles (15 min avant le créneau) :**
- **Confirmer** : Marquer la présence du joueur
- **Absent** : Marquer le joueur absent
- **Annuler** : Annuler la réservation

### 4.5 Paramètres du Club

**Informations modifiables :**
- Nom du club
- Ville
- Adresse
- Téléphone
- Description

**Sports proposés (multi-sélection) :**
- PADEL
- FOOTBALL
- FOOT5
- TENNIS
- BASKET
- HANDBALL
- VOLLEY

## 5. Endpoints API Club

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/auth/login` | Connexion |
| `POST` | `/api/auth/logout` | Déconnexion |

### Club

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/club/me` | Informations du club |
| `PUT` | `/api/utilisateur/update` | Mettre à jour le club |
| `POST` | `/api/club/images` | Ajouter une image |
| `DELETE` | `/api/club/images/{id}` | Supprimer une image |

### Terrains

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/terrains` | Liste des terrains |
| `POST` | `/api/terrains` | Créer un terrain |
| `PUT` | `/api/terrains/{id}` | Modifier un terrain |
| `DELETE` | `/api/terrains/{id}` | Supprimer un terrain |

### Créneaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/creneaux` | Liste des créneaux (paginé) |
| `POST` | `/api/creneaux/terrains/{id}/creneaux` | Créer un créneau simple |
| `POST` | `/api/creneaux/recurrent` | Créer des créneaux récurrents |
| `PUT` | `/api/creneaux/{id}` | Modifier un créneau |
| `PUT` | `/api/creneaux/{id}/annuler` | Annuler un créneau |
| `DELETE` | `/api/creneaux/{id}` | Supprimer un créneau |

### Réservations

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/reservations/reservations` | Liste des réservations |
| `GET` | `/api/reservations/reservations/date?date=` | Réservations par date |
| `PATCH` | `/api/reservations/{id}/confirmer` | Confirmer présence |
| `PUT` | `/api/reservations/{id}/absent` | Marquer absent |
| `PUT` | `/api/reservations/{id}/annuler` | Annuler |

---

# Architecture Technique Commune

## 1. Gestion de l'État (AuthContext)

```typescript
interface AuthContextType {
  token: string | null;
  role: Role | null;           // 'JOUEUR' | 'CLUB' | 'ADMIN'
  isAuthenticated: boolean;
  authReady: boolean;
  login: (token: string) => void;
  logout: () => void;
}
```

**Flux d'authentification :**
1. Connexion → Token JWT reçu
2. Token stocké de manière sécurisée
3. Token décodé pour extraire le rôle
4. Intercepteur ajoute automatiquement le token aux requêtes
5. Erreur 401 → Déconnexion automatique

## 2. Client API (Axios)

**Configuration :**
```typescript
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'
});

// Intercepteur de requête
apiClient.interceptors.request.use(config => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      removeToken();
    }
    return Promise.reject(error);
  }
);
```

## 3. Système de Design

### Palette de Couleurs

| Nom | Hexadécimal | Usage |
|-----|-------------|-------|
| Primary Green | `#1ED760` | Actions, succès |
| Primary Dark | `#05602B` | Navigation active, badges |
| Background | `#F9FAFB` | Fond principal |
| Text Primary | `#0E0E0E` | Texte principal |
| Text Secondary | `#6B7280` | Labels, descriptions |
| Border | `#E5E7EB` | Bordures, séparateurs |
| Warning | `#F59E0B` | Alertes |
| Error | `#EF4444` | Erreurs, suppressions |

### Espacements

```typescript
xs: 4,  sm: 8,  md: 12,  lg: 16,  xl: 20,  xxl: 24,  xxxl: 32
```

### Border Radius

```typescript
sm: 8,  md: 10,  lg: 12,  xl: 16,  xxl: 20,  full: 9999
```

### Typographie

```typescript
xs: 12,  sm: 14,  md: 16,  lg: 18,  xl: 20,  xxl: 24,  xxxl: 26
```

## 4. Types de Données Partagés

### Rôles

```typescript
type Role = 'JOUEUR' | 'CLUB' | 'ADMIN';
```

### Statuts de Réservation

```typescript
type Statut =
  | 'RESERVE'           // En attente
  | 'CONFIRMEE'         // Confirmée
  | 'ABSENT'            // Joueur absent
  | 'ANNULE'            // Annulée (général)
  | 'ANNULE_PAR_JOUEUR' // Annulée par le joueur
  | 'ANNULE_PAR_CLUB'   // Annulée par le club
  | 'LIBRE';            // Disponible
```

### Club

```typescript
interface Club {
  id: number;
  nomClub: string;
  adresse?: string;
  telephone?: string;
  ville?: string;
  locationLink?: string;
  description?: string;
  images?: ClubImage[];
  sports?: string[];
  heureOuverture?: string;
  heureFermeture?: string;
}
```

### Terrain

```typescript
interface Terrain {
  id: number;
  nomTerrain: string;
  typeSurface: string;
  ville: string;
  sport: string;
  photo?: string;
  politiqueClub?: string;
  club?: { id: number; nomClub: string };
}
```

### Créneau

```typescript
interface Creneau {
  id: number;
  dateDebut: string;      // ISO 8601
  dateFin: string;
  date?: string;          // YYYY-MM-DD
  heureDebut?: string;    // HH:mm
  heureFin?: string;
  prix: number;
  secondPrix?: number;
  statut: Statut;
  disponible: boolean;
  terrain: Terrain;
}
```

### Réservation

```typescript
interface Reservation {
  id: number;
  statut: Statut;
  joueur: {
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
  };
  creneau: {
    id: number;
    dateDebut: string;
    dateFin: string;
    prix: number;
    terrain: {
      nomTerrain: string;
      club?: { nomClub?: string };
    };
  };
  dateReservation: string;
  dateAnnulation?: string;
  motifAnnulation?: string;
}
```

---

# Guide de Déploiement

## 1. Configuration de l'Environnement

### Variables d'environnement (.env)

```env
# URL de l'API Backend
EXPO_PUBLIC_API_URL=http://localhost:8080

# Pour iOS Simulator : localhost:8080
# Pour Android Emulator : http://10.0.2.2:8080
# Pour appareil physique : http://[VOTRE_IP]:8080

# Mode développement (optionnel - Club uniquement)
EXPO_PUBLIC_DEV_AUTO_LOGIN=false
EXPO_PUBLIC_DEV_EMAIL=club@test.com
EXPO_PUBLIC_DEV_PASSWORD=Club123!
```

## 2. Développement Local

### Application Joueur (mobile/)

```bash
cd mobile
npm install
npm start          # Démarrer Expo CLI
npm run ios        # Simulateur iOS
npm run android    # Émulateur Android
npm run web        # Prévisualisation web
```

### Application Club (mobile-club/)

```bash
cd mobile-club
npm install
npm start
npm run ios
npm run android
npm run web
```

## 3. Build de Production (EAS)

### Configuration (eas.json)

```json
{
  "cli": { "version": ">= 0.52.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

### Commandes de Build

```bash
# Installation de EAS CLI
npm install -g eas-cli

# Connexion à Expo
eas login

# Build iOS
eas build --platform ios --profile production

# Build Android
eas build --platform android --profile production

# Soumettre aux stores
eas submit --platform ios
eas submit --platform android
```

## 4. Configuration Expo (app.json)

```json
{
  "expo": {
    "name": "FIELDZ",
    "slug": "fieldz",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "dark",
    "ios": {
      "bundleIdentifier": "com.fieldz.app"
    },
    "android": {
      "package": "com.fieldz.app"
    }
  }
}
```

---

## Récapitulatif

### Application Joueur

| Fonctionnalité | Statut |
|----------------|--------|
| Authentification (login/register) | Complet |
| Onboarding | Complet |
| Recherche de clubs | Complet |
| Filtres (sport, ville) | Complet |
| Détails du club | Complet |
| Réservation de créneaux | Complet |
| Gestion des réservations | Complet |
| Profil joueur | Complet |
| Changement de mot de passe | Complet |
| News/Actualités | En cours |
| Connexions sociales | À faire |

### Application Club

| Fonctionnalité | Statut |
|----------------|--------|
| Authentification | Complet |
| Dashboard avec stats | Complet |
| Gestion des terrains (CRUD) | Complet |
| Créneaux simples | Complet |
| Créneaux récurrents | Complet |
| Liste des réservations | Complet |
| Filtres par statut | Complet |
| Confirmation de présence | Complet |
| Marquage d'absence | Complet |
| Annulation | Complet |
| Paramètres du club | Complet |
| Gestion des images | Complet |

---

*Documentation générée le 15 janvier 2026*
*Version: 1.0.0*
