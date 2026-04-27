/**
 * add-artwork.ts — Come Color With Me
 *
 * Adds a new artwork to the site in one command:
 *   1. Processes raw scan → all required variants (thumb, preview, zoom, wall ×3, PDF)
 *   2. Saves files to frontend/public/assets/artwork/
 *   3. Creates the Directus CMS record
 *   4. Prints the git commands to publish
 *
 * Usage:
 *   npm run add-artwork -- \
 *     --file ~/Desktop/drawing.jpg \
 *     --slug animals-butterfly \
 *     --title "Butterfly Garden" \
 *     --type coloring_page \
 *     --category animals \
 *     --age 6-8 \
 *     --free --new
 *
 *   # Finished (colored) artwork — premium print:
 *   npm run add-artwork -- \
 *     --file ~/Desktop/fish.jpg \
 *     --slug ocean-fish \
 *     --title "Tropical Fish" \
 *     --type finished_artwork \
 *     --category ocean \
 *     --age 6-8 \
 *     --premium
 *
 * Reads env from frontend/.env.local:
 *   DIRECTUS_URL          e.g. http://localhost:8055
 *   DIRECTUS_ADMIN_TOKEN  Directus static admin token
 */

import * as fs   from 'fs'
import * as path from 'path'
import sharp from 'sharp'
import PDFDocument from 'pdfkit'
import { createDirectus, rest, staticToken, createItem } from '@directus/sdk'

// ─── Load env ─────────────────────────────────────────────────────────────────

const envPath = path.resolve('./frontend/.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (match) process.env[match[1]] ??= match[2].replace(/^["']|["']$/g, '')
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ASSETS_DIR = path.resolve('./frontend/public/assets/artwork')

const CATEGORIES = [
  'animals', 'food', 'fantasy', 'holidays', 'nature',
  'ocean', 'space', 'buildings', 'cards', 'people',
] as const
type Category = typeof CATEGORIES[number]

const AGE_GROUPS  = ['3-5', '6-8', '9+'] as const
type AgeGroup = typeof AGE_GROUPS[number]

type ArtworkType = 'coloring_page' | 'finished_artwork'

// ─── CLI arg parsing ──────────────────────────────────────────────────────────

function parseArgs(argv: string[]): Record<string, string | boolean> {
  const args: Record<string, string | boolean> = {}
  let i = 0
  while (i < argv.length) {
    const token = argv[i]
    if (token.startsWith('--')) {
      const key = token.slice(2)
      const next = argv[i + 1]
      if (!next || next.startsWith('--')) {
        args[key] = true
        i++
      } else {
        args[key] = next
        i += 2
      }
    } else {
      i++
    }
  }
  return args
}

// ─── Validation ───────────────────────────────────────────────────────────────

function printUsage() {
  console.log(`
Usage: npm run add-artwork -- [flags]

Required:
  --file <path>         Raw scan or photo (JPG, PNG, WEBP, HEIC)
  --slug <slug>         Unique URL slug, e.g. animals-butterfly
  --title <title>       Display title, e.g. "Butterfly Garden"
  --type <type>         coloring_page | finished_artwork
  --category <cat>      ${CATEGORIES.join(' | ')}
  --age <group>         3-5 | 6-8 | 9+

Pricing (at least one required):
  --free                Allow free download
  --premium             Mark as premium (watermark + shop CTA)

Optional:
  --description <text>  Artwork description for the detail page
  --new                 Show "NEW" badge on cards
  --featured            Include in Featured section on homepage
  --sort <number>       Sort order (default: 99)
  --no-directus         Skip Directus record — output asset files only
`)
}

function fail(msg: string): never {
  console.error(`\n❌  ${msg}\n`)
  process.exit(1)
}

// ─── Image processing ─────────────────────────────────────────────────────────

async function processColoringPage(inputPath: string) {
  return sharp(inputPath)
    .greyscale()
    .normalise()
    .threshold(230)
    .sharpen()
}

async function processFinishedArtwork(inputPath: string) {
  return sharp(inputPath)
    .normalise()
    .modulate({ saturation: 1.3 })
    .sharpen()
}

async function generateVariants(
  inputPath: string,
  slug: string,
  artworkType: ArtworkType,
): Promise<void> {
  const pipeline = artworkType === 'coloring_page'
    ? await processColoringPage(inputPath)
    : await processFinishedArtwork(inputPath)

  const meta = await sharp(inputPath).metadata()
  const isLandscape = (meta.width ?? 0) > (meta.height ?? 0)

  console.log('  Generating variants...')

  // Thumbnail: 800×600, cover crop
  await pipeline.clone()
    .resize(800, 600, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 88 })
    .toFile(path.join(ASSETS_DIR, `${slug}-thumb.jpg`))
  console.log('    ✅ thumb.jpg (800×600)')

  // Preview: fit within portrait/landscape dimensions, white background
  const [previewW, previewH] = isLandscape ? [1200, 900] : [900, 1125]
  await pipeline.clone()
    .resize(previewW, previewH, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .jpeg({ quality: 88 })
    .toFile(path.join(ASSETS_DIR, `${slug}-preview.jpg`))
  console.log(`    ✅ preview.jpg (${previewW}×${previewH})`)

  // Zoom: 800×800, cover crop (centre detail)
  await pipeline.clone()
    .resize(800, 800, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 90 })
    .toFile(path.join(ASSETS_DIR, `${slug}-zoom.jpg`))
  console.log('    ✅ zoom.jpg (800×800)')

  // Wall ×3: 1200×800, cover crop — placeholder until room mockups are generated
  for (const suffix of ['-wall', '-wall-2', '-wall-3'] as const) {
    await pipeline.clone()
      .resize(1200, 800, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 82 })
      .toFile(path.join(ASSETS_DIR, `${slug}${suffix}.jpg`))
  }
  console.log('    ✅ wall.jpg × 3 (1200×800 — room mockup placeholders)')

  // Download PDF — coloring pages only
  if (artworkType === 'coloring_page') {
    await generatePdf(pipeline, slug)
    console.log('    ✅ download.pdf (A4)')
  }
}

