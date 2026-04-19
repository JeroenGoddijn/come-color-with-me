import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/newsletter
 * Subscribes an email to a Kit (formerly ConvertKit) form using the v4 API.
 *
 * Required env vars (set in Vercel — server-only, never exposed to browser):
 *   KIT_API_KEY   — Kit v4 API key (starts with "kit_")
 *   KIT_FORM_ID   — Form ID from Kit dashboard
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env['KIT_API_KEY']
  const formId = process.env['KIT_FORM_ID']

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
    // Kit v4 API: Bearer token auth, email_address field, /v4/ base URL
    const kitRes = await fetch(
      `https://api.kit.com/v4/forms/${formId}/subscribers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ email_address: email }),
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
