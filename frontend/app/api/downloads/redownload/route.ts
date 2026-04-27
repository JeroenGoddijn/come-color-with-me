import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { existsSync } from 'fs'
import { join } from 'path'

/**
 * GET /api/downloads/redownload?id={download_record_uuid}
 *
 * Authenticated re-download endpoint. The download record UUID is the stable
 * order token — it never expires and is scoped to the purchasing user via RLS.
 *
 * Security model:
 *   - Requires a valid Supabase session (401 if not logged in)
 *   - Supabase RLS ensures the record belongs to the authenticated user
 *   - Returns the resolved file URL (PDF preferred, falls back to preview JPG)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id') ?? ''

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Must be logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch the download record — RLS guarantees user_id match
  const { data: record } = await supabase
    .from('downloads')
    .select('artwork_slug, artwork_title, stripe_session_id')
    .eq('id', id)
    .single()

  if (!record) {
    return NextResponse.json({ error: 'Download record not found' }, { status: 404 })
  }

  // Resolve the file: prefer PDF, fall back to preview JPG
  const siteUrl  = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000'
  const publicDir = join(process.cwd(), 'public')
  const candidates = [
    `assets/artwork/${record.artwork_slug}-download.pdf`,
    `assets/artwork/${record.artwork_slug}-preview.jpg`,
  ]
  const fileRelative = candidates.find((f) => existsSync(join(publicDir, f)))

  if (!fileRelative) {
    console.error(`No file found for slug: ${record.artwork_slug}`)
    return NextResponse.json({ error: 'File not available' }, { status: 404 })
  }

  // Order reference: first 8 hex chars of the UUID (display-safe, stable)
  const orderRef = '#' + id.replace(/-/g, '').slice(0, 8).toUpperCase()

  return NextResponse.json({
    downloadUrl: `${siteUrl}/${fileRelative}`,
    title:       record.artwork_title,
    orderRef,
  })
}
