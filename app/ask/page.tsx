"use client"
import React, { useState } from 'react'

export default function Ask(){
  const [question, setQuestion] = useState('')
  const [language, setLanguage] = useState('en')
  const [messages, setMessages] = useState<any[]>([])

  async function submit(e: any){
    e.preventDefault()
    const q = { question, language }
    setMessages(prev => [...prev, { from: 'user', text: question }])
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/model/ask`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(q)
    })
    const data = await res.json()
    setMessages(prev => [...prev, { from: 'bot', text: data.answer }])
    setQuestion('')
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl">Ask a Question</h1>
      <div className="mt-4 max-w-xl">
        <div className="mb-2">
          <select value={language} onChange={e=>setLanguage(e.target.value)} className="border p-2">
            <option value="en">English</option>
            <option value="kin">Kinyarwanda</option>
            <option value="lug">Luganda</option>
          </select>
        </div>
        <div className="space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={m.from === 'user' ? 'text-right' : 'text-left'}>
              <div className="inline-block p-2 rounded bg-gray-100">{m.text}</div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="mt-4 flex gap-2">
          <input value={question} onChange={e=>setQuestion(e.target.value)} className="flex-1 border p-2" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
        </form>
      </div>
    </main>
  )
}
