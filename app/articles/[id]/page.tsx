"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Article({ params }: { params: { id: string } }){
  const [article, setArticle] = useState<any>(null)
  useEffect(()=>{
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${params.id}`).then(r=>r.json()).then(setArticle)
  }, [params.id])

  if (!article) return <div className="p-6">Loading...</div>

  const [lang, setLang] = useState('en')
  const title = lang === 'en' ? article.title_en : lang === 'kin' ? article.title_kin : article.title_lug
  const content = lang === 'en' ? article.content_en : lang === 'kin' ? article.content_kin : article.content_lug

  return (
    <main className="p-6">
      <img src={article.cover_image_url || '/placeholder.png'} className="w-full h-64 object-cover rounded" />
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="space-x-2">
          <button onClick={()=>setLang('en')} className="px-2 py-1 border">EN</button>
          <button onClick={()=>setLang('kin')} className="px-2 py-1 border">KIN</button>
          <button onClick={()=>setLang('lug')} className="px-2 py-1 border">LUG</button>
        </div>
      </div>
      <article className="mt-4 prose max-w-none">{content}</article>
    </main>
  )
}
