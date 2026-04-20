import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — Come Color With Me',
  description: 'Terms of service for Come Color With Me.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FFF6F9]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-fredoka font-bold text-[#3D1F5C] text-4xl mb-2">Terms of Service</h1>
        <p className="font-nunito text-[#8B7BA8] text-sm mb-10">Last updated: April 2026</p>

        <div className="bg-white rounded-[20px] p-8 shadow-sm border border-[#C4B5FD]/20 space-y-8 font-nunito text-[#3D1F5C]/85 leading-relaxed">

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">1. Acceptance</h2>
            <p>By using Come Color With Me™ (the &quot;Site&quot;), you agree to these Terms of Service. If you do not agree, please do not use the Site.</p>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">2. Free coloring pages — license</h2>
            <p>
              Free coloring pages may be downloaded and printed for personal, non-commercial use only.
              You may not resell, redistribute, or use them in commercial products without written permission.
            </p>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">3. Digital downloads — license</h2>
            <p>
              Purchased digital downloads (PDF files) are licensed for personal use only. One license
              per purchase. You may print the file for personal use. You may not distribute, resell,
              or use the artwork commercially.
            </p>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">4. Physical prints</h2>
            <p>
              Prints are produced by Gelato and shipped to the address provided at checkout.
              Shipping times are estimates. We will reprint at no charge if your order arrives damaged
              — please contact us within 14 days with a photo.
            </p>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">5. Intellectual property</h2>
            <p>
              All artwork on this Site is original work by Amalia and is protected by copyright.
              The Come Color With Me™ name and logo are trademarks. Unauthorised reproduction is prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">6. Accounts</h2>
            <p>You are responsible for keeping your account credentials secure. Accounts are for personal use only.</p>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">7. Limitation of liability</h2>
            <p>
              The Site is provided &quot;as is.&quot; We are not liable for any indirect or consequential
              damages arising from use of the Site.
            </p>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">8. Contact</h2>
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
