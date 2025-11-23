# FIELDZ - Cheatsheet Commandes

Reference rapide des commandes essentielles pour le developpement et le deploiement.

## Maven

### Developpement

```bash
# Lancer en dev (H2)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Lancer en dev avec debug
mvn spring-boot:run -Dspring-boot.run.profiles=dev -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"

# Recompiler sans redemarrer (avec devtools)
# Sauvegarder un fichier declenche le reload automatique
```

### Build

```bash
# Build simple
mvn clean package

# Build production (sans tests)
mvn clean package -Pprod -DskipTests

# Build avec tests
mvn clean package -Pprod

# Verifier les dependances
mvn dependency:tree
```

### Tests

```bash
# Tous les tests
mvn test

# Un test specifique
mvn test -Dtest=AuthServiceTest

# Tests avec couverture
mvn test jacoco:report
```

### Flyway

```bash
# Info sur les migrations
mvn flyway:info

# Appliquer les migrations
mvn flyway:migrate

# Nettoyer la base (ATTENTION: supprime tout!)
mvn flyway:clean

# Baseline (si tables existent deja)
mvn flyway:baseline -Dflyway.baselineVersion=1

# Reparer le schema Flyway
mvn flyway:repair
```

## Docker

```bash
# Build image
docker build -t fieldz-backend .

# Run container
docker run -p 8080:8080 --env-file .env fieldz-backend

# Docker Compose (si disponible)
docker-compose up -d
```

## Git

```bash
# Nouvelle feature
git checkout -b feature/ma-feature
git add -A
git commit -m "feat: description"
git push origin feature/ma-feature

# Hotfix
git checkout main
git checkout -b hotfix/fix-urgent
git add -A
git commit -m "fix: description"
git push origin hotfix/fix-urgent

# Merge dev -> main
git checkout main
git merge dev
git push origin main
```

## PostgreSQL

```bash
# Connexion
psql -h localhost -U postgres -d fieldz

# Creer la base
createdb fieldz

# Dump
pg_dump -h localhost -U postgres fieldz > backup.sql

# Restore
psql -h localhost -U postgres fieldz < backup.sql

# Lister les tables
\dt

# Decrire une table
\d utilisateur
```

## H2 Console

- URL : https://fieldz-pro.koyeb.app/h2-console
- JDBC URL : `jdbc:h2:file:./data/fieldz_db`
- User : `sa`
- Password : (vide)

## API Testing (curl)

### Authentification

```bash
# Register
curl -X POST https://fieldz-pro.koyeb.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","nom":"Test","typeRole":"JOUEUR"}'

# Login
curl -X POST https://fieldz-pro.koyeb.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'

# Refresh token
curl -X POST https://fieldz-pro.koyeb.app/api/auth/refresh \
  -H "Cookie: refresh_token=xxx"
```

### API Protegee

```bash
# Avec token
curl https://fieldz-pro.koyeb.app/api/joueur/profile \
  -H "Authorization: Bearer <access_token>"

# Liste des clubs
curl https://fieldz-pro.koyeb.app/api/club/search
```

## Cles JWT

```bash
# Generer une paire de cles RSA
openssl genrsa -out private_pkcs1.pem 2048
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private_pkcs1.pem -out private.pem
openssl rsa -in private.pem -pubout -out public.pem

# Verifier les cles
openssl rsa -in private.pem -check
openssl rsa -in public.pem -pubin -text
```

## Logs

```bash
# Suivre les logs en temps reel
tail -f logs/application.log

# Filtrer les erreurs
grep -i error logs/application.log

# Logs Spring Boot (niveau DEBUG)
mvn spring-boot:run -Dspring-boot.run.profiles=dev -Dlogging.level.root=DEBUG
```

## Render CLI

```bash
# Login
render login

# Liste des services
render services list

# Logs
render logs --service fieldz-backend --tail

# Redeploy
render deploys create --service fieldz-backend
```

## Variables d'Environnement

### Dev (.env)

```env
SPRING_PROFILES_ACTIVE=dev
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Prod (Render)

```env
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
CORS_ALLOWED_ORIGINS=https://app.vercel.app
FRONTEND_URL=https://app.vercel.app
BACKEND_URL=https://fieldz-backend.onrender.com
COOKIE_SECURE=true
```

## URLs Importantes

| Environnement | URL |
|---------------|-----|
| Dev Backend | https://fieldz-pro.koyeb.app |
| Dev Frontend | http://localhost:5173 |
| Dev Swagger | https://fieldz-pro.koyeb.app/swagger-ui.html |
| Dev H2 | https://fieldz-pro.koyeb.app/h2-console |
| Prod Health | https://xxx.onrender.com/actuator/health |

## Ports

| Service | Port |
|---------|------|
| Backend | 8080 |
| Frontend (Vite) | 5173 |
| PostgreSQL | 5432 |
| Debug | 5005 |
