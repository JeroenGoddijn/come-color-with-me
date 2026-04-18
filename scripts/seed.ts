/**
 * seed.ts — Come Color With Me
 *
 * Seeds a fresh Directus instance with all initial content:
 *   - Static assets (SVGs uploaded to Directus Files)
 *   - Artist record (Amalia, age 8)
 *   - 18 Artwork records (10 placeholders + 8 from real scans)
 *   - 5 Product records
 *   - HomepageSettings singleton
 *
 * Usage: npm run seed
 * Requires: Directus healthy + DIRECTUS_URL + DIRECTUS_ADMIN_TOKEN in env
 */

import 'dotenv/config'
import {
  createDirectus, rest, staticToken,
  createItem, updateSingleton, uploadFiles,
} from '@directus/sdk'
import * as fs from 'fs'
import * as path from 'path'

// ─── Client ───────────────────────────────────────────────────────────────────

const DIRECTUS_URL = process.env.DIRECTUS_URL ?? 'http://localhost:8055'
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN ?? ''

if (!DIRECTUS_ADMIN_TOKEN) {
  console.error('❌ DIRECTUS_ADMIN_TOKEN is not set. See docs/CMS_SETUP.md.')
  process.exit(1)
}

const client = createDirectus(DIRECTUS_URL)
  .with(staticToken(DIRECTUS_ADMIN_TOKEN))
  .with(rest())

// ─── Asset upload ─────────────────────────────────────────────────────────────

async function uploadAsset(localPath: string, filename: string): Promise<string> {
  const resolved = path.resolve(localPath)
  if (!fs.existsSync(resolved)) {
    console.warn(`  ⚠️  Asset not found, skipping: ${localPath}`)
    return 'placeholder-asset-id'
  }
  const file = fs.createReadStream(resolved)
  const formData = new FormData()
  formData.append('file', new Blob([fs.readFileSync(resolved)]), filename)
  const result = await client.request(uploadFiles(formData))
  return (result as any).id ?? 'placeholder-asset-id'
}

// ─── Artist ───────────────────────────────────────────────────────────────────

async function seedArtist(avatarId: string): Promise<string> {
  const record = await client.request(createItem('artist', {
    name: 'Amalia',
    age: 8,
    bio_short: "Hi! I'm Amalia and I love drawing animals, magical creatures, and places I imagine in my head.",
    bio_long: "I've been drawing since I was three years old. My favorite thing to draw is animals — especially elephants and unicorns. I draw something new almost every day, and I made these coloring pages especially for you. I hope you love coloring them as much as I loved drawing them!\n\nI use markers, crayons, and sometimes watercolors. My mom helps me scan them so you can print them out. I'm 8 years old and I go to school but I draw all the time at home.\n\nThank you for visiting Come Color With Me. I can't wait to see what you make!",
    featured_quote: "I draw something new almost every day — and I made these coloring pages just for you.",
    avatar_image: avatarId,
  }))
  return (record as any).id
}

// ─── Artwork ──────────────────────────────────────────────────────────────────

