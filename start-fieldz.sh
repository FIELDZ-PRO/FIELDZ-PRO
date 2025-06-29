#!/bin/bash

echo "============================"
echo "🚀 Lancement FIELDZ"
echo "============================"

# Backend
echo ""
echo "🔥 Démarrage du backend (Spring Boot)..."
osascript -e 'tell application "Terminal" to do script "cd ~/FIELDZ/fieldz_backend && ./mvnw spring-boot:run"'

sleep 5

# Frontend
echo ""
echo "💻 Démarrage du frontend (React)..."
osascript -e 'tell application "Terminal" to do script "cd ~/FIELDZ/fieldz_frontend && npm run dev"'

echo ""
echo "✅ Les deux serveurs sont lancés dans des fenêtres Terminal."
