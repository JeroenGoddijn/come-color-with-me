# Come Color With Me

A playful art and coloring website showcasing original artwork by Amalia, age 8.
Free downloadable coloring pages + premium art prints.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env files and fill in values
cp frontend/.env.local.example frontend/.env.local
cp backend/.env.example backend/.env
cp docker/.env.docker.example docker/.env.docker

# 3. Start all services (Postgres + Directus + Backend + Frontend)
npm run docker:up

# 4. Wait ~60 seconds, then seed the database
npm run seed

# 5. Open the site
open http://localhost:3000
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000/health |
| Directus Admin | http://localhost:8055/admin |

## Documentation

- [INSTALL.md](docs/INSTALL.md) — Full local setup guide
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — System design and data flows
- [ENVIRONMENT.md](docs/ENVIRONMENT.md) — All environment variables
- [DEPLOYMENT.md](docs/DEPLOYMENT.md) — Production deployment runbook
- [CMS_SETUP.md](docs/CMS_SETUP.md) — Directus schema and content management

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 · React · TypeScript · Tailwind CSS |
| Backend | Node.js · Express · TypeScript |
| CMS | Directus (self-hosted) |
| Database | PostgreSQL |
| Auth | Supabase |
| Deployment | Frontend: Vercel · Backend: Render · DB: Managed Postgres |

## Scripts

```bash
npm run dev           # Start frontend + backend with hot reload
npm run build         # Production build
npm run test          # Run all unit tests
npm run lint          # ESLint + TypeScript checks
npm run check-assets  # Verify all required SVG assets exist
npm run seed          # Seed local Directus with initial content
npm run export-schema # Export CMS schema to cms/schema/snapshot.json
npm run docker:up     # Start all Docker services
npm run docker:down   # Stop all Docker services
npm run docker:reset  # Wipe data + restart + reseed (destructive)
```
