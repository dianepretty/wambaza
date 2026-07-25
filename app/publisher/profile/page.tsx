"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import ProfileForm from '../../../components/ProfileForm'
import DashboardSidebar from '../../../components/DashboardSidebar'

const API = process.env.NEXT_PUBLIC_API_URL

export default function PublisherProfile() {
  const router = useRouter()

  async function handleLogout() {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
    router.push('/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <DashboardSidebar
        navGroups={[
          {
            label: 'Content',
            items: [
              {
                key: 'articles',
                label: 'My Articles',
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                href: '/publisher',
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
        userInitial="P"
        userName="Publisher"
        userRole="Author"
        onLogout={handleLogout}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-8 py-5 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Update your name and email address</p>
        </header>

        <main className="flex-1 p-8">
          <ProfileForm roleLabel="Publisher" />
        </main>
      </div>
    </div>
  )
}
