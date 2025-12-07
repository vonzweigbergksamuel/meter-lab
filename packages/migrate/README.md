# Migration Service

A dedicated Docker service for running database migrations across all services in the meter-lab project.

## Overview

This package provides a centralized migration runner that:
- Runs migrations for backend, auth, and auth-next services
- Validates database connections before running migrations
- Ensures migrations run once before application services start
- Prevents race conditions in horizontally scaled deployments

## Architecture

### Individual Migration Scripts

- `migrate-backend.ts` - Migrates backend database (uses `BACKEND_DATABASE_URL`)
- `migrate-auth-next.ts` - Migrates auth-next database (uses separate credentials)
- `migrate-auth.ts` - Migrates auth database (uses `AUTH_DATABASE_URL`)

Each script:
1. Validates required environment variables
2. Initializes a drizzle database connection
3. Runs migrations from the copied migration files
4. Provides clear success/error logging

### Orchestrator

The main `index.ts` orchestrator:
- Pre-validates all required environment variables
- Runs migrations for all services in sequence
- Handles errors with detailed messaging
- Exits with appropriate status codes

## Usage

### Local Development

```bash
# Run all migrations
docker compose run migrate

# Run individual service migrations (if needed)
docker compose run migrate pnpm migrate:backend
docker compose run migrate pnpm migrate:auth-next
docker compose run migrate pnpm migrate:auth
```

### CI/CD

The migration service is automatically run during deployment:
1. Database containers start first
2. Migration service runs and completes
3. Application services start only after migrations succeed

### Docker Compose Integration

The service is configured with:
- `restart: "no"` - One-shot execution
- `depends_on` - Both database services must be up
- All required database credentials via environment variables

Application services depend on the migrate service with:
```yaml
depends_on:
  migrate:
    condition: service_completed_successfully
```

This ensures migrations complete before apps start.

## Environment Variables

### Backend Database
- `BACKEND_DATABASE_URL` - Full PostgreSQL connection string

### Auth-Next Database
- `AUTH_NEXT_DATABASE_HOST` - Database host (e.g., auth-db)
- `AUTH_NEXT_DATABASE_PORT` - Database port (e.g., 5432)
- `AUTH_NEXT_DATABASE_USER` - Database user
- `AUTH_NEXT_DATABASE_PASSWORD` - Database password
- `AUTH_NEXT_DATABASE_NAME` - Database name

### Auth Database
- `AUTH_DATABASE_URL` - Full PostgreSQL connection string

## Migration Files

Migration files are copied from their respective services during Docker build:
- Backend: `apps/backend/db/migrations`
- Auth: `apps/auth/services/db/migrations`
- Auth-Next: `apps/auth-next/lib/db/migrations`

## Adding New Services

To add migrations for a new service:

1. Create a new migration script in `src/migrate-{service}.ts`
2. Add the migration function to the orchestrator in `src/index.ts`
3. Update the Dockerfile to copy the service's migration files
4. Add required environment variables to compose.yaml and the workflow
5. Update validation in the orchestrator

## Safety Features

- Sequential execution (no parallel race conditions)
- Explicit environment variable validation
- Separate credentials per service (prevents cross-contamination)
- Connection pooling for auth-next (using pg.Pool)
- Simple connection strings for backend and auth services

