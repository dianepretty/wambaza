"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ArticlePreviewModal from '../../components/ArticlePreviewModal'

const API = process.env.NEXT_PUBLIC_API_URL

type User = {
  id: number
  name: string
  email: string
  role: string
  is_active: boolean
  created_at: string
}

type Article = {
  id: number
  title_en: string
  title_kin?: string
  title_lug?: string
  content_en: string
  content_kin?: string
  content_lug?: string
  cover_image_url?: string
  status: string
  publisher_id: number
  publisher_name: string
  publisher_email: string
  updated_at: string
}

type View = 'publishers' | 'articles'
type ArticleStatusFilter = 'all' | 'published' | 'draft' | 'archived'
type ModalMode = 'create' | 'edit' | 'confirm-deactivate' | 'confirm-unpublish' | 'preview-article' | null

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

function ArticleStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: 'bg-green-50 text-green-700',
    draft: 'bg-amber-50 text-amber-700',
    archived: 'bg-gray-100 text-gray-500',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${styles[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  )
}

export default function AdminDashboard() {
  const [view, setView] = useState<View>('publishers')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalMode>(null)
  const [selected, setSelected] = useState<User | null>(null)
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')

  const [articles, setArticles] = useState<Article[]>([])
  const [articlesLoading, setArticlesLoading] = useState(true)
  const [articleStatusFilter, setArticleStatusFilter] = useState<ArticleStatusFilter>('all')
  const [articlePublisherFilter, setArticlePublisherFilter] = useState<number | 'all'>('all')
  const [articleSearch, setArticleSearch] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  const router = useRouter()

  async function loadUsers() {
    try {
      const res = await fetch(`${API}/users`, { credentials: 'include' })
      if (res.ok) setUsers(await res.json())
    } finally {
      setLoading(false)
    }
  }

  async function loadArticles() {
    setArticlesLoading(true)
    try {
      const res = await fetch(`${API}/articles/all`, { credentials: 'include' })
      if (res.ok) setArticles(await res.json())
    } finally {
      setArticlesLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
    loadArticles()
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

  function closeModal() { setModal(null); setSelected(null); setSelectedArticle(null) }

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

  function openDeactivateConfirm(user: User) {
    setSelected(user)
    setModal('confirm-deactivate')
  }

  async function confirmDeactivate() {
    if (!selected) return
    await toggleActive(selected)
    closeModal()
  }

  function openUnpublishConfirm(article: Article) {
    setSelectedArticle(article)
    setModal('confirm-unpublish')
  }

  function openArticlePreview(article: Article) {
    setSelectedArticle(article)
    setModal('preview-article')
  }

  async function confirmUnpublish() {
    if (!selectedArticle) return
    await fetch(`${API}/articles/${selectedArticle.id}/unpublish`, { method: 'PATCH', credentials: 'include' })
    await loadArticles()
    showToast(`"${selectedArticle.title_en}" has been unpublished.`)
    closeModal()
  }

  async function handleLogout() {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
    router.push('/signin')
  }

  const active = users.filter(u => u.is_active).length
  const inactive = users.length - active

  const publishers = users.filter(u => u.role === 'publisher')
  const articleCounts = {
    all: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    draft: articles.filter(a => a.status === 'draft').length,
    archived: articles.filter(a => a.status === 'archived').length,
  }
  const filteredArticles = articles
    .filter(a => articleStatusFilter === 'all' || a.status === articleStatusFilter)
    .filter(a => articlePublisherFilter === 'all' || a.publisher_id === articlePublisherFilter)
    .filter(a => a.title_en.toLowerCase().includes(articleSearch.toLowerCase()))
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

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
          <button
            onClick={() => setView('publishers')}
            className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              view === 'publishers' ? 'bg-white/10 text-white' : 'text-purple-200 hover:bg-white/5 hover:text-white'
            }`}
          >
            {view === 'publishers' && <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-orange-400" />}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a2 2 0 100-4 2 2 0 000 4zM3 16a2 2 0 100-4 2 2 0 000 4z"/></svg>
            Publishers
          </button>
          <button
            onClick={() => setView('articles')}
            className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              view === 'articles' ? 'bg-white/10 text-white' : 'text-purple-200 hover:bg-white/5 hover:text-white'
            }`}
          >
            {view === 'articles' && <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-orange-400" />}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Articles
          </button>
          <a href="/admin/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-purple-200 hover:bg-white/5 hover:text-white text-sm transition-colors">
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

        {/* Topbar */}
        <header className="bg-white border-b px-8 py-5 flex items-center justify-between gap-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{view === 'publishers' ? 'Publishers' : 'Articles'}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {view === 'publishers' ? 'Manage who can write and publish articles' : 'Review and moderate published content'}
            </p>
          </div>
          {view === 'publishers' && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm hover:shadow-md shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              Add Publisher
            </button>
          )}
        </header>

        <main className="flex-1 p-8">

          {view === 'publishers' && <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              {
                label: 'Total Publishers', value: users.length, accent: 'text-purple-700', iconBg: 'bg-purple-100', iconColor: 'text-purple-600',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a2 2 0 100-4 2 2 0 000 4zM3 16a2 2 0 100-4 2 2 0 000 4z" />,
              },
              {
                label: 'Active', value: active, accent: 'text-green-600', iconBg: 'bg-green-100', iconColor: 'text-green-600',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
              },
              {
                label: 'Inactive', value: inactive, accent: 'text-gray-500', iconBg: 'bg-gray-100', iconColor: 'text-gray-500',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
              },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center shrink-0`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{stat.icon}</svg>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${stat.accent}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-4 max-w-sm">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border overflow-hidden">
            {loading ? (
              <div className="divide-y divide-gray-50">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-3 px-6 py-4 animate-pulse">
                    <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded-full w-1/4" />
                      <div className="h-2.5 bg-gray-100 rounded-full w-1/3" />
                    </div>
                    <div className="h-6 bg-gray-100 rounded-full w-16" />
                    <div className="h-6 bg-gray-100 rounded-full w-20" />
                  </div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a2 2 0 100-4 2 2 0 000 4zM3 16a2 2 0 100-4 2 2 0 000 4z" /></svg>
                </div>
                <p className="text-gray-500 text-sm">{search ? 'No publishers match your search.' : 'No publishers yet. Add one to get started.'}</p>
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
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 ring-2 ring-white flex items-center justify-center text-white text-xs font-bold shrink-0">
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
                        <div className="flex items-center justify-end gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(user)}
                            title="Edit"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"/></svg>
                          </button>
                          <button
                            onClick={() => user.is_active ? openDeactivateConfirm(user) : toggleActive(user)}
                            title={user.is_active ? 'Disable' : 'Enable'}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${user.is_active ? 'text-gray-500 hover:text-red-600 hover:bg-red-50' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'}`}
                          >
                            {user.is_active ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          </>}

          {view === 'articles' && <>
            {/* Filter tabs + publisher filter + search */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1.5 w-fit">
                {(['all', 'published', 'draft', 'archived'] as ArticleStatusFilter[]).map(key => (
                  <button
                    key={key}
                    onClick={() => setArticleStatusFilter(key)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                      articleStatusFilter === key ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {key}
                    <span className={`text-xs ${articleStatusFilter === key ? 'text-purple-200' : 'text-gray-400'}`}>{articleCounts[key]}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={articlePublisherFilter}
                  onChange={e => setArticlePublisherFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                >
                  <option value="all">All publishers</option>
                  {publishers.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>

                <div className="relative max-w-xs">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                  <input
                    value={articleSearch}
                    onChange={e => setArticleSearch(e.target.value)}
                    placeholder="Search articles"
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition"
                  />
                </div>
              </div>
            </div>

            {/* Articles grid */}
            {articlesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 bg-white animate-pulse">
                    <div className="h-40 bg-gray-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                      <div className="h-3 bg-gray-200 rounded-full w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="bg-white rounded-2xl border p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <p className="text-gray-500 text-sm">No articles match these filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                  <div key={article.id} className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-40 bg-gray-100">
                      {article.cover_image_url ? (
                        <img src={article.cover_image_url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                      )}
                      <div className="absolute top-3 left-3"><ArticleStatusBadge status={article.status} /></div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 leading-snug line-clamp-2">{article.title_en}</h3>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {initials(article.publisher_name)}
                        </div>
                        <span className="text-xs text-gray-500">{article.publisher_name}</span>
                      </div>
                      <p className="mt-2 text-xs text-gray-400">
                        Updated {new Date(article.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>

                      <div className="mt-4 flex items-center gap-1.5 pt-3 border-t border-gray-50">
                        <button
                          onClick={() => openArticlePreview(article)}
                          title="Preview"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        {article.status === 'published' && (
                          <button
                            onClick={() => openUnpublishConfirm(article)}
                            className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors ml-auto"
                          >
                            Unpublish
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>}
        </main>
      </div>

      {/* Create / Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  {modal === 'create' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-3a4 4 0 11-8 0 4 4 0 018 0zM2 20a6 6 0 0112 0v1H2v-1z"/></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"/></svg>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{modal === 'create' ? 'Add Publisher' : 'Edit Publisher'}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {modal === 'create' ? 'A temporary password will be emailed to them.' : 'Update name or email address.'}
                  </p>
                </div>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
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

      {/* Confirm Deactivate Modal */}
      {modal === 'confirm-deactivate' && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Disable {selected.name}?</h2>
            <p className="text-sm text-gray-500 mt-1.5">
              They will no longer be able to sign in or publish articles until re-enabled.
            </p>
            <div className="flex gap-3 pt-6">
              <button
                onClick={closeModal}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeactivate}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Disable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Unpublish Modal */}
      {modal === 'confirm-unpublish' && selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Unpublish "{selectedArticle.title_en}"?</h2>
            <p className="text-sm text-gray-500 mt-1.5">
              This article will be moved back to drafts and removed from the public site immediately.
            </p>
            <div className="flex gap-3 pt-6">
              <button
                onClick={closeModal}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmUnpublish}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Unpublish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Preview Modal */}
      {modal === 'preview-article' && selectedArticle && (
        <ArticlePreviewModal article={selectedArticle} onClose={closeModal} />
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
