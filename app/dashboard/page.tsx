'use client'

import { useEffect, useState } from 'react'

export default function OverviewPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/data/combined')
        if (!response.ok) throw new Error('Failed to fetch data')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-slate-200 rounded"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <h2 className="text-lg font-semibold text-red-800">Error Loading Dashboard</h2>
        <p className="text-red-700">{error}</p>
        <p className="text-sm text-red-600 mt-2">
          Make sure your Airtable API key and Google Sheets credentials are configured.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">KPI Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-600">Total Ad Spend</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">$--</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-600">Avg Conversion Rate</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">--%</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-600">Total Registrations</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">--</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-600">Event Attendance Rate</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">--%</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Data Status</h2>
        <p className="text-slate-600">API routes are loading. Check the console for details.</p>
      </div>
    </div>
  )
}
