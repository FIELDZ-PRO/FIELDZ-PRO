#!/bin/bash

echo "🚀 Démarrage de FIELDZ..."

# --- Backend ---
echo "▶️ Démarrage du backend (Spring Boot)..."
cd backend || { echo "❌ Dossier backend introuvable"; exit 1; }
./mvnw spring-boot:run &
BACK_PID=$!
cd ..

# Attendre un peu pour éviter les conflits
sleep 5

# --- Frontend ---
echo "▶️ Démarrage du frontend (React)..."
cd frontend || { echo "❌ Dossier frontend introuvable"; kill $BACK_PID; exit 1; }
npm install --silent
npm run dev &
FRONT_PID=$!
cd ..

echo "✅ Les deux serveurs tournent !"
echo "   🌍 Backend : https://fieldz-pro.koyeb.app/"
echo "   🌍 Frontend : http://localhost:5173/"

# Attente pour garder les deux process actifs
trap "kill $BACK_PID $FRONT_PID" EXIT
wait
