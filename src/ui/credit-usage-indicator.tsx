import { ChevronRight, CreditCard } from 'lucide-react'

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
  const progressStyle = { inlineSize: `${percentage}%` }

  return (
    <div className={cn('group relative', className)}>
      <a
        href={billingHref}
        aria-label={`${formatCredits(remainingCents)} balance remaining`}
        className="relative grid size-11 place-items-center rounded-soft text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <CreditCard aria-hidden="true" className="size-6" />
        <span className="absolute -start-1.5 top-1 grid min-w-4 place-items-center rounded-pill bg-danger px-1 text-[10px] font-semibold leading-4 text-on-danger">{percentage}%</span>
      </a>
      <section
        aria-label="Usage balance"
        className="absolute end-0 top-full z-20 mt-3 hidden w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-border bg-surface shadow-popover group-focus-within:block group-hover:block"
      >
        <a
          href="/v3/billing/usage"
          className="flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <span className="font-medium text-ink">Credit balance</span>
          <span className="flex items-center gap-1 text-ink-muted">
            {formatCredits(remainingCents)} / {formatCredits(totalCents)} <span className="font-semibold text-ink">({percentage}%)</span>
            <ChevronRight aria-hidden="true" className="size-4 shrink-0" />
          </span>
        </a>
        <div className="px-4 pb-3">
          <div className="h-1.5 overflow-hidden rounded-pill bg-surface-subtle">
            <div className="h-full rounded-pill bg-accent" style={progressStyle} />
          </div>
        </div>
        <a
          href="/v3/billing/usage"
          className="block border-t border-border px-4 py-2.5 text-center text-sm text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          See detailed breakdown
        </a>
      </section>
    </div>
  )
}
