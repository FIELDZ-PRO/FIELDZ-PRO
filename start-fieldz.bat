@echo off
echo ============================
echo 🚀 Lancement FIELDZ
echo ============================

REM Backend
echo.
echo 🔥 Démarrage du backend (Spring Boot)...
start cmd /k "cd fieldz_backend && mvnw spring-boot:run"

timeout /t 5 > nul

REM Frontend
echo.
echo 💻 Démarrage du frontend (React)...
start cmd /k "cd fieldz_frontend && npm run dev"

echo.
echo ✅ Les deux serveurs sont lancés dans des fenêtres distinctes.
