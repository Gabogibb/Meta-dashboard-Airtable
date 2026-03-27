'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { name: '📊 Overview', href: '/dashboard', exact: true },
  { name: '🧪 A/B Testing', href: '/dashboard/ab-testing', exact: false },
  { name: '📈 Funnel', href: '/dashboard/funnel', exact: false },
  { name: '💰 Meta Ads', href: '/dashboard/ads', exact: false },
  { name: '⚙️ Settings', href: '/dashboard/settings', exact: false },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-gradient-to-r from-white to-slate-50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-1">Real-time insights from Airtable & Google Sheets</p>
            </div>
            <div className="text-xs text-slate-500 text-right">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Sync Enabled</span>
              </div>
            </div>
          </div>

          {/* Navigation tabs */}
          <nav className="flex overflow-x-auto gap-1 pb-px" aria-label="Tabs">
            {tabs.map((tab) => {
              const isActive = tab.exact
                ? pathname === tab.href
                : pathname.startsWith(tab.href) && tab.href !== '/dashboard'
              const isOverviewActive = pathname === '/dashboard' && tab.name.includes('Overview')
              const active = isActive || isOverviewActive

              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-300 whitespace-nowrap ${
                    active
                      ? 'bg-white text-blue-600 shadow-md border-b-2 border-blue-500'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
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
      <main className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-900">Sync Frequency</p>
              <p className="text-xs text-slate-600 mt-1">Every 5 minutes with ISR</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-900">Data Sources</p>
              <p className="text-xs text-slate-600 mt-1">Airtable + Google Sheets</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-900">Status</p>
              <p className="text-xs text-emerald-600 mt-1">✓ All systems operational</p>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-6">
            <p className="text-xs text-slate-500 text-center">
              Analytics Dashboard • Built with Next.js 14 • Powered by Airtable API
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
