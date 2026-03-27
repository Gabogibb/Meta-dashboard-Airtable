import { fetchDashboardData } from '@/lib/airtable'
import { KPICard } from '@/components/KPICard'

// Revalidate every 5 minutes to sync with Airtable
export const revalidate = 300

export default async function OverviewPage() {
  const data = await fetchDashboardData()
  const { abTests, funnel, ads } = data
  const latestTest = abTests[0]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-2">
            Last synced: {new Date(data.lastUpdated).toLocaleString()}
            <span className="ml-2 inline-flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${data.source === 'live' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
              {data.source === 'live' ? 'Live from Airtable' : 'Using cached data'}
            </span>
          </p>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Ad Spend"
          value={`$${ads.summary.totalSpend}`}
          description={`${ads.totalRecords} ads tracked`}
          gradient="bg-gradient-to-br from-blue-50 to-white"
          icon={<div className="text-3xl">💰</div>}
        />
        <KPICard
          title="Webinar Signups"
          value={funnel.totalSignups}
          description={`${funnel.attended} attended (${funnel.attendanceRate}%)`}
          gradient="bg-gradient-to-br from-purple-50 to-white"
          icon={<div className="text-3xl">👥</div>}
        />
        <KPICard
          title="Total Leads"
          value={ads.summary.totalLeads}
          unit="leads"
          description={`CPL: $${ads.summary.costPerLead}`}
          gradient="bg-gradient-to-br from-emerald-50 to-white"
          icon={<div className="text-3xl">🎯</div>}
        />
        <KPICard
          title="Avg CTR"
          value={ads.summary.averageCTR}
          unit="%"
          description={`CPC: $${ads.summary.averageCPC}`}
          gradient="bg-gradient-to-br from-orange-50 to-white"
          icon={<div className="text-3xl">📊</div>}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <KPICard
          title="A/B Tests"
          value={abTests.length}
          unit="active"
          description={`Leader: ${latestTest?.currentLeader || 'None'}`}
          gradient="bg-gradient-to-br from-pink-50 to-white"
          icon={<div className="text-3xl">🧪</div>}
        />
        <KPICard
          title="Total Impressions"
          value={(ads.summary.totalImpressions / 1000).toFixed(1)}
          unit="K"
          description={`Reach: ${(ads.summary.totalReach / 1000).toFixed(1)}K`}
          gradient="bg-gradient-to-br from-indigo-50 to-white"
          icon={<div className="text-3xl">👁️</div>}
        />
        <KPICard
          title="Replay Watch Rate"
          value={funnel.replayRate}
          unit="%"
          description={`${funnel.replayWatchers} watchers`}
          gradient="bg-gradient-to-br from-cyan-50 to-white"
          icon={<div className="text-3xl">▶️</div>}
        />
      </div>

      {/* Latest A/B Test + Top Countries */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {latestTest && (
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900">Latest A/B Test</h2>
              <span className="text-xs font-semibold px-2 py-1 rounded-md bg-blue-100 text-blue-700">{latestTest.currentLeader} Winner</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">{latestTest.date}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                <p className="text-xs font-medium uppercase text-blue-700 mb-2">{latestTest.variantA}</p>
                <p className="text-3xl font-bold text-blue-600 mb-1">{latestTest.variantACR}%</p>
                <p className="text-xs text-slate-600">{latestTest.variantAConversions} / {latestTest.variantAPageViews} conversions</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-100">
                <p className="text-xs font-medium uppercase text-emerald-700 mb-2">{latestTest.variantB}</p>
                <p className="text-3xl font-bold text-emerald-600 mb-1">{latestTest.variantBCR}%</p>
                <p className="text-xs text-slate-600">{latestTest.variantBConversions} / {latestTest.variantBPageViews} conversions</p>
              </div>
            </div>
            {latestTest.notes && (
              <p className="text-xs text-slate-600 italic mt-4 pt-4 border-t border-slate-200">💡 {latestTest.notes}</p>
            )}
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Geographic Distribution</h2>
          <div className="space-y-4">
            {funnel.topCountries.slice(0, 6).map((country: any, idx: number) => {
              const percentage = (country.count / funnel.topCountries[0].count) * 100
              const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500', 'bg-orange-500']
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-900">{country.name}</p>
                    <p className="text-sm font-bold text-slate-900">{country.count}</p>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[idx]} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-lg font-semibold text-slate-900 mb-5">Campaign Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Campaign</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Spend</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Impressions</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Clicks</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Leads</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ads.campaigns.map((camp: any, idx: number) => {
                const roi = camp.leads > 0 ? ((camp.spend / camp.leads).toFixed(2)) : 'N/A'
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{camp.name}</td>
                    <td className="px-4 py-3 text-right text-slate-900 font-semibold">${camp.spend.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{camp.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{camp.clicks.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-600">{camp.leads}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-medium">${roi}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
