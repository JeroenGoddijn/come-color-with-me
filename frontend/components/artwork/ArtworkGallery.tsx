'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FramedRoomScene } from './FramedRoomScene'

export type GalleryImage = {
  src:     string
  alt:     string
  label:   string
  /** When true, renders a dynamic CSS room scene instead of the static image */
  framed?: boolean
}

type Props = {
  images: GalleryImage[]
  title:  string
  /** Slug is used so each artwork gets a deterministic room scene. */
  slug?:  string
}

export function ArtworkGallery({ images, title, slug }: Props) {
  const [active, setActive] = useState(0)
  const current = images[active]

  return (
    <div className="flex flex-col gap-4">
      {/* Main viewer */}
      <div className="relative aspect-[4/3] w-full rounded-[20px] overflow-hidden bg-[#FFF6F9] shadow-[0_4px_24px_rgba(155,111,212,0.14)]">
        {current?.framed ? (
          <FramedRoomScene src={current.src} alt={current.alt ?? title} slug={slug} />
        ) : (
          <Image
            key={current?.src}
            src={current?.src ?? ''}
            alt={current?.alt ?? title}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-contain transition-opacity duration-200"
            priority
          />
        )}
      </div>

      {/* Thumbnail row */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View ${img.label}`}
              className={`relative flex-1 aspect-square rounded-[12px] overflow-hidden border-2 transition-all duration-150 ${
                i === active
                  ? 'border-[#9B6FD4] shadow-[0_0_0_3px_rgba(155,111,212,0.2)]'
                  : 'border-transparent opacity-60 hover:opacity-90'
              }`}
            >
              {img.framed ? (
                /* Thumbnail for the framed tab — mini room preview */
                <div className="absolute inset-0">
                  <FramedRoomScene src={img.src} alt={img.label} slug={slug} />
                </div>
              ) : (
                <Image
                  src={img.src}
                  alt={img.label}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              )}
              <span className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[10px] font-nunito font-semibold text-center py-1 leading-tight z-10">
                {img.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
