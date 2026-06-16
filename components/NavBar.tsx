"use client"
import Link from 'next/link'
import React from 'react'

export default function NavBar(){
  return (
    <nav className="flex items-center justify-between">
      <Link href="/" className="text-xl font-bold">Wambaza</Link>
      <div className="space-x-4">
        <Link href="/ask">Ask a Question</Link>
        <Link href="/signin">Sign In</Link>
      </div>
    </nav>
  )
}
