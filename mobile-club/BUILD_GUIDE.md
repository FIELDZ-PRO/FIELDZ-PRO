# Guide de Build - FIELDZ Club

## Problème avec Expo Go

Expo Go **force** l'utilisation de la nouvelle architecture React Native (Fabric), ce qui cause des erreurs strictes de typage (`expected dynamic type 'boolean', but had type 'string'`).

## Solution : Development Build

Au lieu d'utiliser Expo Go, créons un **development build** qui nous permet de contrôler la configuration.

### Étape 1 : Installation d'EAS CLI

```bash
npm install -g eas-cli
```

### Étape 2: Login EAS (optionnel, peut skip)

```bash
eas login
# ou: eas build:configure --skip-credentials
```

### Étape 3 : Configurer le projet

Créer `eas.json` :

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      },
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### Étape 4 : Build local (plus rapide)

**Pour iOS Simulator:**
```bash
eas build --profile development --platform ios --local
```

**Pour Android Emulator:**
```bash
eas build --profile development --platform android --local
```

###  Étape 5 : Installer le build

**iOS:**
- Le fichier `.app` sera dans le dossier de build
- Glisser-déposer dans le Simulator

**Android:**
- Le fichier `.apk` sera généré
- Installer avec `adb install app.apk`

### Étape 6 : Lancer l'app

```bash
npx expo start --dev-client
```

## Alternative PLUS SIMPLE : Expo Dev Client sans build

Si les builds EAS sont trop compliqués, on peut utiliser `expo-dev-client` directement:

```bash
# Installer expo-dev-client
npx expo install expo-dev-client

# Lancer en mode dev
npx expo run:ios
# ou
npx expo run:android
```

Cette commande va:
1. Créer un build natif en local
2. Le lancer automatiquement
3. Vous permettre de désactiver la nouvelle architecture

## Configuration finale app.json

```json
{
  "expo": {
    "name": "FIELDZ Club",
    "plugins": [
      "expo-secure-store"
    ],
    // PAS de newArchEnabled - laisse la valeur par défaut (false)
  }
}
```

## Commandes de développement

```bash
# Nettoyer tout
rm -rf node_modules/.expo .expo android ios

# Réinstaller
npm install

# Lancer en natif (crée le build local automatiquement)
npx expo run:ios --device  # ou --simulator
npx expo run:android
```

## Avantages

✅ Pas d'erreur de type boolean/string
✅ Contrôle total sur la configuration
✅ Performance native
✅ Debugging natif possible
✅ Fonctionne offline

## Note importante

Avec un development build, vous devrez **rebuilder** l'app seulement si vous changez:
- Les dépendances natives
- La configuration (app.json, etc.)

Pour les changements de code JavaScript/TypeScript, pas besoin de rebuild, le hot reload fonctionne normalement!
