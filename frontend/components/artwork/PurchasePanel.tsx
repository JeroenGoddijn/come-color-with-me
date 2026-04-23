'use client'

import { useState } from 'react'

type PrintSize   = '8x10' | '11x14' | '16x20'
type CardVariant = '4x6' | '4x6-10pack'

const SIZES: { key: PrintSize; label: string; price: string }[] = [
  { key: '8x10',  label: '8×10″',  price: '$19.99' },
  { key: '11x14', label: '11×14″', price: '$24.99' },
  { key: '16x20', label: '16×20″', price: '$34.99' },
]

const CARD_OPTIONS: { key: CardVariant; label: string; desc: string; price: string }[] = [
  { key: '4x6',        label: 'Single Postcard',   desc: '4×6″ · 1 card',   price: '$4.99' },
  { key: '4x6-10pack', label: '10-Pack Postcards',  desc: '4×6″ · 10 cards', price: '$34.99' },
]

interface Props {
  slug:        string
  title:       string
  isFree:      boolean
  isPremium:   boolean
  downloadUrl: string | null
  category?:   string
}

export function PurchasePanel({ slug, title, isFree, isPremium, downloadUrl, category }: Props) {
  const isCard = category === 'cards'

  const [selectedSize,    setSelectedSize]    = useState<PrintSize>('8x10')
  const [selectedVariant, setSelectedVariant] = useState<CardVariant>('4x6')
  const [digitalLoading,  setDigitalLoading]  = useState(false)
  const [printLoading,    setPrintLoading]    = useState(false)
  const [cardLoading,     setCardLoading]     = useState(false)
  const [error, setError] = useState('')

  async function handleDigitalCheckout() {
    setError('')
    setDigitalLoading(true)
    try {
      const res  = await fetch('/api/checkout/digital', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ slug, title }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setDigitalLoading(false)
    }
  }

  async function handlePrintCheckout() {
    setError('')
    setPrintLoading(true)
    try {
      const res  = await fetch('/api/checkout/print', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ slug, title, size: selectedSize }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setPrintLoading(false)
    }
  }

  async function handleCardCheckout() {
    setError('')
    setCardLoading(true)
    try {
      const res  = await fetch('/api/checkout/card', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ slug, title, variant: selectedVariant }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setCardLoading(false)
    }
  }

  const selectedSizeInfo    = SIZES.find((s) => s.key === selectedSize)!
  const selectedVariantInfo = CARD_OPTIONS.find((c) => c.key === selectedVariant)!

  return (
    <div className="flex flex-col gap-4">

      {/* ── FREE: direct download ─────────────────────────────────── */}
      {isFree && downloadUrl && (
        <div className="rounded-[20px] border border-emerald-100 bg-emerald-50 p-6 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">📥</span>
            <div>
              <p className="font-fredoka font-semibold text-[#3D1F5C] text-lg">Free Download</p>
              <p className="font-nunito text-sm text-[#3D1F5C]/70">
                Printable PDF · Print at home or at a print shop
              </p>
            </div>
          </div>
          <a
            href={downloadUrl}
            download
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-[32px] bg-emerald-500 hover:bg-emerald-600 text-white font-nunito font-bold text-base transition-colors shadow-sm"
          >
            ⬇ Download Free — No account needed
          </a>
        </div>
      )}

      {/* ── CARD: postcard ordering (always shown for card category) ─ */}
      {isCard && (
        <div className="rounded-[20px] border border-[#F472B6]/30 bg-white p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden="true">💌</span>
              <div>
                <p className="font-fredoka font-semibold text-[#3D1F5C] text-lg">Printed Postcards</p>
                <p className="font-nunito text-sm text-[#3D1F5C]/70">
                  Premium card stock by Gelato · Ships in 3–5 days
                </p>
              </div>
            </div>
            <span className="font-fredoka font-bold text-[#F472B6] text-xl whitespace-nowrap">
              {selectedVariantInfo.price}
            </span>
          </div>

          {/* Variant selector */}
          <div className="flex gap-2">
            {CARD_OPTIONS.map(({ key, label, desc }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedVariant(key)}
                className={[
                  'flex-1 py-2.5 px-3 rounded-xl border-2 font-nunito font-semibold text-sm transition-colors text-center',
                  selectedVariant === key
                    ? 'border-[#9B6FD4] bg-[#C4B5FD]/15 text-[#9B6FD4]'
                    : 'border-[#C4B5FD] text-[#9B6FD4] hover:bg-[#C4B5FD]/10',
                ].join(' ')}
              >
                <span className="block">{label}</span>
                <span className="block text-[10px] font-normal opacity-70">{desc}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCardCheckout}
            disabled={cardLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-[32px] bg-gradient-to-br from-[#9B6FD4] to-[#F472B6] hover:opacity-90 text-white font-nunito font-bold text-base transition-opacity shadow-sm disabled:opacity-60"
          >
            {cardLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Redirecting…
              </>
            ) : '💌 Order Postcards'}
          </button>
        </div>
      )}

      {/* ── PREMIUM: two purchase paths (non-card artwork only) ──── */}
      {isPremium && !isCard && (
        <>
          {/* Path 1 — Digital PDF */}
          <div className="rounded-[20px] border border-[#C4B5FD]/40 bg-white p-6 flex flex-col gap-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">📥</span>
                <div>
                  <p className="font-fredoka font-semibold text-[#3D1F5C] text-lg">Digital Download</p>
                  <p className="font-nunito text-sm text-[#3D1F5C]/70">
                    High-res PDF · 300 DPI · Instant delivery
                  </p>
                </div>
              </div>
              <span className="font-fredoka font-bold text-[#9B6FD4] text-xl whitespace-nowrap">$2.99</span>
            </div>
            <button
              type="button"
              onClick={handleDigitalCheckout}
              disabled={digitalLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-[32px] bg-[#9B6FD4] hover:bg-[#7c56b0] text-white font-nunito font-bold text-base transition-colors shadow-sm disabled:opacity-60"
            >
              {digitalLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Redirecting…
                </>
              ) : '📥 Download Now'}
            </button>
          </div>

          {/* Path 2 — Physical print */}
          <div className="rounded-[20px] border border-[#F472B6]/30 bg-white p-6 flex flex-col gap-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">🖼</span>
                <div>
                  <p className="font-fredoka font-semibold text-[#3D1F5C] text-lg">Museum-Quality Print</p>
                  <p className="font-nunito text-sm text-[#3D1F5C]/70">
                    Printed locally by Gelato · Ships in 3–5 days
                  </p>
                </div>
              </div>
              <span className="font-fredoka font-bold text-[#F472B6] text-xl whitespace-nowrap">
                {selectedSizeInfo.price}
              </span>
            </div>

            {/* Size selector */}
            <div className="flex gap-2">
              {SIZES.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedSize(key)}
                  className={[
                    'flex-1 py-2 px-3 rounded-xl border-2 font-nunito font-semibold text-sm transition-colors',
                    selectedSize === key
                      ? 'border-[#9B6FD4] bg-[#C4B5FD]/15 text-[#9B6FD4]'
                      : 'border-[#C4B5FD] text-[#9B6FD4] hover:bg-[#C4B5FD]/10',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handlePrintCheckout}
              disabled={printLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-[32px] bg-gradient-to-br from-[#9B6FD4] to-[#F472B6] hover:opacity-90 text-white font-nunito font-bold text-base transition-opacity shadow-sm disabled:opacity-60"
            >
              {printLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Redirecting…
                </>
              ) : '🖼 Order Print'}
            </button>
          </div>
        </>
      )}

      {/* Error message */}
      {error && (
        <p className="font-nunito text-sm text-red-500 text-center" role="alert">{error}</p>
      )}

      {/* Trust badges */}
      <div className="grid grid-cols-2 gap-3 text-sm font-nunito">
        <div className="flex items-center gap-2 text-[#3D1F5C]/70">
          <span>🏠</span> Print at home or shop
        </div>
        <div className="flex items-center gap-2 text-[#3D1F5C]/70">
          <span>📐</span> 300 DPI high-res
        </div>
        <div className="flex items-center gap-2 text-[#3D1F5C]/70">
          <span>📜</span> Personal use license
        </div>
        <div className="flex items-center gap-2 text-[#3D1F5C]/70">
          <span>🌱</span> Carbon neutral print
        </div>
      </div>

    </div>
  )
}
