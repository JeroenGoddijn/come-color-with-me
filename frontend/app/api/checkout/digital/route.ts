import { NextRequest, NextResponse } from 'next/server'
import { getStripe, DIGITAL_PRICE_CENTS } from '@/lib/stripe'

/**
 * POST /api/checkout/digital
 * Creates a Stripe Checkout Session for a paid digital PDF download.
 *
 * Body: { slug: string; title: string }
 *
 * Required env vars (Vercel):
 *   STRIPE_SECRET_KEY          — Stripe secret key
 *   NEXT_PUBLIC_SITE_URL       — e.g. https://comecolorwithme.com
 */
export async function POST(req: NextRequest) {
  const stripeKey = process.env['STRIPE_SECRET_KEY']
  if (!stripeKey) {
    return NextResponse.json(
      { error: 'Payments not configured' },
      { status: 503 }
    )
  }

  let slug: string, title: string
  try {
    const body = await req.json()
    slug  = String(body.slug  ?? '').trim()
    title = String(body.title ?? 'Artwork').trim()
    if (!slug) throw new Error('missing slug')
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000'

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency:     'usd',
            unit_amount:  DIGITAL_PRICE_CENTS,
            product_data: {
              name:        `${title} — Digital Download`,
              description: 'High-res PDF (300 DPI) · Instant delivery · Personal use license',
              images:      [`${siteUrl}/assets/artwork/${slug}-preview.jpg`],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type:  'digital',
        slug,
        title,
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=digital&slug=${encodeURIComponent(slug)}`,
      cancel_url:  `${siteUrl}/artwork/${encodeURIComponent(slug)}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Could not create checkout session' }, { status: 502 })
  }
}
