#!/bin/bash

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -9 -f "expo|metro" 2>/dev/null
sleep 2

# Clear cache
echo "🗑️  Clearing cache..."
rm -rf node_modules/.cache
rm -rf .expo

# Export environment variable to force localhost
export REACT_NATIVE_PACKAGER_HOSTNAME=localhost

# Start Expo with localhost
echo "🚀 Starting Expo development server on localhost..."
echo ""
echo "📱 Once the server starts, press 'i' to open in iOS simulator"
echo ""

npx expo start --clear --localhost

