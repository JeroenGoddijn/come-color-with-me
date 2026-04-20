'use client'

import Image from 'next/image'

/**
 * Renders a photorealistic-style nursery/playroom scene with the artwork
 * composited into a proper fine-art frame + mat board.
 *
 * The print fills the mat opening edge-to-edge (object-cover), matching
 * what a full-bleed Gelato Fine Art Poster looks like in a frame.
 */

interface Props {
  src: string
  alt: string
}

// ── SVG room decorations ──────────────────────────────────────────────────────

// Bunting triangles across the top — brand colors
function Bunting() {
  const colors = ['#F472B6', '#C4B5FD', '#9B6FD4', '#F472B6', '#C4B5FD', '#9B6FD4', '#F472B6', '#C4B5FD', '#9B6FD4', '#F472B6', '#C4B5FD']
  return (
    <svg
      viewBox="0 0 1000 80"
      preserveAspectRatio="none"
      className="absolute top-0 left-0 right-0 w-full"
      style={{ height: '10%', zIndex: 2 }}
      aria-hidden="true"
    >
      {/* String */}
      <path d="M0 20 Q250 35 500 20 Q750 5 1000 20" stroke="#c4b5fd" strokeWidth="2" fill="none" />
      {/* Triangles */}
      {colors.map((color, i) => {
        const x = (i / (colors.length - 1)) * 1000
        return (
          <polygon
            key={i}
            points={`${x - 28},8 ${x + 28},8 ${x},54`}
            fill={color}
            opacity="0.85"
          />
        )
      })}
    </svg>
  )
}

// Small wooden bookshelf on the left
function Bookshelf() {
  const spineColors = ['#9B6FD4', '#F472B6', '#6EE7B7', '#FCD34D', '#C4B5FD', '#F97316']
  return (
    <svg viewBox="0 0 120 90" aria-hidden="true" style={{ width: '13%', position: 'absolute', bottom: '37%', left: '5%' }}>
      {/* Shelf boards */}
      <rect x="2" y="78" width="116" height="8" rx="2" fill="#c4a87a" />
      <rect x="2" y="40" width="116" height="6" rx="2" fill="#c4a87a" />
      {/* Side panels */}
      <rect x="2" y="0" width="8" height="86" rx="2" fill="#b89360" />
      <rect x="110" y="0" width="8" height="86" rx="2" fill="#b89360" />
      {/* Books on top shelf */}
      {spineColors.slice(0, 3).map((c, i) => (
        <rect key={i} x={16 + i * 24} y={10} width={18} height={30} rx="1.5" fill={c} />
      ))}
      {/* Books on bottom shelf */}
      {spineColors.slice(3).map((c, i) => (
        <rect key={i} x={16 + i * 28} y={46} width={20} height={32} rx="1.5" fill={c} />
      ))}
      {/* Small bookend star */}
      <text x="94" y="38" fontSize="16" fill="#FCD34D" textAnchor="middle">⭐</text>
    </svg>
  )
}

