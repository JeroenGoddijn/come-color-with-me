'use client'

import Image from 'next/image'
import { ASSETS } from '@/lib/assets'
import { useFlag } from '@/hooks/useFlags'

type Props = {
  enabled?: boolean
}

export function WatermarkOverlay({ enabled = true }: Props) {
  const flagEnabled = useFlag('ENABLE_WATERMARKS')

  if (!enabled || !flagEnabled) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <Image
        src={ASSETS.watermark}
        alt=""
        fill
        className="object-cover"
        aria-hidden="true"
        priority={false}
      />
    </div>
  )
}
