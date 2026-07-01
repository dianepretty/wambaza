"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ArticlePreviewModal from '../../components/ArticlePreviewModal'

const API = process.env.NEXT_PUBLIC_API_URL

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
  updated_at: string
}

type StatusFilter = 'all' | 'published' | 'draft' | 'archived'

function StatusBadge({ status }: { status: string }) {
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

export default function PublisherDashboard() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<Article | null>(null)
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null)
  const router = useRouter()

  async function loadArticles() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/articles/my`, { credentials: 'include' })
      if (res.ok) setArticles(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadArticles() }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function handleArchive(article: Article) {
    await fetch(`${API}/articles/${article.id}/archive`, { method: 'PATCH', credentials: 'include' })
    await loadArticles()
    showToast(`"${article.title_en}" moved to archive.`)
  }

  async function handleRestore(article: Article) {
    await fetch(`${API}/articles/${article.id}/unpublish`, { method: 'PATCH', credentials: 'include' })
    await loadArticles()
    showToast(`"${article.title_en}" moved to drafts.`)
  }

  async function confirmDeleteArticle() {
    if (!confirmDelete) return
    await fetch(`${API}/articles/${confirmDelete.id}`, { method: 'DELETE', credentials: 'include' })
    setConfirmDelete(null)
    await loadArticles()
    showToast('Article deleted.')
  }

  async function handleLogout() {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
    router.push('/signin')
  }

  const counts = {
    all: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    draft: articles.filter(a => a.status === 'draft').length,
    archived: articles.filter(a => a.status === 'archived').length,
  }

  const filteredArticles = articles
    .filter(a => filter === 'all' || a.status === filter)
    .filter(a => a.title_en.toLowerCase().includes(search.toLowerCase()))

  const tabs: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'published', label: 'Published' },
    { key: 'draft', label: 'Draft' },
    { key: 'archived', label: 'Archived' },
  ]

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">

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
          <div className="px-3 py-1.5 text-xs font-semibold text-purple-300/70 uppercase tracking-widest">Content</div>
          <a className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm">
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-orange-400" />
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            My Articles
          </a>
          <a href="/publisher/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-purple-200 hover:bg-white/5 hover:text-white text-sm transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Profile
          </a>
        </nav>

        <div className="px-6 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold shrink-0">P</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white">Publisher</div>
              <div className="text-xs text-purple-300">Author</div>
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
        <header className="bg-white border-b px-8 py-5 flex items-center justify-between gap-4 shadow-sm shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Articles</h1>
            <p className="text-sm text-gray-500 mt-0.5">Write and manage your health articles</p>
          </div>
          <a
            href="/publisher/editor"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm hover:shadow-md shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            New Article
          </a>
        </header>

        <main className="flex-1 overflow-y-auto p-8">

          {/* Filter tabs + search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1.5 w-fit">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    filter === tab.key ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  <span className={`text-xs ${filter === tab.key ? 'text-purple-200' : 'text-gray-400'}`}>{counts[tab.key]}</span>
                </button>
              ))}
            </div>

            <div className="relative max-w-xs">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles"
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition"
              />
            </div>
          </div>

          {/* Articles grid */}
          {loading ? (
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
              <p className="text-gray-500 text-sm">
                {search ? 'No articles match your search.' : filter === 'all' ? "You haven't written any articles yet." : `No ${filter} articles.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map(article => (
                <div key={article.id} className="group rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-40 bg-gray-100">
                    {article.cover_image_url ? (
                      <img src={article.cover_image_url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                    <div className="absolute top-3 left-3"><StatusBadge status={article.status} /></div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 leading-snug line-clamp-2">{article.title_en}</h3>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                      <span className={article.title_en ? 'text-purple-600 font-semibold' : ''}>EN</span>
                      <span>·</span>
                      <span className={article.title_kin ? 'text-purple-600 font-semibold' : ''}>KIN</span>
                      <span>·</span>
                      <span className={article.title_lug ? 'text-purple-600 font-semibold' : ''}>LUG</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                      Updated {new Date(article.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>

                    <div className="mt-4 flex items-center gap-1.5 pt-3 border-t border-gray-50">
                      <a
                        href={`/publisher/editor?id=${article.id}`}
                        title="Edit"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"/></svg>
                      </a>
                      {article.status === 'archived' ? (
                        <button
                          onClick={() => handleRestore(article)}
                          title="Restore to draft"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 010 10H8m-5-10l4-4m-4 4l4 4" /></svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleArchive(article)}
                          title="Archive"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 01-2-2V5a1 1 0 011-1h16a1 1 0 011 1v1a2 2 0 01-2 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8M10 12h4" /></svg>
                        </button>
                      )}
                      <button
                        onClick={() => setConfirmDelete(article)}
                        title="Delete"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      <button
                        onClick={() => setPreviewArticle(article)}
                        title="Preview"
                        className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Delete "{confirmDelete.title_en}"?</h2>
            <p className="text-sm text-gray-500 mt-1.5">This cannot be undone. The article will be permanently removed.</p>
            <div className="flex gap-3 pt-6">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteArticle}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Preview Modal */}
      {previewArticle && (
        <ArticlePreviewModal article={previewArticle} onClose={() => setPreviewArticle(null)} />
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
