"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL

type Lang = 'kin' | 'lug' | 'en'

const LANGS: { key: Lang; label: string }[] = [
  { key: 'kin', label: 'Kinyarwanda' },
  { key: 'lug', label: 'Luganda' },
  { key: 'en', label: 'English' },
]

export default function Editor() {
  const [activeLang, setActiveLang] = useState<Lang>('kin')
  const [titleEn, setTitleEn] = useState('')
  const [contentEn, setContentEn] = useState('')
  const [titleKin, setTitleKin] = useState('')
  const [contentKin, setContentKin] = useState('')
  const [titleLug, setTitleLug] = useState('')
  const [contentLug, setContentLug] = useState('')
  const [cover, setCover] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState<'draft' | 'publish' | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const params = useSearchParams()
  const router = useRouter()
  const id = params.get('id')

  useEffect(() => {
    if (id) {
      fetch(`${API}/articles/${id}`, { credentials: 'include' }).then(r => r.json()).then(a => {
        setTitleEn(a.title_en || '')
        setContentEn(a.content_en || '')
        setTitleKin(a.title_kin || '')
        setContentKin(a.content_kin || '')
        setTitleLug(a.title_lug || '')
        setContentLug(a.content_lug || '')
        setCover(a.cover_image_url || '')
      })
    }
  }, [id])

  const fields: Record<Lang, { title: string; setTitle: (v: string) => void; content: string; setContent: (v: string) => void }> = {
    kin: { title: titleKin, setTitle: setTitleKin, content: contentKin, setContent: setContentKin },
    lug: { title: titleLug, setTitle: setTitleLug, content: contentLug, setContent: setContentLug },
    en:  { title: titleEn,  setTitle: setTitleEn,  content: contentEn,  setContent: setContentEn  },
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${API}/articles/upload-image`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      if (!res.ok) {
        setError('Image upload failed. Please try a different file.')
        return
      }
      const body = await res.json()
      setCover(body.url)
    } catch {
      setError('Image upload failed. Please check your connection.')
    } finally {
      setUploading(false)
    }
  }

  async function saveArticle(): Promise<number | null> {
    const payload = {
      title_en: titleEn, content_en: contentEn,
      title_kin: titleKin || null, content_kin: contentKin || null,
      title_lug: titleLug || null, content_lug: contentLug || null,
      cover_image_url: cover || null,
    }
    const url = id ? `${API}/articles/${id}` : `${API}/articles`
    const method = id ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.detail ?? 'Could not save article.')
      return null
    }
    const saved = await res.json()
    return saved.id
  }

  async function handleSaveDraft() {
    setError('')
    if (!titleEn.trim() || !contentEn.trim()) {
      setError('English title and content are required.')
      setActiveLang('en')
      return
    }
    setSaving('draft')
    try {
      const savedId = await saveArticle()
      if (savedId) router.push('/publisher')
    } finally {
      setSaving(null)
    }
  }

  async function handlePublish() {
    setError('')
    if (!titleEn.trim() || !contentEn.trim()) {
      setError('English title and content are required.')
      setActiveLang('en')
      return
    }
    setSaving('publish')
    try {
      const savedId = await saveArticle()
      if (!savedId) return
      await fetch(`${API}/articles/${savedId}/publish`, { method: 'PATCH', credentials: 'include' })
      router.push('/publisher')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <a href="/publisher" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          My Articles
        </a>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={saving !== null}
            className="border border-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-xl text-sm hover:border-gray-300 disabled:opacity-60 transition-colors"
          >
            {saving === 'draft' ? 'Saving…' : 'Save as Draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving !== null}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            {saving === 'publish' ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit Article' : 'New Article'}</h1>
        <p className="mt-1 text-sm text-gray-500">Add translations in Kinyarwanda and Luganda. English is required.</p>

        {error && (
          <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <span className="mt-0.5">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Cover image */}
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Header image</label>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          {cover ? (
            <div className="relative h-56 rounded-2xl overflow-hidden border border-gray-200 group">
              <img src={cover} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white text-gray-900 text-sm font-semibold px-4 py-2 rounded-xl"
                >
                  Change
                </button>
                <button
                  onClick={() => setCover('')}
                  className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl"
                >
                  Remove
                </button>
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm font-medium text-gray-600">Uploading…</div>
              )}
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full h-56 rounded-2xl border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-purple-500 transition-colors"
            >
              {uploading ? (
                <span className="text-sm font-medium">Uploading…</span>
              ) : (
                <>
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-sm font-medium">Click to upload a header image</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Language tabs */}
        <div className="mt-8 flex items-center gap-2 border-b border-gray-200">
          {LANGS.map(lang => {
            const filled = fields[lang.key].title.trim() && fields[lang.key].content.trim()
            return (
              <button
                key={lang.key}
                onClick={() => setActiveLang(lang.key)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  activeLang === lang.key ? 'text-purple-700' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {lang.label}
                {lang.key !== 'en' && (
                  <span className={`w-1.5 h-1.5 rounded-full ${filled ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
                {activeLang === lang.key && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-purple-600 rounded-full" />}
              </button>
            )
          })}
        </div>

        {/* Active language fields */}
        <div className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title {activeLang === 'en' && <span className="text-red-500">*</span>}
            </label>
            <input
              value={fields[activeLang].title}
              onChange={e => fields[activeLang].setTitle(e.target.value)}
              placeholder={`Article title in ${LANGS.find(l => l.key === activeLang)?.label}`}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Content {activeLang === 'en' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={fields[activeLang].content}
              onChange={e => fields[activeLang].setContent(e.target.value)}
              rows={14}
              placeholder={`Write the article content in ${LANGS.find(l => l.key === activeLang)?.label}`}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition resize-none"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
