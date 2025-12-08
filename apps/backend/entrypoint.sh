#!/bin/sh
set -e

cd /app/apps/backend

if [ "$BACKEND_RUN_MIGRATIONS" = "true" ]; then
  echo "Running migrations..."
  node dist/scripts/migrate.js
fi

exec node dist/app/server.js