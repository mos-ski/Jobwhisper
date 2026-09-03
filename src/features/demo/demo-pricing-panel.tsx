import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { authPlanFixtures } from '@/mocks/billing'
import { formatCredits } from '@/lib/credits'
import { Badge, Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui'

const DISCOUNT_FIRST_MONTH = 0.6
const DISCOUNTED_PLAN_IDS = new Set(['pro', 'premium'])

// Same checkmark treatment as the real plan cards (plan-selection-view.tsx's PlanCheck).
function PlanCheck() {
  return <img aria-hidden="true" src="/v3-assets/check.svg" alt="" className="mt-0.5 size-4 shrink-0" />
}

export type DemoPricingPanelProps = {
  readonly onClaimOffer: () => void
}

export function DemoPricingPanel({ onClaimOffer }: DemoPricingPanelProps) {
  const navigate = useNavigate()
  const [planId, setPlanId] = useState<string>('pro')

  return (
    <div className="flex w-full shrink-0 flex-col gap-6 border-t border-border bg-canvas p-6 sm:p-8 lg:w-[30%] lg:border-l lg:border-t-0 lg:justify-center">
      <div>
        <h2 className="font-gowun text-xl font-semibold text-ink">See Jobwhisper in action</h2>
        <p className="mt-2 text-sm text-ink-muted">Get 60% off your first month while you try it.</p>
      </div>

      <Tabs value={planId} onValueChange={setPlanId}>
        <TabsList>
          {authPlanFixtures.map((plan) => (
            <TabsTrigger key={plan.id} value={plan.id}>
              {plan.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {authPlanFixtures.map((plan) => {
          const discounted = DISCOUNTED_PLAN_IDS.has(plan.id)
          const firstMonthPrice = Math.round(plan.priceMonthly * (1 - DISCOUNT_FIRST_MONTH))

          return (
            <TabsContent key={plan.id} value={plan.id} className="rounded-panel border border-border bg-surface p-5">
              {plan.popular || discounted ? (
                <div className="flex flex-wrap items-center gap-2">
                  {plan.popular ? <Badge>Popular</Badge> : null}
                  {discounted ? <Badge variant="positive">60% off first month</Badge> : null}
                </div>
              ) : null}

              <div className="mt-3 flex flex-wrap items-end gap-1">
                <span className="font-gowun text-4xl font-semibold leading-tight text-ink">${discounted ? firstMonthPrice : plan.priceMonthly}</span>
                <span className="pb-1 text-sm font-medium text-ink">per month</span>
              </div>
              {discounted ? (
                <p className="mt-1 text-sm text-ink-muted">
                  <span className="line-through">${plan.priceMonthly}/mo</span> after the first month
                </p>
              ) : null}

              <p className="mt-4 text-sm font-semibold text-ink">{formatCredits(plan.includedUsageCents)} included</p>
              <p className="mt-2 text-sm leading-5 text-ink-muted">{plan.description}</p>

              <ul className="mt-4 grid gap-2 text-sm leading-5 text-ink-muted">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <PlanCheck />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          )
        })}
      </Tabs>

      <Button
        size="lg"
        onClick={() => {
          onClaimOffer()
          navigate('/v3/auth/choose-plan')
        }}
      >
        Claim offer
      </Button>

      <p className="text-xs text-ink-muted">
        By continuing, you agree to our <a href="#" className="underline underline-offset-2 hover:text-ink">Privacy Policy</a>.
      </p>
    </div>
  )
}
