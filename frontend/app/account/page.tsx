'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

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

// ─── Download history empty state ─────────────────────────────────────────────

function DownloadHistory() {
  return (
    <div className="bg-white rounded-[20px] p-8 shadow-sm border border-[#C4B5FD]/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-fredoka font-bold text-xl text-[#3D1F5C]">
          Download History
        </h2>
        <span className="font-nunito text-xs text-[#8B7BA8] bg-[#F5F3FF] border border-[#C4B5FD]/30 px-3 py-1 rounded-full">
          0 downloads
        </span>
      </div>

      {/* Empty state */}
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
  // Derive display name from email prefix
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
            { icon: '⬇️', value: '0', label: 'Downloads' },
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
