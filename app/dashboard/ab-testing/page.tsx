import { fetchDashboardData } from '@/lib/airtable'
import { KPICard } from '@/components/KPICard'

export const revalidate = 300

export default async function ABTestingPage() {
  const data = await fetchDashboardData()
  const { abTests } = data

  const avgACR = abTests.reduce((sum: number, t: any) => sum + t.variantACR, 0) / abTests.length
  const avgBCR = abTests.reduce((sum: number, t: any) => sum + t.variantBCR, 0) / abTests.length
  const winnerA = abTests.filter((t: any) => t.currentLeader === 'Variant A').length
  const winnerB = abTests.filter((t: any) => t.currentLeader === 'Variant B').length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">A/B Testing Dashboard</h1>
        <p className="text-slate-600 text-sm mt-1">Track and compare variant performance across all active tests</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Tests"
          value={abTests.length}
          description="Currently running"
          gradient="bg-gradient-to-br from-slate-50 to-white"
          icon={<div className="text-3xl">🧪</div>}
        />
        <KPICard
          title="Avg CR (Variant A)"
          value={avgACR.toFixed(1)}
          unit="%"
          description="Control group"
          gradient="bg-gradient-to-br from-blue-50 to-white"
          icon={<div className="text-3xl">📊</div>}
        />
        <KPICard
          title="Avg CR (Variant B)"
          value={avgBCR.toFixed(1)}
          unit="%"
          description="Test group"
          gradient="bg-gradient-to-br from-emerald-50 to-white"
          icon={<div className="text-3xl">📈</div>}
        />
        <KPICard
          title="Variant Wins"
          value={`${winnerA} vs ${winnerB}`}
          description={winnerB > winnerA ? '🏆 B winning' : 'A holding strong'}
          gradient="bg-gradient-to-br from-purple-50 to-white"
          icon={<div className="text-3xl">🏆</div>}
        />
      </div>

      {/* Tests Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-lg font-semibold text-slate-900 mb-5">All Tests Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Variant A</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Views</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">CR</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Variant B</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Views</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">CR</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Difference</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Winner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {abTests.map((test: any, idx: number) => {
                const crDiff = test.variantBCR - test.variantACR
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-900 font-medium text-sm">{test.date}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs truncate text-sm">{test.variantA}</td>
                    <td className="px-4 py-3 text-right text-slate-700 text-sm">{test.variantAPageViews.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-bold text-blue-600 text-sm">{test.variantACR}%</td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs truncate text-sm">{test.variantB}</td>
                    <td className="px-4 py-3 text-right text-slate-700 text-sm">{test.variantBPageViews.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600 text-sm">{test.variantBCR}%</td>
                    <td className={`px-4 py-3 text-center font-bold text-sm ${crDiff > 0 ? 'text-emerald-600' : crDiff < 0 ? 'text-red-600' : 'text-slate-500'}`}>
                      {crDiff > 0 ? '+' : ''}{crDiff.toFixed(1)}pp
                    </td>
                    <td className={`px-4 py-3 text-center font-bold text-sm rounded-md py-2 ${
                      test.currentLeader === 'Variant A'
                        ? 'bg-blue-100 text-blue-700'
                        : test.currentLeader === 'Variant B'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {test.currentLeader}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-lg font-semibold text-slate-900 mb-5">Test Insights</h2>
        <div className="space-y-3">
          {abTests.map((test: any, idx: number) => (
            <div key={idx} className="flex gap-4 p-3 rounded-lg bg-white border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                  <span className="text-xs font-semibold text-blue-700">💡</span>
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-600 uppercase">{test.date}</p>
                <p className="text-sm text-slate-700 mt-1">{test.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
