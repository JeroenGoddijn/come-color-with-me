import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ASSETS } from '@/lib/assets'

export const metadata: Metadata = {
  title: 'About Amalia — Come Color With Me',
  description:
    "Meet Amalia, the 8-year-old artist behind Come Color With Me. Original drawings, free coloring pages, and premium art prints — all made by a real kid who loves to create.",
}

const FAVOURITES = [
  { emoji: '🐱', label: 'Cats' },
  { emoji: '🦄', label: 'Unicorns' },
  { emoji: '🐶', label: 'Dogs' },
  { emoji: '🧁', label: 'Cupcakes' },
  { emoji: '🐰', label: 'Bunnies' },
  { emoji: '🌸', label: 'Flowers' },
  { emoji: '🏠', label: 'Houses' },
  { emoji: '🍦', label: 'Ice Cream' },
]

const FUN_FACTS = [
  { icon: '🎨', heading: 'Draws every day', body: 'Rain or shine, Amalia finds time to draw — on paper, in notebooks, on napkins.' },
  { icon: '✏️', heading: 'Started with pencils', body: 'Her first drawings were pencil sketches of cats. Now she uses markers, crayons, and watercolours too.' },
  { icon: '💜', heading: 'Purple is her colour', body: 'Ask Amalia her favourite colour and she will tell you in under a second: purple. Every time.' },
  { icon: '🖊️', heading: 'Signs as "amalia"', body: 'Amalia signs her artwork in her own style. The lowercase "amalia" is her artist\'s signature.' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FFF6F9]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#9B6FD4]/12 via-[#F472B6]/8 to-[#C4B5FD]/10 border-b border-[#C4B5FD]/25 py-20 px-4 text-center">
        <div aria-hidden className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#C4B5FD]/15 blur-3xl" />
        <div aria-hidden className="absolute -bottom-12 -right-12 w-60 h-60 rounded-full bg-[#F472B6]/12 blur-3xl" />

        {/* Avatar */}
        <div className="relative mx-auto mb-6 w-36 h-36 rounded-full bg-[#FFF0FA] border-4 border-[#C4B5FD] shadow-lg flex items-center justify-center overflow-hidden">
          <Image
            src={ASSETS.artistAvatar}
            alt="Amalia — illustrated artist portrait"
            width={144}
            height={144}
            className="w-full h-full object-contain"
            priority
          />
        </div>

        <h1 className="font-['Bubblegum_Sans'] text-[clamp(2.25rem,5vw,3.25rem)] text-[#3D1F5C] mb-2 relative">
          Hi, I&apos;m Amalia!
        </h1>
        <p className="font-nunito text-[#8B7BA8] text-lg mb-6 relative">
          Artist · Age 8 · Lover of all things colourful
        </p>

        {/* Favourite chips */}
        <div className="flex flex-wrap justify-center gap-3 relative">
          {FAVOURITES.map(({ emoji, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 bg-white/80 border border-[#C4B5FD]/40 rounded-full px-4 py-1.5 text-sm font-nunito font-semibold text-[#3D1F5C]/80 shadow-sm"
            >
              {emoji} {label}
            </span>
          ))}
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-14 space-y-10">

        {/* ── Amalia's story — in her own words ── */}
        <section className="bg-white rounded-[20px] p-8 md:p-10 shadow-sm border border-[#C4B5FD]/20">
          <p className="font-['Bubblegum_Sans'] text-[#9B6FD4] text-2xl mb-5">In my own words…</p>
          <div className="font-nunito text-[#3D1F5C] text-[1.0625rem] leading-relaxed space-y-4">
            <p>
              I love drawing. I draw cats, dogs, unicorns, houses, cupcakes — basically
              anything I can think of! I draw almost every single day, even if it&apos;s
              just a quick sketch before dinner.
            </p>
            <p>
              I started making coloring pages because I wanted other kids to be able to
              color my drawings too. It makes me really happy when I imagine someone
              printing my page and adding all their own colors to it.
            </p>
            <p>
              My favourite thing to draw right now is unicorns with butterflies.
              I also really love drawing animals — especially cats. They&apos;re the best. 🐱
            </p>
            <p className="text-[#9B6FD4] font-semibold">
              I hope you enjoy coloring my drawings as much as I enjoy making them! 💜
            </p>
          </div>
        </section>

        {/* ── Fun facts grid ── */}
        <section>
          <h2 className="font-fredoka font-bold text-[#3D1F5C] text-2xl mb-6 text-center">
            A few things about Amalia
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FUN_FACTS.map(({ icon, heading, body }) => (
              <div
                key={heading}
                className="bg-white rounded-[20px] p-6 shadow-sm border border-[#C4B5FD]/20 flex gap-4"
              >
                <span className="text-3xl flex-shrink-0 leading-none mt-0.5" aria-hidden="true">{icon}</span>
                <div>
                  <p className="font-fredoka font-semibold text-[#3D1F5C] text-lg mb-1">{heading}</p>
                  <p className="font-nunito text-[#8B7BA8] text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Parent's note ── */}
        <section className="bg-gradient-to-br from-[#9B6FD4]/8 to-[#F472B6]/8 rounded-[20px] p-8 md:p-10 border border-[#C4B5FD]/25">
          <p className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-4">A note from her dad</p>
          <div className="font-nunito text-[#3D1F5C]/85 text-[1rem] leading-relaxed space-y-3">
            <p>
              Amalia has been drawing since she could hold a pencil. What started as
              quick sketches in the margins of notebooks turned into a folder stuffed
              with original drawings — animals, creatures, whole imaginary worlds.
            </p>
            <p>
              This website is our way of sharing her art with the world. Every coloring
              page here is scanned directly from her sketchbook. Every premium print is
              her original artwork, reproduced at museum quality.
            </p>
            <p>
              When she found out kids all over the world might color her drawings, she
              immediately sat down and drew six more pages. That pretty much tells you
              everything you need to know about Amalia.
            </p>
          </div>
        </section>

        {/* ── CTAs ── */}
        <section className="text-center space-y-4">
          <h2 className="font-fredoka font-bold text-[#3D1F5C] text-2xl">
            Ready to start coloring?
          </h2>
          <p className="font-nunito text-[#8B7BA8]">
            All of Amalia&apos;s coloring pages are free to download and print. No account needed.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/coloring-pages"
              className="px-8 py-3 rounded-[32px] bg-[#9B6FD4] hover:bg-[#7c56b0] text-white font-nunito font-bold text-sm transition-colors shadow-sm"
            >
              Browse Coloring Pages
            </Link>
            <Link
              href="/gallery"
              className="px-8 py-3 rounded-[32px] border-2 border-[#C4B5FD] hover:bg-[#C4B5FD]/10 text-[#9B6FD4] font-nunito font-bold text-sm transition-colors"
            >
              See All Artwork
            </Link>
          </div>
        </section>

      </div>
    </main>
  )
}