const ARTWORKS = [
  // ── Placeholder artworks (10) ────────────────────────────────────────────
  { slug: 'rainbow-elephant', title: 'Rainbow Elephant', description: 'A happy elephant surrounded by colorful patterns and swirls.', category: 'animals', age_group: '6-8', is_free: true, is_premium: false, artwork_type: 'coloring_page', is_featured: true, is_new: false, watermark_enabled: false, sort_order: 1, seo_title: 'Rainbow Elephant Coloring Page — Free Download', seo_description: 'A hand-drawn rainbow elephant coloring page by 8-year-old artist Amalia. Free to download and print at home.' },
  { slug: 'galaxy-unicorn', title: 'Galaxy Unicorn', description: 'A magical unicorn galloping through a starry galaxy.', category: 'fantasy', age_group: '6-8', is_free: false, is_premium: true, artwork_type: 'coloring_page', is_featured: true, is_new: false, watermark_enabled: true, sort_order: 2, seo_title: 'Galaxy Unicorn Premium Art Print', seo_description: 'Premium coloring page and art print by child artist Amalia. Galaxy unicorn design available as a downloadable print.' },
  { slug: 'sleepy-turtle', title: 'Sleepy Turtle', description: 'A cozy turtle napping on a lily pad with little fish swimming below.', category: 'ocean', age_group: '3-5', is_free: true, is_premium: false, artwork_type: 'coloring_page', is_featured: true, is_new: false, watermark_enabled: false, sort_order: 3, seo_title: 'Sleepy Turtle Coloring Page for Kids', seo_description: 'Free turtle coloring page for young kids ages 3–5. Hand-drawn by 8-year-old artist Amalia.' },
  { slug: 'sunflower-field', title: 'Sunflower Field', description: 'Rows of tall sunflowers with bumble bees and butterflies.', category: 'nature', age_group: '6-8', is_free: true, is_premium: false, artwork_type: 'coloring_page', is_featured: false, is_new: true, watermark_enabled: false, sort_order: 4, seo_title: 'Sunflower Field Coloring Page', seo_description: 'Free sunflower coloring page with bumble bees and butterflies. Hand-drawn by Amalia, age 8.' },
  { slug: 'rocket-moon', title: 'Rocket to the Moon', description: 'A colorful rocket zooming past planets and shooting stars.', category: 'space', age_group: '6-8', is_free: false, is_premium: true, artwork_type: 'coloring_page', is_featured: false, is_new: true, watermark_enabled: true, sort_order: 5, seo_title: 'Rocket to the Moon Premium Art Print', seo_description: 'Space-themed premium coloring page by child artist Amalia. Rocket, planets, and stars design.' },
  { slug: 'dancing-dolphins', title: 'Dancing Dolphins', description: 'Two dolphins leaping and dancing over ocean waves.', category: 'ocean', age_group: '3-5', is_free: true, is_premium: false, artwork_type: 'coloring_page', is_featured: false, is_new: true, watermark_enabled: false, sort_order: 6, seo_title: 'Dancing Dolphins Coloring Page', seo_description: 'Free dolphin coloring page for young kids. Two dolphins leaping over waves, hand-drawn by Amalia.' },
  { slug: 'magic-forest', title: 'Magic Forest', description: 'An enchanted forest with glowing mushrooms, fairies, and a little deer.', category: 'fantasy', age_group: '9+', is_free: false, is_premium: true, artwork_type: 'coloring_page', is_featured: false, is_new: true, watermark_enabled: true, sort_order: 7, seo_title: 'Magic Forest Premium Art Print', seo_description: 'Detailed enchanted forest coloring page by child artist Amalia. Premium print.' },
  { slug: 'happy-crab', title: 'Happy Crab', description: 'A big, smiling crab on the beach with seashells and starfish around him.', category: 'ocean', age_group: '3-5', is_free: true, is_premium: false, artwork_type: 'coloring_page', is_featured: false, is_new: false, watermark_enabled: false, sort_order: 8, seo_title: 'Happy Crab Coloring Page', seo_description: 'Simple, fun crab coloring page for toddlers and young kids. Hand-drawn by 8-year-old Amalia.' },
  { slug: 'cloud-castle', title: 'Cloud Castle', description: 'A fairytale castle floating among the clouds with rainbows and hot air balloons.', category: 'fantasy', age_group: '6-8', is_free: true, is_premium: false, artwork_type: 'coloring_page', is_featured: false, is_new: false, watermark_enabled: false, sort_order: 9, seo_title: 'Cloud Castle Coloring Page', seo_description: 'Free fantasy coloring page — a castle in the clouds with rainbows. Hand-drawn by Amalia.' },
  { slug: 'baby-dragon', title: 'Baby Dragon', description: 'An adorable baby dragon hatching from an egg, with little wings and a tiny flame.', category: 'fantasy', age_group: '6-8', is_free: false, is_premium: true, artwork_type: 'coloring_page', is_featured: false, is_new: false, watermark_enabled: true, sort_order: 10, seo_title: 'Baby Dragon Premium Art Print', seo_description: 'Adorable baby dragon coloring page by child artist Amalia. Premium art print available.' },
  // ── Real artwork records (8) ─────────────────────────────────────────────
  { slug: 'animals-cat', title: 'Cat', description: 'A cute chibi-style cat with big eyes, drawn in pen. Clean bold lines make it perfect for coloring.', category: 'animals', age_group: '3-5', is_free: true, is_premium: false, artwork_type: 'coloring_page', is_featured: false, is_new: true, watermark_enabled: false, sort_order: 11, seo_title: 'Cat Coloring Page — Free Printable by Amalia', seo_description: 'Free cat coloring page with cute big eyes, hand-drawn in pen by 8-year-old artist Amalia.' },
  { slug: 'animals-dog', title: 'Dog', description: 'A round, happy dog with a bow tie, sitting next to a ball and a bone. Drawn in pen with clean, bold lines.', category: 'animals', age_group: '3-5', is_free: true, is_premium: false, artwork_type: 'coloring_page', is_featured: false, is_new: true, watermark_enabled: false, sort_order: 12, seo_title: 'Dog Coloring Page — Free Printable by Amalia', seo_description: 'Free dog coloring page — a happy puppy with a bow tie, hand-drawn by 8-year-old artist Amalia.' },
  { slug: 'buildings-house-garden', title: 'House with Garden', description: 'A charming cottage-style house with a steep roof, thatched awnings, sunflowers, and a garden path.', category: 'fantasy', age_group: '6-8', is_free: true, is_premium: false, artwork_type: 'coloring_page', is_featured: false, is_new: true, watermark_enabled: false, sort_order: 13, seo_title: 'House with Garden Coloring Page', seo_description: 'Free coloring page of a charming house with sunflowers and a garden path, hand-drawn by Amalia.' },
  { slug: 'food-ice-cream-faces', title: 'Ice Cream Faces', description: 'A kawaii-style ice cream cone with three scoops, each with its own cute face.', category: 'food', age_group: '6-8', is_free: true, is_premium: false, artwork_type: 'coloring_page', is_featured: false, is_new: true, watermark_enabled: false, sort_order: 14, seo_title: 'Ice Cream Faces Coloring Page', seo_description: 'Kawaii ice cream coloring page with cute faces on each scoop, hand-drawn by Amalia.' },
  { slug: 'food-cupcakes', title: 'Cupcakes', description: 'Three cupcakes — a rainbow-frosted center, a blueberry, and a vanilla — surrounded by a confetti watercolor background.', category: 'food', age_group: '6-8', is_free: false, is_premium: true, artwork_type: 'finished_artwork', is_featured: true, is_new: true, watermark_enabled: true, sort_order: 15, seo_title: 'Cupcakes Art Print — Original Artwork by Amalia', seo_description: 'Original marker and watercolor cupcakes painting by 8-year-old artist Amalia. Available as a premium art print.' },
  { slug: 'fantasy-unicorn-butterflies', title: 'Unicorn with Butterflies', description: 'A beautiful unicorn surrounded by butterflies and wrapped gifts. Full color artwork by Amalia — vibrant and magical.', category: 'fantasy', age_group: '6-8', is_free: false, is_premium: true, artwork_type: 'finished_artwork', is_featured: true, is_new: true, watermark_enabled: true, sort_order: 16, seo_title: 'Unicorn with Butterflies Art Print — Original Artwork by Amalia', seo_description: 'Original colored unicorn artwork by child artist Amalia. Available as a premium art print.' },
  { slug: 'holiday-easter-bunny', title: 'Easter Bunny', description: 'A cute Easter bunny surrounded by five decorated eggs. A perfect spring coloring page for little ones.', category: 'holidays', age_group: '3-5', is_free: true, is_premium: false, artwork_type: 'coloring_page', is_featured: false, is_new: true, watermark_enabled: false, sort_order: 17, seo_title: 'Easter Bunny Coloring Page — Free Printable by Amalia', seo_description: 'Free Easter bunny coloring page with decorated eggs, hand-drawn by child artist Amalia.' },
  { slug: 'holiday-easter-card', title: 'Easter Card', description: 'A hand-made Easter card design with original colored artwork — cheerful and ready to print and give.', category: 'holidays', age_group: '6-8', is_free: true, is_premium: false, artwork_type: 'finished_artwork', is_featured: false, is_new: true, watermark_enabled: false, sort_order: 18, seo_title: 'Easter Card — Original Artwork by Amalia', seo_description: 'Original Easter card artwork by child artist Amalia. Free to download and print.' },
]

