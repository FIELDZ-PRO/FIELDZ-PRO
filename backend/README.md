# FIELDZ Backend

Plateforme de reservation de creneaux de padel et autres sports.

## Stack Technique

- **Framework** : Spring Boot 3.4.0
- **Java** : 17
- **Base de donnees** : H2 (dev) / PostgreSQL (prod)
- **Securite** : JWT (RS256) + OAuth2 Google
- **Migrations** : Flyway
- **Documentation API** : OpenAPI / Swagger

## Structure du Projet

```
backend/
├── src/main/java/com/fieldz/
│   ├── auth/              # Authentification & JWT
│   ├── config/            # Configuration Spring
│   ├── controller/        # Endpoints REST
│   ├── dto/               # Data Transfer Objects
│   ├── exception/         # Gestion des erreurs
│   ├── mapper/            # Entity <-> DTO
│   ├── model/             # Entites JPA
│   ├── repository/        # Acces BDD
│   ├── scheduler/         # Taches planifiees
│   ├── security/          # JWT, OAuth2, Rate Limiting
│   ├── service/           # Logique metier
│   └── util/              # Utilitaires
├── src/main/resources/
│   ├── application.yml         # Config commune
│   ├── application-dev.yml     # Config dev (H2)
│   ├── application-prod.yml    # Config prod (PostgreSQL)
│   ├── db/migration/           # Scripts Flyway
│   └── keys/                   # Cles RSA pour JWT
└── pom.xml
```

## Demarrage Rapide

### Prerequis

- Java 17+
- Maven 3.8+
- (Optionnel) PostgreSQL 15+ pour la prod

### Installation

```bash
# Cloner le repo
git clone <repo-url>
cd backend

# Copier le fichier d'environnement
cp .env.example .env
# Editer .env avec vos valeurs

# Lancer en mode dev
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Profils Disponibles

| Profil | Base de donnees | Usage |
|--------|-----------------|-------|
| `dev`  | H2 (fichier)    | Developpement local |
| `prod` | PostgreSQL      | Production (Render) |

### Commandes Utiles

```bash
# Demarrer en dev
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Demarrer en prod
mvn spring-boot:run -Dspring-boot.run.profiles=prod

# Build du JAR
mvn clean package -DskipTests

# Executer les tests
mvn test
```

## Configuration

### Variables d'Environnement

Voir `.env.example` pour la liste complete. Variables essentielles :

| Variable | Description | Requis |
|----------|-------------|--------|
| `SPRING_PROFILES_ACTIVE` | Profil actif (dev/prod) | Oui |
| `DATABASE_URL` | URL PostgreSQL (prod) | Prod |
| `GOOGLE_CLIENT_ID` | OAuth2 Google | Oui |
| `GOOGLE_CLIENT_SECRET` | OAuth2 Google | Oui |
| `CORS_ALLOWED_ORIGINS` | URLs frontend autorisees | Oui |

### JWT (RS256)

Le projet utilise des cles RSA pour signer les tokens JWT :

```bash
# Generer les cles (une seule fois)
./generate-jwt-keys.sh
```

Les cles sont stockees dans `src/main/resources/keys/`.

## API Documentation

Une fois l'application demarree :

- **Swagger UI** : http://localhost:8080/swagger-ui.html
- **OpenAPI JSON** : http://localhost:8080/v3/api-docs

### Endpoints Principaux

| Methode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/refresh` | Rafraichir le token |
| GET | `/api/club/search` | Rechercher des clubs |
| GET | `/api/creneaux/club/{id}` | Creneaux d'un club |
| POST | `/api/joueur/reservation` | Reserver un creneau |

## Deploiement

Voir [DEPLOY_RENDER.md](DEPLOY_RENDER.md) pour le guide complet de deploiement sur Render.

### Build Production

```bash
# Creer le JAR
mvn clean package -Pprod -DskipTests

# Lancer
java -jar target/fieldz-1.0.0.jar --spring.profiles.active=prod
```

## Securite

- **Authentification** : JWT avec tokens d'acces (15min) et refresh (7 jours)
- **OAuth2** : Google Sign-In
- **CORS** : Configure par environnement
- **Rate Limiting** : Protection contre le brute force
- **Headers** : HSTS, CSP, X-Content-Type-Options

## Base de Donnees

### Dev (H2)

- Console : http://localhost:8080/h2-console
- JDBC URL : `jdbc:h2:file:./data/fieldz_db`
- User : `sa` / Password : (vide)

### Prod (PostgreSQL)

- Migrations gerees par Flyway
- Scripts dans `src/main/resources/db/migration/`

## Roles Utilisateurs

| Role | Description |
|------|-------------|
| `JOUEUR` | Peut reserver des creneaux |
| `CLUB` | Gere ses terrains et creneaux |
| `ADMIN` | Administration globale |

## Contribution

1. Fork le projet
2. Creer une branche feature (`git checkout -b feature/ma-feature`)
3. Commit (`git commit -m 'Ajout de ma feature'`)
4. Push (`git push origin feature/ma-feature`)
5. Ouvrir une Pull Request

## License

Projet prive - Tous droits reserves.
