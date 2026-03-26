'use client'

import { KPICard } from '@/components/KPICard'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { useMetrics } from '@/lib/hooks/useMetrics'

export default function OverviewPage() {
  const { data, loading, error, lastUpdated, refetch } = useMetrics()

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-800">Error Loading Dashboard</h2>
        <p className="text-red-700 mt-2">{error}</p>
        <p className="text-sm text-red-600 mt-3">
          Make sure your environment variables are set correctly:
          <br />
          AIRTABLE_API_KEY, AIRTABLE_BASE_ID, and Google Sheets credentials.
        </p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
        <h2 className="text-lg font-semibold text-yellow-800">No Data Available</h2>
        <p className="text-yellow-700 mt-2">Unable to fetch data from Airtable or Google Sheets.</p>
      </div>
    )
  }

  const { abTestMetrics, funnelMetrics, adsMetrics } = data

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          {lastUpdated && (
            <p className="text-sm text-slate-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KPICard
          title="Total Ad Spend"
          value={adsMetrics ? `$${adsMetrics.totalSpend}` : '$0'}
          unit=""
        />
        <KPICard
          title="Total Registrations"
          value={funnelMetrics?.totalSignups || 0}
          unit="signups"
        />
        <KPICard
          title="Event Attendance Rate"
          value={funnelMetrics?.attendanceRate || '0'}
          unit="%"
        />
        <KPICard
          title="Avg Cost Per Lead"
          value={adsMetrics ? `$${adsMetrics.costPerLead}` : '$0'}
          unit=""
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KPICard
          title="Total A/B Tests"
          value={abTestMetrics?.totalTests || 0}
          unit="tests"
        />
        <KPICard
          title="Total Clicks"
          value={adsMetrics?.totalClicks || 0}
          unit="clicks"
        />
        <KPICard
          title="Replay Watch Rate"
          value={funnelMetrics?.replayWatchRate || '0'}
          unit="%"
        />
      </div>

      {/* Detailed Status Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Latest A/B Test */}
        {abTestMetrics?.latestTest && (
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Latest A/B Test</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Test Period</p>
                <p className="text-base font-medium text-slate-900">{abTestMetrics.latestTest.testPeriod}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">{abTestMetrics.latestTest.variantA}</p>
                  <p className="text-xl font-bold text-slate-900">
                    {(abTestMetrics.latestTest.variantACR * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">{abTestMetrics.latestTest.variantB}</p>
                  <p className="text-xl font-bold text-slate-900">
                    {(abTestMetrics.latestTest.variantBCR * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <p className={`text-sm font-medium ${
                  abTestMetrics.latestTest.currentLeader === 'Variant A'
                    ? 'text-green-600'
                    : 'text-blue-600'
                }`}>
                  Current Leader: {abTestMetrics.latestTest.currentLeader}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top Traffic Sources */}
        {funnelMetrics?.topSources && funnelMetrics.topSources.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Traffic Sources</h2>
            <div className="space-y-3">
              {funnelMetrics.topSources.slice(0, 5).map((source, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <p className="text-sm text-slate-700">{source.value || 'Direct'}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${(source.count / funnelMetrics.topSources[0].count) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-sm font-medium text-slate-900 w-12 text-right">{source.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Data Summary */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Data Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-slate-600">A/B Tests</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{data.abTests.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Registrations</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{data.funnelRecords.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Ad Records</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{data.metaAds.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Impressions</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {(adsMetrics?.totalImpressions || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
