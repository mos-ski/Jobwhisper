import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import { cn } from './cn'

export type StatCardProps = HTMLAttributes<HTMLDivElement> & {
  readonly label: string
  readonly value: ReactNode
  readonly icon?: ReactNode
  readonly delta?: {
    readonly value: number
    readonly direction: 'up' | 'down'
  }
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  function StatCard({ label, value, icon, delta, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="stat-card"
        className={cn('rounded-panel border border-border bg-surface p-4 shadow-control', className)}
        {...props}
      >
        <div className="flex items-start justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
          {icon ? <span className="text-ink-muted [&>svg]:size-4">{icon}</span> : null}
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-2xl font-bold text-ink">{value}</p>
          {delta ? (
            <span className={cn('text-xs font-semibold', delta.direction === 'up' ? 'text-positive' : 'text-danger')}>
              {delta.direction === 'up' ? '+' : '-'}{Math.abs(delta.value)}%
            </span>
          ) : null}
        </div>
      </div>
    )
  },
)
