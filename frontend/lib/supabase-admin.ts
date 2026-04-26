import { createClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase admin client using the service role key.
 * Bypasses Row Level Security — only call from trusted server code (webhooks, API routes).
 * Returns null if SUPABASE_SERVICE_ROLE_KEY is not set, allowing callers to
 * degrade gracefully rather than crashing.
 */
export function createAdminClient() {
  const url = process.env['NEXT_PUBLIC_SUPABASE_URL']
  const key = process.env['SUPABASE_SERVICE_ROLE_KEY']
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
