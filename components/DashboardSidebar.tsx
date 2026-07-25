"use client"
import React from 'react'

export type SidebarNavItem = {
  key: string
  label: string
  icon: string
  href?: string
  onClick?: () => void
}

export type SidebarNavGroup = {
  label: string
  items: SidebarNavItem[]
}

type DashboardSidebarProps = {
  navGroups: SidebarNavGroup[]
  activeKey: string
  userInitial: string
  userName: string
  userRole: string
  onLogout: () => void
}

export default function DashboardSidebar({ navGroups, activeKey, userInitial, userName, userRole, onLogout }: DashboardSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-purple-800 to-purple-950 shrink-0 shadow-xl shadow-purple-900/30 z-10">
      <div className="px-6 py-6 border-b border-white/10">
        <a href="/" className="flex items-center gap-2">
          <svg className="w-7 h-7 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3"/>
            <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
            <circle cx="20" cy="10" r="2"/>
          </svg>
          <span className="text-xl font-black text-white tracking-wide">Wambaza</span>
        </a>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {navGroups.map(group => (
          <div key={group.label}>
            <div className="px-3 py-1.5 text-xs font-semibold text-purple-300/70 uppercase tracking-widest">{group.label}</div>
            {group.items.map(item => {
              const active = item.key === activeKey
              const className = `relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                active ? 'bg-white/10 text-white' : 'text-purple-200 hover:bg-white/5 hover:text-white'
              }`
              const content = (
                <>
                  {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-orange-400" />}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  {item.label}
                </>
              )
              if (item.href) {
                return <a key={item.key} href={item.href} className={className}>{content}</a>
              }
              if (item.onClick) {
                return <button key={item.key} onClick={item.onClick} className={className}>{content}</button>
              }
              return <span key={item.key} className={className}>{content}</span>
            })}
          </div>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold shrink-0">{userInitial}</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white">{userName}</div>
            <div className="text-xs text-purple-300">{userRole}</div>
          </div>
          <button
            onClick={onLogout}
            title="Log out"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
