'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

interface Props {
  src:   string
  alt:   string
  /** Used for deterministic room selection so each artwork gets a consistent scene. */
  slug?: string
}

type Pt = { xPct: number; yPct: number }

type Room = {
  src: string
  /**
   * Inner visible-art corners of an existing frame (or display surface)
   * already present in the source photo, ordered TL → TR → BR → BL
   * (clockwise from top-left). Coordinates are percent of the 4:3 container.
   * The CCWM artwork is projected into this quad via a homography (matrix3d)
   * — no synthetic frame is rendered. The photo's frame IS the frame.
   */
  quad: [Pt, Pt, Pt, Pt]
}

// Triangulated against the production 4:3 crops in /public/assets/rooms/.
// Update placements only after re-measuring against the actual JPG file.
const ROOMS: Room[] = [
  // Nursery — left cream picture frame (palm tree painting visible-art opening).
  {
    src: '/assets/rooms/room-nursery-crib.jpg',
    quad: [
      { xPct: 70.9, yPct: 22.1 },
      { xPct: 75.9, yPct: 22.1 },
      { xPct: 75.9, yPct: 30.4 },
      { xPct: 70.9, yPct: 30.4 },
    ],
  },
  // Nursery — right cream picture frame (bridge painting visible-art opening).
  {
    src: '/assets/rooms/room-nursery-crib.jpg',
    quad: [
      { xPct: 85.6, yPct: 21.7 },
      { xPct: 91.3, yPct: 21.7 },
      { xPct: 91.3, yPct: 30.0 },
      { xPct: 85.6, yPct: 30.0 },
    ],
  },
  // Classroom — green chalkboard easel surface, slight back-lean perspective.
  {
    src: '/assets/rooms/room-classroom-blank-wall.jpg',
    quad: [
      { xPct: 51.9, yPct: 51.7 },
      { xPct: 68.4, yPct: 51.7 },
      { xPct: 69.4, yPct: 78.8 },
      { xPct: 50.9, yPct: 78.8 },
    ],
  },
]

// ─── Homography helpers ─────────────────────────────────────────────────
// Standard projective-transform math: given 4 source points and 4 destination
// points, derive the 3×3 matrix that maps src → dst, then expand to a CSS
// matrix3d string.

function adj(m: number[]) {
  return [
    m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3],
  ]
}

function multmm(a: number[], b: number[]) {
  const r = new Array<number>(9)
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let s = 0
      for (let k = 0; k < 3; k++) s += a[3 * i + k]! * b[3 * k + j]!
      r[3 * i + j] = s
    }
  }
  return r
}

function multmv(m: number[], v: number[]) {
  return [
    m[0]! * v[0]! + m[1]! * v[1]! + m[2]! * v[2]!,
    m[3]! * v[0]! + m[4]! * v[1]! + m[5]! * v[2]!,
    m[6]! * v[0]! + m[7]! * v[1]! + m[8]! * v[2]!,
  ]
}

function basisToPoints(p: number[][]) {
  const m = [
    p[0]![0]!, p[1]![0]!, p[2]![0]!,
    p[0]![1]!, p[1]![1]!, p[2]![1]!,
    1,         1,         1,
  ]
  const v = multmv(adj(m), [p[3]![0]!, p[3]![1]!, 1])
  return multmm(m, [
    v[0]!, 0,     0,
    0,     v[1]!, 0,
    0,     0,     v[2]!,
  ])
}

/**
 * CSS matrix3d that projects a (srcW × srcH) rectangle anchored at (0,0)
 * onto the destination quad (TL, TR, BR, BL) given in container pixels.
 */
function quadMatrix3d(srcW: number, srcH: number, dst: number[][]): string {
  const src = [[0, 0], [srcW, 0], [0, srcH], [srcW, srcH]]
  // basisToPoints anchors on its 4th point; reorder dst to match src order
  // (TL, TR, BL, BR) so anchors line up.
  const dstMatched = [dst[0]!, dst[1]!, dst[3]!, dst[2]!]
  const s = basisToPoints(src)
  const d = basisToPoints(dstMatched)
  const t = multmm(d, adj(s))
  for (let i = 0; i < 9; i++) t[i] = t[i]! / t[8]!
  // matrix3d is column-major. Embed the 3×3 homography into the 4×4 transform
  // (z-axis untouched, perspective in the bottom row).
  return `matrix3d(${t[0]},${t[3]},0,${t[6]},${t[1]},${t[4]},0,${t[7]},0,0,1,0,${t[2]},${t[5]},0,${t[8]})`
}

function pickRoom(seed: string): Room {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  return ROOMS[Math.abs(hash) % ROOMS.length]!
}

export function FramedRoomScene({ src, alt, slug = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const r = entry!.contentRect
      setSize({ w: r.width, h: r.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const room = useMemo(() => pickRoom(slug || src), [slug, src])

  // Stable arbitrary basis — only the destination quad's pixel coords drive
  // the final projection, so SRC_W/H value doesn't affect output, only matrix
  // numerical conditioning.
  const SRC_W = 1000
  const SRC_H = 1000

  const transform = useMemo(() => {
    if (size.w === 0) return undefined
    const dst = room.quad.map((p) => [(p.xPct / 100) * size.w, (p.yPct / 100) * size.h])
    return quadMatrix3d(SRC_W, SRC_H, dst)
  }, [room, size])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none"
      role="img"
      aria-label={`${alt} — framed on a wall`}
    >
      {/* Real interior photo (background) — its existing frames carry all
          the lighting, perspective, shadow, and frame styling. */}
      <Image
        src={room.src}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 55vw"
        className="object-cover"
        priority
      />

      {/* Artwork projected into the photo's existing frame opening. */}
      {transform && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0,
            left: 0,
            width: SRC_W,
            height: SRC_H,
            transformOrigin: '0 0',
            transform,
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
            draggable={false}
          />
        </div>
      )}
    </div>
  )
}
