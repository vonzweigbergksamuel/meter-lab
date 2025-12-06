#!/bin/sh
set -e

cd /app/apps/auth

if [ "$AUTH_RUN_MIGRATIONS" = "true" ]; then
  echo "Running migrations..."
  node dist/scripts/migrate.js
fi

if [ "$AUTH_SEED_ADMIN" = "true" ]; then
  echo "Seeding admin user..."
  node dist/scripts/seed-admin.js
fi

exec node dist/app/server.js
