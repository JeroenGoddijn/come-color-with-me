import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Coloring Pages — Come Color With Me',
  description: "Download free and premium coloring pages by Amalia, age 8.",
}

export default function ColoringPagesPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <p className="text-6xl mb-6" aria-hidden="true">🖍️</p>
      <h1 className="font-fredoka font-bold text-3xl text-[#9B6FD4] mb-3">
        Coloring Pages — Coming Soon!
      </h1>
      <p className="font-nunito text-[#8B7BA8] max-w-[440px] mb-8 leading-relaxed">
        We&apos;re getting all of Amalia&apos;s coloring pages ready for you to
        download and print. Check back very soon!
      </p>
      <Link href="/">
        <Button variant="primary">Back to Home</Button>
      </Link>
    </div>
  )
}
