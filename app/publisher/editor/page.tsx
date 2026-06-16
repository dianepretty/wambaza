"use client"
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function Editor(){
  const [titleEn, setTitleEn] = useState('')
  const [contentEn, setContentEn] = useState('')
  const [titleKin, setTitleKin] = useState('')
  const [contentKin, setContentKin] = useState('')
  const [titleLug, setTitleLug] = useState('')
  const [contentLug, setContentLug] = useState('')
  const [cover, setCover] = useState('')
  const params = useSearchParams()
  const router = useRouter()
  const id = params.get('id')

  useEffect(()=>{
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`).then(r=>r.json()).then(a=>{
        setTitleEn(a.title_en||'')
        setContentEn(a.content_en||'')
        setTitleKin(a.title_kin||'')
        setContentKin(a.content_kin||'')
        setTitleLug(a.title_lug||'')
        setContentLug(a.content_lug||'')
        setCover(a.cover_image_url||'')
      })
    }
  }, [id])

  async function save(e:any){
    e.preventDefault()
    const payload = {
      title_en: titleEn, content_en: contentEn,
      title_kin: titleKin, content_kin: contentKin,
      title_lug: titleLug, content_lug: contentLug,
      cover_image_url: cover
    }
    const url = id ? `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}` : `${process.env.NEXT_PUBLIC_API_URL}/articles`
    const method = id ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: {'Content-Type':'application/json'}, credentials: 'include', body: JSON.stringify(payload) })
    if (res.ok) router.push('/publisher')
    else alert('Save failed')
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl">Article Editor</h1>
      <form onSubmit={save} className="mt-4 space-y-3 max-w-2xl">
        <div>
          <label className="block">Title (English)</label>
          <input className="border p-2 w-full" value={titleEn} onChange={e=>setTitleEn(e.target.value)} />
        </div>
        <div>
          <label className="block">Content (English)</label>
          <textarea className="border p-2 w-full" rows={6} value={contentEn} onChange={e=>setContentEn(e.target.value)} />
        </div>
        <div>
          <label className="block">Title (Kinyarwanda)</label>
          <input className="border p-2 w-full" value={titleKin} onChange={e=>setTitleKin(e.target.value)} />
        </div>
        <div>
          <label className="block">Content (Kinyarwanda)</label>
          <textarea className="border p-2 w-full" rows={4} value={contentKin} onChange={e=>setContentKin(e.target.value)} />
        </div>
        <div>
          <label className="block">Title (Luganda)</label>
          <input className="border p-2 w-full" value={titleLug} onChange={e=>setTitleLug(e.target.value)} />
        </div>
        <div>
          <label className="block">Content (Luganda)</label>
          <textarea className="border p-2 w-full" rows={4} value={contentLug} onChange={e=>setContentLug(e.target.value)} />
        </div>
        <div>
          <label className="block">Cover Image URL</label>
          <input className="border p-2 w-full" value={cover} onChange={e=>setCover(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-500 text-white rounded">Save as Draft</button>
          <button type="button" onClick={async ()=>{
            // publish after save
            await save(new Event('submit'))
            const pubUrl = id ? `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}/publish` : null
          }} className="px-4 py-2 bg-green-600 text-white rounded">Publish</button>
        </div>
      </form>
    </main>
  )
}
