'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// ─── Pageview tracker (inside Suspense boundary for useSearchParams) ───────────

function PageviewTracker() {
  const client    = usePostHog()
  const pathname  = usePathname()
  const params    = useSearchParams()
  const prevUrl   = useRef<string | null>(null)

  useEffect(() => {
    const url = pathname + (params.toString() ? `?${params.toString()}` : '')
    if (url === prevUrl.current) return
    prevUrl.current = url
    client?.capture('$pageview', { $current_url: window.location.href })
  }, [client, pathname, params])

  return null
}

// ─── Initialiser — runs once on mount ─────────────────────────────────────────

function PostHogInit() {
  useEffect(() => {
    const key  = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com'
    if (!key) return

    posthog.init(key, {
      api_host:                  host,
      ui_host:                   'https://eu.posthog.com',
      persistence:               'memory',        // no cookies → no consent banner needed
      autocapture:               false,           // opt-in only: no blind click harvesting
      capture_pageview:          false,           // we track manually via PageviewTracker
      capture_pageleave:         true,
      disable_session_recording: true,            // enable explicitly when consent UI is added
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') ph.debug()
      },
    })
  }, [])

  return null
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <PostHogInit />
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </PHProvider>
  )
}
