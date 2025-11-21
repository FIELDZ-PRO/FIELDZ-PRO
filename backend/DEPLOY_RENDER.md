# Guide de Deploiement sur Render

Ce guide explique comment deployer le backend FIELDZ sur Render.

## Prerequis

1. Compte Render (https://render.com)
2. Repository Git (GitHub, GitLab, ou Bitbucket)
3. Base de donnees PostgreSQL (Render ou externe)

## Etape 1 : Creer la Base de Donnees PostgreSQL

### Option A : PostgreSQL sur Render

1. Dashboard Render > **New** > **PostgreSQL**
2. Configuration :
   - **Name** : `fieldz-db`
   - **Database** : `fieldz`
   - **User** : `fieldz_user`
   - **Region** : Choisir la plus proche
   - **Plan** : Free (dev) ou Starter (prod)
3. Cliquer **Create Database**
4. Noter les informations de connexion :
   - Internal Database URL
   - External Database URL

### Option B : PostgreSQL Externe (Supabase, Neon, etc.)

Recuperer l'URL de connexion au format :
```
postgresql://user:password@host:5432/database
```

## Etape 2 : Creer le Web Service

1. Dashboard Render > **New** > **Web Service**
2. Connecter votre repository Git
3. Configuration :

| Champ | Valeur |
|-------|--------|
| **Name** | `fieldz-backend` |
| **Region** | Meme que la BDD |
| **Branch** | `main` ou `prod` |
| **Root Directory** | `backend` |
| **Runtime** | `Docker` ou `Java` |
| **Build Command** | `mvn clean package -Pprod -DskipTests` |
| **Start Command** | `java -jar target/fieldz-1.0.0.jar` |

## Etape 3 : Variables d'Environnement

Dans l'onglet **Environment** du Web Service, ajouter :

### Variables Requises

```env
# Profil Spring
SPRING_PROFILES_ACTIVE=prod

# Base de donnees (copier depuis Render PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/fieldz

# OU separer les credentials
DB_USERNAME=fieldz_user
DB_PASSWORD=your_secure_password

# JWT (IMPORTANT: generer des cles uniques !)
JWT_SECRET=votre-secret-jwt-256-bits-minimum
JWT_ACCESS_EXP_MINUTES=15
JWT_REFRESH_EXP_DAYS=7

# OAuth2 Google
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx

# CORS (URL de votre frontend Vercel)
CORS_ALLOWED_ORIGINS=https://votre-app.vercel.app

# URLs
FRONTEND_URL=https://votre-app.vercel.app
BACKEND_URL=https://fieldz-backend.onrender.com

# Cookies
COOKIE_DOMAIN=onrender.com
COOKIE_SECURE=true

# Mail (optionnel)
MAIL_FROM=contact.fieldz@gmail.com
MAIL_USERNAME=contact.fieldz@gmail.com
MAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx

# Cloudinary (optionnel)
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
```

### Variables Sensibles (Secret Files)

Pour les cles RSA, utiliser les **Secret Files** de Render :
1. Aller dans **Environment** > **Secret Files**
2. Ajouter `keys/private.pem` avec le contenu de votre cle privee
3. Ajouter `keys/public.pem` avec le contenu de votre cle publique

## Etape 4 : Configuration du Health Check

Dans les parametres du Web Service :

| Champ | Valeur |
|-------|--------|
| **Health Check Path** | `/actuator/health` |
| **Health Check Interval** | 30 seconds |

## Etape 5 : Deployer

1. Cliquer **Create Web Service**
2. Le build et deploiement commencent automatiquement
3. Surveiller les logs pour les erreurs

## Verification Post-Deploiement

### 1. Health Check
```bash
curl https://fieldz-backend.onrender.com/actuator/health
# Reponse attendue : {"status":"UP"}
```

### 2. API Docs (si active)
```bash
curl https://fieldz-backend.onrender.com/v3/api-docs
```

### 3. Test d'authentification
```bash
curl -X POST https://fieldz-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'
```

## Configuration OAuth2 Google

Mettre a jour la console Google Cloud :

1. Aller sur https://console.cloud.google.com
2. APIs & Services > Credentials
3. Modifier votre OAuth 2.0 Client ID
4. Ajouter les URIs autorises :

**Authorized JavaScript origins:**
```
https://votre-app.vercel.app
https://fieldz-backend.onrender.com
```

**Authorized redirect URIs:**
```
https://fieldz-backend.onrender.com/login/oauth2/code/google
```

## Troubleshooting

### Erreur de connexion BDD
- Verifier `DATABASE_URL` est correcte
- Verifier que la BDD Render est dans la meme region
- Utiliser l'Internal URL si possible

### Erreur JWT
- S'assurer que les cles RSA sont correctement configurees
- Verifier les permissions des fichiers

### Erreur CORS
- Verifier `CORS_ALLOWED_ORIGINS` inclut l'URL exacte du frontend
- Pas de slash final dans l'URL

### Application lente au demarrage
- Normal sur le plan gratuit (cold start)
- Considerer le plan Starter pour des temps de reponse meilleurs

## Mise a Jour

Les deploiements sont automatiques sur push vers la branche configuree.

Pour un deploiement manuel :
1. Dashboard > Web Service > **Manual Deploy**
2. Choisir **Deploy latest commit**

## Rollback

1. Dashboard > Web Service > **Events**
2. Trouver le deploiement precedent
3. Cliquer **Rollback to this deploy**

## Monitoring

- **Logs** : Dashboard > Web Service > Logs
- **Metrics** : Dashboard > Web Service > Metrics
- **Alertes** : Configurer dans les parametres du service
