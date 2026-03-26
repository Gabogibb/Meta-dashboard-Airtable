import { fetchDashboardData } from '@/lib/airtable'

export const revalidate = 300

export default async function FunnelPage() {
  const data = await fetchDashboardData()
  const { funnel } = data

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Webinar Funnel Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Total Signups</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{funnel.totalSignups}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Event Attendance</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{funnel.attended}</p>
          <p className="text-xs text-slate-500 mt-1">{funnel.attendanceRate}% of signups</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Replay Watchers</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{funnel.replayWatchers}</p>
          <p className="text-xs text-slate-500 mt-1">{funnel.replayRate}% watch rate</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Countries</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{funnel.topCountries.length}+</p>
        </div>
      </div>

      {/* Geographic Breakdown */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Countries</h2>
          <div className="space-y-3">
            {funnel.topCountries.slice(0, 8).map((c: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <p className="text-sm text-slate-700">{c.name}</p>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(c.count / funnel.topCountries[0].count) * 100}%` }} />
                  </div>
                  <p className="text-sm font-medium text-slate-900 w-8 text-right">{c.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Timezones</h2>
          <div className="space-y-3">
            {funnel.topTimezones.slice(0, 8).map((tz: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <p className="text-sm text-slate-700 truncate max-w-[160px]">{tz.name}</p>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(tz.count / funnel.topTimezones[0].count) * 100}%` }} />
                  </div>
                  <p className="text-sm font-medium text-slate-900 w-8 text-right">{tz.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Types */}
      {funnel.eventTypes.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Event Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {funnel.eventTypes.map((et: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-600">{et.name}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{et.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registrants Table */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Recent Registrants (showing {funnel.registrants.length} of {funnel.totalSignups})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Country</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Event Type</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Signup</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Attended</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Replay</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Timezone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {funnel.registrants.map((r: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.name}</td>
                  <td className="px-4 py-3 text-slate-700">{r.country}</td>
                  <td className="px-4 py-3 text-slate-700 text-xs">{r.eventType}</td>
                  <td className="px-4 py-3 text-slate-700">{r.signupDate ? new Date(r.signupDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.cameToEvent === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                      {r.cameToEvent || 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.cameToReplay === 'Yes' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
                      {r.cameToReplay || 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{r.timezone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
