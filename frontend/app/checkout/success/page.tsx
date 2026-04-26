'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

// ─── Digital download result ───────────────────────────────────────────────

interface DownloadResult {
  success:     boolean
  slug:        string
  title:       string
  downloadUrl: string
}

function DigitalSuccess({ sessionId, slug }: { sessionId: string; slug: string }) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [result, setResult] = useState<DownloadResult | null>(null)

  useEffect(() => {
    fetch(`/api/downloads/verify?session_id=${encodeURIComponent(sessionId)}&slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data: DownloadResult) => {
        if (data.success) {
          setResult(data)
          setState('ready')
        } else {
          setState('error')
        }
      })
      .catch(() => setState('error'))
  }, [sessionId, slug])

  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-[#C4B5FD] border-t-[#9B6FD4] rounded-full animate-spin" />
        <p className="font-nunito text-[#8B7BA8] text-sm">Verifying your purchase…</p>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="text-center space-y-3">
        <p className="text-4xl">😔</p>
        <p className="font-fredoka font-semibold text-[#3D1F5C] text-lg">
          Something went wrong
        </p>
        <p className="font-nunito text-[#8B7BA8] text-sm max-w-xs mx-auto">
          Your payment was successful but we couldn&apos;t retrieve your download.
          Please email us and we&apos;ll sort it out immediately.
        </p>
        <a
          href="mailto:hello@comecolorwith.me?subject=Download%20issue"
          className="inline-block mt-2 font-nunito font-bold text-sm text-[#9B6FD4] hover:underline"
        >
          Contact support →
        </a>
      </div>
    )
  }

  return (
    <div className="text-center space-y-5">
      <p className="text-5xl">🎉</p>
      <div>
        <p className="font-fredoka font-bold text-[#3D1F5C] text-2xl mb-1">
          Your download is ready!
        </p>
        <p className="font-nunito text-[#8B7BA8] text-sm">
          {result?.title}
        </p>
      </div>
      <a
        href={result?.downloadUrl}
        download
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[32px] bg-[#9B6FD4] hover:bg-[#7c56b0] text-white font-nunito font-bold text-base transition-colors shadow-sm"
      >
        ⬇ Download Your PDF
      </a>
      <p className="font-nunito text-[#8B7BA8] text-xs">
        If the download doesn&apos;t start, <a href={result?.downloadUrl} className="underline">click here</a>.
      </p>
    </div>
  )
}

// ─── Print order result ────────────────────────────────────────────────────

function PrintSuccess({ slug }: { slug: string }) {
  return (
    <div className="text-center space-y-5">
      <p className="text-5xl">🖼️</p>
      <div>
        <p className="font-fredoka font-bold text-[#3D1F5C] text-2xl mb-1">
          Order placed!
        </p>
        <p className="font-nunito text-[#8B7BA8] text-sm max-w-xs mx-auto">
          Your museum-quality print is being prepared and will ship in 3–5 business days.
          You&apos;ll receive a shipping confirmation by email.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm font-nunito text-[#3D1F5C]/70 pt-2">
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">📦</span>
          <span>Printing started</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">🚚</span>
          <span>Ships in 3–5 days</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">📧</span>
          <span>Tracking by email</span>
        </div>
      </div>
    </div>
  )
}

// ─── Page shell ─────────────────────────────────────────────────────────────

function SuccessContent() {
  const params    = useSearchParams()
  const sessionId = params.get('session_id') ?? ''
  const type      = params.get('type')       ?? ''
  const slug      = params.get('slug')       ?? ''

  return (
    <main className="min-h-screen bg-[#FFF6F9] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-[24px] shadow-sm border border-[#C4B5FD]/20 p-8 md:p-10">
        {type === 'digital' && sessionId && slug ? (
          <DigitalSuccess sessionId={sessionId} slug={slug} />
        ) : type === 'print' && slug ? (
          <PrintSuccess slug={slug} />
        ) : (
          <div className="text-center">
            <p className="text-5xl mb-4">✅</p>
            <p className="font-fredoka font-bold text-[#3D1F5C] text-2xl">Payment successful!</p>
          </div>
        )}

        {/* Footer links */}
        <div className="mt-8 pt-6 border-t border-[#C4B5FD]/20 flex flex-wrap justify-center gap-4 text-sm font-nunito text-[#8B7BA8]">
          <Link href="/coloring-pages" className="hover:text-[#9B6FD4] transition-colors">
            More Coloring Pages
          </Link>
          <Link href="/shop" className="hover:text-[#9B6FD4] transition-colors">
            Shop Prints
          </Link>
          <Link href="/account" className="hover:text-[#9B6FD4] transition-colors">
            My Account
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