// Small plant in a terracotta pot on the right
function Plant() {
  return (
    <svg viewBox="0 0 80 100" aria-hidden="true" style={{ width: '9%', position: 'absolute', bottom: '37%', right: '6%' }}>
      {/* Pot */}
      <path d="M22 72 Q16 72 18 82 L62 82 Q64 72 58 72 Z" fill="#c07040" />
      <rect x="18" y="82" width="44" height="14" rx="3" fill="#b06030" />
      <ellipse cx="40" cy="72" rx="22" ry="5" fill="#d08050" />
      {/* Soil */}
      <ellipse cx="40" cy="72" rx="18" ry="4" fill="#6b4423" />
      {/* Stem */}
      <line x1="40" y1="72" x2="40" y2="42" stroke="#4a7c40" strokeWidth="3" />
      {/* Left branch */}
      <path d="M40 58 Q22 50 18 36" stroke="#4a7c40" strokeWidth="2.5" fill="none" />
      {/* Right branch */}
      <path d="M40 50 Q58 42 62 28" stroke="#4a7c40" strokeWidth="2.5" fill="none" />
      {/* Leaves */}
      <ellipse cx="40" cy="34" rx="12" ry="8" fill="#5a9c50" transform="rotate(-15 40 34)" />
      <ellipse cx="16" cy="32" rx="10" ry="7" fill="#4a8c40" transform="rotate(25 16 32)" />
      <ellipse cx="64" cy="24" rx="10" ry="7" fill="#5aac50" transform="rotate(-20 64 24)" />
      <ellipse cx="40" cy="22" rx="9" ry="6" fill="#6abc60" transform="rotate(5 40 22)" />
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function FramedRoomScene({ src, alt }: Props) {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: '#f7f3ec' }}
      role="img"
      aria-label={`${alt} — framed room mockup`}
    >
      {/* ── Wall ── */}
      {/* Subtle ambient occlusion — edges slightly darker */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 110% 80% at 50% 30%, transparent 55%, rgba(0,0,0,0.055) 100%)',
        }}
      />

      {/* Directional light — soft glow from top-center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% -10%, rgba(255,252,240,0.5) 0%, transparent 80%)',
        }}
      />

      {/* ── Bunting decoration ── */}
      <Bunting />

      {/* ── Framed print (portrait — matches 8×10 Gelato ratio) ── */}
      <div
        className="absolute"
        style={{
          top: '11%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '36%',
          aspectRatio: '4 / 5',
          zIndex: 3,
        }}
      >
        {/* Cast shadow on wall — soft, offset slightly down-right */}
        <div
          className="absolute"
          style={{
            inset: '-3%',
            boxShadow:
              '6px 10px 40px rgba(0,0,0,0.28), 2px 4px 10px rgba(0,0,0,0.18)',
            borderRadius: '3px',
          }}
        />

        {/* Natural maple frame — graduated gradient for realism */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(145deg, #d4b078 0%, #b8904a 35%, #c8a060 60%, #a87838 100%)',
            borderRadius: '3px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.25)',
          }}
        >
          {/* Frame bevel highlight (top-left lit) */}
          <div
            className="absolute"
            style={{
              inset: '0',
              borderRadius: '3px',
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 40%, rgba(0,0,0,0.12) 100%)',
            }}
          />

          {/* Frame groove — inner edge shadow */}
          <div
            className="absolute"
            style={{
              inset: '7%',
              boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.25), inset -1px -1px 3px rgba(0,0,0,0.1)',
              borderRadius: '1px',
              background: 'transparent',
            }}
          />

          {/* White mat board */}
          <div
            className="absolute"
            style={{
              inset: '7%',
              background: '#fefefe',
              boxShadow: 'inset 1px 1px 4px rgba(0,0,0,0.14), inset -1px -1px 2px rgba(0,0,0,0.07)',
              borderRadius: '1px',
            }}
          >
            {/* Mat drop shadow on artwork */}
            <div
              className="absolute"
              style={{
                inset: '7%',
                boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.12)',
              }}
            >
              {/* ── Artwork — fills mat window edge-to-edge ── */}
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 35vw, 22vw"
                className="object-cover"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Left side: bookshelf ── */}
      <Bookshelf />

      {/* ── Right side: plant ── */}
      <Plant />

      {/* ── Baseboard / chair rail ── */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: '36%',
          height: '3px',
          background: 'linear-gradient(180deg, #ddd5c5 0%, #cac2b0 100%)',
          zIndex: 2,
        }}
      />
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: '33%',
          height: '2px',
          background: 'rgba(0,0,0,0.06)',
          zIndex: 2,
        }}
      />

      {/* ── Floor ── */}
      {/* Wood planks — horizontal repeating gradient */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          top: '64%',
          background: `
            repeating-linear-gradient(
              180deg,
              #c49862 0px,
              #c9a070 8px,
              #b88a52 8px,
              #be9260 16px,
              #c8a068 16px,
              #b88a52 17px,
              #c49862 17px,
              #c49862 26px,
              #d4aa78 26px,
              #c49862 34px,
              #b88050 34px,
              #c49862 35px
            )
          `,
          zIndex: 1,
        }}
      />
      {/* Floor shadow at wall base */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: '64%',
          height: '6%',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.04) 60%, transparent 100%)',
          zIndex: 2,
        }}
      />
      {/* Floor darkening towards camera (bottom of frame) */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          height: '10%',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.12) 0%, transparent 100%)',
          zIndex: 2,
        }}
      />

      {/* Small rug under the frame area */}
      <div
        className="absolute"
        style={{
          bottom: '36%',
          left: '28%',
          right: '28%',
          height: '4%',
          background: 'linear-gradient(90deg, transparent 0%, #e8c0d8 8%, #d4a8cc 50%, #e8c0d8 92%, transparent 100%)',
          borderRadius: '2px',
          opacity: 0.7,
          zIndex: 3,
        }}
      />

      {/* ── Print quality badge (bottom-right corner) ── */}
      <div
        className="absolute bottom-[38%] right-[3%] font-nunito text-[0.6rem] text-[#8B7BA8]/70 tracking-wider uppercase"
        style={{ zIndex: 4 }}
      >
        Fine Art Print · Gelato
      </div>
    </div>
  )
}
