'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createBrowserClient } from '@/lib/auth'

// ─── Email confirmed banner ───────────────────────────────────────────────────

function ConfirmedBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      role="status"
      className="bg-emerald-50 border border-emerald-200 rounded-[16px] px-5 py-4 flex items-start gap-3"
    >
      <span className="text-2xl flex-shrink-0" aria-hidden="true">✅</span>
      <div className="flex-1 min-w-0">
        <p className="font-fredoka font-semibold text-emerald-800 text-base leading-snug">
          Email confirmed — welcome to the family!
        </p>
        <p className="font-nunito text-emerald-700 text-sm mt-0.5">
          Your account is active. Browse the gallery, grab a free coloring page, or pick up a premium print.
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="flex-shrink-0 text-emerald-500 hover:text-emerald-700 transition-colors text-lg leading-none mt-0.5"
      >
        ×
      </button>
    </div>
  )
}

// ─── Unauthenticated state ────────────────────────────────────────────────────

function SignedOut() {
  return (
    <main className="min-h-screen bg-[#FFF6F9] flex flex-col items-center justify-center text-center px-4 py-20">
      <p className="text-6xl mb-6" aria-hidden="true">🎨</p>
      <h1 className="font-fredoka font-bold text-3xl text-[#9B6FD4] mb-3">
        My Account
      </h1>
      <p className="font-nunito text-[#6B5A94] max-w-sm mb-8 leading-relaxed text-[1rem]">
        Log in to see your download history, saved artwork, and order details.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/login"
          className="px-8 py-3 rounded-[32px] bg-[#9B6FD4] hover:bg-[#7c56b0] text-white font-nunito font-bold text-sm transition-colors shadow-sm"
        >
          Log In
        </Link>
        <Link
          href="/register"
          className="px-8 py-3 rounded-[32px] border-2 border-[#C4B5FD] hover:bg-[#C4B5FD]/10 text-[#9B6FD4] font-nunito font-bold text-sm transition-colors"
        >
          Create Account
        </Link>
      </div>
    </main>
  )
}

// ─── Loading spinner ──────────────────────────────────────────────────────────

function Loading() {
  return (
    <main className="min-h-screen bg-[#FFF6F9] flex items-center justify-center">
      <div className="w-9 h-9 border-4 border-[#C4B5FD] border-t-[#9B6FD4] rounded-full animate-spin" />
    </main>
  )
}

// ─── Download history ──────────────────────────────────────────────────────────

type DownloadRecord = {
  id: string
  artwork_slug: string
  artwork_title: string
  downloaded_at: string
  stripe_session_id: string
}

