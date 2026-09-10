import { useEffect, useRef, type KeyboardEvent } from 'react'

import { cn } from '@/ui'

export type BillingPricingGuideStep = 0 | 1 | 2

export type BillingPricingGuideCardProps = {
  readonly step: BillingPricingGuideStep
  readonly learnMoreHref: string
  readonly onNext: () => void
  readonly onDismiss: () => void
}

const GUIDE_CONTENT: Readonly<Record<BillingPricingGuideStep, { readonly title: string; readonly body: string }>> = {
  0: {
    title: 'Ace Your Interview Plan',
    body: 'Interview Prep and Copilot are included in a recurring subscription. Usage is measured in minutes, so one credit gives you one minute of live session time.',
  },
  1: {
    title: 'Auto Apply and Resume Builder',
    body: 'These tools use prepaid credits with no subscription. Auto Apply charges for each successful application. Resume Builder charges for each AI prompt you send.',
  },
  2: {
    title: 'Done For You',
    body: 'Want a hands-off job search? A dedicated success manager finds matching roles, tailors your resume, and applies on your behalf. You focus on preparing for interviews.',
  },
}

export function BillingPricingGuideCard({ step, learnMoreHref, onNext, onDismiss }: BillingPricingGuideCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const content = GUIDE_CONTENT[step]
  const isLastStep = step === 2

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
      <h2 id={`billing-pricing-guide-title-${step}`} className="text-sm font-semibold leading-5 text-ink">
        {content.title}
      </h2>
      <p className="mt-4 pb-5 text-sm leading-[22.75px] text-ink-muted">{content.body}</p>

      <div className="border-t border-border pt-[14.4px]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-[2px]" aria-label={`Step ${step + 1} of 3`}>
            {[0, 1, 2].map((dot) => (
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
        {isLastStep ? (
          <a
            href={learnMoreHref}
            className="inline-flex min-h-11 items-center text-[11.7px] font-bold leading-[17.55px] text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            Learn More
          </a>
        ) : (
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex min-h-11 items-center text-[11.7px] font-bold leading-[17.55px] text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            Skip Tutor
          </button>
        )}
      </div>
    </div>
  )
}
