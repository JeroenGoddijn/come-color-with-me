import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import { artworkPreview, artworkZoom, artworkWall } from '@/lib/assets'
import { Badge } from '@/components/ui/Badge'
import { ArtworkGallery } from '@/components/artwork/ArtworkGallery'
import { ArtworkGrid } from '@/components/artwork/ArtworkGrid'
import { PurchasePanel } from '@/components/artwork/PurchasePanel'
import type { ArtworkDetail, ArtworkCard } from '@/types/artwork'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const artwork = await apiFetch<ArtworkDetail>(`/api/gallery/${params.slug}`, {
      next: { revalidate: 300 },
    })
    return {
      title: artwork.seoTitle || `${artwork.title} | Come Color With Me`,
      description: artwork.seoDescription || artwork.description,
    }
  } catch {
    return { title: 'Artwork | Come Color With Me' }
  }
}

export default async function ArtworkDetailPage({ params }: Props) {
  let artwork: ArtworkDetail
  let related: ArtworkCard[] = []

  try {
    artwork = await apiFetch<ArtworkDetail>(`/api/gallery/${params.slug}`, {
      next: { revalidate: 300 },
    })
  } catch {
    notFound()
  }

  try {
    // Use first category-like tag to find related work in the same theme
    const relatedTag = artwork.tags.find(t => !new Set(['free', 'premium', 'card']).has(t)) ?? ''
    const res = await apiFetch<ArtworkCard[]>(
      `/api/gallery?category=${encodeURIComponent(relatedTag)}&limit=6`,
      { next: { revalidate: 300 } }
    )
    related = res.filter((a) => a.slug !== artwork.slug).slice(0, 4)
  } catch {
    // related artwork is non-critical
  }

  const isPremium = artwork.isPremium && !artwork.isFree
  const isFree    = artwork.isFree

  // Framed room scene only applies to finished artwork (prints for walls).
  // Coloring pages are downloads for coloring — framing them makes no sense.
  // Card products (tagged "card") sell as greeting cards, not framed wall art.
  const isCardProduct  = artwork.tags.includes('card')
  const showFramedTab  = artwork.artworkType === 'finished_artwork' && !isCardProduct

  // Derive a readable category label from tags — first tag that isn't a meta-tag
  const META_TAGS = new Set(['free', 'premium', 'card'])
  const categoryLabel = artwork.tags.find(t => !META_TAGS.has(t)) ?? ''

  // Gallery order: Artwork → Framed (finished artwork only) → Zoom → Coloring photo (future)
  const galleryImages = [
    { src: artworkPreview(artwork.slug), alt: artwork.title,               label: 'Artwork' },
    ...(showFramedTab
      ? [{ src: artworkPreview(artwork.slug), alt: `${artwork.title} — framed`, label: 'Framed', framed: true, thumb: artworkWall(artwork.slug) }]
      : []),
    { src: artworkZoom(artwork.slug),    alt: `${artwork.title} — detail`, label: 'Detail'  },
    // { src: artworkColoring(artwork.slug), alt: `Coloring ${artwork.title}`, label: 'In Use' },
  ]

  return (
    <main className="min-h-screen bg-[#FFF6F9]">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Back link */}
        <Link
          href={isPremium ? '/shop' : '/coloring-pages'}
          className="inline-flex items-center gap-1.5 text-sm font-nunito font-semibold text-[#9B6FD4] hover:text-[#7c56b0] mb-8 transition-colors"
        >
          ← {isPremium ? 'Back to Shop' : 'Back to Coloring Pages'}
        </Link>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">

          {/* LEFT — Gallery */}
          <ArtworkGallery images={galleryImages} title={artwork.title} slug={artwork.slug} />

          {/* RIGHT — Purchase panel */}
          <div className="flex flex-col gap-6">

            {/* Badges + meta */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {artwork.isNew    && <Badge variant="pink">✦ New</Badge>}
                {isFree           && <Badge variant="green">✓ Free</Badge>}
                {isPremium        && <Badge variant="purple">★ Premium</Badge>}
              </div>
              <p className="text-xs font-nunito font-semibold text-[#8B7BA8] uppercase tracking-wider mb-1">
                {categoryLabel}
              </p>
              <h1 className="font-fredoka font-bold text-[#3D1F5C] text-3xl leading-tight mb-1">
                {artwork.title}
              </h1>
              <p className="font-nunito text-[#8B7BA8] text-sm">
                by Amalia, age 8
              </p>
            </div>

            {/* Description */}
            {artwork.description && (
              <p className="font-nunito text-[#3D1F5C]/75 text-base leading-relaxed">
                {artwork.description}
              </p>
            )}

            {/* ── Purchase panel (client component — handles Stripe redirect) ── */}
            <PurchasePanel
              slug={artwork.slug}
              title={artwork.title}
              isFree={isFree}
              isPremium={isPremium}
              downloadUrl={artwork.downloadUrl}
              tags={artwork.tags}
            />

          </div>
        </div>

        {/* ── The Story ──────────────────────────────────────────────────── */}
        {artwork.description && (
          <section className="mt-16 max-w-2xl">
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-2xl mb-3">
              The Story Behind This Piece
            </h2>
            <p className="font-nunito text-[#3D1F5C]/75 text-base leading-relaxed">
              {artwork.description}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl">🎨</span>
              <p className="font-nunito text-sm text-[#8B7BA8] italic">
                "Every drawing tells a story." — Amalia, age 8
              </p>
            </div>
          </section>
        )}

        {/* ── Related artwork ────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-2xl mb-6">
              More by Amalia
            </h2>
            <ArtworkGrid artworks={related} />
          </section>
        )}

      </div>
    </main>
  )
}
