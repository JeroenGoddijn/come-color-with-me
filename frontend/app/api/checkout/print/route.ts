import { NextRequest, NextResponse } from 'next/server'
import { getStripe, PRINT_SIZES } from '@/lib/stripe'

/**
 * POST /api/checkout/print
 * Creates a Stripe Checkout Session for a museum-quality Gelato print.
 * Stripe collects shipping address; on webhook success, a Gelato order is created.
 *
 * Body: { slug: string; title: string; size: '8x10' | '11x14' | '16x20' }
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

  let slug: string, title: string, size: string
  try {
    const body = await req.json()
    slug  = String(body.slug  ?? '').trim()
    title = String(body.title ?? 'Artwork').trim()
    size  = String(body.size  ?? '').trim()
    if (!slug || !size) throw new Error('missing slug or size')
    if (!PRINT_SIZES[size]) throw new Error(`invalid size: ${size}`)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }

  const siteUrl    = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000'
  const printSize  = PRINT_SIZES[size]!

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode:                'payment',
      payment_method_types: ['card'],
      // Collect shipping address — forwarded to Gelato in the webhook
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ', 'DE', 'FR', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI'],
      },
      line_items: [
        {
          price_data: {
            currency:    'usd',
            unit_amount: printSize.amount,
            product_data: {
              name:        `${title} — ${printSize.label} Art Print`,
              description: 'Museum-quality print by Gelato · Ships in 3–5 business days · Carbon neutral',
              images:      [`${siteUrl}/assets/artwork/${slug}-preview.jpg`],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type:  'print',
        slug,
        title,
        size,
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=print&slug=${encodeURIComponent(slug)}`,
      cancel_url:  `${siteUrl}/artwork/${encodeURIComponent(slug)}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe print checkout error:', err)
    return NextResponse.json({ error: 'Could not create checkout session' }, { status: 502 })
  }
}
