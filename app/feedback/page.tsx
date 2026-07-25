"use client"
import React, { useState } from 'react'
import SiteHeader from '../../components/SiteHeader'

const API = process.env.NEXT_PUBLIC_API_URL

type FeedbackType = 'articles' | 'chat'

export default function FeedbackPage() {
  const [type, setType] = useState<FeedbackType>('articles')
  const [message, setMessage] = useState('')
  const [chatQuestion, setChatQuestion] = useState('')
  const [chatAnswer, setChatAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  function resetForm() {
    setMessage(''); setChatQuestion(''); setChatAnswer('')
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await fetch(`${API}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          type === 'chat'
            ? { type, message, chat_question: chatQuestion, chat_answer: chatAnswer }
            : { type, message }
        ),
      })
      if (!res.ok) {
        setError('Failed to send feedback. Please try again.')
        return
      }
      resetForm()
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <SiteHeader active="feedback" className="relative z-10 border-b bg-white/80 backdrop-blur-sm" />

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {sent ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Thank you for your feedback!</h1>
            <p className="mt-2 text-sm text-gray-500">We've received your message and will use it to improve Wambaza.</p>
            <button
              onClick={() => setSent(false)}
              className="mt-6 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
            >
              Send more feedback
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Share your feedback</h1>
            <p className="mt-2 text-gray-500">Tell us what's working and what isn't — it helps us make Wambaza better.</p>

            <form onSubmit={handleSubmit} className="mt-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What is your feedback about?</label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1.5 w-fit">
                  {(['articles', 'chat'] as FeedbackType[]).map(key => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setType(key)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        type === key ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {key === 'articles' ? 'Articles' : 'Chat feature'}
                    </button>
                  ))}
                </div>
              </div>

              {type === 'chat' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">The question you asked the chat</label>
                    <textarea
                      required
                      value={chatQuestion}
                      onChange={e => setChatQuestion(e.target.value)}
                      placeholder="e.g. What is puberty?"
                      rows={2}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">The chat's answer</label>
                    <textarea
                      required
                      value={chatAnswer}
                      onChange={e => setChatAnswer(e.target.value)}
                      placeholder="Paste the answer the chat gave you"
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition resize-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your feedback</label>
                <textarea
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={type === 'chat' ? 'What did you think of this answer?' : 'What did you think of our articles?'}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition resize-none"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  <span className="mt-0.5">⚠</span> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-full transition-colors"
              >
                {loading ? 'Sending…' : 'Send Feedback'}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  )
}
