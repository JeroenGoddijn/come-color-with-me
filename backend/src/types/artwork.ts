export type ArtworkType = 'coloring_page' | 'finished_artwork'

export type AgeGroup = '3-5' | '6-8' | '9+'

export type ArtworkCard = {
  id: string
  slug: string
  title: string
  artworkType: ArtworkType
  thumbnail: string
  previewImage: string
  isFree: boolean
  isPremium: boolean
  tags: string[]
  ageGroup: AgeGroup
  isFeatured: boolean
  isNew: boolean
  downloadUrl: string | null
  productId: string | null
  shopUrl: string | null
  watermarkEnabled: boolean
}

export type ArtworkDetail = ArtworkCard & {
  description: string
  publishedAt: string
  seoTitle: string
  seoDescription: string
}
