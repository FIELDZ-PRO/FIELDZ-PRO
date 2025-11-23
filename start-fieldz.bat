@echo off
echo 🚀 Démarrage de FIELDZ...

REM --- Backend ---
echo ▶️ Démarrage du backend (Spring Boot)...
cd backend
start cmd /k mvnw spring-boot:run
cd ..

REM --- Frontend ---
echo ▶️ Démarrage du frontend (React)...
cd frontend
npm install --silent
start cmd /k npm run dev
cd ..

echo ✅ Les deux serveurs tournent !
echo 🌍 Backend : https://fieldz-pro.koyeb.app/
echo 🌍 Frontend : http://localhost:5173/
