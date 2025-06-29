#!/bin/bash

echo "============================"
echo "🚀 Lancement FIELDZ"
echo "============================"

# Backend
echo ""
echo "🔥 Démarrage du backend (Spring Boot)..."
cd fieldz_backend || { echo "❌ Dossier backend introuvable"; exit 1; }
./mvnw spring-boot:run &
BACK_PID=$!

sleep 3

# Frontend
echo ""
echo "💻 Démarrage du frontend (React)..."
cd ../fieldz_frontend || { echo "❌ Dossier frontend introuvable"; kill $BACK_PID; exit 1; }
npm run dev &
FRONT_PID=$!

echo ""
echo "✅ Les deux serveurs tournent !"
echo "🌐 Backend : probablement sur http://localhost:8080"
echo "🌐 Frontend : probablement sur http://localhost:5173"
echo ""
echo "🛑 Pour arrêter : Ctrl + C ou manuellement avec : kill $BACK_PID $FRONT_PID"

# Attend que les deux process soient terminés (si tu veux que ça tienne dans le terminal)
wait
