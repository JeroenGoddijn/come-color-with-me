import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ArtworkGrid } from '@/components/artwork/ArtworkGrid'
import { FilterBar } from '@/components/catalog/FilterBar'
import type { ArtworkCard } from '@/types/artwork'

export const metadata: Metadata = {
  title: 'Shop — Come Color With Me',
  description: "Order museum-quality prints of Amalia's original artwork. Printed locally, ships worldwide.",
  alternates: { canonical: '/shop' },
}

type SearchParams = { category?: string; sort?: string; page?: string }

async function fetchShop(params: SearchParams): Promise<{ artworks: ArtworkCard[]; total: number }> {
  const q = new URLSearchParams({ artworkType: 'finished_artwork', limit: '12' })
  if (params.category) q.set('category', params.category)
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

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const { artworks, total } = await fetchShop(searchParams)

  return (
    <main className="min-h-screen bg-[#FFF6F9]">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#9B6FD4]/15 via-[#F472B6]/10 to-[#C4B5FD]/10 border-b border-[#C4B5FD]/25 py-16 px-4 text-center">
        {/* Decorative blobs */}
        <div aria-hidden className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#9B6FD4]/8 blur-3xl" />
        <div aria-hidden className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-[#F472B6]/10 blur-3xl" />

        <p className="text-5xl mb-4 relative">🖼️</p>
        <h1 className="font-fredoka font-bold text-[#3D1F5C] text-4xl md:text-5xl mb-3 relative">
          Premium Art Prints
        </h1>
        <p className="font-nunito text-[#6B5A94] text-lg max-w-xl mx-auto mb-6 relative">
          Original artwork by Amalia, age 8. Museum-quality Gelato prints —
          produced locally and shipped to your door.
        </p>

        {/* Selling points */}
        <div className="flex flex-wrap justify-center gap-4 relative">
          {[
            { icon: '🎨', text: 'Original artwork' },
            { icon: '🖼', text: 'Museum-quality print' },
            { icon: '🌱', text: 'Carbon neutral' },
            { icon: '🚚', text: 'Ships in 3–5 days' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 bg-white/70 border border-[#C4B5FD]/30 rounded-full px-5 py-2 text-sm font-nunito font-semibold text-[#3D1F5C]/80 shadow-sm">
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {total > 0 && (
          <p className="font-nunito text-sm text-[#6B5A94] mb-6 text-center">
            {total} print{total !== 1 ? 's' : ''} available — starting from $19.99
          </p>
        )}

        {/* Filters — category + sort only */}
        <Suspense>
          <FilterBar show={['category', 'sort']} />
        </Suspense>

        <div className="mt-8">
          <ArtworkGrid artworks={artworks} columns={3} />
        </div>

        {/* Guarantee strip */}
        {artworks.length > 0 && (
          <div className="mt-16 bg-white rounded-[20px] border border-[#C4B5FD]/30 shadow-sm p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl mb-2">🔒</p>
              <p className="font-fredoka font-semibold text-[#3D1F5C] mb-1">Secure checkout</p>
              <p className="font-nunito text-sm text-[#6B5A94]">Powered by Stripe</p>
            </div>
            <div>
              <p className="text-3xl mb-2">✨</p>
              <p className="font-fredoka font-semibold text-[#3D1F5C] mb-1">Quality guarantee</p>
              <p className="font-nunito text-sm text-[#6B5A94]">Reprinted free if not perfect</p>
            </div>
            <div>
              <p className="text-3xl mb-2">💌</p>
              <p className="font-fredoka font-semibold text-[#3D1F5C] mb-1">Gift-ready</p>
              <p className="font-nunito text-sm text-[#6B5A94]">Add a gift note at checkout</p>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
