import Link from 'next/link'
import { ArtworkGrid } from '@/components/artwork/ArtworkGrid'
import type { ArtworkCard } from '@/types/artwork'

type Props = {
  artworks: ArtworkCard[]
}

export function FeaturedGrid({ artworks }: Props) {
  if (artworks.length === 0) return null

  return (
    <section className="py-16 bg-[#FDF4EC]" aria-labelledby="featured-title">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2
            id="featured-title"
            className="font-fredoka font-bold text-[clamp(1.5rem,3vw,2rem)] text-[#3D1F5C] flex items-center gap-3"
          >
            <span
              aria-hidden="true"
              className="w-9 h-9 bg-gradient-to-br from-[#C4B5FD] to-[#F472B6] rounded-xl flex items-center justify-center text-[1.1rem]"
            >
              ⭐
            </span>
            Featured Drawings
          </h2>
          <Link
            href="/gallery"
            aria-label="View all → drawings in gallery"
            className="font-nunito font-bold text-sm text-[#9B6FD4] hover:text-[#F472B6] flex items-center gap-1 transition-colors"
          >
            View all →
          </Link>
        </div>
        <ArtworkGrid artworks={artworks} columns={3} priorityCount={3} />
      </div>
    </section>
  )
}
