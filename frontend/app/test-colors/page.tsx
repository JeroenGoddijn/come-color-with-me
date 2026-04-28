// TEMPORARY — internal colour review only. Delete after client decision.

const PALETTES = [
  {
    id: 'current',
    label: 'Current (failing WCAG AA)',
    purple: '#8B51D6',
    pink: '#DC186D',
    lavender: '#C4B5FD',
    purpleRatio: '3.52:1 ⚠️',
    pinkRatio: '2.50:1 ❌',
  },
  {
    id: 'minimum',
    label: 'Minimum compliant — lightest possible',
    purple: '#8B51D6',
    pink: '#DC186D',
    lavender: '#C4B5FD',
    purpleRatio: '4.66:1 ✅',
    pinkRatio: '4.51:1 ✅',
    note: 'Absolute lightest shades that still pass AA 4.5:1. Purple is very close to current; pink jumps further (pink has much less headroom in its hue).',
  },
  {
    id: 'option-a',
    label: 'Option A — comfortable margin',
    purple: '#7B35C2',
    pink: '#D6186A',
    lavender: '#C4B5FD',
    purpleRatio: '6.33:1 ✅',
    pinkRatio: '4.72:1 ✅',
    note: 'Originally preferred. Noticeably darker purple than minimum; pink nearly identical to minimum (only 1 step).',
  },
  {
    id: 'option-b',
    label: 'Option B — deep / conservative',
    purple: '#6B21A8',
    pink: '#BE185D',
    lavender: '#C4B5FD',
    purpleRatio: '8.22:1 ✅',
    pinkRatio: '5.69:1 ✅',
    note: 'Highest contrast. Feels notably darker than current brand.',
  },
] as const

type Palette = typeof PALETTES[number]

function Swatch({ label, hex, ratio }: { label: string; hex: string; ratio: string }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-lg border border-black/10 flex-shrink-0" style={{ backgroundColor: hex }} />
      <div>
        <p className="font-mono text-xs text-gray-500">{hex}</p>
        <p className="text-xs text-gray-700">{label} <span className="font-mono">{ratio}</span></p>
      </div>
    </div>
  )
}

