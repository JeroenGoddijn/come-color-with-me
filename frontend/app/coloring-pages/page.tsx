import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ArtworkGrid } from '@/components/artwork/ArtworkGrid'
import { FilterBar } from '@/components/catalog/FilterBar'
import type { ArtworkCard } from '@/types/artwork'

export const metadata: Metadata = {
  title: 'Free Coloring Pages — Come Color With Me',
  description: "Download free printable coloring pages by Amalia, age 8. Print at home, color with crayons or markers. New pages added regularly.",
}

type SearchParams = { category?: string; age?: string; sort?: string; page?: string }

async function fetchColoringPages(params: SearchParams): Promise<{ artworks: ArtworkCard[]; total: number }> {
  const q = new URLSearchParams({ artworkType: 'coloring_page', limit: '12' })
  if (params.category) q.set('category', params.category)
  if (params.age)      q.set('ageGroup', params.age)
  q.set('sort',  params.sort ?? 'newest')
  q.set('page',  params.page ?? '1')

  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
  try {
    const res  = await fetch(`${base}/api/gallery?${q}`, { next: { revalidate: 300 } })
    const json = await res.json()
    return { artworks: json.data ?? [], total: json.meta?.total ?? 0 }
  } catch {
    return { artworks: [], total: 0 }
  }
}

export default async function ColoringPagesPage({ searchParams }: { searchParams: SearchParams }) {
  const { artworks, total } = await fetchColoringPages(searchParams)

  return (
    <main className="min-h-screen bg-[#FFF6F9]">

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 to-[#F472B6]/10 border-b border-emerald-100 py-14 px-4 text-center">
        <p className="text-5xl mb-4">🖍️</p>
        <h1 className="font-fredoka font-bold text-[#3D1F5C] text-4xl md:text-5xl mb-3">
          Free Coloring Pages
        </h1>
        <p className="font-nunito text-[#8B7BA8] text-lg max-w-xl mx-auto mb-6">
          Drawn by Amalia, age 8. Download, print, and color — completely free.
          No account needed.
        </p>

        {/* How it works */}
        <div className="inline-flex flex-wrap justify-center gap-6 bg-white/80 rounded-2xl px-8 py-4 text-sm font-nunito text-[#3D1F5C]/75 shadow-sm border border-emerald-100">
          <span>⬇ Download the File</span>
          <span className="text-[#C4B5FD]">·</span>
          <span>🖨 Print on any paper</span>
          <span className="text-[#C4B5FD]">·</span>
          <span>🖍 Color and enjoy!</span>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Trust bar */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm font-nunito text-[#8B7BA8]">
          <span>📐 300 DPI · print-quality</span>
          <span>📜 Personal use included</span>
          <span>📄 A4 + Letter sizes</span>
          {total > 0 && <span>🎨 {total} pages available</span>}
        </div>

        {/* Filters — category and age only, no type toggle */}
        <Suspense>
          <FilterBar show={['category', 'age', 'sort']} />
        </Suspense>

        <div className="mt-8">
          <ArtworkGrid artworks={artworks} columns={3} />
        </div>

      </div>
    </main>
  )
}
