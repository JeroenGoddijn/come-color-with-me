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
   * (clockwise). Coordinates are percent of the 4:3 container. The CCWM
   * artwork is projected into this quad via a homography (matrix3d) — the
   * photo's frame supplies all lighting, shadow, perspective, and styling.
   * No synthetic frame is rendered.
   */
  quad: [Pt, Pt, Pt, Pt]
  /**
   * CSS object-position for the background Image. Required when the source
   * photo must be cropped to 4:3 at a non-default anchor (e.g. 'left center'
   * or 'center top'). Coordinates in this file were triangulated against the
   * same crop — see scripts/debug-frame-overlay.sh.
   */
  objectPosition?: string
}

// Pixel-perfect corners measured via scripts/debug-frame-overlay.sh against
// the production 4:3 1600×1200 crops in /public/assets/rooms/.
// To update: re-run the overlay script on the source file and iterate visually.
const ROOMS: Room[] = [
  // Portrait frame: white wall with vine trellis — black thin-profile frame.
  // Source: Pexels #587441 (2000×1333) → resize to 1800×1200, left-crop to 1600.
  // objectPosition 'left center' reproduces that crop in the browser.
  // Inner art area measured by pixel brightness scan: x=314–713, y=481–1040 (1600×1200).
  // Pixel aspect ≈ 0.71 (portrait). Fits portrait artworks; rejects landscape.
  {
    src: '/assets/rooms/room-poster-vines.jpg',
    objectPosition: '0% 50%',
    quad: [
      { xPct: 20.4, yPct: 40.9 },
      { xPct: 44.1, yPct: 40.9 },
      { xPct: 44.1, yPct: 86.1 },
      { xPct: 20.4, yPct: 86.1 },
    ],
  },
  // Landscape canvas: light blue wall — frameless stretched canvas.
  // Source: Pexels #8012234 (2000×3000) → resize to 1600×2400, top-crop to 1200.
  // objectPosition 'center top' reproduces that crop in the browser.
  // Canvas surface measured by pixel brightness scan: x=791–1527, y=304–827 (1600×1200).
  // Pixel aspect ≈ 1.41 (landscape). Fits landscape artworks; rejects portrait.
  {
    src: '/assets/rooms/room-canvas-blue.jpg',
    objectPosition: '50% 0%',
    quad: [
      { xPct: 49.4, yPct: 25.3 },
      { xPct: 95.4, yPct: 25.3 },
      { xPct: 95.4, yPct: 68.9 },
      { xPct: 49.4, yPct: 68.9 },
    ],
  },
]

// Container is 4:3 — % units along each axis represent different pixel
// distances. Convert quad % aspect → pixel aspect for compatibility checks.
const CONTAINER_ASPECT = 4 / 3

function quadPixelAspect(quad: [Pt, Pt, Pt, Pt]): number {
  const avgWPct = ((quad[1].xPct - quad[0].xPct) + (quad[2].xPct - quad[3].xPct)) / 2
  const avgHPct = ((quad[3].yPct - quad[0].yPct) + (quad[2].yPct - quad[1].yPct)) / 2
  return (avgWPct * CONTAINER_ASPECT) / avgHPct
}

function aspectFit(a: number, b: number): number {
  return Math.min(a, b) / Math.max(a, b)
}

// Filter to rooms compatible with the artwork's orientation (±35% aspect),
// then deterministically pick by slug hash. Falls back to all rooms if no
// compatible match — visible distortion is preferable to a missing scene.
function pickRoom(seed: string, artworkAspect: number): Room {
  const FIT_THRESHOLD = 0.65
  const compat = ROOMS.filter((r) => aspectFit(quadPixelAspect(r.quad), artworkAspect) >= FIT_THRESHOLD)
  const pool = compat.length > 0 ? compat : ROOMS
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return pool[Math.abs(h) % pool.length]!
}

// ─── Inscribe rectangle preserving aspect ────────────────────────────────
function lerp(a: number[], b: number[], t: number): number[] {
  return [a[0]! + (b[0]! - a[0]!) * t, a[1]! + (b[1]! - a[1]!) * t]
}

function bilerp(quad: number[][], u: number, v: number): number[] {
  return lerp(lerp(quad[0]!, quad[1]!, u), lerp(quad[3]!, quad[2]!, u), v)
}

/**
 * Inscribe an artwork-aspect rectangle inside the destination quad,
 * centred on both axes. Letterboxes when the artwork is wider than the
 * quad; pillarboxes when narrower. Returned quad is in container pixels.
 */
