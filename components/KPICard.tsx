interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function KPICard({ title, value, unit, trend, className = '' }: KPICardProps) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-white p-6 ${className}`}>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <div className="mt-3 flex items-baseline gap-2">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {unit && <span className="text-lg text-slate-500">{unit}</span>}
      </div>
      {trend && (
        <p className={`mt-3 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last period
        </p>
      )}
    </div>
  )
}
