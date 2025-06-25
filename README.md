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

## ▶ Backend
commandes bash : 
cd backend
./mvnw spring-boot:run
➡ API à : http://localhost:8080

⚠ Assure-toi que la config CORS est bien active (CorsConfig.java)

🔜 Fonctionnalités prévues

📅 Affichage et réservation de créneaux

📈 Historique des réservations par joueur

🧾 Gestion des terrains côté club

📱 Version responsive ou mobile

🧑‍💻 Auteur
Projet développé par Arslan Dif et Nazim Lamèche 
👋 Contact : 
LinkedIn - https://www.linkedin.com/in/arslan-dif-740077287/ -
LinkedIn - -

📝 Licence
Ce projet est sous licence MIT — libre d’utilisation et de modification.