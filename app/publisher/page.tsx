"use client"
import React, { useEffect, useState } from 'react'

export default function PublisherPage(){
  const [articles, setArticles] = useState<any[]>([])

  useEffect(()=>{
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/my`, { credentials: 'include' }).then(r=>r.json()).then(setArticles)
  }, [])

  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Publisher Dashboard</h1>
        <a href="/publisher/editor" className="px-3 py-2 bg-blue-600 text-white rounded">New Article</a>
      </div>

      <section className="mt-4">
        {articles.map(a=> (
          <div key={a.id} className="border p-2 mb-2">
            <div className="flex justify-between">
              <div>{a.title_en} — {a.status}</div>
              <div>
                <a href={`/articles/${a.id}`} className="mr-2">View</a>
                <a href={`/publisher/editor?id=${a.id}`}>Edit</a>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}
