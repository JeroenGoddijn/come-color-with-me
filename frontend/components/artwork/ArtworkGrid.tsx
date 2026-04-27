import { ArtworkCard } from './ArtworkCard'
import type { ArtworkCard as ArtworkCardType } from '@/types/artwork'

type Props = {
  artworks: ArtworkCardType[]
  columns?: 2 | 3 | 4
  priorityCount?: number
}

const colClass: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
}

export function ArtworkGrid({ artworks, columns = 3, priorityCount = 3 }: Props) {
  if (artworks.length === 0) {
    return (
      <div className="py-16 text-center text-[#8B7BA8] font-nunito">
        <p className="text-4xl mb-3">🎨</p>
        <p className="font-semibold">No artwork found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <ul className={`list-none p-0 m-0 grid ${colClass[columns]} gap-6`}>
      {artworks.map((artwork, i) => (
        <ArtworkCard
          key={artwork.id}
          artwork={artwork}
          priority={i < priorityCount}
        />
      ))}
    </ul>
  )
}
