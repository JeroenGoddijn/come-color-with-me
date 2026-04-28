import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Coloring Club — Come Color With Me',
  description: "Join the Come Color With Me Coloring Club — exclusive coloring pages, early access, and more. Coming soon!",
}

export default function ClubPage() {
  return (
    <main className="min-h-screen bg-[#FFF6F9] flex flex-col items-center justify-center px-4 py-20 text-center">

      <div className="relative mb-8">
        <div aria-hidden className="absolute inset-0 w-40 h-40 rounded-full bg-[#C4B5FD]/20 blur-2xl -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
        <p className="text-7xl relative">🎨</p>
      </div>

      <h1 className="font-['Bubblegum_Sans'] text-[clamp(2rem,5vw,3rem)] text-[#8B51D6] mb-3">
        Coloring Club
      </h1>

      <div className="inline-flex items-center gap-2 bg-[#DC186D]/10 border border-[#DC186D]/30 text-[#DC186D] font-nunito font-bold text-sm px-4 py-1.5 rounded-full mb-6">
        ✦ Coming Soon
      </div>

      <p className="font-nunito text-[#6B5A94] text-lg max-w-md mx-auto mb-4 leading-relaxed">
        Get exclusive coloring pages every month, early access to new artwork,
        and behind-the-scenes peeks at what Amalia is drawing next.
      </p>

      <p className="font-nunito text-[#6B5A94] text-sm mb-10">
        Sign up for the newsletter to be first to know when the Club launches.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/coloring-pages"
          className="px-8 py-3 rounded-[32px] bg-[#8B51D6] hover:bg-[#7c56b0] text-white font-nunito font-bold text-sm transition-colors shadow-sm"
        >
          Browse Free Coloring Pages
        </Link>
        <Link
          href="/gallery"
          className="px-8 py-3 rounded-[32px] border-2 border-[#C4B5FD] hover:bg-[#C4B5FD]/10 text-[#8B51D6] font-nunito font-bold text-sm transition-colors"
        >
          See All Artwork
        </Link>
      </div>

    </main>
  )
}
