/**
 * check-assets.ts — Come Color With Me
 *
 * Verifies all required static assets exist and are non-empty before build.
 * Run in CI before `npm run build` to catch missing assets early.
 *
 * Usage: tsx scripts/check-assets.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const ASSETS_DIR = path.resolve('./frontend/public/assets')

const REQUIRED_ASSETS = [
  'logo-primary.svg',
  'logo-white.svg',
  'hero-background.svg',
  'artist-avatar.svg',
  'watermark.svg',
]

let errors = 0

console.log('🔍 Checking required assets...\n')

if (!fs.existsSync(ASSETS_DIR)) {
  console.error(`❌ Assets directory not found: ${ASSETS_DIR}`)
  console.error('   Create frontend/public/assets/ and add the required SVG files.\n')
  process.exit(1)
}

for (const asset of REQUIRED_ASSETS) {
  const fullPath = path.join(ASSETS_DIR, asset)

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing required asset: /assets/${asset}`)
    errors++
    continue
  }

  const stat = fs.statSync(fullPath)
  if (stat.size === 0) {
    console.error(`❌ Asset is empty (0 bytes): /assets/${asset}`)
    errors++
  } else {
    console.log(`✅ /assets/${asset}  (${(stat.size / 1024).toFixed(1)} KB)`)
  }
}

console.log('')

if (errors > 0) {
  console.error(`🚫 ${errors} asset error(s) found. Resolve before building.\n`)
  process.exit(1)
} else {
  console.log(`✅ All ${REQUIRED_ASSETS.length} required assets present.\n`)
}
