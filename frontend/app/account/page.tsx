'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { createBrowserClient } from '@/lib/auth'

// ─── Unauthenticated state ────────────────────────────────────────────────────

function SignedOut() {
  return (
    <main className="min-h-screen bg-[#FFF6F9] flex flex-col items-center justify-center text-center px-4 py-20">
      <p className="text-6xl mb-6" aria-hidden="true">🎨</p>
      <h1 className="font-fredoka font-bold text-3xl text-[#9B6FD4] mb-3">
        My Account
      </h1>
      <p className="font-nunito text-[#8B7BA8] max-w-sm mb-8 leading-relaxed text-[1rem]">
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
}

function DownloadHistory() {
  const [downloads, setDownloads] = useState<DownloadRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient()
    supabase
      .from('downloads')
      .select('id, artwork_slug, artwork_title, downloaded_at')
      .order('downloaded_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setDownloads(data ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="bg-white rounded-[20px] p-8 shadow-sm border border-[#C4B5FD]/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-fredoka font-bold text-xl text-[#3D1F5C]">
          Download History
        </h2>
        <span className="font-nunito text-xs text-[#8B7BA8] bg-[#F5F3FF] border border-[#C4B5FD]/30 px-3 py-1 rounded-full">
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
          <p className="font-nunito text-[#8B7BA8] text-sm leading-relaxed max-w-xs mx-auto mb-6">
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
            <li key={d.id} className="flex items-center justify-between py-3 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl flex-shrink-0" aria-hidden="true">🖍️</span>
                <div className="min-w-0">
                  <p className="font-nunito font-semibold text-[#3D1F5C] text-sm truncate">
                    {d.artwork_title}
                  </p>
                  <p className="font-nunito text-[#8B7BA8] text-xs">
                    {new Date(d.downloaded_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <Link
                href={`/artwork/${d.artwork_slug}`}
                className="flex-shrink-0 font-nunito font-bold text-xs text-[#9B6FD4] hover:text-[#7c56b0] transition-colors"
              >
                View →
              </Link>
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
        <span className="font-nunito text-xs text-[#8B7BA8] bg-[#F5F3FF] border border-[#C4B5FD]/30 px-3 py-1 rounded-full">
          0 orders
        </span>
      </div>

      {/* Empty state */}
      <div className="text-center py-10">
        <p className="text-5xl mb-4" aria-hidden="true">🖼️</p>
        <p className="font-fredoka font-semibold text-[#3D1F5C] text-lg mb-2">
          No orders yet
        </p>
        <p className="font-nunito text-[#8B7BA8] text-sm leading-relaxed max-w-xs mx-auto mb-6">
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

// ─── Main signed-in dashboard ─────────────────────────────────────────────────

function Dashboard({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const [downloadCount, setDownloadCount] = useState<number | null>(null)

  useEffect(() => {
    const supabase = createBrowserClient()
    supabase
      .from('downloads')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => setDownloadCount(count ?? 0))
  }, [])

  const displayName = email.split('@')[0] ?? 'there'
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1)

  return (
    <main className="min-h-screen bg-[#FFF6F9]">

      {/* Page header */}
      <section className="bg-gradient-to-br from-[#9B6FD4]/10 to-[#F472B6]/8 border-b border-[#C4B5FD]/20 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="font-nunito text-[#8B7BA8] text-sm mb-1">Welcome back,</p>
          <h1 className="font-fredoka font-bold text-[#3D1F5C] text-3xl md:text-4xl mb-1">
            {formattedName} 👋
          </h1>
          <p className="font-nunito text-[#8B7BA8] text-sm">{email}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

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
              <p className="font-nunito text-[#8B7BA8] text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Download history */}
        <DownloadHistory />

        {/* Order history */}
        <OrderHistory />

        {/* Account settings strip */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-[#C4B5FD]/20 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-fredoka font-semibold text-[#3D1F5C]">Account</p>
            <p className="font-nunito text-[#8B7BA8] text-sm">{email}</p>
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

// ─── Page entry point ─────────────────────────────────────────────────────────

export default function AccountPage() {
  const { user, loading, signOut } = useAuth()

  if (loading) return <Loading />
  if (!user)   return <SignedOut />

  return (
    <Dashboard
      email={user.email ?? ''}
      onSignOut={() => void signOut()}
    />
  )
}
