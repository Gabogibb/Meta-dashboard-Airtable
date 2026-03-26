'use client'

import { useMetrics } from '@/lib/hooks/useMetrics'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'

export default function ABTestingPage() {
  const { data, loading, error, refetch } = useMetrics()

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-800">Error Loading A/B Tests</h2>
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

  if (!data || data.abTests.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">A/B Testing</h1>
        <p className="text-slate-600">No A/B test data available yet.</p>
      </div>
    )
  }

  const tests = [...data.abTests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">A/B Testing Dashboard</h1>

      {/* Active Tests */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Recent Tests ({tests.length} total)</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Test Period</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Variant A</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">CR A</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Variant B</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">CR B</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Difference</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Leader</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tests.slice(0, 20).map((test) => (
                <tr key={test.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900">{test.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{test.testPeriod}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{test.variantA}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {(test.variantACR * 100).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{test.variantB}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {(test.variantBCR * 100).toFixed(2)}%
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium ${
                    test.crDifference > 0 ? 'text-green-600' : test.crDifference < 0 ? 'text-red-600' : 'text-slate-600'
                  }`}>
                    {test.crDifference > 0 ? '+' : ''}{(test.crDifference * 100).toFixed(2)}%
                  </td>
                  <td className={`px-6 py-4 text-sm font-semibold ${
                    test.currentLeader === 'Variant A' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {test.currentLeader}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      {data.abTestMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-600">Avg Conversions (A)</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{data.abTestMetrics.averageAConversions.toFixed(0)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-600">Avg Conversions (B)</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{data.abTestMetrics.averageBConversions.toFixed(0)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-600">Avg CR Difference</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {(data.abTestMetrics.averageCRDifference * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
