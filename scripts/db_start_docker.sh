#!/usr/bin/env bash
set -euo pipefail

# MMOJournal - Start local Postgres container for schema rebuild testing

CONTAINER_NAME="mmoj-db"
PORT="5433"
PASSWORD="postgres"
DB_NAME="mmojournal"

echo "🐳 Starting local Postgres container for MMOJournal..."

# Check if container already exists (running or stopped)
if docker ps -a --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "ℹ️  Container '${CONTAINER_NAME}' already exists."
  
  # Check if it's running
  if docker ps --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "✅ Container is already running on localhost:${PORT}"
  else
    echo "🔄 Starting existing container..."
    docker start "${CONTAINER_NAME}"
    echo "✅ Container started on localhost:${PORT}"
  fi
  exit 0
fi

# Create and start new container
echo "🚀 Creating new Postgres container..."
docker run -d \
  --name "${CONTAINER_NAME}" \
  -p "${PORT}:5432" \
  -e POSTGRES_PASSWORD="${PASSWORD}" \
  -e POSTGRES_DB="${DB_NAME}" \
  postgres:15

echo "⏳ Waiting for Postgres to be ready..."
sleep 3

# Wait for Postgres to accept connections
for i in {1..30}; do
  if docker exec "${CONTAINER_NAME}" pg_isready -q; then
    echo "✅ Postgres is ready on localhost:${PORT}"
    echo "📋 Connection details:"
    echo "   Host: localhost:${PORT}"
    echo "   Database: ${DB_NAME}"
    echo "   User: postgres"
    echo "   Password: ${PASSWORD}"
    exit 0
  fi
  echo "   Attempt ${i}/30..."
  sleep 1
done

echo "❌ Postgres failed to start within 30 seconds"
exit 1
