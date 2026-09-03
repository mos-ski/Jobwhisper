import { ArrowRight, CreditCard, Gift } from 'lucide-react'

import { cn } from './cn'

export type CreditUsageIndicatorProps = {
  readonly remainingCents: number
  readonly totalCents: number
  readonly formatCredits: (cents: number) => string
  readonly billingHref?: string
  readonly className?: string
}

/** Same icon-badge-plus-hover-dropdown pattern as the dashboard's own credit indicator (dashboard-view.tsx's CreditDropdown), reused here so every page's top bar behaves identically instead of a different flat progress bar. */
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
        className="absolute end-0 top-full z-20 mt-3 hidden w-[min(16rem,calc(100vw-2rem))] overflow-hidden rounded-md border border-border bg-surface text-xs shadow-popover group-focus-within:block group-hover:block"
      >
        <div className="grid gap-3 px-4 py-3">
          <div className="flex min-h-9 items-center justify-between gap-4">
            <h2 className="text-sm font-medium leading-6 text-ink">Usage balance</h2>
            <a href={billingHref} className="inline-flex min-h-7 items-center justify-center gap-1 rounded-lg border border-border bg-surface px-2 text-xs font-semibold text-ink-muted shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              Upgrade
              <ArrowRight aria-hidden="true" className="size-3" />
            </a>
          </div>
          <div className="grid gap-1.5">
            <div className="flex items-center justify-between gap-4 text-sm text-ink-muted">
              <span>Usage this month</span>
              <span className="font-medium text-ink">{percentage}% remaining</span>
            </div>
            <div className="h-2 overflow-hidden rounded-pill bg-surface-subtle">
              <div className="h-full rounded-pill bg-accent shadow-control" style={progressStyle} />
            </div>
            <p className="text-end text-xs font-medium leading-5 text-ink-muted">{formatCredits(remainingCents)} remaining</p>
          </div>
        </div>
        <a href={billingHref} className="flex min-h-12 items-center justify-center gap-2 bg-accent px-3 text-sm font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <Gift aria-hidden="true" className="size-4" />
          Add Funds
        </a>
      </section>
    </div>
  )
}
