'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

function LoginForm() {
  const { user, loading: authLoading, signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/account'
  const resetSuccess = searchParams.get('reset') === 'success'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Already logged in → go to account (or redirect param)
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirect)
    }
  }, [authLoading, user, router, redirect])

  if (authLoading || user) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn(email, password)
      router.push(redirect)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <p className="text-5xl mb-4" aria-hidden="true">🎨</p>
          <h1 className="font-fredoka font-bold text-2xl text-[#9B6FD4] mb-2">
            Welcome back!
          </h1>
          <p className="font-nunito text-[#8B7BA8] text-sm">
            Sign in to access your downloads and account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(155,111,212,0.12)] p-8 flex flex-col gap-5"
          noValidate
        >
          {resetSuccess && (
            <div role="status" className="bg-green-50 border border-green-200 text-green-700 text-sm font-nunito rounded-lg px-4 py-3">
              Password updated! Sign in with your new password.
            </div>
          )}

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
              className="w-full px-4 py-3 rounded-xl border-2 border-[#C4B5FD]/50 text-[#3D1F5C] font-nunito text-sm placeholder:text-[#8B7BA8] focus:outline-none focus:border-[#9B6FD4] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="font-nunito font-semibold text-sm text-[#3D1F5C]">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="font-nunito text-xs text-[#9B6FD4] hover:text-[#F472B6] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#C4B5FD]/50 text-[#3D1F5C] font-nunito text-sm placeholder:text-[#8B7BA8] focus:outline-none focus:border-[#9B6FD4] transition-colors"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
            Sign In
          </Button>

          <p className="text-center font-nunito text-sm text-[#8B7BA8]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#9B6FD4] font-semibold hover:text-[#F472B6] transition-colors">
              Create one free
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
