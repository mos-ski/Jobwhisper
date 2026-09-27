import { useEffect, useRef, type KeyboardEvent } from 'react'

import { cn } from '@/ui'

export type BillingPricingGuideStep = 0 | 1

export type BillingPricingGuideCardProps = {
  readonly step: BillingPricingGuideStep
  readonly learnMoreHref: string
  /** The step's own next move, e.g. "View plan" to the plan picker or "Buy credits". */
  readonly linkLabel: string
  readonly linkHref: string
  readonly onNext: () => void
  readonly onDismiss: () => void
}

const GUIDE_CONTENT: Readonly<Record<BillingPricingGuideStep, { readonly title: string; readonly body: string }>> = {
  0: {
    title: 'View usage',
    body: 'Auto Apply uses one credit per successful application and Resume Builder one per AI prompt. The bar shows how much of your last purchase is left, and turns red below 20%. View usage details lists every credit spent.',
  },
  1: {
    title: 'See credits',
    body: 'Each balance is what you have left to spend. Press Buy credits to add more: from $10 for Auto Apply or $5 for Resume Builder. Credits last 12 months, and Automatic reload tops a balance up when it runs low.',
  },
}

export function BillingPricingGuideCard({ step, learnMoreHref, linkLabel, linkHref, onNext, onDismiss }: BillingPricingGuideCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const content = GUIDE_CONTENT[step]
  const isLastStep = step === 1

  useEffect(() => {
    cardRef.current?.focus()
  }, [step])

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onDismiss()
      return
    }

    if (event.key !== 'Tab') return
    const focusable = Array.from(cardRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
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
      aria-labelledby={`billing-pricing-guide-title-${step}`}
      data-step={step + 1}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      data-node-id="920:8504"
      className="fixed inset-x-4 bottom-4 z-tooltip rounded-[2px] border border-border bg-surface p-6 outline-none sm:absolute sm:inset-x-auto sm:bottom-auto sm:start-0 sm:top-full sm:mt-2 sm:w-[352px]"
    >
      <div className="-mt-3 flex items-center justify-between gap-3">
        <h2 id={`billing-pricing-guide-title-${step}`} className="text-sm font-semibold leading-5 text-ink">
          {content.title}
        </h2>
        {isLastStep ? null : (
          <button
            type="button"
            onClick={onDismiss}
            className="-me-2 inline-flex min-h-11 shrink-0 items-center rounded-md px-2 text-xs font-semibold text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            Skip tour
          </button>
        )}
      </div>
      <p className="mt-4 pb-5 text-sm leading-[22.75px] text-ink-muted">{content.body}</p>

      <div className="border-t border-border pt-[14.4px]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-[2px]" aria-label={`Step ${step + 1} of 2`}>
            {[0, 1].map((dot) => (
              <span
                key={dot}
                aria-hidden="true"
                className={cn('h-[3px] w-[21px] rounded-pill', dot === step ? 'bg-accent' : 'bg-muted')}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={isLastStep ? onDismiss : onNext}
            className="inline-flex min-h-9 w-[92px] items-center justify-center rounded-[7.2px] bg-accent px-[14.4px] py-[7.2px] text-[11.7px] font-semibold leading-[21.6px] text-on-accent shadow-control transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {isLastStep ? 'Done' : 'Next'}
          </button>
        </div>
        <div className="mt-1 flex items-center justify-between gap-4">
          <a
            href={linkHref}
            className="-ms-1 inline-flex min-h-11 items-center rounded-md px-1 text-sm font-semibold text-accent-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {linkLabel}
          </a>
          {isLastStep ? (
            <a
              href={learnMoreHref}
              className="inline-flex min-h-11 items-center rounded-md px-1 text-xs font-semibold text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              Learn More
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}
