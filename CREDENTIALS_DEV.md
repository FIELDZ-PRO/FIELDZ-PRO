# 🔐 Credentials de développement

## Comptes de test

### CLUB
- **Email**: `club@test.com`
- **Mot de passe**: `Club123!`
- **Rôle**: CLUB

### JOUEUR
- **Email**: `joueur@test.com`
- **Mot de passe**: `Joueur123!`
- **Rôle**: JOUEUR

## 🚀 Créer les comptes automatiquement

Exécute ce script **une seule fois** après avoir démarré le backend:

```bash
cd /Users/yacinebask/Desktop/FIELDZ-PRO-1

# Créer le compte CLUB
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "club@test.com",
    "motDePasse": "Club123!",
    "nom": "Club Test",
    "typeRole": "CLUB"
  }'

echo "\n✅ Compte CLUB créé\n"

# Créer le compte JOUEUR
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joueur@test.com",
    "motDePasse": "Joueur123!",
    "nom": "Test",
    "prenom": "Joueur",
    "typeRole": "JOUEUR"
  }'

echo "\n✅ Compte JOUEUR créé\n"
```

## ⚙️ Script automatisé

J'ai créé un script pour toi:

```bash
chmod +x create-test-accounts.sh
./create-test-accounts.sh
```

## 📝 Notes

- Ces comptes sont **UNIQUEMENT** pour le développement local
- Ne JAMAIS committer ces credentials en production
- H2 est une base de données en mémoire, les comptes seront **supprimés** au redémarrage du backend
- Tu devras recréer les comptes à chaque redémarrage du backend

## 🔄 Auto-login configuré

Les apps mobiles sont configurées pour se connecter automatiquement:
- **mobile-club** → `club@test.com`
- **mobile** → `joueur@test.com`

Pour désactiver l'auto-login, édite les fichiers `.env.dev` et change:
```bash
EXPO_PUBLIC_DEV_AUTO_LOGIN=false
```
