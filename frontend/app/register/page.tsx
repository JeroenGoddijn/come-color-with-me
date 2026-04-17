'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password)
      setDone(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[420px] text-center">
          <p className="text-5xl mb-4" aria-hidden="true">🎉</p>
          <h1 className="font-fredoka font-bold text-2xl text-[#9B6FD4] mb-3">
            Check your email!
          </h1>
          <p className="font-nunito text-[#8B7BA8] text-sm leading-relaxed max-w-[300px] mx-auto">
            We sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account, then log in.
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button variant="primary">Go to Login</Button>
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
          <p className="text-5xl mb-4" aria-hidden="true">🌟</p>
          <h1 className="font-fredoka font-bold text-2xl text-[#9B6FD4] mb-2">
            Create your account
          </h1>
          <p className="font-nunito text-[#8B7BA8] text-sm">
            Free to join — get access to your download history.
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
              className="w-full px-4 py-3 rounded-xl border-2 border-[#C4B5FD]/50 text-[#3D1F5C] font-nunito text-sm placeholder:text-[#8B7BA8] focus:outline-none focus:border-[#9B6FD4] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="font-nunito font-semibold text-sm text-[#3D1F5C]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#C4B5FD]/50 text-[#3D1F5C] font-nunito text-sm placeholder:text-[#8B7BA8] focus:outline-none focus:border-[#9B6FD4] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm" className="font-nunito font-semibold text-sm text-[#3D1F5C]">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#C4B5FD]/50 text-[#3D1F5C] font-nunito text-sm placeholder:text-[#8B7BA8] focus:outline-none focus:border-[#9B6FD4] transition-colors"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
            Create Account
          </Button>

          <p className="text-center font-nunito text-sm text-[#8B7BA8]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#9B6FD4] font-semibold hover:text-[#F472B6] transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
