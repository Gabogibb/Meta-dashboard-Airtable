import { fetchDashboardData } from '@/lib/airtable'

// Revalidate every 5 minutes to sync with Airtable
export const revalidate = 300

export default async function OverviewPage() {
  const data = await fetchDashboardData()
  const { abTests, funnel, ads } = data
  const latestTest = abTests[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Last synced: {new Date(data.lastUpdated).toLocaleString()} ({data.source === 'live' ? 'Live from Airtable' : 'Cached data'})
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${data.source === 'live' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
          {data.source === 'live' ? 'Live' : 'Static'}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Total Ad Spend</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">${ads.summary.totalSpend}</p>
          <p className="text-xs text-slate-500 mt-1">{ads.totalRecords} ad records</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Webinar Signups</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{funnel.totalSignups}</p>
          <p className="text-xs text-slate-500 mt-1">{funnel.attended} attended ({funnel.attendanceRate}%)</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Total Leads</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{ads.summary.totalLeads}</p>
          <p className="text-xs text-slate-500 mt-1">CPL: ${ads.summary.costPerLead}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Avg CTR</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{ads.summary.averageCTR}%</p>
          <p className="text-xs text-slate-500 mt-1">CPC: ${ads.summary.averageCPC}</p>
        </div>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">A/B Tests Run</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{abTests.length}</p>
          <p className="text-xs text-slate-500 mt-1">Latest leader: {latestTest?.currentLeader || 'N/A'}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Total Impressions</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{(ads.summary.totalImpressions / 1000).toFixed(1)}K</p>
          <p className="text-xs text-slate-500 mt-1">Reach: {(ads.summary.totalReach / 1000).toFixed(1)}K</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Replay Watch Rate</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{funnel.replayRate}%</p>
          <p className="text-xs text-slate-500 mt-1">{funnel.replayWatchers} replay viewers</p>
        </div>
      </div>

      {/* Latest A/B Test + Top Countries */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {latestTest && (
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Latest A/B Test</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Date</span>
                <span className="font-medium">{latestTest.date}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100">
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-1">{latestTest.variantA}</p>
                  <p className="text-2xl font-bold text-blue-600">{latestTest.variantACR}%</p>
                  <p className="text-xs text-slate-500">{latestTest.variantAConversions}/{latestTest.variantAPageViews}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-1">{latestTest.variantB}</p>
                  <p className="text-2xl font-bold text-emerald-600">{latestTest.variantBCR}%</p>
                  <p className="text-xs text-slate-500">{latestTest.variantBConversions}/{latestTest.variantBPageViews}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">{latestTest.notes}</p>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Countries</h2>
          <div className="space-y-3">
            {funnel.topCountries.slice(0, 6).map((country: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <p className="text-sm text-slate-700">{country.name}</p>
                <div className="flex items-center gap-3">
                  <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(country.count / funnel.topCountries[0].count) * 100}%` }} />
                  </div>
                  <p className="text-sm font-medium text-slate-900 w-8 text-right">{country.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Campaign Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Campaign</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Spend</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Impressions</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Clicks</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Leads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ads.campaigns.map((camp: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{camp.name}</td>
                  <td className="px-4 py-3 text-right text-slate-900">${camp.spend.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{camp.impressions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{camp.clicks.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">{camp.leads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
