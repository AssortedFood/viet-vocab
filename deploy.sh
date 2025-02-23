#!/bin/bash

set -e  # Exit if any command fails

# Define paths
PROJECT_DIR="/home/oxi/projects/viet-vocab"
COMPOSE_DIR="/home/oxi/docker-compose"
IMAGE_NAME="0xidising/viet-vocab"

# Capture start time
START_TIME=$(date +%s)

echo ""
echo "🚀🌍  [DEPLOYMENT STARTED]  🌍🚀"
echo "============================================="
echo ""

# Navigate to project directory
cd "$PROJECT_DIR"

echo "🗑️  Cleaning up old dependencies and cache..."
rm -rf node_modules/ .next/

echo "📦 Installing dependencies... (This may take a moment)"
npm install --prefer-offline --no-audit  # Faster than `npm ci`, allows cache usage

echo "⚙️  Building the project..."
if ! npm run build; then
    echo "❌ Build failed! Exiting..."
    exit 1
fi

echo "🐳 Building and pushing Docker image..."
docker build -t "$IMAGE_NAME" .
docker push "$IMAGE_NAME:latest"

# Navigate to docker-compose directory
cd "$COMPOSE_DIR"

echo "🛑 Stopping existing container..."
docker compose stop vietvocab || echo "⚠️ Service was not running."

echo "⬇️  Pulling the latest image..."
docker compose pull vietvocab

echo "🚀 Restarting the service..."
docker compose up -d vietvocab

# Capture end time
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "🎉🚀  [DEPLOYMENT SUCCESSFUL]  🚀🎉"
echo "============================================="
echo "✅ Service is up and running!"
echo "⏳ Total deployment time: ${DURATION}s"