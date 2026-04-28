import Link from 'next/link'
import { ArtworkGrid } from '@/components/artwork/ArtworkGrid'
import type { ArtworkCard } from '@/types/artwork'

type Props = {
  artworks: ArtworkCard[]
}

export function JustAddedGrid({ artworks }: Props) {
  if (artworks.length === 0) return null

  return (
    <section className="py-16" aria-labelledby="just-added-title">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2
            id="just-added-title"
            className="font-fredoka font-bold text-[clamp(1.5rem,3vw,2rem)] text-[#3D1F5C] flex items-center gap-3"
          >
            <span
              aria-hidden="true"
              className="w-9 h-9 bg-gradient-to-br from-[#C4B5FD] to-[#F472B6] rounded-xl flex items-center justify-center text-[1.1rem]"
            >
              ✦
            </span>
            Just Added
          </h2>
          <Link
            href="/coloring-pages"
            aria-label="See all new → coloring pages"
            className="font-nunito font-bold text-sm text-[#9B6FD4] hover:text-[#F472B6] flex items-center gap-1 transition-colors"
          >
            See all new →
          </Link>
        </div>
        <ArtworkGrid artworks={artworks} columns={4} priorityCount={0} />
      </div>
    </section>
  )
}
