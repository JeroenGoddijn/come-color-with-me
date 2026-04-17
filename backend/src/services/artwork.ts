import { readItems } from '@directus/sdk'
import { getClient, mapArtworkCard } from './directus.js'
import type { ArtworkCard, ArtworkType, AgeGroup } from '../types/artwork.js'
import { parsePagination } from '../utils/pagination.js'

// ---------------------------------------------------------------------------
// Gallery filter types
// ---------------------------------------------------------------------------

export type GalleryFilters = {
  category?: string
  ageGroup?: string
  artworkType?: string
  isFree?: string
  isPremium?: string
  search?: string
  sort?: string
  page?: string
  limit?: string
}

type SortKey = 'newest' | 'oldest' | 'title_asc' | 'title_desc'

const VALID_AGE_GROUPS: AgeGroup[] = ['3-5', '6-8', '9+']
const VALID_ARTWORK_TYPES: ArtworkType[] = ['coloring_page', 'finished_artwork']
const VALID_SORT_KEYS: SortKey[] = ['newest', 'oldest', 'title_asc', 'title_desc']

function sortToDirectus(sort: SortKey): string[] {
  switch (sort) {
    case 'newest':   return ['-published_at']
    case 'oldest':   return ['published_at']
    case 'title_asc':  return ['title']
    case 'title_desc': return ['-title']
  }
}

export class ValidationError extends Error {
  public readonly code = 'VALIDATION_ERROR'
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

// ---------------------------------------------------------------------------
// Gallery service
// ---------------------------------------------------------------------------

export async function getGallery(
  filters: GalleryFilters
): Promise<{ items: ArtworkCard[]; total: number }> {
  const { limit, offset } = parsePagination({
    page: filters.page ?? '',
    limit: filters.limit ?? '',
  })

  // Validate optional enum params
  if (filters.ageGroup && !VALID_AGE_GROUPS.includes(filters.ageGroup as AgeGroup)) {
    throw new ValidationError(`Invalid ageGroup value: "${filters.ageGroup}". Must be one of: ${VALID_AGE_GROUPS.join(', ')}`)
  }
  if (filters.artworkType && !VALID_ARTWORK_TYPES.includes(filters.artworkType as ArtworkType)) {
    throw new ValidationError(`Invalid artworkType value: "${filters.artworkType}". Must be one of: ${VALID_ARTWORK_TYPES.join(', ')}`)
  }

  const sortKey: SortKey = (VALID_SORT_KEYS.includes(filters.sort as SortKey)
    ? filters.sort
    : 'newest') as SortKey

  // Build Directus filter object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {
    status: { _eq: 'published' },
  }

  if (filters.category) {
    filter['category'] = { _eq: filters.category }
  }
  if (filters.ageGroup) {
    filter['age_group'] = { _eq: filters.ageGroup }
  }
  if (filters.artworkType) {
    filter['artwork_type'] = { _eq: filters.artworkType }
  }
  if (filters.isFree === 'true') {
    filter['is_free'] = { _eq: true }
  }
  if (filters.isPremium === 'true') {
    filter['is_premium'] = { _eq: true }
  }
  if (filters.search) {
    filter['title'] = { _icontains: filters.search }
  }

  const client = getClient()

  // Fetch page of items
  const items = await client.request(
    readItems('artwork', {
      filter,
      limit,
      offset,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sort: sortToDirectus(sortKey) as any,
    })
  )

  // Fetch total count with same filter (no pagination)
  const allItems = await client.request(
    readItems('artwork', {
      filter,
      limit: -1,
      fields: ['id'],
    })
  )

  const total = Array.isArray(allItems) ? allItems.length : 0

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { items: (items as any[]).map(mapArtworkCard), total }
}

// ---------------------------------------------------------------------------
// Finished artwork (shop page)
// ---------------------------------------------------------------------------

export async function getFinishedArtwork(
  filters: Pick<GalleryFilters, 'category' | 'sort' | 'page' | 'limit'>
): Promise<{ items: ArtworkCard[]; total: number }> {
  return getGallery({
    ...filters,
    artworkType: 'finished_artwork',
  })
}
