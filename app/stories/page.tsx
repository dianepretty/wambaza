"use client"
import React, { useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import hero from '../../assets/images/hero.jpg'

const fetcher = (url: string) => fetch(url).then(r => r.json())

function readingTime(text?: string) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export default function Stories() {
  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/articles`, fetcher)
  const loading = !data && !error
  const articles = Array.isArray(data) ? data : []
  const [search, setSearch] = useState('')

  const filteredArticles = articles.filter((a: any) =>
    a.title_en?.toLowerCase().includes(search.toLowerCase()) ||
    a.content_en?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6 w-full">
            <div className="flex-1">
              <a href="/" className="flex items-center gap-2 text-3xl font-black text-purple-700 tracking-wide">
                <svg className="w-7 h-7 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
                Wambaza
              </a>
            </div>
            <nav className="hidden md:flex gap-6 mx-auto">
              <a href="/" className="text-gray-700 hover:text-purple-700">Home</a>
              <a href="/stories" className="text-purple-700 font-semibold border-b-2 border-purple-700">Stories</a>
              <a href="/signin" className="text-gray-700 hover:text-purple-700">Sign in</a>
            </nav>
            <div className="flex items-center gap-3">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold">Ask AI</button>
            </div>
          </div>
        </div>
      </header>

      {/* Header banner */}
      <section className="relative">
        <div className="h-72 md:h-96 w-full relative">
          <Image src={hero} alt="Wambaza stories" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-black/30 to-black/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full mb-4">REAL STORIES, REAL ANSWERS</div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">All Stories</h1>
            <p className="mt-3 text-purple-100 text-base md:text-lg max-w-xl">Explore every health article from the Wambaza community.</p>
          </div>
        </div>

        {/* Search bar floating over banner */}
        <div className="max-w-2xl mx-auto px-6 -mt-7 relative z-10">
          <div className="relative">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles by title or topic"
              className="w-full bg-white shadow-lg rounded-full pl-14 pr-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400 transition"
            />
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <p className="text-sm text-gray-500 mb-6">
          {loading ? 'Loading articles…' : `${filteredArticles.length} article${filteredArticles.length === 1 ? '' : 's'}${search ? ` matching "${search}"` : ''}`}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading && (
            <>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 bg-white animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                    <div className="h-3 bg-gray-200 rounded-full w-full" />
                    <div className="h-3 bg-gray-200 rounded-full w-5/6" />
                  </div>
                </div>
              ))}
            </>
          )}

          {!loading && filteredArticles.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
              </div>
              <p className="text-gray-500 text-sm">
                {search ? `No articles match "${search}".` : 'No articles published yet — check back soon.'}
              </p>
            </div>
          )}

          {!loading && filteredArticles.map((a: any) => (
            <a key={a.id} href={`/articles/${a.id}`} className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white block">
              <div className="relative h-48 overflow-hidden">
                <img src={a.cover_image_url || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Health</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-purple-700 transition-colors">{a.title_en}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">{a.content_en?.slice(0, 120)}...</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{readingTime(a.content_en)} min read</span>
                  <span className="text-purple-600 text-xs font-semibold group-hover:underline">Read more →</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex flex-col items-center text-center">
            <span className="flex items-center gap-2 text-4xl font-black text-gray-900 tracking-wide">
              <svg className="w-8 h-8 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
              Wambaza
            </span>
            <p className="mt-3 text-gray-500 text-sm max-w-sm leading-relaxed">
              Safe, private, and accurate health information for every adolescent — in Kinyarwanda, Luganda, and English.
            </p>
            <div className="mt-8 w-16 h-[2px] bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 rounded-full" />
          </div>
          <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <span>© {new Date().getFullYear()} Wambaza. All rights reserved.</span>
            <span className="flex items-center gap-1">Made with <span className="text-orange-400">♥</span> for adolescents everywhere</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
