"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import loginImg from '../../assets/images/login.jpg'

type View = 'signin' | 'forgot'

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.546-4.204M6.343 6.343A9.96 9.96 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-1.307 2.56M6.343 6.343L3 3m3.343 3.343l11.314 11.314M17.657 17.657L21 21" />
    </svg>
  )
}

export default function SignIn() {
  const [view, setView] = useState<View>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSignIn(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.detail ?? 'Incorrect email or password. Please try again.')
        return
      }

      // Check if user must change their password on first login
      const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: 'include',
      })
      if (meRes.ok) {
        const me = await meRes.json()
        router.push(me.must_change_password ? '/change-password' : '/publisher')
      } else {
        router.push('/publisher')
      }
    } catch {
      setError('Something went wrong. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  // No forgot-password endpoint exists on the backend — show contact-admin message
  function handleForgotPassword(e: { preventDefault(): void }) {
    e.preventDefault()
    setResetSent(true)
  }

  return (
    <div className="min-h-screen flex">

      {/* Left image panel */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image src={loginImg} alt="Publisher workspace" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-purple-800/60 to-black/50" />

        {/* Content over image */}
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <a href="/" className="flex items-center gap-2">
            <svg className="w-8 h-8 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3"/>
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
              <circle cx="20" cy="10" r="2"/>
            </svg>
            <span className="text-2xl font-black text-white tracking-wide">Wambaza</span>
          </a>

          <div>
            <div className="inline-flex items-center gap-2 bg-orange-400/20 border border-orange-400/30 text-orange-300 text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              Publisher Portal
            </div>
            <h2 className="text-4xl font-bold text-white leading-snug">
              Write stories that <br /><span className="text-orange-400">change lives.</span>
            </h2>
            <p className="mt-4 text-purple-100 text-base leading-relaxed max-w-sm">
              Your articles reach thousands of adolescents across East Africa. Sign in to create, edit, and publish health content that matters.
            </p>

          </div>

          <p className="text-purple-300 text-xs">© {new Date().getFullYear()} Wambaza. All rights reserved.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center px-6 py-12 bg-white overflow-hidden">

        {/* Decorative background icons */}
        {/* Top-right large circle */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border-2 border-purple-100 opacity-60" />
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border border-orange-100 opacity-60" />

        {/* Stethoscope — top right */}
        <svg className="absolute top-10 right-10 w-10 h-10 text-purple-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3"/>
          <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
          <circle cx="20" cy="10" r="2"/>
        </svg>

        {/* Heart — bottom left */}
        <svg className="absolute bottom-16 left-8 w-12 h-12 text-orange-100" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>

        {/* Plus / medical cross — bottom right */}
        <svg className="absolute bottom-20 right-12 w-8 h-8 text-purple-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>

        {/* Small dot cluster — top left */}
        <div className="absolute top-12 left-8 grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-200 opacity-60" />
          ))}
        </div>

        {/* Small dot cluster — bottom center-right */}
        <div className="absolute bottom-10 right-32 grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-200 opacity-60" />
          ))}
        </div>
        <div className="w-full max-w-md">

          {/* Back to home */}
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Back to home
          </a>

          {/* Mobile logo */}
          <a href="/" className="flex lg:hidden items-center gap-2 mb-10">
            <svg className="w-7 h-7 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3"/>
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
              <circle cx="20" cy="10" r="2"/>
            </svg>
            <span className="text-2xl font-black text-purple-700 tracking-wide">Wambaza</span>
          </a>

          {view === 'signin' ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
              <p className="mt-2 text-sm text-gray-500">Sign in to your publisher account to continue writing.</p>

              {error && (
                <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  <span className="mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSignIn} className="mt-8 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <button type="button" onClick={() => { setView('forgot'); setError('') }} className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            </>
          ) : resetSent ? (
            <>
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-2xl mb-6">🔐</div>
              <h1 className="text-3xl font-bold text-gray-900">Contact your admin</h1>
              <p className="mt-2 text-sm text-gray-500">
                Password resets are managed by your administrator. Please reach out to your admin and they will reset your password for you.
              </p>
              <button
                onClick={() => { setView('signin'); setResetSent(false); setError('') }}
                className="mt-8 w-full border border-gray-200 hover:border-purple-400 text-gray-700 font-semibold py-3 rounded-xl transition-colors duration-200 text-sm"
              >
                ← Back to sign in
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setView('signin'); setError('') }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-purple-600 mb-8 transition-colors">
                ← Back to sign in
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Forgot your password?</h1>
              <p className="mt-2 text-sm text-gray-500">Password resets are handled by your administrator. Click below and we'll show you what to do.</p>

              {error && (
                <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  <span className="mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="mt-8 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
                >
                  Continue
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
