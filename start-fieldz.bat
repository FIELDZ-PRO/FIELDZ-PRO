@echo off
echo ============================
echo 🚀 Lancement FIELDZ
echo ============================

REM Lancer backend
echo.
echo 🔥 Démarrage du backend (Spring Boot)...
start "BACKEND" cmd /k "cd /d C:\Users\HP\FIELDZ\fieldz_backend && mvnw spring-boot:run"

timeout /t 5

REM Lancer frontend
echo.
echo 💻 Démarrage du frontend (React)...
start "FRONTEND" cmd /k "cd /d C:\Users\HP\FIELDZ\fieldz_frontend && npm run dev"

echo.
echo ✅ Les deux serveurs sont lancés dans deux fenêtres.
pause
