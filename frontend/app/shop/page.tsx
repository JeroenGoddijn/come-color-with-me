import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Shop — Come Color With Me',
  description: "Shop premium prints and artwork by Amalia.",
}

export default function ShopPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <p className="text-6xl mb-6" aria-hidden="true">🛍️</p>
      <h1 className="font-fredoka font-bold text-3xl text-[#9B6FD4] mb-3">
        Shop — Coming Soon!
      </h1>
      <p className="font-nunito text-[#8B7BA8] max-w-[440px] mb-8 leading-relaxed">
        Premium prints of Amalia&apos;s artwork are on their way.
        Sign up to be notified when the shop opens!
      </p>
      <Link href="/">
        <Button variant="primary">Back to Home</Button>
      </Link>
    </div>
  )
}
