# FIELDZ Club - Application Mobile

Application mobile React Native pour la gestion des clubs sportifs dans le système FIELDZ.

## 🚀 Fonctionnalités

### ✅ Implémentées
- **Authentification** - Connexion sécurisée des clubs avec JWT
- **Navigation** - Bottom tabs avec 5 écrans principaux
- **Dashboard** - Vue d'ensemble avec statistiques en temps réel
  - Stats du jour (réservations, confirmées, revenus)
  - Liste des réservations du jour
  - Aperçu des terrains
  - Pull-to-refresh
- **Gestion des terrains** - CRUD complet
  - Créer, modifier, supprimer des terrains
  - Sélection du sport et type de surface
  - Support photos
  - Floating Action Button
- **Gestion des créneaux** - Simple et récurrent
  - Créneaux simples (date/heure/prix)
  - Créneaux récurrents (jours de semaine + période)
  - FAB avec options multiples
  - Suppression avec confirmation
- **Gestion des réservations** - Complète
  - Filtres par statut (Toutes, Réservées, Confirmées, Absents, Annulées)
  - Recherche par nom/terrain
  - Actions avec période de grâce 15 min
  - Confirmer présence / Marquer absent / Annuler
- **Paramètres** - Configuration du club
  - Édition infos (nom, ville, adresse, téléphone, description)
  - Sélection des sports proposés
  - Déconnexion sécurisée

## 📱 Écrans

1. **Accueil (Dashboard)** - Statistiques et réservations du jour
2. **Terrains** - Gestion des terrains du club
3. **Créneaux** - Création et gestion des créneaux
4. **Réservations** - Visualisation et gestion des réservations
5. **Paramètres** - Configuration du club

## 🔧 Installation

```bash
cd mobile-club
npm install
```

## 🏃 Lancement

### ⚠️ IMPORTANT : Problème avec Expo Go

Expo Go force la nouvelle architecture React Native (Fabric) qui cause des erreurs de type strictes.

**Solution recommandée**: Utiliser un development build au lieu d'Expo Go.

### Option 1 : Build local automatique (RECOMMANDÉ)

```bash
# iOS Simulator
npx expo run:ios

# Android Emulator
npx expo run:android
```

Cette commande va automatiquement:
1. Créer un build natif en local
2. L'installer sur votre simulator/emulator
3. Le lancer avec hot reload

**Note**: Le premier build peut prendre 5-10 minutes. Les suivants seront instantanés.

### Option 2 : Build avec EAS (si Option 1 ne marche pas)

Voir le guide complet dans [BUILD_GUIDE.md](BUILD_GUIDE.md).

### Option 3 : Expo Go (peut avoir des erreurs)

```bash
npm start
# Puis scanner le QR code avec Expo Go
```

⚠️ Cette option peut causer des erreurs de type boolean/string à cause de la nouvelle architecture forcée.

## 🌐 Configuration

Créez un fichier `.env` à partir de `.env.example`:

```bash
# iOS Simulator et Expo web:
EXPO_PUBLIC_API_URL=http://localhost:8080

# Android Emulator:
# EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
```

## 🔐 Compte de test

Pour tester l'application, utilisez un compte club depuis `backend/CREDENTIALS_DEV.md`.

Exemple:
- Email: `club@test.com`
- Password: `Club123!`

## 📚 Stack Technique

- **React Native** avec Expo SDK 54
- **TypeScript** pour la sécurité des types
- **React Navigation** (Native Stack + Bottom Tabs)
- **Axios** pour les appels API
- **expo-secure-store** pour le stockage sécurisé des tokens
- **jwt-decode** pour la gestion des JWT

## 📂 Structure du projet

```
mobile-club/
├── src/
│   ├── api/              # Services API
│   │   ├── auth.ts
│   │   ├── club.ts
│   │   ├── terrains.ts
│   │   ├── creneaux.ts
│   │   └── reservations.ts
│   ├── components/       # Composants réutilisables
│   │   ├── ui/          # Composants UI (Button, Input)
│   │   └── Logo.tsx
│   ├── contexts/        # Context API
│   │   └── AuthContext.tsx
│   ├── navigation/      # Navigation
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── screens/         # Écrans
│   │   ├── auth/
│   │   └── main/
│   ├── theme/           # Design system
│   │   └── index.ts
│   └── types/           # Types TypeScript
│       └── index.ts
├── App.tsx              # Point d'entrée
└── app.json             # Configuration Expo
```

## 🔗 Backend

Cette application nécessite le backend FIELDZ en cours d'exécution:

```bash
cd ../backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

## 📝 Notes

- Cette app est dédiée aux **CLUBS** uniquement
- L'app joueurs est dans le dossier `mobile/`
- Les deux apps partagent le même backend