// ─── Products ─────────────────────────────────────────────────────────────────

function buildProducts(artworkMap: Record<string, string>) {
  return [
    { artwork_id: artworkMap['galaxy-unicorn'], sku: 'CCWM-001-PRINT', product_name: 'Galaxy Unicorn Art Print', price: 1200, size_options: [{ label: '5×7"', value: '5x7', priceModifier: 0 }, { label: '8×10"', value: '8x10', priceModifier: 300 }, { label: '11×14"', value: '11x14', priceModifier: 600 }], frame_options: [], inventory_state: 'made_to_order' },
    { artwork_id: artworkMap['rocket-moon'], sku: 'CCWM-002-PRINT', product_name: 'Rocket to the Moon Art Print', price: 900, size_options: [{ label: '5×7"', value: '5x7', priceModifier: 0 }, { label: '8×10"', value: '8x10', priceModifier: 300 }], frame_options: [], inventory_state: 'made_to_order' },
    { artwork_id: artworkMap['magic-forest'], sku: 'CCWM-003-PRINT', product_name: 'Magic Forest Art Print', price: 1400, size_options: [{ label: '8×10"', value: '8x10', priceModifier: 0 }, { label: '11×14"', value: '11x14', priceModifier: 400 }, { label: '16×20"', value: '16x20', priceModifier: 900 }], frame_options: [{ label: 'No Frame', value: 'none', priceModifier: 0 }, { label: 'Simple White Frame', value: 'white', priceModifier: 1500 }], inventory_state: 'made_to_order' },
    { artwork_id: artworkMap['food-cupcakes'], sku: 'CCWM-004-PRINT', product_name: 'Cupcakes Art Print', price: 1500, size_options: [{ label: '5×7"', value: '5x7', priceModifier: 0 }, { label: '8×10"', value: '8x10', priceModifier: 400 }, { label: '11×14"', value: '11x14', priceModifier: 900 }], frame_options: [{ label: 'No Frame', value: 'none', priceModifier: 0 }, { label: 'Simple White Frame', value: 'white', priceModifier: 1500 }, { label: 'Premium Walnut Frame', value: 'walnut', priceModifier: 3500 }], inventory_state: 'made_to_order' },
    { artwork_id: artworkMap['fantasy-unicorn-butterflies'], sku: 'CCWM-005-PRINT', product_name: 'Unicorn with Butterflies Art Print', price: 1500, size_options: [{ label: '5×7"', value: '5x7', priceModifier: 0 }, { label: '8×10"', value: '8x10', priceModifier: 400 }, { label: '11×14"', value: '11x14', priceModifier: 900 }], frame_options: [{ label: 'No Frame', value: 'none', priceModifier: 0 }, { label: 'Simple White Frame', value: 'white', priceModifier: 1500 }, { label: 'Premium Walnut Frame', value: 'walnut', priceModifier: 3500 }], inventory_state: 'made_to_order' },
  ]
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Seeding Come Color With Me...\n')

  // 1. Upload static assets
  console.log('📁 Uploading static assets...')
  const avatarId  = await uploadAsset('frontend/public/assets/artist-avatar.svg', 'artist-avatar.svg')
  const heroId    = await uploadAsset('frontend/public/assets/hero-background.svg', 'hero-background.svg')
  const logoId    = await uploadAsset('frontend/public/assets/logo-primary.svg', 'logo-primary.svg')
  console.log('  ✅ Assets uploaded\n')

  // 2. Seed artist
  console.log('👩‍🎨 Seeding artist...')
  const artistId = await seedArtist(avatarId)
  console.log(`  ✅ Artist seeded: ${artistId}\n`)

  // 3. Seed artwork
  console.log('🖼  Seeding artwork...')
  const artworkMap: Record<string, string> = {}
  for (const artwork of ARTWORKS) {
    const record = await client.request(createItem('artwork', {
      ...artwork,
      status: 'published',
      published_at: new Date().toISOString(),
    }))
    artworkMap[artwork.slug] = (record as any).id
    process.stdout.write(`  ✅ ${artwork.title}\n`)
  }
  console.log(`\n  ✅ ${ARTWORKS.length} artwork records seeded\n`)

  // 4. Seed products
  console.log('🛍  Seeding products...')
  const products = buildProducts(artworkMap)
  for (const product of products) {
    if (!product.artwork_id || product.artwork_id === 'undefined') continue
    await client.request(createItem('products', product))
    process.stdout.write(`  ✅ ${product.product_name}\n`)
  }
  console.log(`\n  ✅ Products seeded\n`)

  // 5. Seed homepage settings
  console.log('🏠 Seeding homepage settings...')
  await client.request(updateSingleton('homepage_settings', {
    hero_headline: 'Color the World, One Drawing at a Time!',
    hero_subheadline: 'Free and premium artwork by a real 8-year-old artist. Print, color, and keep forever.',
    primary_cta_label: 'Browse Free Drawings',
    primary_cta_href: '/coloring-pages',
    secondary_cta_label: 'See Premium Prints',
    secondary_cta_href: '/shop',
    featured_artwork_ids: [
      artworkMap['rainbow-elephant'],
      artworkMap['food-cupcakes'],
      artworkMap['fantasy-unicorn-butterflies'],
    ].filter(Boolean),
    just_added_artwork_ids: [
      artworkMap['animals-cat'],
      artworkMap['animals-dog'],
      artworkMap['buildings-house-garden'],
      artworkMap['food-ice-cream-faces'],
      artworkMap['holiday-easter-bunny'],
      artworkMap['holiday-easter-card'],
    ].filter(Boolean),
    active_theme: 'whimsical',
  }))
  console.log('  ✅ Homepage settings seeded\n')

  console.log('🎨 Seed complete! Visit http://localhost:3000\n')
}

seed().catch(err => {
  console.error('\n❌ Seed failed:', err.message)
  process.exit(1)
})
# last schema fix: 2026-04-18T00:35:31Z