async function generatePdf(pipeline: sharp.Sharp, slug: string): Promise<void> {
  // A4 at 150 DPI: 1240×1754 px — good quality, reasonable file size
  const imgBuf = await pipeline.clone()
    .resize(1240, 1754, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .jpeg({ quality: 92 })
    .toBuffer()

  return new Promise((resolve, reject) => {
    const pdfPath = path.join(ASSETS_DIR, `${slug}-download.pdf`)
    const doc     = new PDFDocument({ size: 'A4', margin: 28, info: { Title: slug } })
    const stream  = fs.createWriteStream(pdfPath)

    doc.pipe(stream)

    // Centre image on A4 page (595 × 842 pt), 28pt margins → 539 × 786 usable
    const usableW = 595 - 56
    const usableH = 842 - 56

    // Image dimensions in points at 72 DPI (1240 px / 150 DPI * 72 pt/in)
    const imgW = (1240 / 150) * 72   // ~595 pt
    const imgH = (1754 / 150) * 72   // ~842 pt
    const scale = Math.min(usableW / imgW, usableH / imgH)
    const drawW = imgW * scale
    const drawH = imgH * scale
    const x = (595 - drawW) / 2
    const y = (842 - drawH) / 2

    doc.image(imgBuf, x, y, { width: drawW, height: drawH })
    doc.end()
    stream.on('finish', resolve)
    stream.on('error', reject)
  })
}

// ─── Directus ─────────────────────────────────────────────────────────────────

async function createDirectusRecord(opts: {
  slug: string
  title: string
  description: string
  artworkType: ArtworkType
  category: Category
  ageGroup: AgeGroup
  isFree: boolean
  isPremium: boolean
  isNew: boolean
  isFeatured: boolean
  sortOrder: number
}): Promise<string> {
  const url   = process.env['DIRECTUS_URL']
  const token = process.env['DIRECTUS_ADMIN_TOKEN']
  if (!url || !token) {
    throw new Error(
      'DIRECTUS_URL and DIRECTUS_ADMIN_TOKEN must be set in frontend/.env.local'
    )
  }

  const client = createDirectus(url).with(staticToken(token)).with(rest())

  const seoTitle = opts.artworkType === 'coloring_page'
    ? `${opts.title} Coloring Page — Free Printable by Amalia`
    : `${opts.title} Art Print — Original Artwork by Amalia`

  const seoDescription = opts.artworkType === 'coloring_page'
    ? `Free ${opts.title.toLowerCase()} coloring page, hand-drawn by 8-year-old artist Amalia. Download, print, and color at home.`
    : `Original ${opts.title.toLowerCase()} artwork by child artist Amalia, age 8. Available as a premium art print.`

  const record = await client.request(createItem('artwork', {
    slug:             opts.slug,
    title:            opts.title,
    description:      opts.description,
    category:         opts.category,
    age_group:        opts.ageGroup,
    artwork_type:     opts.artworkType,
    is_free:          opts.isFree,
    is_premium:       opts.isPremium,
    is_new:           opts.isNew,
    is_featured:      opts.isFeatured,
    watermark_enabled: opts.isPremium && !opts.isFree,
    sort_order:       opts.sortOrder,
    seo_title:        seoTitle,
    seo_description:  seoDescription,
    status:           'published',
    published_at:     new Date().toISOString(),
  }))

  return (record as any).id as string
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args['help'] || args['h']) { printUsage(); process.exit(0) }

  // ── Validate required args ──────────────────────────────────────────────────
  const file        = String(args['file']        ?? '').trim()
  const slug        = String(args['slug']        ?? '').trim()
  const title       = String(args['title']       ?? '').trim()
  const typeArg     = String(args['type']        ?? '').trim()
  const categoryArg = String(args['category']    ?? '').trim()
  const ageArg      = String(args['age']         ?? '').trim()

  if (!file)        { printUsage(); fail('--file is required') }
  if (!slug)        { printUsage(); fail('--slug is required') }
  if (!title)       { printUsage(); fail('--title is required') }
  if (!typeArg)     { printUsage(); fail('--type is required (coloring_page | finished_artwork)') }
  if (!categoryArg) { printUsage(); fail('--category is required') }
  if (!ageArg)      { printUsage(); fail('--age is required (3-5 | 6-8 | 9+)') }

  const artworkType = typeArg as ArtworkType
  if (!['coloring_page', 'finished_artwork'].includes(artworkType))
    fail(`--type must be coloring_page or finished_artwork, got: ${typeArg}`)

  const category = categoryArg as Category
  if (!CATEGORIES.includes(category))
    fail(`--category must be one of: ${CATEGORIES.join(', ')}`)

  const ageGroup = ageArg as AgeGroup
  if (!AGE_GROUPS.includes(ageGroup))
    fail(`--age must be one of: 3-5, 6-8, 9+`)

  const isFree     = Boolean(args['free'])
  const isPremium  = Boolean(args['premium'])
  if (!isFree && !isPremium)
    fail('At least one of --free or --premium is required')

  const isNew      = Boolean(args['new'])
  const isFeatured = Boolean(args['featured'])
  const skipCms    = Boolean(args['no-directus'])
  const sortOrder  = Number(args['sort'] ?? 99)
  const description = String(args['description'] ?? '').trim() ||
    `Original artwork by Amalia, age 8. ${artworkType === 'coloring_page' ? 'A coloring page you can print and color at home.' : 'A finished colored artwork available as a premium print.'}`

  // ── Validate source file ────────────────────────────────────────────────────
  const inputPath = path.resolve(file.replace(/^~/, process.env['HOME'] ?? '~'))
  if (!fs.existsSync(inputPath))
    fail(`Source file not found: ${inputPath}`)

  // ── Check slug is unique ────────────────────────────────────────────────────
  const thumbPath = path.join(ASSETS_DIR, `${slug}-thumb.jpg`)
  if (fs.existsSync(thumbPath)) {
    console.warn(`\n⚠️   Files already exist for slug "${slug}". Overwriting.\n`)
  }

  // ── Validate slug format ────────────────────────────────────────────────────
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))
    fail(`--slug must be lowercase alphanumeric with hyphens only, e.g. animals-butterfly`)

  // ── Go! ─────────────────────────────────────────────────────────────────────

  console.log(`\n🎨  Adding artwork: "${title}" (${slug})\n`)
  console.log(`  Type:     ${artworkType}`)
  console.log(`  Category: ${category}`)
  console.log(`  Age:      ${ageGroup}`)
  console.log(`  Free:     ${isFree}  |  Premium: ${isPremium}`)
  console.log(`  New:      ${isNew}   |  Featured: ${isFeatured}\n`)

  // 1. Process images
  console.log('📸  Processing image...')
  await generateVariants(inputPath, slug, artworkType)

  // 2. Create CMS record
  if (!skipCms) {
    console.log('\n📋  Creating Directus record...')
    try {
      const id = await createDirectusRecord({
        slug, title, description, artworkType, category, ageGroup,
        isFree, isPremium, isNew, isFeatured, sortOrder,
      })
      console.log(`  ✅ Artwork record created (id: ${id})`)
    } catch (err: any) {
      console.error(`  ⚠️  Directus record creation failed: ${err.message}`)
      console.error('     You can create the record manually in the Directus admin UI.')
      console.error(`     URL: ${process.env['DIRECTUS_URL'] ?? 'http://localhost:8055'}/admin\n`)
    }
  } else {
    console.log('\n⏭   Skipping Directus (--no-directus)\n')
    console.log('  Create the artwork record manually in the Directus admin:')
    console.log(`  slug: ${slug}`)
    console.log(`  title: ${title}`)
    console.log(`  type: ${artworkType}`)
    console.log(`  category: ${category}`)
    console.log(`  age_group: ${ageGroup}`)
    console.log(`  is_free: ${isFree}  |  is_premium: ${isPremium}`)
  }

  // 3. Print next steps
  const files = [
    `${slug}-thumb.jpg`,
    `${slug}-preview.jpg`,
    `${slug}-zoom.jpg`,
    `${slug}-wall.jpg`,
    `${slug}-wall-2.jpg`,
    `${slug}-wall-3.jpg`,
    ...(artworkType === 'coloring_page' ? [`${slug}-download.pdf`] : []),
  ]

  console.log('\n✅  Done! New files:\n')
  files.forEach(f => console.log(`  frontend/public/assets/artwork/${f}`))

  console.log('\n📦  Next steps:\n')
  if (artworkType === 'coloring_page') {
    console.log('  1. Review the generated wall-*.jpg files — they are placeholders.')
    console.log('     Run: python3 scripts/generate-room-mockups.py')
    console.log('     to composite the artwork into real room photos.\n')
  }
  console.log('  Commit and push to deploy:')
  console.log()
  const fileArgs = files.map(f => `"frontend/public/assets/artwork/${f}"`).join(' ')
  console.log(`  git add ${fileArgs}`)
  console.log(`  git commit -m "feat(ccwm): add artwork — ${title}"`)
  console.log('  git push origin main')
  console.log()
}

main().catch(err => {
  console.error('\n❌  Unexpected error:', err.message)
  process.exit(1)
})
