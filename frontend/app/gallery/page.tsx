import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ArtworkGrid } from '@/components/artwork/ArtworkGrid'
import { FilterBar } from '@/components/catalog/FilterBar'
import type { ArtworkCard } from '@/types/artwork'

export const metadata: Metadata = {
  title: 'Gallery — Come Color With Me',
  description: "Browse all of Amalia's original drawings, coloring pages and artwork prints.",
}

type SearchParams = {
  type?:     string
  category?: string
  age?:      string
  sort?:     string
  page?:     string
}

type GalleryMeta = { total: number; page: number; limit: number; hasMore: boolean }

async function fetchGallery(params: SearchParams): Promise<{ artworks: ArtworkCard[]; meta: GalleryMeta }> {
  const q = new URLSearchParams()
  if (params.type)     q.set('artworkType', params.type)
  if (params.category) q.set('category',    params.category)
  if (params.age)      q.set('ageGroup',    params.age)
  q.set('sort',  params.sort  ?? 'newest')
  q.set('limit', '12')
  q.set('page',  params.page  ?? '1')

  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
  try {
    const res  = await fetch(`${base}/api/gallery?${q}`, { next: { revalidate: 300 } })
    const json = await res.json()
    return {
      artworks: json.data ?? [],
      meta:     json.meta ?? { total: 0, page: 1, limit: 12, hasMore: false },
    }
  } catch {
    return { artworks: [], meta: { total: 0, page: 1, limit: 12, hasMore: false } }
  }
}

export default async function GalleryPage({ searchParams }: { searchParams: SearchParams }) {
  const { artworks, meta } = await fetchGallery(searchParams)
  const currentPage = Number(searchParams.page ?? 1)

  return (
    <main className="min-h-screen bg-[#FFF6F9]">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#9B6FD4]/10 to-[#F472B6]/10 border-b border-[#C4B5FD]/20 py-14 px-4 text-center">
        <p className="text-5xl mb-4">🎨</p>
        <h1 className="font-fredoka font-bold text-[#3D1F5C] text-4xl md:text-5xl mb-3">
          Amalia&apos;s Gallery
        </h1>
        <p className="font-nunito text-[#8B7BA8] text-lg max-w-xl mx-auto">
          Original drawings and coloring pages by an 8-year-old artist.
          {meta.total > 0 && ` ${meta.total} piece${meta.total !== 1 ? 's' : ''} and counting.`}
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Filters */}
        <Suspense>
          <FilterBar show={['type', 'category', 'age', 'sort']} />
        </Suspense>

        {/* Grid */}
        <div className="mt-8">
          <ArtworkGrid artworks={artworks} columns={3} />
        </div>

        {/* Pagination */}
        {(meta.hasMore || currentPage > 1) && (
          <div className="flex justify-center items-center gap-4 mt-12">
            {currentPage > 1 && (
              <a
                href={buildPageUrl(searchParams, currentPage - 1)}
                className="px-6 py-2.5 rounded-[32px] border-2 border-[#C4B5FD] text-[#9B6FD4] font-nunito font-bold text-sm hover:bg-[#C4B5FD]/10 transition-colors"
              >
                ← Previous
              </a>
            )}
            <span className="font-nunito text-[#8B7BA8] text-sm">
              Page {currentPage}
            </span>
            {meta.hasMore && (
              <a
                href={buildPageUrl(searchParams, currentPage + 1)}
                className="px-6 py-2.5 rounded-[32px] bg-[#9B6FD4] text-white font-nunito font-bold text-sm hover:bg-[#7c56b0] transition-colors"
              >
                Next →
              </a>
            )}
          </div>
        )}

      </div>
    </main>
  )
}

function buildPageUrl(params: SearchParams, page: number): string {
  const q = new URLSearchParams()
  if (params.type)     q.set('type',     params.type)
  if (params.category) q.set('category', params.category)
  if (params.age)      q.set('age',      params.age)
  if (params.sort)     q.set('sort',     params.sort)
  q.set('page', String(page))
  return `/gallery?${q}`
}
