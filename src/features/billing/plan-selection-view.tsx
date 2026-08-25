import { useEffect, useRef, useState } from 'react'
import type { Plan } from '@/contracts/billing'
import { formatCredits } from '@/lib/credits'
import { Badge, Button, cn } from '@/ui'
import { X } from 'lucide-react'

export type AuthPlanOption = {
  readonly id: Plan
  readonly name: string
  readonly priceMonthly: number
  readonly includedUsageCents: number
  readonly description: string
  readonly features: readonly string[]
  readonly note: string
  readonly popular?: boolean
}

export type BillingCadence = 'monthly' | 'annual'

export type PlanSelectionViewProps = {
  readonly cadence: BillingCadence
  readonly plans: readonly AuthPlanOption[]
  readonly selectedPlanId: Plan
  readonly laterHref: string
  readonly onToggleCadence: () => void
  readonly onSelectPlan: (plan: Plan) => void
}

function PlanCheck() {
  return <img aria-hidden="true" src="/v3-assets/check.svg" alt="" className="mt-0.5 size-4 shrink-0" />
}

function PlanCard({
  plan,
  selected,
  annual,
  onSelectPlan,
  cardRef,
}: {
  readonly plan: AuthPlanOption
  readonly selected: boolean
  readonly annual: boolean
  readonly onSelectPlan: (plan: Plan) => void
  readonly cardRef?: (el: HTMLElement | null) => void
}) {
  const subscribeLabel = `Subscribe to ${plan.name}`
  const annualMonthlyPrice = Math.round(plan.priceMonthly * 0.8)
  const displayPrice = annual ? annualMonthlyPrice : plan.priceMonthly

  return (
    <article
      ref={cardRef}
      className={cn(
        'flex w-[82%] shrink-0 snap-center flex-col rounded-panel border border-border bg-surface p-6 md:w-auto md:shrink md:min-h-full',
        selected ? 'bg-accent-subtle' : '',
      )}
      aria-label={`${plan.name} plan`}
    >
      <div className="flex min-h-8 items-center gap-2 border-b border-border pb-4">
        <h2 className="text-lg font-semibold text-ink">{plan.name}</h2>
        {plan.popular ? <Badge>Popular</Badge> : null}
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <div className="flex flex-wrap items-end gap-1">
          <span className="text-4xl font-semibold leading-tight text-ink">${displayPrice}</span>
          <span className="pb-2 text-sm font-medium text-ink">per month</span>
        </div>
        {annual ? <p className="mt-1 text-sm text-ink-muted">${displayPrice * 12} billed yearly</p> : null}
        <p className="mt-5 text-sm font-semibold text-ink">{formatCredits(plan.includedUsageCents)} included</p>
        <p className="mt-3 text-sm leading-5 text-ink-muted">{plan.description}</p>

        <div className="mt-6">
          <Button
            variant={plan.popular ? 'primary' : 'secondary'}
            className="w-full"
            onClick={() => onSelectPlan(plan.id)}
            aria-label={subscribeLabel}
          >
            Subscribe
          </Button>
        </div>

        <ul className="mt-6 grid gap-2 text-sm leading-5 text-ink-muted">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <PlanCheck />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm italic leading-5 text-ink-muted">{plan.note}</p>
      </div>
    </article>
  )
}

export function PlanSelectionView({
  cadence,
  plans,
  selectedPlanId,
  laterHref,
  onToggleCadence,
  onSelectPlan,
}: PlanSelectionViewProps) {
  const annual = cadence === 'annual'
  const carouselRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Partial<Record<Plan, HTMLElement>>>({})
  const recommendedPlanId = plans.find((plan) => plan.popular)?.id ?? plans[0]?.id
  const [activePlanId, setActivePlanId] = useState<Plan | undefined>(recommendedPlanId)

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
    if (!isMobile) return
    const container = carouselRef.current
    const card = recommendedPlanId ? cardRefs.current[recommendedPlanId] : undefined
    if (!container || !card) return
    container.scrollLeft = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2
  }, [recommendedPlanId])

  useEffect(() => {
    const container = carouselRef.current
    if (!container) return
    function handleScroll() {
      const containerCenter = container!.scrollLeft + container!.clientWidth / 2
      let closestId: Plan | undefined
      let closestDistance = Infinity
      for (const plan of plans) {
        const card = cardRefs.current[plan.id]
        if (!card) continue
        const cardCenter = card.offsetLeft + card.clientWidth / 2
        const distance = Math.abs(cardCenter - containerCenter)
        if (distance < closestDistance) {
          closestDistance = distance
          closestId = plan.id
        }
      }
      if (closestId) setActivePlanId(closestId)
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [plans])

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-64 bg-brand-bar sm:h-80" />
        <a
          href="/v3"
          aria-label="Close plan selection"
          className="absolute end-6 top-6 z-shell grid size-11 place-items-center rounded-soft text-brand-bar-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <X aria-hidden="true" className="size-5" />
        </a>

        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-12 pt-14 sm:px-6 sm:pt-16">
          <div className="mx-auto flex flex-col items-center gap-3 text-center text-brand-bar-text">
            <h1 className="text-2xl font-semibold leading-tight">Choose a plan</h1>
            <div className="flex items-center gap-3 text-sm font-medium">
              <span>Monthly</span>
              <button
                type="button"
                role="switch"
                aria-label="Toggle annual billing"
                aria-checked={annual}
                onClick={onToggleCadence}
                className={cn(
                  'relative flex h-6 w-10 shrink-0 items-center rounded-pill p-0.5 transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bar',
                  annual ? 'bg-brand-bar-text' : 'bg-brand-bar-text/25',
                )}
              >
                <span
                  className={cn(
                    'block size-5 rounded-pill shadow-control transition-transform duration-normal',
                    annual ? 'translate-x-4 bg-brand-bar' : 'translate-x-0 bg-brand-bar-text',
                  )}
                />
              </button>
              <span>
                Annual <span className="text-focus">(save 20%)</span>
              </span>
            </div>
          </div>

          <div className="mx-auto mt-8 w-full max-w-4xl bg-surface p-4 shadow-panel sm:mt-12 sm:p-6">
            <div
              ref={carouselRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:snap-none md:grid-cols-3 md:overflow-visible md:pb-0"
            >
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  selected={plan.id === selectedPlanId}
                  annual={annual}
                  onSelectPlan={onSelectPlan}
                  cardRef={(el) => {
                    if (el) cardRefs.current[plan.id] = el
                    else delete cardRefs.current[plan.id]
                  }}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-center gap-2 md:hidden">
              {plans.map((plan) => (
                <span
                  key={plan.id}
                  className={cn('h-1.5 rounded-full transition-all', plan.id === activePlanId ? 'w-5 bg-accent' : 'w-1.5 bg-border')}
                />
              ))}
            </div>
            <p className="rounded-b-panel border border-warning bg-warning-surface px-4 py-3 text-sm text-warning">
              You're billed for what you actually use — a quick resume edit costs less than a 30-minute live Copilot session. Use your balance across any feature.
            </p>
          </div>

          <p className="mt-6 text-center">
            <a
              href={laterHref}
              className="text-base font-medium text-ink-muted underline underline-offset-4 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              I&apos;ll do this later
            </a>
          </p>
          <p className="mt-1.5 text-center text-sm text-ink-muted">
            No plan? You&apos;ll still get 5 credits every month to try Lightforth.
          </p>
        </div>
      </section>
    </main>
  )
}
