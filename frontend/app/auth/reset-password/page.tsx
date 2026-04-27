'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/auth'
import { Button } from '@/components/ui/Button'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
      const supabase = createBrowserClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      // Sign the user out so they re-authenticate with the new password.
      // This prevents the one-time recovery session from lingering.
      await supabase.auth.signOut()
      router.replace('/login?reset=success')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Password update failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <p className="text-5xl mb-4" aria-hidden="true">🔐</p>
          <h1 className="font-fredoka font-bold text-2xl text-[#9B6FD4] mb-2">
            Set a new password
          </h1>
          <p className="font-nunito text-[#6B5A94] text-sm">
            Choose something strong and memorable.
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
            <label htmlFor="password" className="font-nunito font-semibold text-sm text-[#3D1F5C]">
              New password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#C4B5FD]/50 text-[#3D1F5C] font-nunito text-sm placeholder:text-[#6B5A94] focus:outline-none focus:border-[#9B6FD4] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm" className="font-nunito font-semibold text-sm text-[#3D1F5C]">
              Confirm new password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#C4B5FD]/50 text-[#3D1F5C] font-nunito text-sm placeholder:text-[#6B5A94] focus:outline-none focus:border-[#9B6FD4] transition-colors"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
            Update Password
          </Button>
        </form>
      </div>
    </div>
  )
}
