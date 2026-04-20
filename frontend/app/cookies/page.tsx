import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy — Come Color With Me',
  description: 'Cookie policy for Come Color With Me — what cookies we use and why.',
}

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#FFF6F9]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-fredoka font-bold text-[#3D1F5C] text-4xl mb-2">Cookie Policy</h1>
        <p className="font-nunito text-[#8B7BA8] text-sm mb-10">Last updated: April 2026</p>

        <div className="bg-white rounded-[20px] p-8 shadow-sm border border-[#C4B5FD]/20 space-y-8 font-nunito text-[#3D1F5C]/85 leading-relaxed">

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">What are cookies?</h2>
            <p>Cookies are small text files stored on your device by your browser. They help websites remember your preferences and improve your experience.</p>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">Cookies we use</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F3FF] text-left">
                    <th className="p-3 font-semibold rounded-tl-lg">Cookie</th>
                    <th className="p-3 font-semibold">Provider</th>
                    <th className="p-3 font-semibold">Purpose</th>
                    <th className="p-3 font-semibold rounded-tr-lg">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C4B5FD]/20">
                  <tr>
                    <td className="p-3"><code className="bg-[#F5F3FF] px-1 rounded">sb-*</code></td>
                    <td className="p-3">Supabase</td>
                    <td className="p-3">Authentication session (keeps you logged in)</td>
                    <td className="p-3">Session / 1 week</td>
                  </tr>
                  <tr>
                    <td className="p-3"><code className="bg-[#F5F3FF] px-1 rounded">__stripe_mid</code></td>
                    <td className="p-3">Stripe</td>
                    <td className="p-3">Fraud prevention during checkout</td>
                    <td className="p-3">1 year</td>
                  </tr>
                  <tr>
                    <td className="p-3"><code className="bg-[#F5F3FF] px-1 rounded">__stripe_sid</code></td>
                    <td className="p-3">Stripe</td>
                    <td className="p-3">Checkout session continuity</td>
                    <td className="p-3">30 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">Cookies we do NOT use</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>No advertising or tracking cookies</li>
              <li>No third-party social media cookies</li>
              <li>No profiling or behavioural targeting cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">Managing cookies</h2>
            <p>
              You can control cookies through your browser settings. Disabling cookies may affect
              login functionality and checkout. The Site works without an account — free coloring
              pages can always be downloaded without cookies.
            </p>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">Contact</h2>
            <p>Questions? Email <a href="mailto:hello@comecolorwith.me" className="text-[#9B6FD4] underline">hello@comecolorwith.me</a>.</p>
          </section>

        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="font-nunito text-sm text-[#9B6FD4] hover:underline">← Back to home</Link>
        </div>
      </div>
    </main>
  )
}
