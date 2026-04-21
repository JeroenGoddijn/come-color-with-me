'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  src: string
  alt: string
}

/**
 * Renders a clean, minimal room scene with the artwork composited into a
 * dark-walnut frame. Orientation (portrait vs landscape) is detected
 * automatically from the image's natural dimensions on load, so the frame
 * always matches the artwork's aspect ratio.
 */
export function FramedRoomScene({ src, alt }: Props) {
  // Default to portrait; updated once the image reports its natural size
  const [ratio, setRatio] = useState<number>(4 / 5)

  function handleLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth, naturalHeight } = e.currentTarget
    if (naturalWidth > 0 && naturalHeight > 0) {
      setRatio(naturalWidth / naturalHeight)
    }
  }

  const isLandscape = ratio > 1.05

  // Frame takes up more horizontal space when landscape
  const frameWidth = isLandscape ? '68%' : '40%'

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{ background: '#EEE8DF' }}
      role="img"
      aria-label={`${alt} — framed room preview`}
    >

      {/* ── Wall ─────────────────────────────────────────────────────────── */}
      {/* Warm linen wall with soft top-centre highlight */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 70% at 50% 5%, #F7F2EA 0%, #EEE8DF 55%, #E4DCCE 100%)',
        }}
      />

      {/* Subtle directional light from upper-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(130deg, rgba(255,250,240,0.28) 0%, transparent 55%)',
        }}
      />

      {/* Edge vignette — gives depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.10)' }}
      />

      {/* Picture rail — thin strip of moulding near the top */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: '7%',
          height: '3px',
          background:
            'linear-gradient(180deg, #c8bfb0 0%, #b8af9e 60%, #c4bba8 100%)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
          zIndex: 2,
        }}
      />
      {/* Rail shadow below */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: 'calc(7% + 3px)',
          height: '6px',
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.06) 0%, transparent 100%)',
          zIndex: 2,
        }}
      />

      {/* ── Framed print ─────────────────────────────────────────────────── */}
      <div
        className="absolute"
        style={{
          // Position upper-centre, below the picture rail
          top: '11%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: frameWidth,
          aspectRatio: String(ratio),
          maxHeight: '72%',
          zIndex: 3,
        }}
      >
        {/* Cast shadow on wall */}
        <div
          className="absolute"
          style={{
            inset: '-3%',
            boxShadow:
              '6px 10px 36px rgba(0,0,0,0.26), 1px 2px 6px rgba(0,0,0,0.14)',
            borderRadius: '2px',
          }}
        />

        {/* Dark walnut frame */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(155deg, #5a4232 0%, #3a2818 40%, #4e3828 65%, #2e1e10 100%)',
            borderRadius: '2px',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.50)',
          }}
        >
          {/* Frame bevel — lit top-left edge */}
          <div
            className="absolute inset-0"
            style={{
              borderRadius: '2px',
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.14) 0%, transparent 30%, rgba(0,0,0,0.22) 100%)',
            }}
          />

          {/* White mat board */}
          <div
            className="absolute"
            style={{
              inset: '7%',
              background: '#FDFCFB',
              boxShadow:
                'inset 1px 1px 5px rgba(0,0,0,0.10), inset -1px -1px 3px rgba(0,0,0,0.06)',
              borderRadius: '1px',
            }}
          >
            {/* Mat inner shadow — artwork sits recessed */}
            <div
              className="absolute"
              style={{
                inset: '7%',
                boxShadow: 'inset 2px 2px 7px rgba(0,0,0,0.12)',
                borderRadius: '1px',
              }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 55vw, 35vw"
                className="object-cover"
                draggable={false}
                onLoad={handleLoad}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Baseboard / chair rail ───────────────────────────────────────── */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: '33%',
          height: '3px',
          background:
            'linear-gradient(180deg, #d0c8b8 0%, #beb6a4 60%, #cac2b0 100%)',
          zIndex: 2,
        }}
      />
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: '30%',
          height: '2px',
          background:
            'linear-gradient(180deg, #c0b8a4 0%, #b4ac98 100%)',
          zIndex: 2,
        }}
      />

      {/* ── Hardwood floor ──────────────────────────────────────────────── */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          top: '67%',
          background: `repeating-linear-gradient(
            180deg,
            #b5864a 0px,  #bc8e52 5px,
            #a87840 5px,  #b08450 10px,
            #ba8c50 10px, #a47840 11px,
            #b5864a 11px, #b5864a 18px,
            #c2965c 18px, #b5864a 24px,
            #a88050 24px, #b5864a 25px
          )`,
          zIndex: 1,
        }}
      />

      {/* Shadow at wall-floor join */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: '67%',
          height: '5%',
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.04) 70%, transparent 100%)',
          zIndex: 2,
        }}
      />

      {/* Floor darkens towards camera */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          height: '8%',
          background:
            'linear-gradient(0deg, rgba(0,0,0,0.13) 0%, transparent 100%)',
          zIndex: 2,
        }}
      />

      {/* ── Fine Art badge ───────────────────────────────────────────────── */}
      <div
        className="absolute font-nunito text-[0.55rem] text-[#8B7BA8]/60 tracking-widest uppercase"
        style={{ bottom: '35%', right: '3%', zIndex: 4 }}
      >
        Fine Art Print · Gelato
      </div>
    </div>
  )
}
