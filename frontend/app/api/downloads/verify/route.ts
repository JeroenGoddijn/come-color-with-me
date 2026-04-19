import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

/**
 * GET /api/downloads/verify?session_id=xxx&slug=yyy
 *
 * Validates a Stripe Checkout Session and — if paid — returns the download URL
 * for the purchased digital artwork PDF.
 *
 * Security model (Sprint 2 MVP):
 *   - Verifies session exists in Stripe and payment_status === 'paid'
 *   - Verifies session metadata.slug matches the requested slug
 *   - Returns a download URL (currently the public PDF path; Sprint 3 will
 *     upgrade to a Supabase Storage signed URL with a 1-hour TTL)
 *
 * Sprint 3 TODO: replace with Supabase Storage signed URL generation:
 *   const { data } = await supabase.storage.from('premium-pdfs').createSignedUrl(...)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id') ?? ''
  const slug      = searchParams.get('slug')       ?? ''

  if (!sessionId || !slug) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const stripeKey = process.env['STRIPE_SECRET_KEY']
  if (!stripeKey) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
  }

  try {
    const stripe  = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Must be paid
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 })
    }

    // Must match the purchased artwork
    if (session.metadata?.['slug'] !== slug) {
      return NextResponse.json({ error: 'Session does not match artwork' }, { status: 403 })
    }

    // Must be a digital purchase
    if (session.metadata?.['type'] !== 'digital') {
      return NextResponse.json({ error: 'Not a digital download purchase' }, { status: 400 })
    }

    // Return the download URL.
    // Sprint 2: serves the PDF from public assets (fine for launch).
    // Sprint 3: upgrade to Supabase Storage private bucket + signed URL.
    const siteUrl    = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000'
    const downloadUrl = `${siteUrl}/assets/artwork/${slug}-download.pdf`

    return NextResponse.json({
      success:     true,
      slug,
      title:       session.metadata?.['title'] ?? slug,
      downloadUrl,
    })
  } catch (err) {
    console.error('Download verify error:', err)
    return NextResponse.json({ error: 'Could not verify purchase' }, { status: 502 })
  }
}
