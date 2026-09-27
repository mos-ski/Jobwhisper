import { useEffect, useRef, type KeyboardEvent } from 'react'

export type BillingPricingGuideCardProps = {
  readonly linkLabel: string
  readonly linkHref: string
  readonly onDismiss: () => void
}

/** The one-card billing tour: what "unlimited" means on a plan, and what extra credits are for. */
export function BillingPricingGuideCard({ linkLabel, linkHref, onDismiss }: BillingPricingGuideCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    cardRef.current?.focus()
  }, [])

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onDismiss()
      return
    }

    if (event.key !== 'Tab') return
    const focusable = Array.from(cardRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (!first || !last) return
    const active = document.activeElement

    if (event.shiftKey && (active === first || active === cardRef.current)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      ref={cardRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="billing-pricing-guide-title"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="fixed inset-x-4 bottom-4 z-tooltip rounded-[2px] border border-border bg-surface p-6 outline-none sm:absolute sm:inset-x-auto sm:bottom-auto sm:start-0 sm:top-full sm:mt-2 sm:w-[352px]"
    >
      <h2 id="billing-pricing-guide-title" className="text-sm font-semibold leading-5 text-ink">
        Your credits and balances
      </h2>
      <p className="mt-4 pb-5 text-sm leading-[22.75px] text-ink-muted">
        Your plan makes Interview Prep, Copilot, Auto Apply and Resume Builder unlimited. If you ever reach its usage limit, extra credits keep you going: press Buy credits on any row, and turn on automatic reload there if you want it to top up for you.
      </p>
      <div className="flex items-center justify-between gap-4 border-t border-border pt-[14.4px]">
        <a
          href={linkHref}
          className="-ms-1 inline-flex min-h-11 items-center rounded-md px-1 text-sm font-semibold text-accent-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          {linkLabel}
        </a>
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex min-h-11 w-[92px] items-center justify-center rounded-[7.2px] bg-accent px-[14.4px] text-[11.7px] font-semibold text-on-accent shadow-control transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