function PaletteColumn({ p }: { p: Palette }) {
  const bg = '#FFF6F9'
  return (
    <div className="flex-1 min-w-0 border border-gray-200 rounded-2xl overflow-hidden">
      {/* Column header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <p className="font-bold text-sm text-gray-800">{p.label}</p>
        {'note' in p && p.note && (
          <p className="text-xs text-gray-500 mt-0.5">{p.note}</p>
        )}
      </div>

      <div className="p-5 space-y-8" style={{ backgroundColor: bg }}>

        {/* Swatches */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">Palette</p>
          <Swatch label="Purple" hex={p.purple} ratio={p.purpleRatio} />
          <Swatch label="Pink" hex={p.pink} ratio={p.pinkRatio} />
          <Swatch label="Lavender (unchanged)" hex={p.lavender} ratio="1.74:1 decorative only" />
        </div>

        {/* Header nav links */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">Desktop nav links</p>
          <nav className="flex gap-4 flex-wrap">
            {['Gallery', 'Coloring Pages', 'Shop', 'About'].map(l => (
              <span
                key={l}
                className="font-nunito font-semibold text-[0.9375rem] px-3 py-2 rounded-lg"
                style={{ color: p.purple, backgroundColor: bg }}
              >
                {l}
              </span>
            ))}
          </nav>
        </div>

        {/* Logo wordmark */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">Logo wordmark</p>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: p.purple + '22' }}>
              <div className="w-full h-full flex items-center justify-center text-lg">🎨</div>
            </div>
            <span
              className="font-['Bubblegum_Sans'] text-[1.2rem] leading-tight"
              style={{ color: p.purple }}
            >
              Come Color<span className="block" style={{ color: p.pink }}>With Me™</span>
            </span>
          </div>
        </div>

        {/* Primary CTA button */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">Primary CTA (pink fill)</p>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-nunito font-bold text-white text-sm"
            style={{ backgroundColor: p.pink }}
          >
            🖍 Start Coloring Free
          </button>
        </div>

        {/* Secondary CTA button */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">Secondary CTA (purple fill)</p>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-nunito font-bold text-white text-sm"
            style={{ backgroundColor: p.purple }}
          >
            ★ Browse Prints
          </button>
        </div>

        {/* Outline button */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">Outline button (Log In)</p>
          <button
            type="button"
            className="font-nunito font-bold text-sm rounded-full px-5 py-2 border-2"
            style={{ color: p.purple, borderColor: p.lavender, backgroundColor: bg }}
          >
            Log In
          </button>
        </div>

        {/* Card */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">Artwork card</p>
          <div
            className="rounded-[20px] overflow-hidden shadow-md p-4"
            style={{ backgroundColor: '#fff' }}
          >
            <div
              className="w-full h-28 rounded-xl mb-3 flex items-center justify-center text-4xl"
              style={{ backgroundColor: p.purple + '15' }}
            >
              🐱
            </div>
            <p className="text-xs font-nunito font-semibold uppercase tracking-wider mb-1" style={{ color: p.purple }}>
              Animals
            </p>
            <h3 className="font-fredoka font-semibold text-[#3D1F5C] text-base mb-3 truncate">Playful Cat</h3>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-emerald-50 text-emerald-700 font-nunito font-bold text-[0.8125rem]"
              >
                ⬇ Download Free
              </button>
            </div>
          </div>
        </div>

        {/* Filter chip */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">Filter chips</p>
          <div className="flex flex-wrap gap-2">
            {['All', 'Coloring Pages', 'Art Prints'].map((chip, i) => (
              <span
                key={chip}
                className="font-nunito font-semibold text-sm px-4 py-1.5 rounded-full border"
                style={
                  i === 0
                    ? { backgroundColor: p.purple, color: '#fff', borderColor: p.purple }
                    : { backgroundColor: bg, color: p.purple, borderColor: p.lavender }
                }
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Badge */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">Badges</p>
          <div className="flex gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-nunito font-bold text-white" style={{ backgroundColor: p.pink }}>✦ NEW</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-nunito font-bold text-white" style={{ backgroundColor: p.purple }}>★ Premium</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-nunito font-bold text-white bg-emerald-500">✓ Free</span>
          </div>
        </div>

        {/* Text links */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">Body text links</p>
          <p className="font-nunito text-[#3D1F5C] text-sm">
            Original drawings by Amalia.{' '}
            <span className="font-bold underline cursor-pointer" style={{ color: p.purple }}>Learn more about me →</span>
          </p>
          <p className="font-nunito text-sm mt-1" style={{ color: p.purple }}>
            View all → <span className="font-bold">drawings in gallery</span>
          </p>
        </div>

        {/* Muted text */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">Muted / secondary text (purple at reduced opacity)</p>
          <p className="font-nunito text-sm" style={{ color: p.purple }}>
            Amalia&apos;s Art Studio · Page 1 of 3
          </p>
        </div>

      </div>
    </div>
  )
}

export default function TestColorsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8 p-4 bg-amber-50 border border-amber-300 rounded-xl text-sm text-amber-800">
          <strong>Internal review only.</strong> This page exists solely for colour decision-making. Delete <code className="font-mono">/app/test-colors/</code> once a direction is chosen.
        </div>

        <h1 className="font-fredoka font-bold text-3xl text-[#3D1F5C] mb-2">
          Brand Colour Comparison
        </h1>
        <p className="font-nunito text-gray-600 mb-8">
          Background on all colour panels is Blush White <code className="font-mono bg-gray-100 px-1 rounded">#FFF6F9</code> — the actual page background. Contrast ratios are measured against this background.
          WCAG AA requires 4.5:1 for normal text · 3:1 for large text (18px+ or 14px+ bold).
        </p>

        <div className="flex gap-6 items-start flex-col lg:flex-row">
          {PALETTES.map(p => (
            <PaletteColumn key={p.id} p={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
