#!/usr/bin/env bash
set -euo pipefail

# MMOJournal - Stop and remove local Postgres container

CONTAINER_NAME="mmoj-db"

echo "🐳 Stopping local Postgres container..."

# Check if container exists
if ! docker ps -a --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "ℹ️  Container '${CONTAINER_NAME}' does not exist."
  exit 0
fi

# Stop if running
if docker ps --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "🛑 Stopping container..."
  docker stop "${CONTAINER_NAME}"
fi

# Remove container
echo "🗑️  Removing container..."
docker rm "${CONTAINER_NAME}"

echo "✅ Container '${CONTAINER_NAME}' stopped and removed"
