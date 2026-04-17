# CMS — Come Color With Me

This directory contains the Directus CMS schema and extensions.

- **`schema/snapshot.json`** — Directus schema snapshot (source of truth). Apply with `npx directus schema apply ./cms/schema/snapshot.json`. Export after schema changes with `npm run export-schema`.
- **`extensions/`** — Custom Directus hooks/endpoints (none in Sprint 1).

For full CMS setup instructions see [`docs/CMS_SETUP.md`](../docs/CMS_SETUP.md).
