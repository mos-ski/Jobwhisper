import { Gift, Plus } from 'lucide-react'

import { cn, Tooltip, TooltipContent, TooltipTrigger } from '@/ui'

export type CreditCardProps = {
  readonly remainingCents: number
  readonly totalCents: number
  readonly formatAmount: (cents: number) => string
  readonly resetDate: string
  readonly bonusHref: string
  readonly detailsHref: string
  readonly className?: string
  /** Ran out mid-cycle? Renders an "Add credits" button next to Add Funds. See PRICING.md §1. */
  readonly onTopUp?: () => void
}

export function CreditCard({ remainingCents, totalCents, formatAmount, resetDate, bonusHref, detailsHref, className, onTopUp }: CreditCardProps) {
  const percentage = totalCents > 0 ? Math.round((remainingCents / totalCents) * 100) : 0

  return (
    <section className={cn('rounded-panel border border-border bg-surface p-6 shadow-control', className)}>
      <div className="flex items-start justify-between">
        <h2 className="font-bold">Usage Balance</h2>
        <Tooltip>
          <TooltipTrigger
            render={
              <a href={detailsHref} className="text-sm font-semibold text-accent underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus hover:underline">
                View usage details
              </a>
            }
          />
          <TooltipContent>See a breakdown of how your balance was used</TooltipContent>
        </Tooltip>
      </div>
      <p className="text-sm text-ink-muted">Resets on {resetDate}</p>

      <p className="mt-5 text-3xl font-black">
        {percentage}% <span className="text-base font-medium text-ink-muted">remaining</span>
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-pill bg-surface-subtle">
        <div className={cn('h-full rounded-pill transition-all', percentage > 20 ? 'bg-accent' : 'bg-danger')} style={{ inlineSize: `${percentage}%` }} />
      </div>
      <p className="mt-2 text-sm text-ink-muted">{formatAmount(remainingCents)} of {formatAmount(totalCents)}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        <a href={bonusHref} className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <Gift aria-hidden="true" className="size-4 text-accent-secondary" />
          <span className="text-accent-text">Add Funds</span>
        </a>
        {onTopUp ? (
          <button
            type="button"
            onClick={onTopUp}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <Plus aria-hidden="true" className="size-4 text-accent-secondary" />
            <span className="text-accent-text">Add credits</span>
          </button>
        ) : null}
      </div>
    </section>
  )
}
