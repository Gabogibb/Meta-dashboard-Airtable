'use client'

import { useMetrics } from '@/lib/hooks/useMetrics'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { KPICard } from '@/components/KPICard'

export default function FunnelPage() {
  const { data, loading, error, refetch } = useMetrics()

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-800">Error Loading Funnel Data</h2>
        <p className="text-red-700 mt-2">{error}</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data || data.funnelRecords.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Funnel Analytics</h1>
        <p className="text-slate-600">No funnel data available yet.</p>
      </div>
    )
  }

  const metrics = data.funnelMetrics

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Webinar Funnel Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KPICard
          title="Total Signups"
          value={metrics?.totalSignups || 0}
          unit="registrations"
        />
        <KPICard
          title="Event Attendance"
          value={metrics?.attendees || 0}
          unit="attendees"
        />
        <KPICard
          title="Attendance Rate"
          value={metrics?.attendanceRate || '0'}
          unit="%"
        />
        <KPICard
          title="Replay Watchers"
          value={metrics?.replayWatchers || 0}
          unit="viewers"
        />
      </div>

      {/* Geographic Breakdown */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Top Countries */}
        {metrics?.topCountries && metrics.topCountries.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Countries</h2>
            <div className="space-y-3">
              {metrics.topCountries.slice(0, 8).map((country, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <p className="text-sm text-slate-700">{country.value || 'Unknown'}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${(country.count / metrics.topCountries[0].count) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-sm font-medium text-slate-900 w-12 text-right">{country.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Timezones */}
        {metrics?.topTimeZones && metrics.topTimeZones.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Timezones</h2>
            <div className="space-y-3">
              {metrics.topTimeZones.slice(0, 8).map((tz, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <p className="text-sm text-slate-700">{tz.value || 'Unknown'}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width: `${(tz.count / metrics.topTimeZones[0].count) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-sm font-medium text-slate-900 w-12 text-right">{tz.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registrants Table */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Registrants ({data.funnelRecords.length} total)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Country</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Signup Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Attended</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Replay</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Timezone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.funnelRecords.slice(0, 20).map((record) => (
                <tr key={record.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{record.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{record.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{record.country || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {record.signupDate ? new Date(record.signupDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        record.cameToEvent === 'Yes' || record.cameToEvent === 'yes'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {record.cameToEvent || 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        record.cameToReplay === 'Yes' || record.cameToReplay === 'yes'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {record.cameToReplay || 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{record.timezone || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.funnelRecords.length > 20 && (
          <p className="mt-4 text-sm text-slate-600">
            Showing 20 of {data.funnelRecords.length} registrants
          </p>
        )}
      </div>
    </div>
  )
}
