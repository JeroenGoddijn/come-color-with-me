/**
 * Gelato POD integration — Sprint 2
 *
 * Testing (no real charges):
 *   Option A — Sandbox account: create a second Gelato account with no payment method.
 *              Set its API key as GELATO_API_KEY_TEST. Orders auto-cancel without payment.
 *   Option B — API Portal: place manual test orders in the Gelato dashboard; auto-cancelled.
 *
 * The webhook uses GELATO_API_KEY_TEST when Stripe is in test mode (livemode=false),
 * and GELATO_API_KEY for live orders. If GELATO_API_KEY_TEST is not set, test-mode
 * orders are logged and skipped rather than risking a real order.
 *
 * Gelato API docs: https://dashboard.gelato.com/docs/orders/v4/
 */

const GELATO_API_BASE = 'https://order.api.gelato.com'

/**
 * Map size key → Gelato productUid.
 * These are account-specific. Get them from your Gelato product catalog.
 * Example format: "photobook_21x29_pf_170-176pp_ver1"
 *
 * Env var naming convention: POD_{PARTNER}_{PRODUCT}_{VARIANT}
 *   - POD_GELATO_PRINT_8X10   → Fine art print 8×10"
 *   - POD_GELATO_PRINT_11X14  → Fine art print 11×14"
 *   - POD_GELATO_PRINT_16X20  → Fine art print 16×20"
 *
 * TODO: Replace placeholders with real Gelato product UIDs once account is set up.
 */
const GELATO_PRODUCT_UIDS: Record<string, string> = {
  '8x10':  process.env['POD_GELATO_PRINT_8X10']  ?? 'PLACEHOLDER_8X10',
  '11x14': process.env['POD_GELATO_PRINT_11X14'] ?? 'PLACEHOLDER_11X14',
  '16x20': process.env['POD_GELATO_PRINT_16X20'] ?? 'PLACEHOLDER_16X20',
}

export interface GelatoAddress {
  firstName:   string
  lastName:    string
  addressLine1: string
  addressLine2?: string
  city:        string
  state:       string
  postCode:    string
  country:     string
  email:       string
  phone?:      string
}

export interface CreatePrintOrderParams {
  orderReferenceId: string   // e.g. Stripe session ID
  artworkSlug:      string
  artworkTitle:     string
  artworkFileUrl:   string   // publicly accessible print-resolution file URL
  size:             '8x10' | '11x14' | '16x20'
  quantity:         number
  shippingAddress:  GelatoAddress
  currency:         string
  livemode?:        boolean  // pass session.livemode from Stripe; selects correct API key
}

export async function createGelatoPrintOrder(params: CreatePrintOrderParams): Promise<{ id: string }> {
  // Use sandbox key for Stripe test-mode orders, live key for real orders.
  const isLive  = params.livemode !== false
  const apiKey  = isLive
    ? process.env['GELATO_API_KEY']
    : (process.env['GELATO_API_KEY_TEST'] ?? process.env['GELATO_API_KEY'])

  if (!apiKey) throw new Error(isLive ? 'GELATO_API_KEY is not set' : 'GELATO_API_KEY_TEST (or GELATO_API_KEY) is not set')

  const productUid = GELATO_PRODUCT_UIDS[params.size]
  if (!productUid || productUid.startsWith('PLACEHOLDER')) {
    throw new Error(`Gelato productUid not configured for size ${params.size}. Set GELATO_PRODUCT_${params.size.toUpperCase().replace('X', 'X')} env var.`)
  }

  const body = {
    orderReferenceId:    params.orderReferenceId,
    customerReferenceId: params.artworkSlug,
    currency:            params.currency,
    items: [
      {
        itemReferenceId: `${params.artworkSlug}-${params.size}`,
        productUid,
        files: [{ type: 'default', url: params.artworkFileUrl }],
        quantity: params.quantity,
      },
    ],
    shippingAddress: {
      firstName:    params.shippingAddress.firstName,
      lastName:     params.shippingAddress.lastName,
      addressLine1: params.shippingAddress.addressLine1,
      addressLine2: params.shippingAddress.addressLine2 ?? '',
      city:         params.shippingAddress.city,
      state:        params.shippingAddress.state,
      postCode:     params.shippingAddress.postCode,
      country:      params.shippingAddress.country,
      email:        params.shippingAddress.email,
      phone:        params.shippingAddress.phone ?? '',
    },
    shipmentMethodUid: 'standard',
  }

  const res = await fetch(`${GELATO_API_BASE}/orders/v4`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY':    apiKey,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gelato API error ${res.status}: ${text}`)
  }

  const json = await res.json() as { order: { id: string } }
  return { id: json.order.id }
}
