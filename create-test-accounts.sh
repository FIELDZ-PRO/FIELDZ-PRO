#!/bin/bash

echo "🔧 Création des comptes de test..."
echo ""

# Vérifier que le backend est démarré
if ! curl -s http://localhost:8080/api/sports > /dev/null 2>&1; then
    echo "❌ Le backend n'est pas démarré sur http://localhost:8080"
    echo "Démarrez-le avec: cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev"
    exit 1
fi

echo "✅ Backend détecté sur http://localhost:8080"
echo ""

# Créer le compte CLUB
echo "📝 Création du compte CLUB (club@test.com)..."
CLUB_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "club@test.com",
    "motDePasse": "Club123!",
    "nom": "Club Test",
    "nomClub": "Club Test",
    "role": "CLUB"
  }')

if echo "$CLUB_RESPONSE" | grep -q "token\|accessToken"; then
    echo "✅ Compte CLUB créé avec succès"
else
    echo "⚠️  Le compte CLUB existe peut-être déjà ou erreur: $CLUB_RESPONSE"
fi

echo ""

# Créer le compte JOUEUR
echo "📝 Création du compte JOUEUR (joueur@test.com)..."
JOUEUR_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joueur@test.com",
    "motDePasse": "Joueur123!",
    "nom": "Test",
    "prenom": "Joueur",
    "role": "JOUEUR"
  }')

if echo "$JOUEUR_RESPONSE" | grep -q "token\|accessToken"; then
    echo "✅ Compte JOUEUR créé avec succès"
else
    echo "⚠️  Le compte JOUEUR existe peut-être déjà ou erreur: $JOUEUR_RESPONSE"
fi

echo ""
echo "🎉 Comptes de test prêts!"
echo ""
echo "📱 Tu peux maintenant lancer les apps mobiles:"
echo "   cd mobile-club && npm run ios"
echo "   cd mobile && npm run ios"
