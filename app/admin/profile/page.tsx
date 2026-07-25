"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProfileForm from '../../../components/ProfileForm'
import DashboardSidebar from '../../../components/DashboardSidebar'

const API = process.env.NEXT_PUBLIC_API_URL

export default function AdminProfile() {
  const router = useRouter()

  useEffect(() => {
    // Verify access in the background; redirect away if not an admin, but don't block rendering.
    fetch(`${API}/auth/me`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(me => {
        if (me.role !== 'admin') throw new Error()
      })
      .catch(() => router.push('/signin'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleLogout() {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
    router.push('/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <DashboardSidebar
        navGroups={[
          {
            label: 'Management',
            items: [
              {
                key: 'publishers',
                label: 'Publishers',
                icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a2 2 0 100-4 2 2 0 000 4zM3 16a2 2 0 100-4 2 2 0 000 4z',
                href: '/admin',
              },
              {
                key: 'articles',
                label: 'Articles',
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                href: '/admin',
              },
              {
                key: 'profile',
                label: 'Profile',
                icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
              },
            ],
          },
        ]}
        activeKey="profile"
        userInitial="A"
        userName="Admin"
        userRole="Administrator"
        onLogout={handleLogout}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-8 py-5 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Update your name and email address</p>
        </header>

        <main className="flex-1 p-8">
          <ProfileForm roleLabel="Administrator" />
        </main>
      </div>
    </div>
  )
}
