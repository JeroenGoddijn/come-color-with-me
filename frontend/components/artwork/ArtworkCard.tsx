import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { WatermarkOverlay } from './WatermarkOverlay'
import { artworkThumb } from '@/lib/assets'
import { cn } from '@/utils/cn'
import type { ArtworkCard as ArtworkCardType } from '@/types/artwork'

type Props = {
  artwork: ArtworkCardType
  priority?: boolean
}

export function ArtworkCard({ artwork, priority = false }: Props) {
  const {
    slug,
    title,
    tags,
    artworkType,
    isFree,
    isPremium,
    isNew,
    watermarkEnabled,
    downloadUrl,
  } = artwork

  const META_TAGS = new Set(['free', 'premium', 'card'])
  const categoryLabel = tags.find(t => !META_TAGS.has(t)) ?? ''

  const thumb = artworkThumb(slug)

  return (
    <li
      className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(155,111,212,0.12)] hover:shadow-[0_12px_40px_rgba(155,111,212,0.24)] transition-shadow duration-200 flex flex-col"
    >
      {/* Thumbnail */}
      <Link href={`/artwork/${slug}`} className="block relative aspect-[4/3] bg-[#FFF6F9] overflow-hidden">
        <Image
          src={thumb}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover hover:scale-105 transition-transform duration-300"
          priority={priority}
        />
        <WatermarkOverlay enabled={watermarkEnabled && isPremium} />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20">
          {isNew && <Badge variant="pink">✦ NEW</Badge>}
          {isFree && <Badge variant="green">✓ Free</Badge>}
          {isPremium && !isFree && <Badge variant="purple">★ Premium</Badge>}
        </div>

        {/* Hover overlay icon */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#9B6FD4]/0 hover:bg-[#9B6FD4]/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-200 z-20"
        >
          <span className="text-4xl">{artworkType === 'coloring_page' ? '🖍' : '✨'}</span>
        </div>
      </Link>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-nunito font-semibold text-[#6B5A94] uppercase tracking-wider mb-1">{categoryLabel}</p>
        <h3 className="font-fredoka font-semibold text-[#3D1F5C] text-base mb-3 truncate">{title}</h3>
        <div className={cn('mt-auto flex gap-2', !isFree && !isPremium && 'hidden')}>
          {isFree && downloadUrl && (
            <a
              href={downloadUrl}
              download
              aria-label={`⬇ Download Free — ${title} coloring page`}
              className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-emerald-50 text-emerald-700 font-nunito font-bold text-[0.8125rem] hover:bg-emerald-100 transition-colors"
            >
              ⬇ Download Free
            </a>
          )}
          {isPremium && !isFree && (
            <Link
              href={artwork.shopUrl ?? `/artwork/${slug}`}
              aria-label={`★ Order Print — ${title}`}
              className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-gradient-to-br from-[#9B6FD4] to-[#F472B6] text-white font-nunito font-bold text-[0.8125rem] hover:opacity-90 transition-opacity"
            >
              ★ Order Print
            </Link>
          )}
        </div>
      </div>
    </li>
  )
}
