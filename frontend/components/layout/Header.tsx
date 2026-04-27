'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

const NAV_LINKS = [
  { href: '/gallery', label: 'Gallery' },
  { href: '/coloring-pages', label: 'Coloring Pages' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/account', label: 'My Account' },
] as const

const DRAWER_LINKS = [
  { href: '/gallery', label: 'Gallery', icon: '🖼️' },
  { href: '/coloring-pages', label: 'Coloring Pages', icon: '🖍️' },
  { href: '/shop', label: 'Shop', icon: '🛍️' },
  { href: '/about', label: 'About Amalia', icon: '💜' },
  { href: '/account', label: 'My Account', icon: '👤' },
] as const

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user, signOut } = useAuth()

  function closeDrawer() {
    setDrawerOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 h-[72px] bg-[rgba(255,246,249,0.92)] backdrop-blur-md border-b border-[#C4B5FD]/30">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" aria-label="Come Color With Me – home" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/assets/brand/logo-icon.svg"
              alt=""
              width={44}
              height={44}
              priority
            />
            <span className="font-['Bubblegum_Sans'] text-[1.2rem] text-[#9B6FD4] leading-tight hidden sm:block">
              Come Color<span className="text-[#F472B6] block">With Me™</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-nunito font-semibold text-[0.9375rem] text-[#9B6FD4] px-3 py-2 rounded-lg transition-colors hover:text-[#F472B6] hover:bg-[#F472B6]/08 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9B6FD4] focus-visible:ring-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <button
                type="button"
                onClick={() => signOut()}
                className="font-nunito font-bold text-sm text-[#9B6FD4] border-2 border-[#C4B5FD] rounded-full px-5 py-2 transition-all hover:bg-[#C4B5FD] hover:text-[#3D1F5C]"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="font-nunito font-bold text-sm text-[#9B6FD4] border-2 border-[#C4B5FD] rounded-full px-5 py-2 transition-all hover:bg-[#C4B5FD] hover:text-[#3D1F5C]"
              >
                Log In
              </Link>
            )}
          </div>

          {/* Hamburger */}
          <button
            type="button"
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-[#C4B5FD]/20 transition-colors"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            onClick={() => setDrawerOpen(true)}
          >
            <span className="block w-6 h-0.5 bg-[#9B6FD4] rounded" />
            <span className="block w-6 h-0.5 bg-[#9B6FD4] rounded" />
            <span className="block w-4 h-0.5 bg-[#9B6FD4] rounded self-start ml-1" />
          </button>
        </div>
      </header>

      {/* Drawer overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[200] bg-black/40 transition-opacity duration-300 lg:hidden',
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden={!drawerOpen}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <nav
        id="mobile-drawer"
        className={cn(
          'fixed top-0 right-0 z-[201] h-full w-[300px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden',
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Mobile navigation"
        aria-hidden={!drawerOpen}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between p-5 border-b border-[#C4B5FD]/30">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/brand/logo-icon.svg"
              alt=""
              width={40}
              height={40}
            />
            <div>
              <p className="font-['Bubblegum_Sans'] text-[#9B6FD4] text-base leading-tight">Hi there!</p>
              <span className="text-[#8B7BA8] text-xs font-nunito">Amalia&apos;s Art Studio</span>
            </div>
          </div>
          <button
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#8B7BA8] hover:bg-[#F472B6]/12 hover:text-[#F472B6] transition-colors"
            aria-label="Close menu"
            onClick={closeDrawer}
          >
            ✕
          </button>
        </div>

        {/* Drawer nav links */}
        <div className="flex-1 overflow-y-auto py-4">
          {DRAWER_LINKS.slice(0, 4).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeDrawer}
              className="flex items-center gap-3 px-5 py-3.5 font-nunito font-semibold text-[#3D1F5C] hover:bg-[#9B6FD4]/08 hover:text-[#9B6FD4] transition-colors"
            >
              <span className="text-xl w-7 text-center">{link.icon}</span>
              {link.label}
            </Link>
          ))}

          <div className="my-3 mx-5 h-px bg-[#C4B5FD]/30" />

          <Link
            href="/account"
            onClick={closeDrawer}
            className="flex items-center gap-3 px-5 py-3.5 font-nunito font-semibold text-[#3D1F5C] hover:bg-[#9B6FD4]/08 hover:text-[#9B6FD4] transition-colors"
          >
            <span className="text-xl w-7 text-center">👤</span>
            My Account
          </Link>
        </div>

        {/* Drawer footer */}
        <div className="p-5 border-t border-[#C4B5FD]/30">
          {user ? (
            <button
              type="button"
              onClick={() => { signOut(); closeDrawer() }}
              className="w-full font-nunito font-bold text-white bg-[#9B6FD4] hover:bg-[#8B5CF6] rounded-full py-3 transition-all"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={closeDrawer}
              className="block w-full font-nunito font-bold text-center text-white bg-[#9B6FD4] hover:bg-[#8B5CF6] rounded-full py-3 transition-all"
            >
              Log In
            </Link>
          )}
        </div>
      </nav>
    </>
  )
}
