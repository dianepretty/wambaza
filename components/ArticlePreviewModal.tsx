"use client"
import React, { useState } from 'react'

type Lang = 'en' | 'kin' | 'lug'

const LANGS: { key: Lang; label: string }[] = [
  { key: 'en', label: 'English' },
  { key: 'kin', label: 'Kinyarwanda' },
  { key: 'lug', label: 'Luganda' },
]

type PreviewArticle = {
  title_en: string
  title_kin?: string
  title_lug?: string
  content_en: string
  content_kin?: string
  content_lug?: string
  cover_image_url?: string
  status: string
}

export default function ArticlePreviewModal({ article, onClose }: { article: PreviewArticle; onClose: () => void }) {
  const [lang, setLang] = useState<Lang>('en')

  const available: Record<Lang, boolean> = {
    en: Boolean(article.title_en && article.content_en),
    kin: Boolean(article.title_kin && article.content_kin),
    lug: Boolean(article.title_lug && article.content_lug),
  }

  const title = lang === 'en' ? article.title_en : lang === 'kin' ? article.title_kin : article.title_lug
  const content = lang === 'en' ? article.content_en : lang === 'kin' ? article.content_kin : article.content_lug

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 text-gray-500 hover:text-gray-900 hover:bg-white shadow-sm transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        {article.cover_image_url ? (
          <img src={article.cover_image_url} className="w-full h-56 object-cover rounded-t-2xl" />
        ) : (
          <div className="w-full h-32 bg-gradient-to-br from-purple-700 to-purple-900 rounded-t-2xl" />
        )}

        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            {LANGS.map(l => (
              <button
                key={l.key}
                onClick={() => available[l.key] && setLang(l.key)}
                disabled={!available[l.key]}
                title={!available[l.key] ? 'Not available in this language' : undefined}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
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

          {available[lang] ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 leading-snug">{title}</h2>
              <div className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">{content}</div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm">
              This article isn't available in {LANGS.find(l => l.key === lang)?.label} yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
