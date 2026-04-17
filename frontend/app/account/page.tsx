'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

export default function AccountPage() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C4B5FD] border-t-[#9B6FD4] rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <p className="text-6xl mb-6" aria-hidden="true">👤</p>
        <h1 className="font-fredoka font-bold text-3xl text-[#9B6FD4] mb-3">
          My Account
        </h1>
        <p className="font-nunito text-[#8B7BA8] max-w-[400px] mb-8 leading-relaxed">
          Log in to access your account, view your download history, and manage
          your coloring pages.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/login">
            <Button variant="primary">Log In</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Create Account</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] py-16 px-4">
      <div className="mx-auto max-w-[600px]">
        <h1 className="font-fredoka font-bold text-3xl text-[#9B6FD4] mb-2">
          My Account
        </h1>
        <p className="font-nunito text-[#8B7BA8] mb-8">{user.email}</p>

        <div className="bg-white rounded-[20px] p-8 shadow-sm border border-[#C4B5FD]/20 mb-6">
          <h2 className="font-fredoka font-bold text-xl text-[#3D1F5C] mb-4">
            Download History
          </h2>
          <p className="font-nunito text-[#8B7BA8] text-sm leading-relaxed">
            Your download history will appear here once you&apos;ve downloaded
            some coloring pages. Coming in the next update!
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
}
