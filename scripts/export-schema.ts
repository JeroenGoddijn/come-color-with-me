/**
 * export-schema.ts — Come Color With Me
 *
 * Exports the current Directus schema snapshot to cms/schema/snapshot.json.
 * Commit the output file to track schema changes in version control.
 *
 * Usage: npm run export-schema
 * Requires: Directus running + DIRECTUS_URL + DIRECTUS_ADMIN_TOKEN in env
 */

import 'dotenv/config'
import { createDirectus, rest, staticToken, schemaSnapshot } from '@directus/sdk'
import * as fs from 'fs'
import * as path from 'path'

const DIRECTUS_URL = process.env.DIRECTUS_URL ?? 'http://localhost:8055'
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN ?? ''

if (!DIRECTUS_ADMIN_TOKEN) {
  console.error('❌ DIRECTUS_ADMIN_TOKEN is not set.')
  console.error('   Set it in backend/.env or export it before running this script.')
  process.exit(1)
}

const client = createDirectus(DIRECTUS_URL)
  .with(staticToken(DIRECTUS_ADMIN_TOKEN))
  .with(rest())

async function exportSchema() {
  console.log(`📦 Exporting Directus schema from ${DIRECTUS_URL}...\n`)

  const snapshot = await client.request(schemaSnapshot())

  const outputPath = path.resolve('./cms/schema/snapshot.json')
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(snapshot, null, 2))

  console.log(`✅ Schema written to cms/schema/snapshot.json`)
  console.log('   Commit this file to track schema changes in version control.\n')
}

exportSchema().catch(err => {
  console.error('❌ Schema export failed:', err.message)
  process.exit(1)
})
