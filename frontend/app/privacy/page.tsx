import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Come Color With Me',
  description: 'Privacy policy for Come Color With Me — how we collect, use, and protect your information.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FFF6F9]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-fredoka font-bold text-[#3D1F5C] text-4xl mb-2">Privacy Policy</h1>
        <p className="font-nunito text-[#8B7BA8] text-sm mb-10">Last updated: April 2026</p>

        <div className="bg-white rounded-[20px] p-8 shadow-sm border border-[#C4B5FD]/20 space-y-8 font-nunito text-[#3D1F5C]/85 leading-relaxed">

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">1. Who we are</h2>
            <p>
              Come Color With Me™ (<strong>comecolorwith.me</strong>) is a website that shares
              original artwork and coloring pages created by Amalia. The site is operated by her
              parent/guardian on her behalf.
            </p>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">2. Information we collect</h2>
            <p className="mb-3">We collect only what is necessary to operate the site:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Email address</strong> — when you create an account or subscribe to our newsletter.</li>
              <li><strong>Payment information</strong> — processed directly by Stripe. We never store card details.</li>
              <li><strong>Shipping address</strong> — only when you order a physical print, collected by Stripe and forwarded to our print provider (Gelato).</li>
              <li><strong>Usage data</strong> — basic analytics (page views). No personal data is linked to analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">3. Children&apos;s privacy (COPPA)</h2>
            <p className="mb-3">
              This site is designed for families and is child-friendly in content. We comply with the
              Children&apos;s Online Privacy Protection Act (COPPA):
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do not knowingly collect personal information from children under 13.</li>
              <li>Children under 13 should not create accounts or make purchases without parental consent.</li>
              <li>Free coloring pages can be downloaded without any account or personal information.</li>
              <li>If you believe we have inadvertently collected information from a child under 13, please contact us and we will delete it immediately.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">4. How we use your information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To fulfil digital download purchases and physical print orders.</li>
              <li>To send newsletter emails (only if you subscribed — unsubscribe any time).</li>
              <li>To provide account functionality (download history, order history).</li>
              <li>We do not sell, rent, or share your personal information with third parties for marketing.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">5. Third-party services</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Stripe</strong> — payment processing. Subject to <a href="https://stripe.com/privacy" className="text-[#9B6FD4] underline" target="_blank" rel="noopener noreferrer">Stripe&apos;s Privacy Policy</a>.</li>
              <li><strong>Gelato</strong> — print fulfilment. Your shipping address is shared with Gelato solely to fulfil your print order.</li>
              <li><strong>Kit (ConvertKit)</strong> — newsletter delivery. Subject to Kit&apos;s Privacy Policy.</li>
              <li><strong>Supabase</strong> — authentication and data storage. Hosted in the EU.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">6. Data retention</h2>
            <p>We retain your data only as long as necessary. You may request deletion of your account and associated data at any time by emailing us.</p>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">7. Your rights</h2>
            <p>You have the right to access, correct, or delete your personal data. Contact us at <a href="mailto:hello@comecolorwith.me" className="text-[#9B6FD4] underline">hello@comecolorwith.me</a>.</p>
          </section>

          <section>
            <h2 className="font-fredoka font-bold text-[#3D1F5C] text-xl mb-3">8. Contact</h2>
            <p>Questions about this policy? Email us at <a href="mailto:hello@comecolorwith.me" className="text-[#9B6FD4] underline">hello@comecolorwith.me</a>.</p>
          </section>

        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="font-nunito text-sm text-[#9B6FD4] hover:underline">← Back to home</Link>
        </div>
      </div>
    </main>
  )
}
