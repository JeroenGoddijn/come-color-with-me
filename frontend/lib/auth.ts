import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase browser client for use in client components.
 * Uses the public anon key — safe to expose in the browser.
 *
 * Sprint 1: Used for session detection and basic auth flow.
 * Sprint 2: Full server-side client with cookie handling will be added.
 */
export function createBrowserClient() {
  return createSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
