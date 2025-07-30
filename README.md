# 🎾 FIELDZ

> **FIELDZ** est une plateforme web complète de **réservation de créneaux de padel**, développée avec une architecture **fullstack moderne** :

- 🖥️ **Frontend** : React + Vite + Tailwind CSS  
- ⚙️ **Backend** : Spring Boot + JWT + PostgreSQL  
- 🔐 **Authentification par rôles** : `JOUEUR` et `CLUB`

---

## 📁 Structure du projet

```bash
FIELDZ/
├── frontend/        # Application React (interface utilisateur)
├── backend/         # Application Spring Boot (API REST sécurisée)
├── .gitignore
└── README.md


---

## 🚀 Fonctionnalités principales

### ✅ Frontend (React)

- Interface utilisateur avec Tailwind CSS
- Formulaire de connexion sécurisé
- Stockage et décodage du token JWT
- Redirection automatique selon le rôle (`/club` ou `/joueur`)
- Routes protégées (`ProtectedRoute`)
- Bouton de déconnexion

### ✅ Backend (Spring Boot)

- Authentification via JWT
- Rôles `JOUEUR` et `CLUB`
- Endpoints sécurisés :
  - `/api/auth/login`
  - `/api/club/**`
  - `/api/joueur/**`
- Configuration CORS propre pour accès depuis le frontend (`localhost:5173`)

---

## 🧪 Comment lancer le projet

## ▶ Frontend

commandes bash : 

cd frontend
npm install
npm run dev
➡ Accès à : http://localhost:5173
➡ API à : http://localhost:8080

## ▶ Backend
commandes bash : 
cd C:\Users\HP\FIELDZ\fieldz_backend  
./mvnw spring-boot:run

## ▶ Frontend
commandes bash :
cd C:\Users\HP\FIELDZ\fieldz_frontend
npm run dev
  
⚠ Assure-toi que la config CORS est bien active (CorsConfig.java)

🔜 Fonctionnalités prévues

📅 Affichage et réservation de créneaux

📈 Historique des réservations par joueur

🧾 Gestion des terrains côté club

📱 Version responsive ou mobile

##> 📖 Accès à la documentation de l’API (Swagger UI)

▶ Lancer Swagger UI en local
Swagger UI te permet de visualiser et tester tous les endpoints du backend facilement depuis une interface web.

Lancer le backend Spring Boot :

bash
Copier
Modifier
cd fieldz_backend
./mvnw spring-boot:run
# ou
mvn spring-boot:run
Ouvrir Swagger UI dans ton navigateur à l’adresse :

bash
Copier
Modifier
http://localhost:8080/swagger-ui.html
(selon la version, essaie aussi http://localhost:8080/swagger-ui/index.html)

### authentification google ##

🔐 Authentification via Google (OAuth2)
L’application FIELDZ permet aux utilisateurs de se connecter via leur compte Google, en plus de l’authentification par email/mot de passe classique.

📌 Fonctionnement actuel
Lorsqu’un utilisateur clique sur "Connexion via Google", il est redirigé vers la page d’authentification officielle Google.

S’il s’agit de sa première connexion, un compte est automatiquement créé dans la base de données avec :

l’email Google,

un rôle par défaut (JOUEUR),

un mot de passe vide (non nécessaire pour l’auth Google),

et un token JWT est généré automatiquement.

L’utilisateur est redirigé vers /oauth-success, où son token est décodé, et il est ensuite redirigé vers la page correspondant à son rôle (/joueur, /club, etc.).

🔧 Prérequis pour tester en local
Dans le Google Cloud Console, assure-toi que :

Le Client ID utilisé côté frontend correspond à l’origine http://localhost:5173.

Le Client ID côté backend est bien celui configuré dans application.properties.

Dans frontend/.env ou directement dans GoogleOAuthProvider, le clientId doit être :

Copier
Modifier
655220357439-xxxxx.apps.googleusercontent.com
Le backend doit être lancé sur http://localhost:8080 et le frontend sur http://localhost:5173.

🧪 Comment tester la connexion Google
Démarre le backend Spring Boot :

bash
Copier
Modifier
./mvnw spring-boot:run
Démarre le frontend React :

bash
Copier
Modifier
npm run dev
Va sur http://localhost:5173/login

Clique sur le bouton "Connexion via Google"

✅ Cas 1 : Utilisateur existant

L’utilisateur est reconnu par son email.

Il est automatiquement connecté, le token JWT est stocké, et il est redirigé selon son rôle.

🆕 Cas 2 : Utilisateur inconnu (première connexion)

Le backend crée automatiquement un nouveau compte JOUEUR.

Il reçoit un token JWT valide et est redirigé vers /joueur.

✅ Comportements gérés
🔒 Connexion via Google sécurisée (OAuth2)

✅ Création automatique d’un compte pour les nouveaux utilisateurs

🧭 Redirection dynamique selon le rôle (CLUB ou JOUEUR)

🧠 Persistant via localStorage (token stocké et lu automatiquement)

############## BDD PGSQL et H2 #########################

#Pour la version PoGSQL, il faut taper ça dans le terminal (en remplaçant ton_mot_de_passe par votre mot de passe PGSQL)
#Attention, il faut un encodage en UTF8, si vous codez sur IntelliJ, essayez d'ouvrir applicationproperties sur VSCode (en UTF8 par défaut) puis faire CTRL+S

set DB_PASSWORD=ton_mot_de_passe
mvnw spring-boot:run

##################code à copier pour SQL : 
spring.application.name=fieldz

# ---------------------------
# POSTGRESQL CONFIGURATION
# ---------------------------

spring.datasource.url=jdbc:postgresql://localhost:5432/fieldz
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.username=postgres
spring.datasource.password=${DB_PASSWORD}
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# -------------------------
# H2 DATABASE CONFIGURATION (TOUT commenté)
# -------------------------
# spring.datasource.url=jdbc:h2:file:./data/fieldz_db
# spring.datasource.driverClassName=org.h2.Driver
# spring.datasource.username=sa
# spring.datasource.password=
# spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
# spring.jpa.hibernate.ddl-auto=update
# spring.jpa.show-sql=true

# # H2 Web Console
# spring.h2.console.enabled=true
# spring.h2.console.path=/h2-console

springdoc.swagger-ui.path=/swagger-ui.html
jwt.secret=rC6VGsN9YzKqv2AYP8r8CW6sQsAD+BF4W1s4+LE2YFY=


 
################ code à copier pour H2 : 
spring.application.name=fieldz

# ---------------------------
# POSTGRESQL CONFIGURATION
# ---------------------------

#spring.datasource.url=jdbc:postgresql://localhost:5432/fieldz
#spring.datasource.driver-class-name=org.postgresql.Driver
#spring.datasource.username=postgres
#spring.datasource.password=TON_MOT_DE_PASSE

#spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
#spring.jpa.hibernate.ddl-auto=update
#spring.jpa.show-sql=true

# -------------------------
# H2 DATABASE CONFIGURATION
# -------------------------
spring.datasource.url=jdbc:h2:file:./data/fieldz_db
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA settings
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# H2 Web Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Pour que tout soit lisible et joli
springdoc.swagger-ui.path=/swagger-ui.html


jwt.secret=rC6VGsN9YzKqv2AYP8r8CW6sQsAD+BF4W1s4+LE2YFY=


#########   ▶ Astuces & bonnes pratiques #########
Si Swagger n’est pas accessible :

Vérifie que le backend tourne bien (pas d’erreur au démarrage)

Assure-toi que le port 8080 n’est pas bloqué par un firewall

Vérifie qu’aucun autre serveur n’utilise déjà le port 8080

Désactive Swagger en production pour plus de sécurité (voir doc springdoc).

Swagger n’est pas accessible sur Internet sauf si le projet est déployé publiquement (VPS, cloud, ngrok…).

🧑‍💻 Auteur
Projet développé par :
_ DIF Arslan
_ Allam Yacine
_ Lamèche Nazim

👋 Contact : 
LinkedIn - https://www.linkedin.com/in/arslan-dif-740077287/ -
LinkedIn - -
LinkedIn - -

📝 Licence
Ce projet est sous licence MIT — libre d’utilisation et de modification.
