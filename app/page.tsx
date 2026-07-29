"use client"
import React, { useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import hero from '../assets/images/hero.jpg'
import SiteHeader from '../components/SiteHeader'

const fetcher = (url: string) => fetch(url).then(r => r.json())

function readingTime(text?: string) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export default function Home() {
  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/articles`, fetcher)
  const loading = !data && !error
  const articles = Array.isArray(data) ? data.slice(0, 3) : []
  const [question, setQuestion] = useState('')
  const router = useRouter()

  function handleAskSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    router.push(question.trim() ? `/ask?q=${encodeURIComponent(question)}` : '/ask')
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <SiteHeader active="home" />

      {/* Hero */}
      <section className="relative">
        <div className="h-96 md:h-[720px] w-full relative">
          <Image
            src={hero}
            alt="hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black/20 to-black/60" />
          <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex items-center">
            <div className="text-white max-w-xl bg-white/5 backdrop-blur-sm p-6 rounded-xl">
              <div className="inline-block bg-white/20 text-xs px-3 py-1 rounded-full">EMPOWERING YOUR JOURNEY</div>
              <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">Your <span className="text-purple-300">Health</span>, Your Future</h1>
              <p className="mt-4 text-base md:text-lg lg:text-xl max-w-md">Empathetic, reliable, and expert health information tailored for adolescents. Discover your path to well-being with Wambaza.</p>
              <div className="mt-6 flex gap-3">
                <a href="/stories" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition-colors">Explore Health Topics →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ask AI Banner */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Ask anything about your health</h3>
            <p className="text-sm text-gray-600">Our AI assistant is here to provide safe, private, and accurate health information.</p>
          </div>
          <div className="w-full md:w-1/2">
            <form onSubmit={handleAskSubmit} className="flex gap-2">
              <input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Type a question in Kinyarwanda, Luganda or English" className="flex-1 border rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder:text-sm" />
              <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-full flex items-center justify-center hover:shadow-lg hover:bg-purple-700 transition-all duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.6563168,11.6889879 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99701575 L3.03521743,10.4380088 C3.03521743,10.5951061 3.34915502,10.5951061 3.50612381,10.5951061 L16.6915026,11.3805931 C16.6915026,11.3805931 17.1624089,11.3805931 17.1624089,11.88 C17.1624089,12.3813069 16.6915026,12.4744748 16.6915026,12.4744748 Z"/></svg>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Latest Stories */}
      <section className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Latest Stories</h2>
            <p className="text-sm text-gray-600">Real experiences from our community</p>
          </div>
          <a href="/stories" className="text-purple-600 hover:text-purple-700 font-medium">View All Stories →</a>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading && (
            <>
              {[1,2,3].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 bg-white animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                    <div className="h-3 bg-gray-200 rounded-full w-full" />
                    <div className="h-3 bg-gray-200 rounded-full w-5/6" />
                    <div className="flex justify-between pt-1">
                      <div className="h-3 bg-gray-200 rounded-full w-16" />
                      <div className="h-3 bg-gray-200 rounded-full w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {!loading && articles.length === 0 && (
            <>
              {[1,2,3].map(i => (
                <div key={i} className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white">
                  <div className="relative h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Health</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-purple-700 transition-colors">Placeholder Story Title</h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">A short excerpt about the story to give readers a quick preview of what to expect.</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-400">5 min read</span>
                      <span className="text-purple-600 text-xs font-semibold group-hover:underline">Read more →</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {!loading && articles.map((a: any) => (
            <a key={a.id} href={`/articles/${a.id}`} className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white block">
              <div className="relative h-48 overflow-hidden">
                <img src={a.cover_image_url?.startsWith('http') ? a.cover_image_url : 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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

      {/* Analytics */}
      <section className="mt-16 bg-gradient-to-br from-purple-700 to-purple-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-purple-300 text-xs font-semibold uppercase tracking-widest">By the numbers</span>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">Built for trust and safety</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* gradient border wrapper technique: 1px gradient bg + inner bg */}
            <div className="p-[1px] rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 hover:from-orange-300 hover:to-purple-400 transition-all duration-300">
              <div className="bg-purple-800/90 backdrop-blur-sm rounded-2xl p-6 text-center h-full">
                <div className="text-3xl md:text-4xl font-extrabold text-orange-400">3</div>
                <div className="mt-3 text-white font-semibold text-sm">LANGUAGES</div>
                <p className="mt-2 text-purple-200 text-xs leading-relaxed">Ask your questions in Kinyarwanda, Luganda, or English.</p>
              </div>
            </div>
            <div className="p-[1px] rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 hover:from-orange-300 hover:to-purple-400 transition-all duration-300">
              <div className="bg-purple-800/90 backdrop-blur-sm rounded-2xl p-6 text-center h-full">
                <div className="text-3xl md:text-4xl font-extrabold text-orange-400">100%</div>
                <div className="mt-3 text-white font-semibold text-sm">CONFIDENTIAL</div>
                <p className="mt-2 text-purple-200 text-xs leading-relaxed">Your questions stay private. No names, no judgement.</p>
              </div>
            </div>
            <div className="p-[1px] rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 hover:from-orange-300 hover:to-purple-400 transition-all duration-300">
              <div className="bg-purple-800/90 backdrop-blur-sm rounded-2xl p-6 text-center h-full">
                <div className="text-3xl md:text-4xl font-extrabold text-orange-400">24/7</div>
                <div className="mt-3 text-white font-semibold text-sm">AI SUPPORT</div>
                <p className="mt-2 text-purple-200 text-xs leading-relaxed">Get health guidance any time of day or night, in your language.</p>
              </div>
            </div>
            <div className="p-[1px] rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 hover:from-orange-300 hover:to-purple-400 transition-all duration-300">
              <div className="bg-purple-800/90 backdrop-blur-sm rounded-2xl p-6 text-center h-full">
                <div className="text-3xl md:text-4xl font-extrabold text-orange-400">✔</div>
                <div className="mt-3 text-white font-semibold text-sm">VERIFIED INFO</div>
                <p className="mt-2 text-purple-200 text-xs leading-relaxed">All health articles are reviewed and approved by medical professionals.</p>
              </div>
            </div>
          </div>
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
            <a href="/terms" className="hover:text-purple-700">Terms &amp; Privacy Policy</a>
            <span className="flex items-center gap-1">Made with <span className="text-orange-400">♥</span> for adolescents everywhere</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
