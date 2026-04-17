'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { FeatureFlags } from '@/types/flags'

const DEFAULT_FLAGS: FeatureFlags = {
  ENABLE_PREMIUM_PRINTS: false,
  ENABLE_COLORING_CLUB: false,
  ENABLE_ACCOUNT_DOWNLOADS: true,
  ENABLE_NEWSLETTER: true,
  ENABLE_WATERMARKS: true,
  ENABLE_CART: false,
  ENABLE_CHECKOUT: false,
  ENABLE_ARTIST_UPLOADS: false,
  ENABLE_GAMIFICATION: false,
  ENABLE_THEME_PLAYFUL: false,
  ENABLE_THEME_WHIMSICAL: true,
}

function parseDefaultFlags(): FeatureFlags {
  try {
    const raw = process.env.NEXT_PUBLIC_DEFAULT_FLAGS
    if (raw) {
      return { ...DEFAULT_FLAGS, ...JSON.parse(raw) } as FeatureFlags
    }
  } catch {
    // Fall through to defaults
  }
  return DEFAULT_FLAGS
}

const FlagsContext = createContext<FeatureFlags>(parseDefaultFlags())

export function FlagsProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(parseDefaultFlags())

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
    fetch(`${apiUrl}/api/settings`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setFlags((prev) => ({ ...prev, ...json.data }))
        }
      })
      .catch(() => {
        // Silently fall back to defaults if API is unavailable
      })
  }, [])

  return (
    <FlagsContext.Provider value={flags}>
      {children}
    </FlagsContext.Provider>
  )
}

export function useFlagsContext(): FeatureFlags {
  return useContext(FlagsContext)
}

export { FlagsContext }
