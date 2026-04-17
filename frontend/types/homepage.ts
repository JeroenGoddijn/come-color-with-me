import type { Artist } from './artist'
import type { ArtworkCard } from './artwork'

export type HomepageData = {
  heroHeadline: string
  heroSubheadline: string
  heroBackgroundImage: string
  primaryCTA: { label: string; href: string }
  secondaryCTA: { label: string; href: string }
  featuredArtwork: ArtworkCard[]
  justAddedArtwork: ArtworkCard[]
  activeTheme: 'whimsical' | 'playful'
  artist: Artist
}
