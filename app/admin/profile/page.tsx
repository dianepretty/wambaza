"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProfileForm from '../../../components/ProfileForm'

const API = process.env.NEXT_PUBLIC_API_URL

export default function AdminProfile() {
  const router = useRouter()

  useEffect(() => {
    // Verify access in the background; redirect away if not an admin, but don't block rendering.
    fetch(`${API}/auth/me`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(me => {
        if (me.role !== 'admin') throw new Error()
      })
      .catch(() => router.push('/signin'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleLogout() {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
    router.push('/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-purple-800 to-purple-950 shrink-0 shadow-xl shadow-purple-900/30 z-10">
        <div className="px-6 py-6 border-b border-white/10">
          <a href="/" className="flex items-center gap-2">
            <svg className="w-7 h-7 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3"/>
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
              <circle cx="20" cy="10" r="2"/>
            </svg>
            <span className="text-xl font-black text-white tracking-wide">Wambaza</span>
          </a>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          <div className="px-3 py-1.5 text-xs font-semibold text-purple-300/70 uppercase tracking-widest">Management</div>
          <a href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-purple-200 hover:bg-white/5 hover:text-white text-sm transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a2 2 0 100-4 2 2 0 000 4zM3 16a2 2 0 100-4 2 2 0 000 4z"/></svg>
            Publishers
          </a>
          <a href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-purple-200 hover:bg-white/5 hover:text-white text-sm transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Articles
          </a>
          <a className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm">
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-orange-400" />
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Profile
          </a>
        </nav>

        <div className="px-6 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold shrink-0">A</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white">Admin</div>
              <div className="text-xs text-purple-300">Administrator</div>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-8 py-5 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Update your name and email address</p>
        </header>

        <main className="flex-1 p-8">
          <ProfileForm roleLabel="Administrator" />
        </main>
      </div>
    </div>
  )
}
