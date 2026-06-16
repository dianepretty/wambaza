"use client"
import React, { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL

type User = {
  id: number
  name: string
  email: string
  role: string
  is_active: boolean
  created_at: string
}

type ModalMode = 'create' | 'edit' | null

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-gray-400'}`} />
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalMode>(null)
  const [selected, setSelected] = useState<User | null>(null)
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [toast, setToast] = useState('')

  async function loadUsers() {
    try {
      const res = await fetch(`${API}/users`, { credentials: 'include' })
      if (res.ok) setUsers(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function openCreate() {
    setFormName(''); setFormEmail(''); setFormError('')
    setSelected(null); setModal('create')
  }

  function openEdit(user: User) {
    setFormName(user.name); setFormEmail(user.email); setFormError('')
    setSelected(user); setModal('edit')
  }

  function closeModal() { setModal(null); setSelected(null) }

  async function handleCreate(e: { preventDefault(): void }) {
    e.preventDefault()
    setFormError(''); setFormLoading(true)
    try {
      const res = await fetch(`${API}/users`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, email: formEmail }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setFormError(body.detail ?? 'Failed to create user.')
        return
      }
      await loadUsers()
      closeModal()
      showToast('Publisher created — temporary password sent by email.')
    } catch {
      setFormError('Something went wrong. Please try again.')
    } finally {
      setFormLoading(false)
    }
  }

  async function handleEdit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!selected) return
    setFormError(''); setFormLoading(true)
    try {
      const res = await fetch(`${API}/users/${selected.id}`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, email: formEmail }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setFormError(body.detail ?? 'Failed to update user.')
        return
      }
      await loadUsers()
      closeModal()
      showToast('User updated successfully.')
    } catch {
      setFormError('Something went wrong. Please try again.')
    } finally {
      setFormLoading(false)
    }
  }

  async function toggleActive(user: User) {
    const action = user.is_active ? 'deactivate' : 'activate'
    await fetch(`${API}/users/${user.id}/${action}`, { method: 'PATCH', credentials: 'include' })
    await loadUsers()
    showToast(`${user.name} has been ${action}d.`)
  }

  const active = users.filter(u => u.is_active).length
  const inactive = users.length - active

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r shrink-0">
        <div className="px-6 py-5 border-b">
          <a href="/" className="flex items-center gap-2">
            <svg className="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3"/>
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
              <circle cx="20" cy="10" r="2"/>
            </svg>
            <span className="font-black text-purple-700 tracking-wide">Wamb<span className="text-orange-400">aza</span></span>
          </a>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-widest">Management</div>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-purple-50 text-purple-700 font-semibold text-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a2 2 0 100-4 2 2 0 000 4zM3 16a2 2 0 100-4 2 2 0 000 4z"/></svg>
            Publishers
          </a>
          <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 text-sm transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Back to Site
          </a>
        </nav>

        <div className="px-6 py-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs font-bold">A</div>
            <div>
              <div className="text-sm font-semibold text-gray-800">Admin</div>
              <div className="text-xs text-gray-400">Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Publishers</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage who can write and publish articles</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            Add Publisher
          </button>
        </header>

        <main className="flex-1 p-6">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Publishers', value: users.length, color: 'text-gray-900', bg: 'bg-white' },
              { label: 'Active', value: active, color: 'text-green-600', bg: 'bg-white' },
              { label: 'Inactive', value: inactive, color: 'text-gray-400', bg: 'bg-white' },
            ].map(stat => (
              <div key={stat.label} className={`${stat.bg} rounded-2xl border p-5`}>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-400 text-sm">Loading publishers…</div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-3">👥</div>
                <p className="text-gray-500 text-sm">No publishers yet. Add one to get started.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                    <th className="text-left px-6 py-3 font-semibold">Publisher</th>
                    <th className="text-left px-6 py-3 font-semibold">Role</th>
                    <th className="text-left px-6 py-3 font-semibold">Status</th>
                    <th className="text-left px-6 py-3 font-semibold">Joined</th>
                    <th className="text-right px-6 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {initials(user.name)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">{user.role}</span>
                      </td>
                      <td className="px-6 py-4"><StatusBadge active={user.is_active} /></td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(user)}
                            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-purple-700 bg-gray-100 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"/></svg>
                            Edit
                          </button>
                          <button
                            onClick={() => toggleActive(user)}
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${user.is_active ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}
                          >
                            {user.is_active ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{modal === 'create' ? 'Add Publisher' : 'Edit Publisher'}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {modal === 'create' ? 'A temporary password will be sent to their email.' : 'Update name or email address.'}
                </p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {formError && (
              <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                <span className="mt-0.5">⚠</span> {formError}
              </div>
            )}

            <form onSubmit={modal === 'create' ? handleCreate : handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                <input
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Diane Uwimana"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  placeholder="publisher@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:border-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  {formLoading ? 'Saving…' : modal === 'create' ? 'Create Publisher' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          {toast}
        </div>
      )}
    </div>
  )
}
