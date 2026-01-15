# Démarrage Rapide - FIELDZ Club

## TL;DR - Pour lancer l'app maintenant

### 1. Démarrer le backend

```bash
cd ../backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Le backend tournera sur http://localhost:8080 avec H2 en mémoire.

### 2. Lancer l'app mobile

**Option simple (RECOMMANDÉ):**

```bash
cd mobile-club
npx expo run:ios
```

Cela va:
- Créer un build natif (première fois: ~5-10 min)
- Lancer automatiquement sur le simulator
- Éviter les erreurs de type d'Expo Go

**Si vous avez des erreurs de pods iOS:**

```bash
cd ios
pod install
cd ..
npx expo run:ios
```

### 3. Se connecter

Utilisez un compte club de test (voir `backend/CREDENTIALS_DEV.md`):
- Email: `club@test.com`
- Mot de passe: `Club123!`

## Problèmes courants

### "Expected dynamic type 'boolean' but had type 'string'"

➡️ **Cause**: Expo Go force la nouvelle architecture React Native

➡️ **Solution**: Utiliser `npx expo run:ios` au lieu d'Expo Go

### "Backend n'est pas joignable"

➡️ **Vérifier** que le backend tourne sur http://localhost:8080

➡️ **Tester** dans le navigateur: http://localhost:8080/api/sports

### "Cannot find module 'expo-dev-client'"

```bash
npx expo install expo-dev-client
npx expo run:ios
```

## Mode développement

Une fois le build créé, vous n'avez plus besoin de rebuilder pour les changements de code JS/TS:

```bash
# Terminal 1: Backend
cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Terminal 2: Metro bundler (si besoin)
cd mobile-club && npx expo start --dev-client
```

Le hot reload fonctionnera normalement!

## Simplifier au maximum

Si les builds natifs sont trop compliqués pour le moment, vous pouvez:

1. **Juste tester les APIs** avec Postman/Swagger (http://localhost:8080/swagger-ui.html)
2. **Utiliser le frontend web** existant dans `/frontend`
3. **Revenir à l'app mobile** plus tard quand le backend est 100% prêt

L'important c'est que le backend et les APIs fonctionnent bien. L'app mobile c'est juste une interface pour consommer ces APIs.
