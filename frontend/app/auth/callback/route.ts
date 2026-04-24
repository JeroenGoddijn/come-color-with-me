import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Handles Supabase PKCE auth callbacks — email confirmation and password reset.
 *
 * Supabase sends users here with a `code` query param after:
 *   - Clicking the email confirmation link (sign-up)
 *   - Clicking the password reset link (forgot password)
 *
 * `next` controls where the user lands after a successful exchange:
 *   - Email confirmation → /account (default)
 *   - Password reset    → /auth/reset-password
 *
 * Supabase Dashboard must have this URL in "Redirect URLs":
 *   https://comecolorwith.me/auth/callback
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/account'

  if (code) {
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

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Code missing or exchange failed — show the error page.
  return NextResponse.redirect(`${origin}/auth/error`)
}
