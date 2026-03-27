interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
  className?: string
  gradient?: string
}

export function KPICard({
  title,
  value,
  unit,
  description,
  icon,
  trend,
  className = '',
  gradient = 'bg-white'
}: KPICardProps) {
  return (
    <div className={`rounded-xl border border-slate-200 ${gradient} p-6 hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
          <div className="mt-4 flex items-baseline gap-2">
            <p className="text-4xl font-bold text-slate-900">{value}</p>
            {unit && <span className="text-sm font-medium text-slate-600">{unit}</span>}
          </div>
          {description && (
            <p className="text-xs text-slate-500 mt-2">{description}</p>
          )}
          {trend && (
            <div className={`mt-3 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${
              trend.isPositive
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              {trend.label && <span className="text-slate-600 font-normal">{trend.label}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-3 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
