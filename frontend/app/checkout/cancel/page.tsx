import Link from 'next/link'

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-[#FFF6F9] flex flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-5xl mb-6" aria-hidden="true">💜</p>
      <h1 className="font-fredoka font-bold text-[#3D1F5C] text-3xl mb-3">
        No worries!
      </h1>
      <p className="font-nunito text-[#6B5A94] max-w-sm mb-8 leading-relaxed">
        Your checkout was cancelled and nothing was charged.
        You can go back and pick it up whenever you&apos;re ready.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/coloring-pages"
          className="px-8 py-3 rounded-[32px] bg-[#9B6FD4] hover:bg-[#7c56b0] text-white font-nunito font-bold text-sm transition-colors shadow-sm"
        >
          Browse Coloring Pages
        </Link>
        <Link
          href="/shop"
          className="px-8 py-3 rounded-[32px] border-2 border-[#C4B5FD] hover:bg-[#C4B5FD]/10 text-[#9B6FD4] font-nunito font-bold text-sm transition-colors"
        >
          Shop Prints
        </Link>
      </div>
    </main>
  )
}
