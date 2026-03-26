'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { name: 'Overview', href: '/dashboard', exact: true },
  { name: 'A/B Testing', href: '/dashboard/ab-testing', exact: false },
  { name: 'Funnel Analytics', href: '/dashboard/funnel', exact: false },
  { name: 'Meta Ads', href: '/dashboard/ads', exact: false },
  { name: 'Settings', href: '/dashboard/settings', exact: false },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
            <div className="text-sm text-slate-500">
              Last updated: <span id="last-update">just now</span>
            </div>
          </div>

          {/* Navigation tabs */}
          <nav className="flex space-x-1 border-b border-slate-200 -mb-px" aria-label="Tabs">
            {tabs.map((tab) => {
              const isActive = tab.exact
                ? pathname === tab.href
                : pathname.startsWith(tab.href) && tab.href !== '/dashboard'
              const isOverviewActive = pathname === '/dashboard' && tab.name === 'Overview'
              const active = isActive || isOverviewActive

              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    active
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {tab.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500 text-center">
            Analytics Dashboard • Data synchronized every 5-30 minutes
          </p>
        </div>
      </footer>
    </div>
  )
}
