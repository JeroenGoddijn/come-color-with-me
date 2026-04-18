import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import { artworkThumb } from '@/lib/assets'
import { Badge } from '@/components/ui/Badge'
import type { ArtworkDetail } from '@/types/artwork'

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

  try {
    artwork = await apiFetch<ArtworkDetail>(`/api/gallery/${params.slug}`, {
      next: { revalidate: 300 },
    })
  } catch {
    notFound()
  }

  const thumb = artworkThumb(artwork.slug)
  const isColoringPage = artwork.artworkType === 'coloring_page'

  return (
    <main className="min-h-screen bg-[#FFF6F9] py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back link */}
        <Link
          href="/gallery"
          className="inline-flex items-center gap-1.5 text-sm font-nunito font-semibold text-[#9B6FD4] hover:text-[#7c56b0] mb-8 transition-colors"
        >
          ← Back to Gallery
        </Link>

        <div className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(155,111,212,0.14)] overflow-hidden">

          {/* Image */}
          <div className="relative aspect-[4/3] w-full bg-[#FFF6F9]">
            <Image
              src={thumb}
              alt={artwork.title}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-contain"
              priority
            />
          </div>

          {/* Content */}
          <div className="p-6 md:p-10">

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {artwork.isNew && <Badge variant="pink">✦ NEW</Badge>}
              {artwork.isFree && <Badge variant="green">✓ Free Download</Badge>}
              {artwork.isPremium && !artwork.isFree && <Badge variant="purple">★ Premium</Badge>}
              {isColoringPage && <Badge variant="gray">🖍 Coloring Page</Badge>}
            </div>

            <p className="text-xs font-nunito font-semibold text-[#8B7BA8] uppercase tracking-wider mb-2">
              {artwork.category}
            </p>

            <h1 className="font-fredoka font-bold text-[#3D1F5C] text-3xl md:text-4xl mb-4">
              {artwork.title}
            </h1>

            {artwork.description && (
              <p className="font-nunito text-[#3D1F5C]/80 text-base leading-relaxed mb-8 max-w-prose">
                {artwork.description}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              {artwork.isFree && artwork.downloadUrl && (
                <a
                  href={artwork.downloadUrl}
                  download
                  className="inline-flex items-center gap-2 py-3 px-8 rounded-[32px] bg-emerald-500 text-white font-nunito font-bold text-base hover:bg-emerald-600 transition-colors shadow-sm"
                >
                  ⬇ Download Free
                </a>
              )}
              {artwork.isPremium && !artwork.isFree && artwork.shopUrl && (
                <Link
                  href={artwork.shopUrl}
                  className="inline-flex items-center gap-2 py-3 px-8 rounded-[32px] bg-gradient-to-br from-[#9B6FD4] to-[#F472B6] text-white font-nunito font-bold text-base hover:opacity-90 transition-opacity shadow-sm"
                >
                  ★ Order a Print
                </Link>
              )}
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 py-3 px-8 rounded-[32px] border-2 border-[#C4B5FD] text-[#9B6FD4] font-nunito font-bold text-base hover:bg-[#C4B5FD]/10 transition-colors"
              >
                Browse More
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
