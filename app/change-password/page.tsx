"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ChangePassword(){
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const router = useRouter()

  async function submit(e: any){
    e.preventDefault()
    if (newPassword !== confirm) return alert('Passwords do not match')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      credentials: 'include',
      body: JSON.stringify({ new_password: newPassword })
    })
    if (res.ok) router.push('/')
    else alert('Could not change password')
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl">Change Password</h1>
      <form onSubmit={submit} className="mt-4 max-w-md">
        <label className="block">New Password</label>
        <input type="password" className="border p-2 w-full" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
        <label className="block mt-2">Confirm New Password</label>
        <input type="password" className="border p-2 w-full" value={confirm} onChange={e=>setConfirm(e.target.value)} />
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Change Password</button>
      </form>
    </main>
  )
}
