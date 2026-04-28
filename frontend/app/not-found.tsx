import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <p className="text-6xl mb-6" aria-hidden="true">🖍️</p>
      <h1 className="font-fredoka font-bold text-3xl text-[#8B51D6] mb-3">
        Page not found!
      </h1>
      <p className="font-nunito text-[#6B5A94] max-w-[400px] mb-8 leading-relaxed">
        Looks like this page got lost in Amalia&apos;s art box.
        Let&apos;s get you back to the coloring pages!
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/coloring-pages">
          <Button variant="primary">Browse Coloring Pages</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    </div>
  )
}