function DownloadHistory() {
  const [downloads, setDownloads] = useState<DownloadRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<Set<string>>(new Set())

  useEffect(() => {
    const supabase = createBrowserClient()
    supabase
      .from('downloads')
      .select('id, artwork_slug, artwork_title, downloaded_at, stripe_session_id')
      .order('downloaded_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setDownloads(data ?? [])
        setLoading(false)
      })
  }, [])

  async function handleRedownload(record: DownloadRecord) {
    setDownloading((prev) => new Set(prev).add(record.id))
    try {
      const res  = await fetch(`/api/downloads/redownload?id=${encodeURIComponent(record.id)}`)
      const data = await res.json() as { downloadUrl?: string; filename?: string; error?: string }
      if (!data.downloadUrl) throw new Error(data.error ?? 'No download URL')
      // Fetch as blob so browser respects the filename regardless of the URL path
      const fileRes = await fetch(data.downloadUrl)
      const blob    = await fileRes.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a       = document.createElement('a')
      a.href        = blobUrl
      a.download    = data.filename ?? `Come Color With Me - ${record.artwork_title}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
    } catch (err) {
      console.error('Re-download failed:', err)
      alert('Download failed — please try again or contact hello@comecolorwith.me')
    } finally {
      setDownloading((prev) => {
        const next = new Set(prev)
        next.delete(record.id)
        return next
      })
    }
  }

  // Order ref matches the success page: last 8 chars of Stripe session ID
  function orderRef(record: DownloadRecord) {
    const sid = record.stripe_session_id
    return '#' + sid.replace(/^cs_(test|live)_/, '').slice(-8).toUpperCase()
  }

  return (
    <div className="bg-white rounded-[20px] p-8 shadow-sm border border-[#C4B5FD]/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-fredoka font-bold text-xl text-[#3D1F5C]">
          Download History
        </h2>
        <span className="font-nunito text-xs text-[#6B5A94] bg-[#F5F3FF] border border-[#C4B5FD]/30 px-3 py-1 rounded-full">
          {loading ? '…' : `${downloads.length} download${downloads.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-7 h-7 border-4 border-[#C4B5FD] border-t-[#9B6FD4] rounded-full animate-spin" />
        </div>
      ) : downloads.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-5xl mb-4" aria-hidden="true">🖍️</p>
          <p className="font-fredoka font-semibold text-[#3D1F5C] text-lg mb-2">
            No downloads yet
          </p>
          <p className="font-nunito text-[#6B5A94] text-sm leading-relaxed max-w-xs mx-auto mb-6">
            Every coloring page you download will appear here so you can
            find and re-download them any time.
          </p>
          <Link
            href="/coloring-pages"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[32px] bg-[#9B6FD4] hover:bg-[#7c56b0] text-white font-nunito font-bold text-sm transition-colors"
          >
            Browse Free Coloring Pages
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-[#C4B5FD]/20">
          {downloads.map((d) => (
            <li key={d.id} className="flex items-center gap-3 py-4">
              {/* Artwork thumbnail */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/assets/artwork/${d.artwork_slug}-thumb.jpg`}
                alt=""
                width={52}
                height={52}
                className="w-[52px] h-[52px] rounded-[10px] object-cover flex-shrink-0 bg-[#F5F3FF]"
              />

              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <p className="font-nunito font-semibold text-[#3D1F5C] text-sm truncate">
                  {d.artwork_title}
                </p>
                <p className="font-nunito text-[#6B5A94] text-xs mt-0.5">
                  {new Date(d.downloaded_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                  {' · '}
                  <span className="font-mono tracking-wide">{orderRef(d)}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  disabled={downloading.has(d.id)}
                  onClick={() => handleRedownload(d)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#9B6FD4] hover:bg-[#7c56b0] text-white font-nunito font-bold text-xs transition-colors disabled:opacity-50 disabled:cursor-wait"
                >
                  {downloading.has(d.id)
                    ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                    : '⬇'}
                  {downloading.has(d.id) ? 'Saving…' : 'Download'}
                </button>
                <Link
                  href={`/artwork/${d.artwork_slug}`}
                  className="font-nunito font-bold text-xs text-[#9B6FD4] hover:text-[#7c56b0] transition-colors whitespace-nowrap"
                >
                  View →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Order history empty state ────────────────────────────────────────────────

function OrderHistory() {
  return (
    <div className="bg-white rounded-[20px] p-8 shadow-sm border border-[#C4B5FD]/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-fredoka font-bold text-xl text-[#3D1F5C]">
          Print Orders
        </h2>
        <span className="font-nunito text-xs text-[#6B5A94] bg-[#F5F3FF] border border-[#C4B5FD]/30 px-3 py-1 rounded-full">
          0 orders
        </span>
      </div>

      <div className="text-center py-10">
        <p className="text-5xl mb-4" aria-hidden="true">🖼️</p>
        <p className="font-fredoka font-semibold text-[#3D1F5C] text-lg mb-2">
          No orders yet
        </p>
        <p className="font-nunito text-[#6B5A94] text-sm leading-relaxed max-w-xs mx-auto mb-6">
          When you order a premium art print, your order details and
          tracking information will show up here.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[32px] border-2 border-[#C4B5FD] hover:bg-[#C4B5FD]/10 text-[#9B6FD4] font-nunito font-bold text-sm transition-colors"
        >
          Browse Art Prints
        </Link>
      </div>
    </div>
  )
}

// ─── Onboarding guide for new users with zero downloads ──────────────────────

function OnboardingGuide() {
  const steps = [
    {
      icon: '🖍️',
      title: 'Grab a free coloring page',
      body: 'All of Amalia\'s coloring pages are free to download and print at home.',
      href: '/coloring-pages',
      cta: 'Browse Coloring Pages',
    },
    {
      icon: '🖼️',
      title: 'Shop premium art prints',
      body: 'Museum-quality prints shipped to your door — perfect for a kids\' bedroom.',
      href: '/shop',
      cta: 'See the Shop',
    },
    {
      icon: '🎨',
      title: 'Explore the full gallery',
      body: 'See all of Amalia\'s artwork in one place and find your favourites.',
      href: '/gallery',
      cta: 'Open Gallery',
    },
  ]

  return (
    <div className="bg-gradient-to-br from-[#9B6FD4]/5 to-[#F472B6]/5 rounded-[20px] p-8 border border-[#C4B5FD]/20">
      <h2 className="font-fredoka font-bold text-xl text-[#3D1F5C] mb-1">
        Get started
      </h2>
      <p className="font-nunito text-[#6B5A94] text-sm mb-6">
        Here&apos;s what you can do on Come Color With Me.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {steps.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group bg-white rounded-[16px] p-5 border border-[#C4B5FD]/20 shadow-sm hover:shadow-md hover:border-[#9B6FD4]/30 transition-all flex flex-col gap-3"
          >
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="font-fredoka font-semibold text-[#3D1F5C] text-base leading-snug mb-1">
                {s.title}
              </p>
              <p className="font-nunito text-[#6B5A94] text-xs leading-relaxed">
                {s.body}
              </p>
            </div>
            <span className="font-nunito font-bold text-xs text-[#9B6FD4] group-hover:text-[#F472B6] transition-colors mt-auto">
              {s.cta} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ─── Main signed-in dashboard ─────────────────────────────────────────────────

function Dashboard({
  email,
  onSignOut,
  showConfirmed,
}: {
  email: string
  onSignOut: () => void
  showConfirmed: boolean
}) {
  const router = useRouter()
  const [confirmed, setConfirmed] = useState(showConfirmed)
  const [downloadCount, setDownloadCount] = useState<number | null>(null)

  useEffect(() => {
    const supabase = createBrowserClient()
    supabase
      .from('downloads')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => setDownloadCount(count ?? 0))
  }, [])

  function dismissConfirmed() {
    setConfirmed(false)
    // Remove the query param so a refresh doesn't re-show the banner
    router.replace('/account', { scroll: false })
  }

  const displayName = email.split('@')[0] ?? 'there'
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1)
  const isNewUser = downloadCount === 0

  return (
    <main className="min-h-screen bg-[#FFF6F9]">

      {/* Page header */}
      <section className="bg-gradient-to-br from-[#9B6FD4]/10 to-[#F472B6]/8 border-b border-[#C4B5FD]/20 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="font-nunito text-[#6B5A94] text-sm mb-1">Welcome back,</p>
          <h1 className="font-fredoka font-bold text-[#3D1F5C] text-3xl md:text-4xl mb-1">
            {formattedName} 👋
          </h1>
          <p className="font-nunito text-[#6B5A94] text-sm">{email}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        {/* Email confirmed banner */}
        {confirmed && <ConfirmedBanner onDismiss={dismissConfirmed} />}

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: '⬇️', value: downloadCount === null ? '…' : String(downloadCount), label: 'Downloads' },
            { icon: '🖼️', value: '0', label: 'Orders' },
            { icon: '🎨', value: '0', label: 'Favourites' },
          ].map(({ icon, value, label }) => (
            <div
              key={label}
              className="bg-white rounded-[20px] p-5 text-center shadow-sm border border-[#C4B5FD]/20"
            >
              <p className="text-2xl mb-1" aria-hidden="true">{icon}</p>
              <p className="font-fredoka font-bold text-[#3D1F5C] text-2xl leading-none mb-0.5">{value}</p>
              <p className="font-nunito text-[#6B5A94] text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Onboarding guide for new users, download history for returning users */}
        {isNewUser && downloadCount !== null ? (
          <>
            <OnboardingGuide />
            <DownloadHistory />
          </>
        ) : (
          <DownloadHistory />
        )}

        {/* Order history */}
        <OrderHistory />

        {/* Account settings strip */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-[#C4B5FD]/20 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-fredoka font-semibold text-[#3D1F5C]">Account</p>
            <p className="font-nunito text-[#6B5A94] text-sm">{email}</p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="px-5 py-2 rounded-[32px] border-2 border-[#C4B5FD] hover:bg-[#C4B5FD]/10 text-[#9B6FD4] font-nunito font-bold text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>

      </div>
    </main>
  )
}

// ─── Inner component that reads search params ─────────────────────────────────

function AccountInner() {
  const { user, loading, signOut } = useAuth()
  const searchParams = useSearchParams()
  const showConfirmed = searchParams.get('confirmed') === 'true'

  if (loading) return <Loading />
  if (!user)   return <SignedOut />

  return (
    <Dashboard
      email={user.email ?? ''}
      onSignOut={() => void signOut()}
      showConfirmed={showConfirmed}
    />
  )
}

// ─── Page entry point ─────────────────────────────────────────────────────────

export default function AccountPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AccountInner />
    </Suspense>
  )
}
