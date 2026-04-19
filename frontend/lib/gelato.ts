/**
 * Gelato POD integration — Sprint 2
 *
 * Before this works in production you must:
 *  1. Create a Gelato account at gelato.com
 *  2. Upload Amalia's artwork files to Gelato (or provide a public CDN URL)
 *  3. Create products in the Gelato dashboard and note the productUid for each size
 *  4. Set GELATO_API_KEY in Render (backend) and Vercel (frontend) env vars
 *  5. Replace the placeholder productUids below with real values
 *
 * Gelato API docs: https://dashboard.gelato.com/docs/orders/v4/
 */

const GELATO_API_BASE = 'https://order.api.gelato.com'

/**
 * Map size key → Gelato productUid.
 * These are account-specific. Get them from your Gelato product catalog.
 * Example format: "photobook_21x29_pf_170-176pp_ver1"
 *
 * TODO: Replace placeholders with real Gelato product UIDs once account is set up.
 */
const GELATO_PRODUCT_UIDS: Record<string, string> = {
  '8x10':  process.env['GELATO_PRODUCT_8X10']  ?? 'PLACEHOLDER_8X10',
  '11x14': process.env['GELATO_PRODUCT_11X14'] ?? 'PLACEHOLDER_11X14',
  '16x20': process.env['GELATO_PRODUCT_16X20'] ?? 'PLACEHOLDER_16X20',
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
}

export async function createGelatoPrintOrder(params: CreatePrintOrderParams): Promise<{ id: string }> {
  const apiKey = process.env['GELATO_API_KEY']
  if (!apiKey) throw new Error('GELATO_API_KEY is not set')

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
