"use client"
import React, { useState, useEffect } from 'react'

type Lang = 'en' | 'kin' | 'lug'

const LANGS: { key: Lang; label: string }[] = [
  { key: 'en', label: 'English' },
  { key: 'kin', label: 'Kinyarwanda' },
  { key: 'lug', label: 'Luganda' },
]

export default function Article({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<any>(null)
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${params.id}`).then(r => r.json()).then(setArticle)
  }, [params.id])

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center gap-3 text-gray-400">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          <span className="text-sm font-medium">Loading article…</span>
        </div>
      </div>
    )
  }

  const available: Record<Lang, boolean> = {
    en: Boolean(article.title_en && article.content_en),
    kin: Boolean(article.title_kin && article.content_kin),
    lug: Boolean(article.title_lug && article.content_lug),
  }

  const title = lang === 'en' ? article.title_en : lang === 'kin' ? article.title_kin : article.title_lug
  const content = lang === 'en' ? article.content_en : lang === 'kin' ? article.content_kin : article.content_lug
  const wordCount = (article.content_en || '').trim().split(/\s+/).filter(Boolean).length
  const readingMinutes = Math.max(1, Math.round(wordCount / 200))

  return (
    <main className="min-h-screen bg-white">
      {/* Top nav */}
      <header className="border-b">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Wambaza
          </a>
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-72 md:h-[28rem] w-full">
        {article.cover_image_url ? (
          <img src={article.cover_image_url} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-700 to-purple-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-3xl mx-auto px-6 pb-8 w-full">
            <span className="inline-block bg-orange-400 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">Health</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">{title}</h1>
            <div className="mt-4 flex items-center gap-3 text-purple-100 text-sm">
              <span>
                {new Date(article.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="w-1 h-1 rounded-full bg-purple-300" />
              <span>{readingMinutes} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Language switcher */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-2 -mt-px pt-6">
          {LANGS.map(l => (
            <button
              key={l.key}
              onClick={() => available[l.key] && setLang(l.key)}
              disabled={!available[l.key]}
              title={!available[l.key] ? 'Not available in this language' : undefined}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                lang === l.key
                  ? 'bg-purple-600 text-white'
                  : available[l.key]
                  ? 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-10">
        {available[lang] ? (
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {content}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p>This article isn't available in {LANGS.find(l => l.key === lang)?.label} yet.</p>
          </div>
        )}
      </article>

      {/* Footer divider */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="border-t pt-8 flex items-center justify-between text-sm text-gray-400">
          <span>© {new Date().getFullYear()} Wambaza</span>
          <a href="/" className="text-purple-600 hover:text-purple-700 font-semibold">More articles →</a>
        </div>
      </div>
    </main>
  )
}