function inscribeQuad(quad: [Pt, Pt, Pt, Pt], artworkAspect: number, w: number, h: number): number[][] {
  const px = quad.map((p) => [(p.xPct / 100) * w, (p.yPct / 100) * h])
  const avgW = ((px[1]![0]! - px[0]![0]!) + (px[2]![0]! - px[3]![0]!)) / 2
  const avgH = ((px[3]![1]! - px[0]![1]!) + (px[2]![1]! - px[1]![1]!)) / 2
  const qa = avgW / avgH
  let u0 = 0, u1 = 1, v0 = 0, v1 = 1
  if (artworkAspect > qa) {
    const s = qa / artworkAspect
    v0 = (1 - s) / 2
    v1 = 1 - v0
  } else if (artworkAspect < qa) {
    const s = artworkAspect / qa
    u0 = (1 - s) / 2
    u1 = 1 - u0
  }
  return [
    bilerp(px, u0, v0),
    bilerp(px, u1, v0),
    bilerp(px, u1, v1),
    bilerp(px, u0, v1),
  ]
}

// ─── Homography helpers ─────────────────────────────────────────────────
function adj(m: number[]) {
  return [
    m[4]! * m[8]! - m[5]! * m[7]!, m[2]! * m[7]! - m[1]! * m[8]!, m[1]! * m[5]! - m[2]! * m[4]!,
    m[5]! * m[6]! - m[3]! * m[8]!, m[0]! * m[8]! - m[2]! * m[6]!, m[2]! * m[3]! - m[0]! * m[5]!,
    m[3]! * m[7]! - m[4]! * m[6]!, m[1]! * m[6]! - m[0]! * m[7]!, m[0]! * m[4]! - m[1]! * m[3]!,
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
 * CSS matrix3d projecting a (srcW × srcH) rectangle anchored at (0,0)
 * onto the destination quad (TL, TR, BR, BL) given in container pixels.
 */
function quadMatrix3d(srcW: number, srcH: number, dst: number[][]): string {
  const src = [[0, 0], [srcW, 0], [0, srcH], [srcW, srcH]]
  // basisToPoints anchors on its 4th point — reorder dst to (TL, TR, BL, BR)
  // so anchors match the src ordering.
  const dstMatched = [dst[0]!, dst[1]!, dst[3]!, dst[2]!]
  const s = basisToPoints(src)
  const d = basisToPoints(dstMatched)
  const t = multmm(d, adj(s))
  for (let i = 0; i < 9; i++) t[i] = t[i]! / t[8]!
  // Column-major 4×4. Z-axis untouched, perspective in the bottom row.
  return `matrix3d(${t[0]},${t[3]},0,${t[6]},${t[1]},${t[4]},0,${t[7]},0,0,1,0,${t[2]},${t[5]},0,${t[8]})`
}

export function FramedRoomScene({ src, alt, slug = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  // Default 0.8 — the catalog majority is 4:5 portrait. Updated on image load.
  const [aspect, setAspect] = useState(0.8)

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

  function handleLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth, naturalHeight } = e.currentTarget
    if (naturalWidth > 0 && naturalHeight > 0) {
      setAspect(naturalWidth / naturalHeight)
    }
  }

  const room = useMemo(() => pickRoom(slug || src, aspect), [slug, src, aspect])

  // Source rectangle matches artwork aspect so inscribed-quad projection is
  // distortion-free (src and dst quads have the same shape).
  const SRC_H = 1000
  const SRC_W = SRC_H * aspect

  const transform = useMemo(() => {
    if (size.w === 0) return undefined
    const dst = inscribeQuad(room.quad, aspect, size.w, size.h)
    return quadMatrix3d(SRC_W, SRC_H, dst)
  }, [room, size, aspect, SRC_W])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none"
      role="img"
      aria-label={`${alt} — framed on a wall`}
    >
      <Image
        src={room.src}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 55vw"
        className="object-cover"
        style={room.objectPosition ? { objectPosition: room.objectPosition } : undefined}
        priority
      />
      {transform && (
        <div
          className="absolute pointer-events-none top-0 left-0 [transform-origin:0_0]"
          style={{ width: SRC_W, height: SRC_H, transform }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain"
            onLoad={handleLoad}
            draggable={false}
          />
        </div>
      )}
    </div>
  )
}
