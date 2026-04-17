import Link from 'next/link'
import Image from 'next/image'
import { ASSETS } from '@/lib/assets'
import type { Artist } from '@/types/artist'

type Props = {
  artist: Artist
}

export function ArtistIntro({ artist }: Props) {
  return (
    <section
      className="py-16 bg-[#FFF6F9]"
      aria-labelledby="artist-heading"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(155,111,212,0.12)] p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-[#C4B5FD] shadow-[0_4px_16px_rgba(155,111,212,0.2)]">
              <Image
                src={artist.avatarImage || ASSETS.artistAvatar}
                alt={`${artist.name} avatar`}
                width={112}
                height={112}
                className="object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-[#F472B6] text-white text-xs font-nunito font-bold px-2 py-0.5 rounded-full shadow-sm">
              Age {artist.age}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 id="artist-heading" className="font-fredoka font-bold text-[1.5rem] text-[#3D1F5C] mb-3">
              Hi! I&apos;m <span className="text-[#9B6FD4]">{artist.name}</span> 👋
            </h2>
            <p className="text-[#8B7BA8] font-nunito text-base leading-relaxed mb-4 max-w-[520px]">
              {artist.bioShort}
            </p>
            <Link
              href="/about"
              aria-label={`Learn more about ${artist.name}`}
              className="inline-flex items-center gap-1 font-nunito font-bold text-[#9B6FD4] hover:text-[#F472B6] text-sm transition-colors"
            >
              Learn more about me →
            </Link>

            {/* Stats — illustrative placeholders, wired to CMS in Sprint 2 */}
            <div role="list" className="flex gap-8 mt-6 justify-center sm:justify-start">
              <div role="listitem" className="text-center">
                <p className="font-fredoka font-bold text-[1.25rem] text-[#9B6FD4]">47+</p>
                <p className="text-[0.75rem] text-[#8B7BA8] mt-0.5">Drawings</p>
              </div>
              <div role="listitem" className="text-center">
                <p className="font-fredoka font-bold text-[1.25rem] text-[#9B6FD4]">2.4k</p>
                <p className="text-[0.75rem] text-[#8B7BA8] mt-0.5">Downloads</p>
              </div>
              <div role="listitem" className="text-center">
                <p className="font-fredoka font-bold text-[1.25rem] text-[#9B6FD4]">12</p>
                <p className="text-[0.75rem] text-[#8B7BA8] mt-0.5">Categories</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
