'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DownloadResult {
  success:     boolean
  slug:        string
  title:       string
  downloadUrl: string
  filename:    string
  orderRef:    string
}

// ─── Digital download success ─────────────────────────────────────────────────

function DigitalSuccess({ sessionId, slug }: { sessionId: string; slug: string }) {
  const { user } = useAuth()
  const [state, setState]     = useState<'loading' | 'ready' | 'error'>('loading')
  const [result, setResult]   = useState<DownloadResult | null>(null)
  const [dlLoading, setDlLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/downloads/verify?session_id=${encodeURIComponent(sessionId)}&slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data: DownloadResult) => {
        if (data.success) { setResult(data); setState('ready') }
        else setState('error')
      })
      .catch(() => setState('error'))
  }, [sessionId, slug])

  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="w-8 h-8 border-4 border-[#C4B5FD] border-t-[#9B6FD4] rounded-full animate-spin" />
        <p className="font-nunito text-[#6B5A94] text-sm">Confirming your purchase…</p>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="text-center space-y-4 py-4">
        <p className="text-4xl">😔</p>
        <p className="font-fredoka font-semibold text-[#3D1F5C] text-xl">
          Something went wrong
        </p>
        <p className="font-nunito text-[#6B5A94] text-sm max-w-xs mx-auto">
          Your payment was successful but we couldn&apos;t load your download.
          We&apos;re on it — please email us and we&apos;ll sort it immediately.
        </p>
        <a
          href="mailto:hello@comecolorwith.me?subject=Download%20issue%20after%20purchase"
          className="inline-block font-nunito font-bold text-sm text-[#9B6FD4] hover:underline"
        >
          Contact support →
        </a>
      </div>
    )
  }

  const isPdf      = result!.filename.endsWith('.pdf')
  const fileLabel  = isPdf ? 'Coloring Page' : 'Artwork'

  async function handleDownload() {
    if (!result) return
    setDlLoading(true)
    try {
      const res     = await fetch(result.downloadUrl)
      const blob    = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a       = document.createElement('a')
      a.href        = blobUrl
      a.download    = result.filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
    } catch {
      window.open(result.downloadUrl, '_blank')
    } finally {
      setDlLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="text-center">
        <p className="text-5xl mb-3" aria-hidden="true">🎉</p>
        <h1 className="font-fredoka font-bold text-[#3D1F5C] text-2xl mb-1">
          Thank you for your purchase!
        </h1>
        <p className="font-nunito text-[#6B5A94] text-sm">
          Your {fileLabel.toLowerCase()} is ready to download.
        </p>
      </div>

      {/* ── Order card: thumbnail + title + order ref ── */}
      <div className="bg-[#F5F3FF] rounded-[16px] p-4 flex items-center gap-4">
        {/* Artwork thumbnail */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/assets/artwork/${result!.slug}-thumb.jpg`}
          alt=""
          width={64}
          height={64}
          className="w-16 h-16 rounded-[12px] object-cover flex-shrink-0 bg-[#EDE9FE]"
        />
        <div className="min-w-0 flex-1">
          <p className="font-fredoka font-semibold text-[#3D1F5C] text-base leading-snug">
            {result!.title}
          </p>
          <p className="font-nunito text-[#6B5A94] text-xs mt-0.5 font-mono tracking-wide">
            Order {result!.orderRef}
          </p>
        </div>
        <span className="flex-shrink-0 w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-sm font-bold">
          ✓
        </span>
      </div>

      {/* ── Download button ── */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleDownload}
          disabled={dlLoading}
          className="flex items-center justify-center gap-2 w-full px-8 py-4 rounded-[32px] bg-[#9B6FD4] hover:bg-[#7c56b0] disabled:opacity-60 disabled:cursor-wait text-white font-nunito font-bold text-base transition-colors shadow-sm"
        >
          {dlLoading
            ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
            : <>⬇&nbsp; Download {fileLabel}</>
          }
        </button>
        <p className="text-center font-nunito text-[#6B5A94] text-xs">
          Saved as <span className="font-mono">{result!.filename}</span>
          {' · '}
          <a href={result!.downloadUrl} className="underline">
            open in browser
          </a>
        </p>
      </div>

      {/* ── Account CTA ── */}
      {user ? (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-[14px] px-4 py-3">
          <span className="text-emerald-500 text-xl flex-shrink-0">✅</span>
          <p className="font-nunito text-emerald-800 text-sm">
            Saved to your account —{' '}
            <Link href="/account" className="font-bold underline underline-offset-2">
              re-download any time
            </Link>{' '}
            from My Account.
          </p>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-[14px] px-4 py-4 text-center space-y-2">
          <p className="font-nunito text-amber-800 text-sm">
            💡 <strong>Create a free account</strong> to re-download this any time — no need to repurchase.
          </p>
          <Link
            href={`/register`}
            className="inline-block px-5 py-2 rounded-[32px] bg-amber-500 hover:bg-amber-600 text-white font-nunito font-bold text-sm transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      )}

      {/* ── Divider ── */}
      <div className="border-t border-[#C4B5FD]/30" />

      {/* ── Tips ── */}
      <div className="space-y-4">
        <div>
          <p className="font-fredoka font-semibold text-[#3D1F5C] text-sm mb-2">
            🖨️ Printing tips
          </p>
          <ul className="font-nunito text-[#6B5A94] text-xs space-y-1.5 leading-relaxed">
            <li>→ Print on <strong>A4 or US Letter</strong> at <strong>100% scale</strong> — turn off any &ldquo;fit to page&rdquo; option</li>
            <li>→ <strong>160 g/m² card stock</strong> handles markers without bleed-through</li>
            <li>→ Any home printer works — colour and black &amp; white both look great</li>
          </ul>
        </div>
        <div>
          <p className="font-fredoka font-semibold text-[#3D1F5C] text-sm mb-2">
            🎨 Best coloring tools
          </p>
          <p className="font-nunito text-[#6B5A94] text-xs leading-relaxed">
            Crayons, coloured pencils, or washable markers all work beautifully.
            Amalia&apos;s personal favourite is <strong>markers</strong>!
          </p>
        </div>
        <div>
          <p className="font-fredoka font-semibold text-[#3D1F5C] text-sm mb-2">
            📸 Share your creation
          </p>
          <p className="font-nunito text-[#6B5A94] text-xs leading-relaxed">
            Finished coloring? We&apos;d love to see it!
            Share on Instagram and tag <strong>@comecolorwithme</strong> — Amalia checks personally.
          </p>
        </div>
      </div>

    </div>
  )
}

// ─── Print order success ───────────────────────────────────────────────────────

function PrintSuccess({ slug }: { slug: string }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-5xl mb-3" aria-hidden="true">🖼️</p>
        <h1 className="font-fredoka font-bold text-[#3D1F5C] text-2xl mb-1">
          Order placed!
        </h1>
        <p className="font-nunito text-[#6B5A94] text-sm max-w-xs mx-auto">
          Your museum-quality print is being prepared. You&apos;ll receive a shipping
          confirmation with tracking by email.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { icon: '✅', label: 'Order confirmed' },
          { icon: '🖨️', label: 'Printing started' },
          { icon: '🚚', label: 'Ships in 3–5 days' },
        ].map(({ icon, label }) => (
          <div key={label} className="bg-[#F5F3FF] rounded-[14px] p-4 flex flex-col items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <span className="font-nunito text-[#6B5A94] text-xs leading-snug">{label}</span>
          </div>
        ))}
      </div>

      <p className="font-nunito text-[#6B5A94] text-xs text-center">
        Questions? Email{' '}
        <a href="mailto:hello@comecolorwith.me" className="underline text-[#9B6FD4]">
          hello@comecolorwith.me
        </a>
      </p>
    </div>
  )
}

// ─── Page shell ───────────────────────────────────────────────────────────────

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

        {/* Footer nav */}
        <div className="mt-8 pt-6 border-t border-[#C4B5FD]/20 flex flex-wrap justify-center gap-4 text-sm font-nunito text-[#6B5A94]">
          <Link href="/coloring-pages" className="hover:text-[#9B6FD4] transition-colors">
            More Coloring Pages
          </Link>
          <Link href="/shop" className="hover:text-[#9B6FD4] transition-colors">
            Shop Art Prints
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
