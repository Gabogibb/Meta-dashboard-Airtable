import { fetchDashboardData } from '@/lib/airtable'
import { KPICard } from '@/components/KPICard'
import { SimpleBarChart } from '@/components/BarChart'

export const revalidate = 300

export default async function FunnelPage() {
  const data = await fetchDashboardData()
  const { funnel } = data

  // Calculate conversion metrics
  const signupToAttendance = ((funnel.attended / funnel.totalSignups) * 100).toFixed(1)
  const signupToReplay = ((funnel.replayWatchers / funnel.totalSignups) * 100).toFixed(1)
  const attendanceToReplay = ((funnel.replayWatchers / funnel.attended) * 100).toFixed(1)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Webinar Funnel Analytics</h1>
        <p className="text-slate-600 text-sm mt-1">Track signups, attendance, and engagement across webinar events</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Signups"
          value={funnel.totalSignups}
          description="Registered attendees"
          gradient="bg-gradient-to-br from-blue-50 to-white"
          icon={<div className="text-3xl">📝</div>}
        />
        <KPICard
          title="Event Attendance"
          value={funnel.attended}
          description={`${signupToAttendance}% conversion`}
          gradient="bg-gradient-to-br from-emerald-50 to-white"
          icon={<div className="text-3xl">👥</div>}
        />
        <KPICard
          title="Replay Watchers"
          value={funnel.replayWatchers}
          description={`${funnel.replayRate}% watch rate`}
          gradient="bg-gradient-to-br from-purple-50 to-white"
          icon={<div className="text-3xl">▶️</div>}
        />
        <KPICard
          title="Regions Represented"
          value={funnel.topCountries.length}
          unit="countries"
          description={`Top: ${funnel.topCountries[0]?.name || 'N/A'}`}
          gradient="bg-gradient-to-br from-orange-50 to-white"
          icon={<div className="text-3xl">🌍</div>}
        />
      </div>

      {/* Funnel Visualization */}
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Conversion Funnel</h2>
        <div className="space-y-4">
          {[
            { label: 'Signups', value: funnel.totalSignups, color: 'bg-blue-500', percentage: 100 },
            { label: 'Attended Event', value: funnel.attended, color: 'bg-emerald-500', percentage: parseInt(signupToAttendance) },
            { label: 'Watched Replay', value: funnel.replayWatchers, color: 'bg-purple-500', percentage: parseInt(signupToReplay) }
          ].map((stage, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-900">{stage.label}</p>
                <p className="text-sm font-bold text-slate-900">{stage.value} ({stage.percentage}%)</p>
              </div>
              <div className="w-full h-8 bg-slate-100 rounded-lg overflow-hidden">
                <div
                  className={`h-full ${stage.color} rounded-lg transition-all duration-500 flex items-center justify-end pr-3`}
                  style={{ width: `${stage.percentage}%` }}
                >
                  {stage.percentage > 10 && <span className="text-white text-xs font-bold">{stage.percentage}%</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Geographic Distribution</h2>
          <SimpleBarChart
            data={funnel.topCountries.slice(0, 8).map((c: any) => ({
              name: c.name,
              value: c.count
            }))}
            color="#3b82f6"
            height={300}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Timezone Distribution</h2>
          <SimpleBarChart
            data={funnel.topTimezones.slice(0, 8).map((tz: any) => ({
              name: tz.name.split('/')[1] || tz.name,
              value: tz.count
            }))}
            color="#10b981"
            height={300}
          />
        </div>
      </div>

      {/* Event Types */}
      {funnel.eventTypes.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Event Type Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {funnel.eventTypes.map((et: any, idx: number) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                <p className="text-xs font-semibold text-slate-600 uppercase">{et.name}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{et.count}</p>
                <p className="text-xs text-slate-500 mt-1">{((et.count / funnel.totalSignups) * 100).toFixed(1)}% of signups</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registrants Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-lg font-semibold text-slate-900 mb-5">
          Registrants (showing {funnel.registrants.length} of {funnel.totalSignups})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Country</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Event Type</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Signup Date</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Attended</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Watched</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {funnel.registrants.map((r: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.name}</td>
                  <td className="px-4 py-3 text-slate-700 text-sm">{r.country}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{r.eventType}</td>
                  <td className="px-4 py-3 text-slate-700">{r.signupDate ? new Date(r.signupDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      r.cameToEvent === 'Yes'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {r.cameToEvent === 'Yes' ? '✓ Yes' : '✗ No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      r.cameToReplay === 'Yes'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {r.cameToReplay === 'Yes' ? '✓ Yes' : '✗ No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
