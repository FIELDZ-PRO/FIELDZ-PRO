# Instructions de Migration Dev/Prod

Ce document decrit les etapes pour migrer le projet FIELDZ vers la nouvelle architecture avec profils separes.

## Vue d'ensemble des Changements

### Fichiers Ajoutes/Modifies

| Fichier | Action | Description |
|---------|--------|-------------|
| `application.yml` | Cree | Configuration commune |
| `application-dev.yml` | Cree | Profil developpement (H2) |
| `application-prod.yml` | Cree | Profil production (PostgreSQL) |
| `application.properties` | A supprimer | Remplace par les fichiers YAML |
| `pom.xml` | Modifie | Spring Boot 3.4.0, Flyway, Actuator |
| `CorsConfig.java` | Modifie | Support des profils |
| `SecurityConfig.java` | Modifie | 3 security chains |
| `V1__Initial_schema.sql` | Cree | Migration Flyway |
| `.env.example` | Cree | Template variables d'environnement |

## Etapes de Migration

### 1. Sauvegarder l'Existant

```bash
# Creer une branche de backup
git checkout -b backup/pre-migration
git add -A
git commit -m "Backup avant migration dev/prod"
git checkout dev
```

### 2. Mettre a Jour les Dependances

```bash
# Nettoyer le cache Maven
mvn clean

# Telecharger les nouvelles dependances
mvn dependency:resolve
```

### 3. Supprimer l'Ancien application.properties

```bash
# IMPORTANT : Apres avoir verifie que les YAML fonctionnent
rm src/main/resources/application.properties
```

### 4. Configurer l'Environnement Local

```bash
# Copier le template
cp .env.example .env

# Editer avec vos valeurs locales
# IMPORTANT : Ne jamais commiter le fichier .env !
```

### 5. Tester en Mode Dev

```bash
# Lancer avec le profil dev
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Verifier :
# - Console H2 : http://localhost:8080/h2-console
# - Swagger : http://localhost:8080/swagger-ui.html
# - API : http://localhost:8080/api/auth/login
```

### 6. Preparer la Production

#### 6.1 Generer les Cles JWT (si necessaire)

```bash
# Sur Linux/Mac
./generate-jwt-keys.sh

# Sur Windows (Git Bash)
bash generate-jwt-keys.sh
```

#### 6.2 Tester avec PostgreSQL Local (optionnel)

```bash
# Creer une base de test
createdb fieldz_test

# Lancer avec le profil prod
DATABASE_URL=jdbc:postgresql://localhost:5432/fieldz_test \
DB_USERNAME=postgres \
DB_PASSWORD=password \
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

### 7. Deployer sur Render

Suivre le guide [DEPLOY_RENDER.md](DEPLOY_RENDER.md).

## Verification Post-Migration

### Checklist Dev

- [ ] Application demarre sans erreur
- [ ] Console H2 accessible
- [ ] Swagger UI fonctionne
- [ ] Login/Register fonctionnent
- [ ] OAuth2 Google fonctionne
- [ ] CORS autorise le frontend local

### Checklist Prod

- [ ] Build Maven reussit
- [ ] Migrations Flyway s'executent
- [ ] Health check repond OK
- [ ] Login/Register fonctionnent
- [ ] OAuth2 Google fonctionne
- [ ] CORS autorise le frontend Vercel
- [ ] Cookies refresh_token securises

## Rollback

En cas de probleme :

```bash
# Revenir a la branche de backup
git checkout backup/pre-migration

# OU restaurer un fichier specifique
git checkout backup/pre-migration -- src/main/resources/application.properties
```

## Migration des Donnees Existantes

Si vous avez des donnees H2 a migrer vers PostgreSQL :

### Option 1 : Export/Import SQL

```bash
# Export depuis H2
java -cp h2-*.jar org.h2.tools.Script \
  -url jdbc:h2:file:./data/fieldz_db \
  -user sa \
  -script backup.sql

# Adapter le SQL pour PostgreSQL (types, sequences, etc.)
# Importer dans PostgreSQL
psql -d fieldz -f backup_adapted.sql
```

### Option 2 : Recreer les Donnees

Pour un environnement de test, il est souvent plus simple de recreer les donnees via l'API.

## Problemes Courants

### "Table already exists" avec Flyway

```bash
# Si les tables existent deja, utiliser baseline
mvn flyway:baseline -Dflyway.baselineVersion=1
```

### Erreur de version JJWT

La mise a jour vers JJWT 0.12.6 peut necessiter des ajustements dans `JwtService.java` :

```java
// Ancien (0.11.x)
Jwts.parser().setSigningKey(key)

// Nouveau (0.12.x)
Jwts.parser().verifyWith(key).build()
```

### Erreur CORS

Verifier que `CORS_ALLOWED_ORIGINS` ne contient pas de slash final :
- Correct : `https://app.vercel.app`
- Incorrect : `https://app.vercel.app/`

## Support

En cas de probleme :
1. Verifier les logs : `mvn spring-boot:run` avec `logging.level.root=DEBUG`
2. Consulter la documentation Spring Boot 3.4
3. Ouvrir une issue sur le repository
