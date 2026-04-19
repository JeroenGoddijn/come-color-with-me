import { NextResponse } from 'next/server'

/**
 * TEMPORARY DEBUG ROUTE — DELETE AFTER USE
 * GET /api/debug/gelato-products
 * Fetches Fine Art Poster size variants from Gelato product API.
 * Deploy → hit once → copy UIDs → delete this file.
 */
export async function GET() {
  const apiKey = process.env['GELATO_API_KEY']
  if (!apiKey) {
    return NextResponse.json({ error: 'GELATO_API_KEY not set' }, { status: 503 })
  }

  const results: Record<string, unknown> = {}

  // Try both known Gelato product API endpoints
  const endpoints = [
    'https://product.api.gelato.com/v3/products/fine-art-poster',
    'https://product.api.gelato.com/v3/products/fine-art-poster/variants',
    'https://product.api.gelato.com/v4/products/fine-art-poster',
    'https://product.api.gelato.com/v3/products?catalogUid=posters&limit=5',
  ]

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: { 'X-API-KEY': apiKey },
        signal: AbortSignal.timeout(8000),
      })
      const text = await res.text()
      results[url] = { status: res.status, body: text.slice(0, 3000) }
    } catch (err) {
      results[url] = { error: String(err) }
    }
  }

  return NextResponse.json(results, { status: 200 })
}
