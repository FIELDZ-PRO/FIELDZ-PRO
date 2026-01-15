#!/bin/bash

# Kill any processes on port 8082
lsof -ti:8082 | xargs kill -9 2>/dev/null || true

# Start Expo on port 8082
echo "🚀 Démarrage de Expo sur le port 8082..."
npx expo start --clear --port 8082
