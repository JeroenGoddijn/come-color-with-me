'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'

interface Props {
  src:   string
  alt:   string
  /** Used for deterministic room selection so each artwork gets a consistent scene. */
  slug?: string
}

type Room = {
  src: string
  /** Frame position on the wall (percent of the rendered container). */
  xPct: number
  yPct: number
}

/**
 * Three real interior photos, each with a specific wall anchor where the
 * framed artwork sits naturally (above couch, centered on empty wall, etc).
 * Photos are cropped to cover the 4:3 container, so anchors were chosen to
 * stay stable inside that crop.
 */
const ROOMS: Room[] = [
  { src: '/assets/rooms/room-modern-living.jpg', xPct: 50, yPct: 12 },
  { src: '/assets/rooms/room-scandi-minimal.jpg', xPct: 50, yPct: 8  },
  { src: '/assets/rooms/room-warm-living.jpg',    xPct: 50, yPct: 18 },
]

function pickRoom(seed: string): Room {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  return ROOMS[Math.abs(hash) % ROOMS.length]!
}

export function FramedRoomScene({ src, alt, slug = '' }: Props) {
  // Default portrait; updated once the image reports its natural dimensions
  const [ratio, setRatio] = useState<number>(4 / 5)

  const room = useMemo(() => pickRoom(slug || src), [slug, src])

  function handleLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth, naturalHeight } = e.currentTarget
    if (naturalWidth > 0 && naturalHeight > 0) {
      setRatio(naturalWidth / naturalHeight)
    }
  }

  const isLandscape = ratio > 1.05
  // Landscape art hangs wider; portrait narrower. Height follows aspectRatio.
  const frameWidth  = isLandscape ? '44%' : '28%'

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      role="img"
      aria-label={`${alt} — framed on a wall`}
    >
      {/* ── Real interior photo (background) ──────────────────────────── */}
      <Image
        src={room.src}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 55vw"
        className="object-cover"
        priority
      />

      {/* ── Framed artwork ─────────────────────────────────────────────── */}
      <div
        className="absolute"
        style={{
          top:       `${room.yPct}%`,
          left:      `${room.xPct}%`,
          transform: 'translateX(-50%)',
          width:     frameWidth,
          aspectRatio: String(ratio),
        }}
      >
        {/* Cast shadow on wall */}
        <div
          className="absolute"
          style={{
            inset: 0,
            boxShadow:
              '6px 14px 38px rgba(0,0,0,0.32), 2px 4px 10px rgba(0,0,0,0.18)',
            borderRadius: '2px',
          }}
        />

        {/* Slim dark-walnut frame */}
        <div
          className="absolute inset-0 p-[3%]"
          style={{
            background:
              'linear-gradient(150deg, #3a2a1e 0%, #251811 45%, #3d2d20 75%, #1c120a 100%)',
            borderRadius: '2px',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.55)',
          }}
        >
          {/* Inner bevel highlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: '2px',
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.10) 0%, transparent 28%, rgba(0,0,0,0.22) 100%)',
            }}
          />

          {/* Artwork — fills frame opening edge-to-edge */}
          <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: '1px' }}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
              onLoad={handleLoad}
              draggable={false}
            />
            {/* Subtle inner recess shadow so print feels set into the frame */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.22)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
