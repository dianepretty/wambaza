"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type Message = { from: 'user' | 'bot'; text: string; confidence?: number }

const SUGGESTIONS = [
  { q: 'What is puberty?', icon: 'M5 13l4 4L19 7' },
  { q: 'How can I prevent STIs?', icon: 'M9 12.75L11.25 15 15 9.75M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z' },
  { q: 'Is it normal to feel anxious about my body changing?', icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 17h.008v.008H12V17z' },
  { q: 'Where can I get contraception?', icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' },
]

const TRUST_BADGES = [
  { label: 'Private & anonymous', icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z' },
  { label: 'Confidence-scored', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z' },
  { label: 'KIN · LUG · SW · EN', icon: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0zM3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 000 18M12.5 3a17 17 0 010 18' },
]

function BotAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shrink-0 text-orange-400">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3"/>
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
        <circle cx="20" cy="10" r="2"/>
      </svg>
    </div>
  )
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  const tier = pct >= 75 ? 'high' : pct >= 45 ? 'medium' : 'low'
  const styles: Record<string, string> = {
    high: 'bg-green-50 text-green-700',
    medium: 'bg-amber-50 text-amber-700',
    low: 'bg-red-50 text-red-700',
  }
  const labels: Record<string, string> = {
    high: 'Confident',
    medium: 'Somewhat confident',
    low: "Not very sure — please verify with a professional",
  }
  return (
    <span className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-[11px] font-semibold ${styles[tier]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {labels[tier]} · {pct}%
    </span>
  )
}

export default function Ask() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const initialAsked = useRef(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const el = chatRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  useEffect(() => {
    if (initialAsked.current) return
    const q = searchParams.get('q')
    if (q) {
      initialAsked.current = true
      ask(q)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function ask(q: string) {
    if (!q.trim() || loading) return
    setMessages(prev => [...prev, { from: 'user', text: q }])
    setQuestion('')
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/model/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, language: 'auto' }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { from: 'bot', text: data.answer, confidence: data.confidence }])
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: "Sorry, something went wrong. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    ask(question)
  }

  return (
    <div className="h-screen bg-white relative overflow-hidden flex flex-col">

      {/* Soft background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      {/* Top nav */}
      <header className="relative z-10 border-b bg-white/80 backdrop-blur-sm shrink-0">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-2xl font-black text-purple-700 tracking-wide">
            <svg className="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
            Wambaza
          </a>
          <a href="/" className="text-sm text-gray-500 hover:text-purple-600 transition-colors">← Back to home</a>
        </div>
      </header>

      {/* Chat area — scroll container */}
      <main ref={chatRef} className="relative z-10 flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-2xl w-full mx-auto px-6 py-8 flex flex-col min-h-full">

        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ask me anything about your health</h1>
            <p className="mt-2 text-gray-500 max-w-md">
              Safe, judgment-free answers in Kinyarwanda, Luganda, Swahili, or English — whenever you need them.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {TRUST_BADGES.map(b => (
                <span key={b.label} className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={b.icon} /></svg>
                  {b.label}
                </span>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {SUGGESTIONS.map(s => (
                <button
                  key={s.q}
                  onClick={() => ask(s.q)}
                  className="flex items-start gap-3 bg-white border border-gray-100 hover:border-purple-300 hover:shadow-md text-left p-4 rounded-2xl transition-all"
                >
                  <span className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={s.icon} /></svg>
                  </span>
                  <span className="text-sm font-medium text-gray-700">{s.q}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="space-y-4 pb-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-end gap-2 ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.from === 'bot' && <BotAvatar />}
                <div
                  className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                    m.from === 'user'
                      ? 'bg-purple-600 text-white rounded-2xl rounded-br-md'
                      : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-bl-md shadow-sm'
                  }`}
                >
                  {m.text}
                  {m.from === 'bot' && typeof m.confidence === 'number' && (
                    <ConfidenceBadge confidence={m.confidence} />
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-end gap-2 justify-start">
                <BotAvatar />
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md shadow-sm px-4 py-3 flex items-center gap-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
        </div>
      </main>

      {/* Input bar */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm border-t shrink-0">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Type a question in Kinyarwanda, Luganda, Swahili or English"
              className="flex-1 border border-gray-200 rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="bg-orange-400 hover:bg-orange-500 disabled:opacity-50 text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.6563168,11.6889879 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99701575 L3.03521743,10.4380088 C3.03521743,10.5951061 3.34915502,10.5951061 3.50612381,10.5951061 L16.6915026,11.3805931 C16.6915026,11.3805931 17.1624089,11.3805931 17.1624089,11.88 C17.1624089,12.3813069 16.6915026,12.4744748 16.6915026,12.4744748 Z"/></svg>
            </button>
          </form>
          <p className="mt-2 text-center text-[11px] text-gray-400">Wambaza AI can be wrong — for emergencies, contact a health professional.</p>
        </div>
      </div>
    </div>
  )
}
