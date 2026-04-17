import {
  createDirectus,
  rest,
  staticToken,
  readItems,
  readSingleton,
} from '@directus/sdk'
import type { ArtworkCard, AgeGroup, ArtworkType } from '../types/artwork.js'
import type { Artist } from '../types/artist.js'

// ---------------------------------------------------------------------------
// Directus collection shape (snake_case from CMS)
// ---------------------------------------------------------------------------

type DirectusArtwork = {
  id: string
  slug: string
  title: string
  description: string | null
  thumbnail_image: string | null
  preview_image: string | null
  download_file: string | null
  category: string
  age_group: AgeGroup
  is_featured: boolean
  is_new: boolean
  is_free: boolean
  is_premium: boolean
  artwork_type: ArtworkType
  watermark_enabled: boolean
  sort_order: number | null
  published_at: string | null
  seo_title: string | null
  seo_description: string | null
  status: string
}

type DirectusArtist = {
  id: string
  name: string
  age: number
  bio_short: string
  bio_long: string
  avatar_image: string | null
  featured_quote: string
}

type DirectusHomepageSettings = {
  id: string
  hero_headline: string
  hero_subheadline: string
  hero_background_image: string | null
  primary_cta_label: string
  primary_cta_href: string
  secondary_cta_label: string
  secondary_cta_href: string
  featured_artwork_ids: string[]
  just_added_artwork_ids: string[]
  active_theme: 'whimsical' | 'playful'
}

// ---------------------------------------------------------------------------
// Directus SDK schema type
// ---------------------------------------------------------------------------

type DirectusSchema = {
  artwork: DirectusArtwork[]
  artist: DirectusArtist
  homepage_settings: DirectusHomepageSettings
}

// ---------------------------------------------------------------------------
// Singleton client
// ---------------------------------------------------------------------------

function createClient() {
  const url = process.env['DIRECTUS_URL']
  const token = process.env['DIRECTUS_ADMIN_TOKEN']

  if (!url || !token) {
    throw new Error('DIRECTUS_URL and DIRECTUS_ADMIN_TOKEN must be set before initialising the Directus client')
  }

  return createDirectus<DirectusSchema>(url)
    .with(staticToken(token))
    .with(rest())
}

// Lazily initialised so validateEnv() runs before any import side-effects
let _client: ReturnType<typeof createClient> | null = null

function getClient() {
  if (!_client) {
    _client = createClient()
  }
  return _client
}

export { getClient }

export const directusClient = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

// ---------------------------------------------------------------------------
// Field mappers
// ---------------------------------------------------------------------------

function buildDirectusAssetUrl(fileId: string | null | undefined): string {
  if (!fileId) return ''
  const base = process.env['DIRECTUS_URL'] ?? 'http://localhost:8055'
  return `${base}/assets/${fileId}`
}

export function mapArtworkCard(raw: DirectusArtwork): ArtworkCard {
  const directusUrl = process.env['DIRECTUS_URL'] ?? 'http://localhost:8055'
  const thumbnailId = raw.thumbnail_image
  const previewId = raw.preview_image

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    artworkType: raw.artwork_type,
    thumbnail: thumbnailId
      ? `/assets/artwork/${raw.slug}-thumb.jpg`
      : '',
    previewImage: previewId
      ? `${directusUrl}/assets/${previewId}`
      : '',
    isFree: raw.is_free,
    isPremium: raw.is_premium,
    category: raw.category,
    ageGroup: raw.age_group,
    isFeatured: raw.is_featured,
    isNew: raw.is_new,
    downloadUrl: raw.is_free ? `/api/art/${raw.slug}/download` : null,
    productId: null, // resolved by product join in Sprint 2
    shopUrl: raw.is_premium ? `/product/${raw.slug}` : null,
    watermarkEnabled: raw.watermark_enabled,
  }
}

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export async function getArtist(): Promise<Artist> {
  const client = getClient()
  const raw = await client.request(
    readSingleton('artist', {
      fields: ['id', 'name', 'age', 'bio_short', 'bio_long', 'avatar_image', 'featured_quote'],
    })
  )

  return {
    id: raw.id,
    name: raw.name,
    age: raw.age,
    bioShort: raw.bio_short,
    bioLong: raw.bio_long,
    avatarImage: buildDirectusAssetUrl(raw.avatar_image),
    featuredQuote: raw.featured_quote,
  }
}

export async function getFeaturedArtwork(): Promise<ArtworkCard[]> {
  const client = getClient()
  const items = await client.request(
    readItems('artwork', {
      filter: {
        status: { _eq: 'published' },
        is_featured: { _eq: true },
      },
      limit: 6,
      sort: ['sort_order'],
    })
  )

  return (items as DirectusArtwork[]).map(mapArtworkCard)
}

export async function getJustAddedArtwork(): Promise<ArtworkCard[]> {
  const client = getClient()
  const items = await client.request(
    readItems('artwork', {
      filter: {
        status: { _eq: 'published' },
        is_new: { _eq: true },
      },
      limit: 8,
      sort: ['-published_at'],
    })
  )

  return (items as DirectusArtwork[]).map(mapArtworkCard)
}

export async function getHomepageSettings(): Promise<DirectusHomepageSettings> {
  const client = getClient()
  const raw = await client.request(
    readSingleton('homepage_settings', {
      fields: [
        'id',
        'hero_headline',
        'hero_subheadline',
        'hero_background_image',
        'primary_cta_label',
        'primary_cta_href',
        'secondary_cta_label',
        'secondary_cta_href',
        'featured_artwork_ids',
        'just_added_artwork_ids',
        'active_theme',
      ],
    })
  )

  return raw as DirectusHomepageSettings
}
