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

// Placements come from the designer handoff package at
// deliverables/design/ccwm_rooms/placements.json. Do not tweak by eye —
// update the JSON, re-export annotated PNGs, then sync this array.
// The bedroom-blue source spec is a perspective quad with ~2% skew; we
// render it as the quad's bounding box (visually indistinguishable at this
// scale, single code path).
const ROOMS: Room[] = [
  { src: '/assets/rooms/room-nursery-crib.jpg',         xPct: 61,   yPct: 24, maxWidthPct: 20, maxHeightPct: 27 },
  { src: '/assets/rooms/room-kids-bedroom-blue.jpg',    xPct: 24.5, yPct: 16, maxWidthPct: 19, maxHeightPct: 29 },
  { src: '/assets/rooms/room-kindergarten-floral.jpg',  xPct: 70,   yPct: 13, maxWidthPct: 18, maxHeightPct: 25 },
  { src: '/assets/rooms/room-classroom-blank-wall.jpg', xPct: 62,   yPct: 37, maxWidthPct: 22, maxHeightPct: 24 },
  { src: '/assets/rooms/room-playroom-tree.jpg',        xPct: 59,   yPct: 12, maxWidthPct: 16, maxHeightPct: 22 },
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
  // Convert maxWidthPct → equivalent height %: fh = fw * (W/H) / ratio = fw * aspect / ratio
  const widthLimitAsHeight = (room.maxWidthPct * CONTAINER_ASPECT) / ratio
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
