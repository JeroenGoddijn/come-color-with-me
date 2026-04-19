import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { createGelatoPrintOrder } from '@/lib/gelato'

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events for digital downloads and print orders.
 *
 * Required env vars (Vercel):
 *   STRIPE_SECRET_KEY          — Stripe secret key
 *   STRIPE_WEBHOOK_SECRET      — Webhook signing secret from Stripe dashboard
 *   NEXT_PUBLIC_SITE_URL       — e.g. https://comecolorwithme.com
 *
 * In Stripe dashboard → Developers → Webhooks:
 *   Add endpoint: https://comecolorwithme.com/api/webhooks/stripe
 *   Select events: checkout.session.completed
 */

// Required to read raw body for signature verification
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET']
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  // Read raw body for Stripe signature verification
  const rawBody  = await req.text()
  const signature = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const type    = session.metadata?.['type']
    const slug    = session.metadata?.['slug']   ?? ''
    const title   = session.metadata?.['title']  ?? ''

    if (type === 'digital') {
      await handleDigitalDownload(session, slug, title)
    } else if (type === 'print') {
      await handlePrintOrder(session, slug, title)
    }
  }

  return NextResponse.json({ received: true })
}

// ─── Digital download ─────────────────────────────────────────────────────────

async function handleDigitalDownload(
  session: Stripe.Checkout.Session,
  slug: string,
  title: string,
) {
  // Record the purchase in Supabase so the account dashboard can show it
  // and so the download token can be validated against a paid session.
  //
  // For Sprint 2 MVP we rely on Stripe session verification at download time
  // (see /api/downloads/verify) rather than a separate DB record.
  // Sprint 3 will add: supabase.from('downloads').insert({ ... })

  console.log(`Digital download purchased: ${title} (${slug}) — session ${session.id}`)
}

// ─── Print order via Gelato ───────────────────────────────────────────────────

async function handlePrintOrder(
  session: Stripe.Checkout.Session,
  slug: string,
  title: string,
) {
  const size     = session.metadata?.['size'] ?? '8x10'
  // In Stripe API v2026+, shipping address lives in collected_information.shipping_details
  const shipping = session.collected_information?.shipping_details
  const customer = session.customer_details

  if (!shipping?.address || !customer?.email) {
    console.error('Print order missing shipping address or customer email for session', session.id)
    return
  }

  const addr = shipping.address

  const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000'
  // Use the preview image as the print file until high-res Gelato-ready files are stored in Supabase Storage.
  // TODO Sprint 3: upload 600 DPI TIFF to Supabase Storage and use that URL here.
  const artworkFileUrl = `${siteUrl}/assets/artwork/${slug}-preview.jpg`

  try {
    const gelatoOrder = await createGelatoPrintOrder({
      orderReferenceId: session.id,
      artworkSlug:      slug,
      artworkTitle:     title,
      artworkFileUrl,
      size:             size as '8x10' | '11x14' | '16x20',
      quantity:         1,
      currency:         session.currency?.toUpperCase() ?? 'USD',
      shippingAddress: {
        firstName:    customer.name?.split(' ')[0] ?? 'Customer',
        lastName:     customer.name?.split(' ').slice(1).join(' ') ?? '',
        addressLine1: addr.line1 ?? '',
        addressLine2: addr.line2 ?? undefined,
        city:         addr.city ?? '',
        state:        addr.state ?? '',
        postCode:     addr.postal_code ?? '',
        country:      addr.country ?? 'US',
        email:        customer.email,
        phone:        customer.phone ?? undefined,
      },
    })
    console.log(`Gelato print order created: ${gelatoOrder.id} for session ${session.id}`)
  } catch (err) {
    // Log but don't fail the webhook — Stripe won't retry if we return 200.
    // Alert/retry logic should be added in Sprint 3.
    console.error('Failed to create Gelato order:', err)
  }
}
