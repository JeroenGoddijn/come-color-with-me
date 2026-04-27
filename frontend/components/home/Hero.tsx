import Link from 'next/link'

export function Hero() {
  return (
    <section
      className="relative overflow-hidden min-h-[560px] flex items-center py-24"
      aria-labelledby="hero-headline"
    >
      {/* Background gradients */}
      <div className="hero-bg-gradient absolute inset-0" aria-hidden="true" />

      {/* Floating blobs */}
      <div aria-hidden="true" className="hero-blob-delay-0 absolute w-20 h-20 bg-[#C4B5FD] rounded-full opacity-50 top-[12%] left-[8%] animate-float" />
      <div aria-hidden="true" className="hero-blob-delay-1 absolute w-12 h-12 bg-[#F472B6] rounded-full opacity-50 top-[20%] right-[12%] animate-float" />
      <div aria-hidden="true" className="hero-blob-delay-2 absolute w-16 h-16 bg-[#FDBA74] rounded-full opacity-50 bottom-[18%] left-[15%] animate-float" />
      <div aria-hidden="true" className="hero-blob-delay-3 absolute w-10 h-10 bg-[#6EE7B7] rounded-full opacity-50 bottom-[25%] right-[8%] animate-float" />
      <div aria-hidden="true" className="hero-blob-delay-4 absolute w-14 h-14 bg-[#93C5FD] rounded-full opacity-50 top-[60%] left-[5%] animate-float" />

      {/* Paint dots */}
      <div aria-hidden="true" className="absolute w-3 h-3 bg-[#F472B6] rounded-full opacity-40 top-[15%] left-[30%]" />
      <div aria-hidden="true" className="absolute w-2 h-2 bg-[#6EE7B7] rounded-full opacity-50 top-[70%] right-[25%]" />
      <div aria-hidden="true" className="absolute w-4 h-4 bg-[#9B6FD4] rounded-full opacity-25 bottom-[20%] left-[45%]" />
      <div aria-hidden="true" className="absolute w-2.5 h-2.5 bg-[#FDBA74] rounded-full opacity-60 top-[40%] right-[18%]" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-[720px] mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#C4B5FD] rounded-full px-[18px] py-[6px] text-[0.8125rem] font-nunito font-bold text-[#9B6FD4] mb-5 shadow-sm">
            <span>🌟</span>
            <span>Art by a real 8-year-old artist</span>
          </div>

          {/* Headline */}
          <h1
            id="hero-headline"
            className="font-['Bubblegum_Sans'] text-[clamp(2.4rem,5vw,3.5rem)] text-[#9B6FD4] leading-[1.1] mb-4"
          >
            Color the World,<br />One Drawing at a Time!
          </h1>

          {/* Sub */}
          <p className="text-[clamp(1rem,1.5vw,1.125rem)] text-[#8B7BA8] max-w-[520px] mx-auto mb-6 leading-[1.65]">
            Free and premium artwork drawn by Amalia — an 8-year-old artist
            sharing her colorful world with kids everywhere.
          </p>

          {/* CTAs */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/coloring-pages"
              className="inline-flex items-center gap-2 px-7 py-[14px] bg-[#F472B6] hover:bg-[#EC4899] text-white font-nunito font-bold text-base rounded-full shadow-[0_4px_16px_rgba(155,111,212,0.12)] hover:shadow-[0_8px_32px_rgba(155,111,212,0.18)] hover:-translate-y-0.5 transition-all duration-200"
            >
              🖍 Browse Free Drawings
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-[14px] bg-[#9B6FD4] hover:bg-[#8B5CF6] text-white font-nunito font-bold text-base rounded-full shadow-[0_4px_16px_rgba(155,111,212,0.12)] hover:shadow-[0_8px_32px_rgba(155,111,212,0.18)] hover:-translate-y-0.5 transition-all duration-200"
            >
              ✨ See Premium Prints
            </Link>
          </div>

          {/* Trust signals */}
          <ul className="list-none p-0 m-0 flex items-center justify-center gap-5 mt-6 text-[0.8125rem] text-[#8B7BA8] font-nunito font-semibold flex-wrap">
            <li>✅ Free downloads, no signup</li>
            <li>🔒 Safe for kids</li>
            <li>🎨 100% hand-drawn</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
