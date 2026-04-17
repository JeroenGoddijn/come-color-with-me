'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FlagGate } from '@/components/ui/FlagGate'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const year = new Date().getFullYear()

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    // Newsletter integration: wired in Sprint 2 once provider is confirmed
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer role="contentinfo" className="bg-[#3D1F5C] text-white/75 pt-16 pb-8">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <p className="font-['Bubblegum_Sans'] text-[1.3rem] text-white mb-3">
              Come Color With Me 🎨
            </p>
            <p className="text-sm leading-relaxed max-w-[240px]">
              Original artwork by a real 8-year-old artist.
              Free coloring pages and premium prints for kids who love to color.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-fredoka font-bold text-sm text-white uppercase tracking-[0.08em] mb-4">
              Quick Links
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/gallery" className="hover:text-[#F472B6] transition-colors">Gallery</Link></li>
              <li><Link href="/coloring-pages" className="hover:text-[#F472B6] transition-colors">Free Coloring Pages</Link></li>
              <li><Link href="/shop" className="hover:text-[#F472B6] transition-colors">Shop Prints</Link></li>
              <li><Link href="/about" className="hover:text-[#F472B6] transition-colors">About Amalia</Link></li>
              <li><Link href="/club" className="hover:text-[#F472B6] transition-colors">Coloring Club</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="font-fredoka font-bold text-sm text-white uppercase tracking-[0.08em] mb-4">
              Legal
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/privacy" className="hover:text-[#F472B6] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#F472B6] transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-[#F472B6] transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <FlagGate flag="ENABLE_NEWSLETTER">
            <div>
              <p className="font-fredoka font-bold text-sm text-white uppercase tracking-[0.08em] mb-4">
                Stay in the Loop
              </p>
              {subscribed ? (
                <p className="text-sm text-[#6EE7B7]">Thanks! You&apos;re on the list 🎉</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                  <p className="text-sm leading-relaxed">
                    New drawings every week! Get notified when Amalia adds something new.
                  </p>
                  <div className="flex gap-2">
                    <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                    <input
                      type="email"
                      id="newsletter-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[#C4B5FD]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#F472B6] hover:bg-[#EC4899] text-white font-nunito font-bold text-sm rounded-lg transition-colors whitespace-nowrap"
                    >
                      Join
                    </button>
                  </div>
                </form>
              )}
            </div>
          </FlagGate>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-white/10 text-[0.8125rem]">
          <span>© {year} Come Color With Me. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#F472B6] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#F472B6] transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-[#F472B6] transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
