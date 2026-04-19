'use client'

import { useState } from 'react'
import Image from 'next/image'

type GalleryImage = {
  src: string
  alt: string
  label: string
}

type Props = {
  images: GalleryImage[]
  title: string
}

export function ArtworkGallery({ images, title }: Props) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-[4/3] w-full rounded-[20px] overflow-hidden bg-[#FFF6F9] shadow-[0_4px_24px_rgba(155,111,212,0.14)]">
        <Image
          key={images[active]?.src}
          src={images[active]?.src ?? ''}
          alt={images[active]?.alt ?? title}
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-contain transition-opacity duration-200"
          priority
        />
      </div>

      {/* Thumbnail row */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setActive(i)}
              aria-label={`View ${img.label}`}
              className={`relative flex-1 aspect-square rounded-[12px] overflow-hidden border-2 transition-all duration-150 ${
                i === active
                  ? 'border-[#9B6FD4] shadow-[0_0_0_3px_rgba(155,111,212,0.2)]'
                  : 'border-transparent opacity-60 hover:opacity-90'
              }`}
            >
              <Image
                src={img.src}
                alt={img.label}
                fill
                sizes="120px"
                className="object-cover"
              />
              <span className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[10px] font-nunito font-semibold text-center py-1 leading-tight">
                {img.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
