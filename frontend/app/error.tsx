'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    // Log to error tracking service in production
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <p className="text-6xl mb-6" aria-hidden="true">🎨</p>
      <h1 className="font-fredoka font-bold text-3xl text-[#9B6FD4] mb-3">
        Oops! Something went wrong
      </h1>
      <p className="font-nunito text-[#8B7BA8] max-w-[400px] mb-8 leading-relaxed">
        We&apos;re sorry — something unexpected happened. Try refreshing the page,
        or go back to the homepage.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Button onClick={reset} variant="primary">Try Again</Button>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          Go Home
        </Button>
      </div>
    </div>
  )
}
