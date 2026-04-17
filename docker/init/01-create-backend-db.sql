-- Creates a separate database for the backend service.
-- Directus uses the 'directus' database (created by POSTGRES_DB env var).
-- The backend API uses 'ccwm_local' for any direct DB operations.

CREATE DATABASE ccwm_local;
GRANT ALL PRIVILEGES ON DATABASE ccwm_local TO directus;
