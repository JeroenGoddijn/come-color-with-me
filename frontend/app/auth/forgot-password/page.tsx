'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/auth'
import { Button } from '@/components/ui/Button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createBrowserClient()
      const redirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback?next=/auth/reset-password`
          : '/auth/callback?next=/auth/reset-password'

      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (error) throw error
      setDone(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[420px] text-center">
          <p className="text-5xl mb-4" aria-hidden="true">📬</p>
          <h1 className="font-fredoka font-bold text-2xl text-[#8B51D6] mb-3">
            Check your inbox!
          </h1>
          <p className="font-nunito text-[#6B5A94] text-sm leading-relaxed max-w-[300px] mx-auto">
            We sent a password reset link to <strong>{email}</strong>.
            Click it within the next hour to set a new password.
          </p>
          <p className="font-nunito text-xs text-[#6B5A94] mt-3">
            Don&apos;t see it? Check your spam folder.
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button variant="primary">Back to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <p className="text-5xl mb-4" aria-hidden="true">🔑</p>
          <h1 className="font-fredoka font-bold text-2xl text-[#8B51D6] mb-2">
            Forgot your password?
          </h1>
          <p className="font-nunito text-[#6B5A94] text-sm">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(155,111,212,0.12)] p-8 flex flex-col gap-5"
          noValidate
        >
          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm font-nunito rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-nunito font-semibold text-sm text-[#3D1F5C]">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#C4B5FD]/50 text-[#3D1F5C] font-nunito text-sm placeholder:text-[#6B5A94] focus:outline-none focus:border-[#8B51D6] transition-colors"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
            Send Reset Link
          </Button>

          <p className="text-center font-nunito text-sm text-[#6B5A94]">
            Remembered it?{' '}
            <Link href="/login" className="text-[#8B51D6] font-semibold hover:text-[#DC186D] transition-colors">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
