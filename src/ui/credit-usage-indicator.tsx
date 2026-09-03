import { CreditCard } from 'lucide-react'

import { cn } from './cn'

export type CreditUsageIndicatorProps = {
  readonly remainingCents: number
  readonly totalCents: number
  readonly formatCredits: (cents: number) => string
  readonly billingHref?: string
  readonly className?: string
}

export function CreditUsageIndicator({ remainingCents, totalCents, formatCredits, billingHref = '/v3/billing', className }: CreditUsageIndicatorProps) {
  const percentage = totalCents > 0 ? Math.round((remainingCents / totalCents) * 100) : 0
  const isLow = percentage <= 20

  return (
    <a
      href={billingHref}
      aria-label={`${formatCredits(remainingCents)} of ${formatCredits(totalCents)} remaining`}
      data-slot="credit-usage-indicator"
      className={cn(
        'flex items-center gap-3 rounded-soft px-3 py-1.5 transition-colors duration-normal',
        'hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
        className,
      )}
    >
      <CreditCard aria-hidden="true" className={cn('size-4 shrink-0', isLow ? 'text-danger' : 'text-accent')} />
      <div className="grid min-w-0 gap-0.5">
        <div className="flex items-baseline gap-2 text-xs">
          <span className="truncate font-semibold text-ink">Credits</span>
          <span className="whitespace-nowrap text-ink-muted">
            {formatCredits(remainingCents)} / {formatCredits(totalCents)}{' '}
            <span className={cn('font-semibold', isLow ? 'text-danger' : 'text-ink')}>{percentage}%</span>
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-pill bg-surface-subtle">
          <div
            className={cn('h-full rounded-pill transition-all duration-300', isLow ? 'bg-danger' : 'bg-accent')}
            style={{ inlineSize: `${percentage}%` }}
          />
        </div>
      </div>
    </a>
  )
}
