import Stripe from 'stripe'

/**
 * Singleton Stripe client for use in Next.js Route Handlers (server-only).
 * Never import this in client components or pages.
 */
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env['STRIPE_SECRET_KEY']
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
    _stripe = new Stripe(key, { apiVersion: '2026-03-25.dahlia' })
  }
  return _stripe
}

/** Print size → Stripe unit_amount (cents) + display label */
export const PRINT_SIZES: Record<string, { label: string; amount: number }> = {
  '8x10':  { label: '8×10″',  amount: 1999 },
  '11x14': { label: '11×14″', amount: 2499 },
  '16x20': { label: '16×20″', amount: 3499 },
}

/** Postcard/greeting-card variant → Stripe unit_amount (cents) + display label */
export const CARD_VARIANTS: Record<string, { label: string; amount: number; quantity: number }> = {
  '4x6':        { label: 'Single Postcard (4×6″)',  amount:  499, quantity:  1 },
  '4x6-10pack': { label: '10-Pack Postcards (4×6″)', amount: 3499, quantity: 10 },
}

/** Digital download price in cents */
export const DIGITAL_PRICE_CENTS = 299
