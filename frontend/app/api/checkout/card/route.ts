import { NextRequest, NextResponse } from 'next/server'
import { getStripe, CARD_VARIANTS } from '@/lib/stripe'

/**
 * POST /api/checkout/card
 * Creates a Stripe Checkout Session for a printed greeting card / postcard via Gelato.
 * Stripe collects shipping; on webhook success a Gelato card order is created.
 *
 * Body: { slug: string; title: string; variant: '4x6' | '4x6-10pack' }
 */
export async function POST(req: NextRequest) {
  const stripeKey = process.env['STRIPE_SECRET_KEY']
  if (!stripeKey) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
  }

  let slug: string, title: string, variant: string
  try {
    const body = await req.json()
    slug    = String(body.slug    ?? '').trim()
    title   = String(body.title   ?? 'Card').trim()
    variant = String(body.variant ?? '').trim()
    if (!slug || !variant) throw new Error('missing slug or variant')
    if (!CARD_VARIANTS[variant]) throw new Error(`invalid variant: ${variant}`)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }

  const siteUrl   = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000'
  const cardInfo  = CARD_VARIANTS[variant]!

  try {
    const stripe  = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode:                 'payment',
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ', 'DE', 'FR', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI'],
      },
      line_items: [
        {
          price_data: {
            currency:    'usd',
            unit_amount: cardInfo.amount,
            product_data: {
              name:        `${title} — ${cardInfo.label}`,
              description: `Printed on premium card stock by Gelato · Ships in 3–5 business days · Carbon neutral`,
              images:      [`${siteUrl}/assets/artwork/${slug}-preview.jpg`],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: 'card',
        slug,
        title,
        variant,
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=card&slug=${encodeURIComponent(slug)}`,
      cancel_url:  `${siteUrl}/artwork/${encodeURIComponent(slug)}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe card checkout error:', err)
    return NextResponse.json({ error: 'Could not create checkout session' }, { status: 502 })
  }
}
