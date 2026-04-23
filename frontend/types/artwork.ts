export type ArtworkType = 'coloring_page' | 'finished_artwork'

export type AgeGroup = '3-5' | '6-8' | '9+'

export type ArtworkCard = {
  id: string
  slug: string
  title: string
  artworkType: ArtworkType
  thumbnail: string          // Relative URL: /assets/artwork/[slug]-thumb.jpg
  previewImage: string       // Directus asset URL
  isFree: boolean
  isPremium: boolean
  tags: string[]
  ageGroup: AgeGroup
  isFeatured: boolean
  isNew: boolean
  downloadUrl: string | null // null if isPremium and no download access
  productId: string | null   // null if isFree
  shopUrl: string | null
  watermarkEnabled: boolean
}

export type ArtworkDetail = ArtworkCard & {
  description: string
  publishedAt: string        // ISO 8601
  seoTitle: string
  seoDescription: string
}
