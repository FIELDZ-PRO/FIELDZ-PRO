# 🚀 Lancer les deux apps en même temps

Ce guide explique comment lancer **mobile-club** (CLUB) et **mobile** (JOUEUR) en parallèle pour tester la synchronisation.

## ✅ Configuration automatique

J'ai déjà configuré:
- **mobile-club** → Port 8081 → Auto-login `club@test.com`
- **mobile** → Port 8082 → Auto-login `joueur@test.com`
- Les deux apps pointent vers le même backend H2 local

## 📱 Lancement

### Terminal 1: Backend

```bash
cd /Users/yacinebask/Desktop/FIELDZ-PRO-1/backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Le backend tourne sur http://localhost:8080 avec H2 en mémoire.

### Terminal 2: App CLUB

```bash
cd /Users/yacinebask/Desktop/FIELDZ-PRO-1/mobile-club
npm run ios
# Ou: npm start (si le build est déjà fait)
```

L'app CLUB va:
- ✅ S'ouvrir sur le simulateur iOS
- ✅ Se connecter automatiquement avec `club@test.com`
- ✅ Utiliser le port 8081

### Terminal 3: App JOUEUR

```bash
cd /Users/yacinebask/Desktop/FIELDZ-PRO-1/mobile
npm run ios
# Ou: npm start (si le build est déjà fait)
```

L'app JOUEUR va:
- ✅ S'ouvrir sur un autre simulateur iOS (ou le même)
- ✅ Se connecter automatiquement avec `joueur@test.com`
- ✅ Utiliser le port 8082

## 🔄 Tester la synchronisation

### Scénario 1: Club crée un créneau

1. **Sur app CLUB**: Créer un nouveau créneau
2. **Sur app JOUEUR**: Faire un pull-to-refresh → Le créneau apparaît !

### Scénario 2: Joueur réserve un créneau

1. **Sur app JOUEUR**: Réserver un créneau
2. **Sur app CLUB**: Faire un pull-to-refresh → La réservation apparaît !

### Scénario 3: Club confirme une réservation

1. **Sur app CLUB**: Confirmer la présence du joueur
2. **Sur app JOUEUR**: Faire un pull-to-refresh → Le statut change !

## ⚙️ Mode Auto-login

Les fichiers `.env.dev` sont déjà configurés avec `EXPO_PUBLIC_DEV_AUTO_LOGIN=true`.

**Pour désactiver l'auto-login** (et avoir un bouton "DEV LOGIN" à la place):

```bash
# Dans mobile-club/.env.dev ou mobile/.env.dev
EXPO_PUBLIC_DEV_AUTO_LOGIN=false
```

Le bouton "🔧 DEV LOGIN" apparaîtra sur l'écran de connexion.

## 🎯 Polling automatique (optionnel)

Si tu veux que les apps se rafraîchissent automatiquement toutes les X secondes sans pull-to-refresh:

Je peux ajouter un système de polling. Dis-moi si tu veux ça!

## 📝 Ports utilisés

- Backend: `8080`
- Metro bundler CLUB: `8081`
- Metro bundler JOUEUR: `8082`

Si tu as un conflit de port:

```bash
# Changer le port dans mobile-club/.env.dev ou mobile/.env.dev
EXPO_PORT=8083  # Par exemple
```

## 🔧 Troubleshooting

### "Port 8081 already in use"

```bash
# Tuer tous les processus Metro
pkill -f "expo"
# Relancer
```

### "Cannot connect to Metro bundler"

Vérifier que les deux apps utilisent des ports différents dans leurs fichiers `.env.dev`.

### "Backend unreachable"

```bash
# Tester dans le navigateur
open http://localhost:8080/api/sports
```

## 💡 Astuce

Ouvre deux fenêtres de simulateur côte à côte:
- Simulateur 1: App CLUB
- Simulateur 2: App JOUEUR

Tu pourras voir en temps réel les changements !
