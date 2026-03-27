import { fetchDashboardData } from '@/lib/airtable'
import { KPICard } from '@/components/KPICard'

export const revalidate = 300

export default async function AdsPage() {
  const data = await fetchDashboardData()
  const { ads } = data

  const roiPerLead = ads.summary.totalLeads > 0 ? (ads.summary.totalSpend / ads.summary.totalLeads).toFixed(2) : '0'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Meta Ads Performance</h1>
        <p className="text-slate-600 text-sm mt-1">Real-time insights into ad spend, reach, and lead generation</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Spend"
          value={`$${ads.summary.totalSpend}`}
          description={`${ads.totalRecords} ad records`}
          gradient="bg-gradient-to-br from-blue-50 to-white"
          icon={<div className="text-3xl">💳</div>}
        />
        <KPICard
          title="Total Impressions"
          value={(ads.summary.totalImpressions / 1000).toFixed(1)}
          unit="K"
          description={`CPM: $${ads.summary.averageCPM}`}
          gradient="bg-gradient-to-br from-purple-50 to-white"
          icon={<div className="text-3xl">👁️</div>}
        />
        <KPICard
          title="Total Clicks"
          value={ads.summary.totalClicks}
          unit="clicks"
          description={`CTR: ${ads.summary.averageCTR}%`}
          gradient="bg-gradient-to-br from-orange-50 to-white"
          icon={<div className="text-3xl">🖱️</div>}
        />
        <KPICard
          title="Total Leads"
          value={ads.summary.totalLeads}
          unit="leads"
          description={`CPL: $${ads.summary.costPerLead}`}
          gradient="bg-gradient-to-br from-emerald-50 to-white"
          icon={<div className="text-3xl">🎯</div>}
        />
      </div>

      {/* Efficiency Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <KPICard
          title="Cost Per Click"
          value={`$${ads.summary.averageCPC}`}
          description="Average CPC across all ads"
          gradient="bg-gradient-to-br from-rose-50 to-white"
          icon={<div className="text-3xl">📍</div>}
        />
        <KPICard
          title="Total Reach"
          value={(ads.summary.totalReach / 1000).toFixed(1)}
          unit="K"
          description="Unique people reached"
          gradient="bg-gradient-to-br from-cyan-50 to-white"
          icon={<div className="text-3xl">📢</div>}
        />
        <KPICard
          title="Cost Per Lead"
          value={`$${roiPerLead}`}
          description={`From ${ads.campaigns.length} campaigns`}
          gradient="bg-gradient-to-br from-indigo-50 to-white"
          icon={<div className="text-3xl">💰</div>}
        />
      </div>

      {/* Campaign Breakdown */}
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
                <th className="px-4 py-3 text-right font-semibold text-slate-900">CPL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ads.campaigns.map((c: any, idx: number) => {
                const cpl = c.leads > 0 ? (c.spend / c.leads).toFixed(2) : 'N/A'
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">${c.spend.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{c.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{c.clicks.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-600">{c.leads}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-medium">${cpl}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Ads */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-lg font-semibold text-slate-900 mb-5">Top Performing Ads</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Ad Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Campaign</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Spend</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Impressions</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">CTR</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">CPC</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Leads</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">CPL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ads.ads.slice(0, 25).map((ad: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 truncate max-w-xs">{ad.adName}</td>
                  <td className="px-4 py-3 text-slate-700 text-sm truncate max-w-xs">{ad.campaignName}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">${ad.spend}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{ad.impressions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-medium">{ad.ctr}%</td>
                  <td className="px-4 py-3 text-right text-slate-700">${ad.cpc}</td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-600">{ad.leads}</td>
                  <td className="px-4 py-3 text-right text-slate-700">${ad.costPerLead || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
