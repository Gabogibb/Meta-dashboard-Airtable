import { fetchDashboardData } from '@/lib/airtable'

export const revalidate = 300

export default async function AdsPage() {
  const data = await fetchDashboardData()
  const { ads } = data

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Meta Ads Performance</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Total Spend</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">${ads.summary.totalSpend}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Total Impressions</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{(ads.summary.totalImpressions / 1000).toFixed(1)}K</p>
          <p className="text-xs text-slate-500 mt-1">CPM: ${ads.summary.averageCPM}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Total Clicks</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{ads.summary.totalClicks}</p>
          <p className="text-xs text-slate-500 mt-1">CTR: {ads.summary.averageCTR}%</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Total Leads</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{ads.summary.totalLeads}</p>
          <p className="text-xs text-slate-500 mt-1">CPL: ${ads.summary.costPerLead}</p>
        </div>
      </div>

      {/* ROI Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Avg CPC</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">${ads.summary.averageCPC}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Total Reach</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{(ads.summary.totalReach / 1000).toFixed(1)}K</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Ad Records</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{ads.totalRecords}</p>
          <p className="text-xs text-slate-500 mt-1">{ads.campaigns.length} campaigns</p>
        </div>
      </div>

      {/* Campaign Breakdown */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Campaigns</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Campaign</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Spend</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Impressions</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Clicks</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Leads</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Ads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ads.campaigns.map((c: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                  <td className="px-4 py-3 text-right">${c.spend.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{c.impressions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{c.clicks}</td>
                  <td className="px-4 py-3 text-right font-medium">{c.leads}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{c.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Ads */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Ads by Spend</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-900">Ad Name</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-900">Date</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-900">Campaign</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-900">Spend</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-900">Impr</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-900">Clicks</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-900">CTR%</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-900">CPC</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-900">Leads</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-900">CPL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ads.ads.slice(0, 25).map((ad: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium text-slate-900 truncate max-w-[140px]">{ad.adName}</td>
                  <td className="px-3 py-2 text-slate-700">{ad.dateStart}</td>
                  <td className="px-3 py-2 text-slate-600 truncate max-w-[120px]">{ad.campaignName}</td>
                  <td className="px-3 py-2 text-right font-medium">${ad.spend}</td>
                  <td className="px-3 py-2 text-right text-slate-700">{ad.impressions.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right text-slate-700">{ad.clicks}</td>
                  <td className="px-3 py-2 text-right text-slate-700">{ad.ctr}%</td>
                  <td className="px-3 py-2 text-right text-slate-700">${ad.cpc}</td>
                  <td className="px-3 py-2 text-right font-medium">{ad.leads}</td>
                  <td className="px-3 py-2 text-right text-slate-700">${ad.costPerLead || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
