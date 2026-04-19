import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/newsletter
 * Subscribes an email to the Kit (ConvertKit) form.
 *
 * Required env vars (set in Vercel):
 *   KIT_API_KEY   — ConvertKit API key (server-only)
 *   KIT_FORM_ID   — Form ID from Kit dashboard (server-only)
 */
export async function POST(req: NextRequest) {
  const apiKey  = process.env['KIT_API_KEY']
  const formId  = process.env['KIT_FORM_ID']

  if (!apiKey || !formId) {
    console.error('Newsletter: KIT_API_KEY or KIT_FORM_ID not set')
    return NextResponse.json(
      { success: false, error: 'Newsletter not configured' },
      { status: 503 }
    )
  }

  let email: string
  try {
    const body = await req.json()
    email = (body.email ?? '').trim().toLowerCase()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }

  if (!email || !email.includes('@')) {
    return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 422 })
  }

  try {
    const kitRes = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ api_key: apiKey, email }),
      }
    )

    if (!kitRes.ok) {
      const text = await kitRes.text()
      console.error(`Kit API error ${kitRes.status}:`, text)
      return NextResponse.json(
        { success: false, error: 'Could not subscribe. Please try again.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Newsletter fetch error:', err)
    return NextResponse.json(
      { success: false, error: 'Network error. Please try again.' },
      { status: 502 }
    )
  }
}
