# 🚀 Lancer l'app MAINTENANT (Solution finale)

## Ce qu'on vient de faire:

✅ Installé `expo-dev-client` - permet de faire des builds natifs
✅ Mis à jour les scripts npm
✅ Arrêté Expo Go (qui causait les erreurs)

## Ce que tu dois faire MAINTENANT:

### Étape 1: Lancer le build iOS (première fois seulement)

Ouvre un terminal et lance:

```bash
cd /Users/yacinebask/Desktop/FIELDZ-PRO-1/mobile-club
npm run ios
```

**⏱️ PATIENCE**: Le premier build prend **5-10 minutes**.

Tu vas voir:
```
› Building app...
› Compiling...
› Linking...
```

C'est normal! Xcode compile tout le code natif.

### Étape 2: Une fois le build terminé

Le simulateur iOS va s'ouvrir automatiquement avec ton app! 🎉

### Étape 3: Modifications futures

Pour les prochaines fois, tu n'auras plus besoin de rebuilder!

**Terminal 1 - Backend:**
```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

**Terminal 2 - App mobile:**
```bash
cd mobile-club
npm start
```

L'app se rechargera automatiquement à chaque modification de code!

## Si tu as une erreur pendant le build

### "CocoaPods not installed"

```bash
sudo gem install cocoapods
cd ios && pod install && cd ..
npm run ios
```

### "No iOS devices connected"

- Ouvre Xcode
- Menu: Xcode > Open Developer Tool > Simulator
- Relance `npm run ios`

### "Build failed"

```bash
# Nettoyer tout
rm -rf ios android .expo node_modules
npm install
npm run ios
```

## Pourquoi cette solution fonctionne?

❌ **Expo Go** = Force la nouvelle architecture React Native = Erreurs de type
✅ **Build natif** = Tu contrôles la config = Pas d'erreur de type

## Alternative si ça ne marche vraiment pas

Si le build iOS est trop compliqué pour le moment:

1. Concentre-toi sur le **backend** d'abord
2. Utilise **Swagger** pour tester les APIs: http://localhost:8080/swagger-ui.html
3. Ou utilise le **frontend web** dans `/frontend`
4. Reviens à l'app mobile plus tard

L'important c'est que le backend et les APIs marchent. L'app mobile c'est juste une interface.

---

## Besoin d'aide?

Si le build prend plus de 15 minutes ou plante, arrête tout (Ctrl+C) et dis-moi l'erreur exacte.
