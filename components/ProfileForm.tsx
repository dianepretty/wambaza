"use client"
import React, { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function ProfileForm({ roleLabel }: { roleLabel: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch(`${API}/auth/me`, { credentials: 'include' })
      .then(res => res.json())
      .then(me => { setName(me.name || ''); setEmail(me.email || '') })
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError(''); setSuccess(false); setSaving(true)
    try {
      const res = await fetch(`${API}/auth/me`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.detail ?? 'Could not update profile.')
        return
      }
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-md bg-white rounded-2xl border p-8 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-6" />
        <div className="h-3 bg-gray-200 rounded-full w-1/3 mb-2" />
        <div className="h-10 bg-gray-100 rounded-xl mb-4" />
        <div className="h-3 bg-gray-200 rounded-full w-1/3 mb-2" />
        <div className="h-10 bg-gray-100 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-md bg-white rounded-2xl border p-8">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-lg font-bold mb-3">
          {initials(name || '?')}
        </div>
        <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">{roleLabel}</span>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          <span className="mt-0.5">⚠</span> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
          <span className="mt-0.5">✓</span> Profile updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
