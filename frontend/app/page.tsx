import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { ArtistIntro } from '@/components/home/ArtistIntro'
import { FeaturedGrid } from '@/components/home/FeaturedGrid'
import { JustAddedGrid } from '@/components/home/JustAddedGrid'
import { apiFetch } from '@/lib/api'
import type { Artist } from '@/types/artist'
import type { ArtworkCard } from '@/types/artwork'

export const metadata: Metadata = {
  title: 'Come Color With Me — Free Coloring Pages by Amalia',
  description:
    'Discover free coloring pages and premium prints by Amalia, age 8. Download and color original hand-drawn artwork created with love.',
}

// Revalidate every 5 minutes
export const revalidate = 300

async function getHomepageData(): Promise<{
  artist: Artist
  featured: ArtworkCard[]
  justAdded: ArtworkCard[]
}> {
  const [artist, featured, justAdded] = await Promise.allSettled([
    apiFetch<Artist>('/api/artist'),
    apiFetch<ArtworkCard[]>('/api/homepage/featured'),
    apiFetch<ArtworkCard[]>('/api/homepage/just-added'),
  ])

  return {
    artist:
      artist.status === 'fulfilled'
        ? artist.value
        : {
            id: '',
            name: 'Amalia',
            age: 8,
            bioShort:
              'I love drawing animals, magical creatures, and places I imagine in my head. I draw something new almost every day — and I made these coloring pages especially for you!',
            bioLong: '',
            avatarImage: '',
            featuredQuote: '',
          },
    featured: featured.status === 'fulfilled' ? featured.value : [],
    justAdded: justAdded.status === 'fulfilled' ? justAdded.value : [],
  }
}

export default async function HomePage() {
  const { artist, featured, justAdded } = await getHomepageData()

  return (
    <>
      <Hero />
      <ArtistIntro artist={artist} />
      <FeaturedGrid artworks={featured} />
      <JustAddedGrid artworks={justAdded} />
    </>
  )
}
