#!/bin/bash
# ============================================================
# FIELDZ - Script de generation des cles JWT (RS256)
# ============================================================
# Usage : ./generate-jwt-keys.sh
# ============================================================

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Repertoire de destination
KEYS_DIR="src/main/resources/keys"

echo -e "${YELLOW}============================================${NC}"
echo -e "${YELLOW}   FIELDZ - Generation des cles JWT RS256   ${NC}"
echo -e "${YELLOW}============================================${NC}"
echo ""

# Verifier si OpenSSL est installe
if ! command -v openssl &> /dev/null; then
    echo -e "${RED}Erreur : OpenSSL n'est pas installe.${NC}"
    echo "Installez OpenSSL et reessayez."
    exit 1
fi

# Creer le repertoire si necessaire
if [ ! -d "$KEYS_DIR" ]; then
    echo -e "${YELLOW}Creation du repertoire $KEYS_DIR...${NC}"
    mkdir -p "$KEYS_DIR"
fi

# Verifier si des cles existent deja
if [ -f "$KEYS_DIR/private.pem" ] || [ -f "$KEYS_DIR/public.pem" ]; then
    echo -e "${YELLOW}Attention : Des cles existent deja dans $KEYS_DIR${NC}"
    read -p "Voulez-vous les remplacer ? (o/N) : " confirm
    if [[ ! "$confirm" =~ ^[oOyY]$ ]]; then
        echo "Operation annulee."
        exit 0
    fi
    echo ""
fi

echo -e "${GREEN}Generation de la cle privee RSA (2048 bits)...${NC}"

# Generer la cle privee au format PKCS#1 (traditionnnel)
openssl genrsa -out "$KEYS_DIR/private_pkcs1.pem" 2048 2>/dev/null

# Convertir en format PKCS#8 (requis par Java)
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt \
    -in "$KEYS_DIR/private_pkcs1.pem" \
    -out "$KEYS_DIR/private.pem"

echo -e "${GREEN}Generation de la cle publique...${NC}"

# Extraire la cle publique
openssl rsa -in "$KEYS_DIR/private.pem" -pubout -out "$KEYS_DIR/public.pem" 2>/dev/null

# Supprimer la cle PKCS#1 intermediaire (optionnel, garder pour compatibilite)
# rm "$KEYS_DIR/private_pkcs1.pem"

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   Cles generees avec succes !              ${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Fichiers crees :"
echo "  - $KEYS_DIR/private.pem (cle privee PKCS#8)"
echo "  - $KEYS_DIR/public.pem (cle publique)"
echo "  - $KEYS_DIR/private_pkcs1.pem (cle privee PKCS#1)"
echo ""

# Afficher les informations de la cle
echo -e "${YELLOW}Informations de la cle :${NC}"
openssl rsa -in "$KEYS_DIR/private.pem" -text -noout 2>/dev/null | head -1
echo ""

# Securite
echo -e "${RED}IMPORTANT - Securite :${NC}"
echo "  1. Ne JAMAIS commiter les fichiers .pem dans Git"
echo "  2. Ajouter 'keys/*.pem' dans .gitignore"
echo "  3. En production, utiliser des variables d'environnement"
echo "     ou des secrets managers (Vault, AWS Secrets, etc.)"
echo ""

# Verifier le .gitignore
GITIGNORE="../.gitignore"
if [ -f "$GITIGNORE" ]; then
    if ! grep -q "keys/\*.pem" "$GITIGNORE" && ! grep -q "\*.pem" "$GITIGNORE"; then
        echo -e "${YELLOW}Ajout de 'keys/*.pem' au .gitignore...${NC}"
        echo "" >> "$GITIGNORE"
        echo "# JWT Keys" >> "$GITIGNORE"
        echo "keys/*.pem" >> "$GITIGNORE"
        echo -e "${GREEN}Fait !${NC}"
    fi
fi

echo ""
echo -e "${GREEN}Configuration terminee. Vous pouvez maintenant demarrer l'application.${NC}"
