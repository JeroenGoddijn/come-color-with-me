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
  /** Horizontal CENTER of the frame (percent of container width). */
  xPct: number
  /** Vertical TOP of the frame (percent of container height). */
  yPct: number
  /**
   * The empty-wall bounding box the frame must fit inside. Frame scales to the
   * largest size that fits given the artwork's natural aspect ratio, so
   * landscape art fills width and portrait art fills height — both bounded
   * above the furniture in each photo.
   */
  maxWidthPct:  number
  maxHeightPct: number
}

const ROOMS: Room[] = [
  // White playroom. Rocking horse + book shelf at bottom (y≈62%). Large clear white wall left.
  { src: '/assets/rooms/room-kids-playroom.jpg', xPct: 22, yPct: 5, maxWidthPct: 36, maxHeightPct: 52 },
  // Pink kids bedroom. Bunny plushies on bed, desk right. Clear taupe wall centre-left above headboard.
  { src: '/assets/rooms/room-kids-bedroom.jpg', xPct: 43, yPct: 6, maxWidthPct: 22, maxHeightPct: 38 },
  // Nordic nursery. Teepee centre, paper lanterns. Clear white wall left of teepee.
  { src: '/assets/rooms/room-kids-nursery.jpg', xPct: 34, yPct: 4, maxWidthPct: 18, maxHeightPct: 34 },
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

  // Fit the frame to the wall's bounding box. The 4:3 gallery viewport means
  // 1% of width ≠ 1% of height, so we convert the width limit into height
  // units before taking the min. The container aspect is 4:3 (width/height = 1.333).
  const CONTAINER_ASPECT = 4 / 3
  // maxWidthPct (of width) → equivalent height percent on the 4:3 container
  const widthLimitAsHeight = (room.maxWidthPct / ratio) / CONTAINER_ASPECT
  const frameHeightPct = Math.min(room.maxHeightPct, widthLimitAsHeight)

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
          height:    `${frameHeightPct}%`,
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
