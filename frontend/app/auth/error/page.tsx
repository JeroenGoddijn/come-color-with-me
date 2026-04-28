import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Auth Error',
  robots: { index: false, follow: false },
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px] text-center">
        <p className="text-5xl mb-4" aria-hidden="true">😕</p>
        <h1 className="font-fredoka font-bold text-2xl text-[#8B51D6] mb-3">
          Something went wrong
        </h1>
        <p className="font-nunito text-[#6B5A94] text-sm leading-relaxed max-w-[300px] mx-auto mb-8">
          The link you followed may have expired or already been used.
          Request a new one and try again.
        </p>
        <div className="flex flex-col gap-3 items-center">
          <Link
            href="/auth/forgot-password"
            className="px-8 py-3 rounded-[32px] bg-[#8B51D6] hover:bg-[#7c56b0] text-white font-nunito font-bold text-sm transition-colors shadow-sm"
          >
            Request a new link
          </Link>
          <Link
            href="/login"
            className="font-nunito text-sm text-[#8B51D6] hover:text-[#DC186D] transition-colors"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
