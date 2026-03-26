'use client'

import { useMetrics } from '@/lib/hooks/useMetrics'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { KPICard } from '@/components/KPICard'

export default function AdsPage() {
  const { data, loading, error, refetch } = useMetrics()

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-800">Error Loading Ads Data</h2>
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

  if (!data || data.metaAds.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Meta Ads Performance</h1>
        <p className="text-slate-600">No Meta ads data available yet.</p>
      </div>
    )
  }

  const metrics = data.adsMetrics

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Meta Ads Performance</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KPICard
          title="Total Spend"
          value={metrics ? `$${metrics.totalSpend}` : '$0'}
          unit=""
        />
        <KPICard
          title="Total Impressions"
          value={metrics?.totalImpressions ? (metrics.totalImpressions / 1000).toFixed(1) : '0'}
          unit="K"
        />
        <KPICard
          title="Total Clicks"
          value={metrics?.totalClicks || 0}
          unit="clicks"
        />
        <KPICard
          title="Average CTR"
          value={metrics?.averageCTR || '0'}
          unit="%"
        />
      </div>

      {/* ROI Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KPICard
          title="Cost Per Lead"
          value={metrics ? `$${metrics.costPerLead}` : '$0'}
          unit=""
        />
        <KPICard
          title="Cost Per Registration"
          value={metrics ? `$${metrics.costPerRegistration}` : '$0'}
          unit=""
        />
        <KPICard
          title="Cost Per Purchase"
          value={metrics && metrics.costPerPurchase !== 'N/A' ? `$${metrics.costPerPurchase}` : 'N/A'}
          unit=""
        />
      </div>

      {/* Ads Table */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Ad Campaigns ({data.metaAds.length} total)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Ad Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Campaign</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-900">Spend</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-900">Impressions</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-900">Clicks</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-900">CTR</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-900">CPC</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-900">Leads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.metaAds.slice(0, 30).map((ad) => (
                <tr key={ad.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-900 font-medium truncate max-w-xs">{ad.adName}</td>
                  <td className="px-6 py-4 text-slate-700 truncate max-w-xs">{ad.campaignName}</td>
                  <td className="px-6 py-4 text-right text-slate-900 font-medium">
                    ${ad.spend.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-900">
                    {ad.impressions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-900">
                    {ad.clicks.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-900">
                    {(ad.ctr * 100).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 text-right text-slate-900">
                    ${ad.cpc.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-900 font-medium">
                    {ad.leads.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.metaAds.length > 30 && (
          <p className="mt-4 text-sm text-slate-600">
            Showing 30 of {data.metaAds.length} ad campaigns
          </p>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Performance Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Total Leads</span>
              <span className="font-medium text-slate-900">{metrics?.totalLeads || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Registrations</span>
              <span className="font-medium text-slate-900">{metrics?.totalRegistrations || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Purchases</span>
              <span className="font-medium text-slate-900">{metrics?.totalPurchases || 0}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3">
              <span className="text-slate-600">Average CPM</span>
              <span className="font-medium text-slate-900">${metrics?.averageCPM || '0'}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Performers</h2>
          <div className="space-y-3">
            {data.metaAds
              .sort((a, b) => b.clicks - a.clicks)
              .slice(0, 3)
              .map((ad, idx) => (
                <div key={ad.id} className="flex items-center justify-between">
                  <p className="text-sm text-slate-700">
                    {idx + 1}. {ad.adName.substring(0, 20)}...
                  </p>
                  <p className="text-sm font-medium text-slate-900">{ad.clicks} clicks</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
