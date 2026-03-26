export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border border-slate-200 bg-slate-100 p-6 h-32" />
        ))}
      </div>

      {/* Chart Area */}
      <div className="animate-pulse rounded-lg border border-slate-200 bg-slate-100 p-6 h-64" />

      {/* Table Area */}
      <div className="animate-pulse rounded-lg border border-slate-200 bg-slate-100 p-6 h-96" />
    </div>
  )
}
