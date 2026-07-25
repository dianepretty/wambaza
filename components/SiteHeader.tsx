"use client"
import React from 'react'

type SiteHeaderProps = {
  active?: 'home' | 'stories' | 'feedback'
  className?: string
}

export default function SiteHeader({ active, className = 'border-b' }: SiteHeaderProps) {
  function linkClass(key: 'home' | 'stories' | 'feedback') {
    return active === key
      ? 'text-purple-700 font-semibold border-b-2 border-purple-700'
      : 'text-gray-700 hover:text-purple-700'
  }

  return (
    <header className={className}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6 w-full">
          <div className="flex-1">
            <a href="/" className="flex items-center gap-2 text-3xl font-black text-purple-700 tracking-wide">
              <svg className="w-7 h-7 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
              Wambaza
            </a>
          </div>
          <nav className="hidden md:flex gap-6 mx-auto">
            <a href="/" className={linkClass('home')}>Home</a>
            <a href="/stories" className={linkClass('stories')}>Stories</a>
            <a href="/feedback" className={linkClass('feedback')}>Feedback</a>
            <a href="/signin" className="text-gray-700 hover:text-purple-700">Sign in</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/ask" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">Ask AI</a>
          </div>
        </div>
      </div>
    </header>
  )
}
