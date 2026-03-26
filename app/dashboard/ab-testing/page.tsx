import { fetchDashboardData } from '@/lib/airtable'

export const revalidate = 300

export default async function ABTestingPage() {
  const data = await fetchDashboardData()
  const { abTests } = data

  const avgACR = abTests.reduce((sum: number, t: any) => sum + t.variantACR, 0) / abTests.length
  const avgBCR = abTests.reduce((sum: number, t: any) => sum + t.variantBCR, 0) / abTests.length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">A/B Testing Dashboard</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Total Tests</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{abTests.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Avg CR (Variant A)</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{avgACR.toFixed(1)}%</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Avg CR (Variant B)</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{avgBCR.toFixed(1)}%</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">A Wins</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {abTests.filter((t: any) => t.currentLeader === 'Variant A').length} / {abTests.length}
          </p>
        </div>
      </div>

      {/* Tests Table */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">All Tests</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Variant A</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Views</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">CR A</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Variant B</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Views</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">CR B</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900">Diff</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Leader</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {abTests.map((test: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-900 font-medium">{test.date}</td>
                  <td className="px-4 py-3 text-slate-700 truncate max-w-[150px]">{test.variantA}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{test.variantAPageViews}</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-600">{test.variantACR}%</td>
                  <td className="px-4 py-3 text-slate-700 truncate max-w-[150px]">{test.variantB}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{test.variantBPageViews}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-600">{test.variantBCR}%</td>
                  <td className={`px-4 py-3 text-right font-medium ${test.crDifference > 0 ? 'text-emerald-600' : test.crDifference < 0 ? 'text-red-600' : 'text-slate-500'}`}>
                    {test.crDifference > 0 ? '+' : ''}{test.crDifference}pp
                  </td>
                  <td className={`px-4 py-3 font-semibold ${test.currentLeader === 'Variant A' ? 'text-blue-600' : test.currentLeader === 'Variant B' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {test.currentLeader}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Test Notes</h2>
        <div className="space-y-3">
          {abTests.map((test: any, idx: number) => (
            <div key={idx} className="flex gap-3 text-sm">
              <span className="text-slate-500 shrink-0">{test.date}</span>
              <span className="text-slate-700">{test.notes}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
