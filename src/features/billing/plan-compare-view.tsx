import { useEffect, useRef, useState } from 'react'
import { Check, Minus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import type { BillingPlanCard } from '@/contracts/account.draft'
import { AppShell } from '@/features/dashboard/app-nav'
import { ShellBar, Switch } from '@/ui'
import { PlanAmount, PlanCard, PlanCarousel } from '@/features/pricing/plan-card'
import { ProOfferWidget } from './pro-offer-widget'

type FeatureRow = {
  readonly capability: string
  readonly starter: string | boolean
  readonly pro: string | boolean
  readonly premium: string | boolean
}

const FEATURE_MATRIX: readonly FeatureRow[] = [
  { capability: 'Interview Prep', starter: true, pro: true, premium: true },
  { capability: 'Interview Copilot (web)', starter: true, pro: true, premium: true },
  { capability: 'Interview Copilot (desktop app)', starter: false, pro: true, premium: true },
  { capability: 'Coding Copilot', starter: false, pro: true, premium: true },
  { capability: 'Meeting Copilot', starter: false, pro: true, premium: true },
  { capability: 'Monthly minutes', starter: '≈500', pro: '≈1,000', premium: '≈4,000' },
  { capability: 'Knowledge Base documents', starter: '3', pro: '5', premium: '10' },
]

function FeatureCell({ value }: { readonly value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check aria-hidden="true" className="size-4 text-positive" />
    ) : (
      <Minus aria-hidden="true" className="size-4 text-ink-muted/40" />
    )
  }
  return <span className="text-ink">{value}</span>
}

function FeatureAccessMatrix() {
  return (
    <article className="mt-6 w-full min-w-0 bg-surface shadow-panel">
      <div className="flex min-h-[5rem] flex-col justify-center gap-1 border-b border-border px-4 sm:px-6 lg:px-8">
        <h2 className="font-gowun text-base font-semibold text-ink">Feature access matrix</h2>
        <p className="text-sm text-ink-muted">What each tier actually unlocks.</p>
      </div>
      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-subtle text-ink-muted">
                <th className="px-3 py-2.5 text-start font-semibold sm:px-4">Capability</th>
                <th className="px-3 py-2.5 text-start font-semibold sm:px-4">Starter</th>
                <th className="px-3 py-2.5 text-start font-semibold sm:px-4">Pro</th>
                <th className="px-3 py-2.5 text-start font-semibold sm:px-4">Premium</th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_MATRIX.map((row) => (
                <tr key={row.capability} className="border-b border-border">
                  <td className="px-3 py-2.5 font-medium leading-5 text-ink sm:px-4">{row.capability}</td>
                  <td className="px-3 py-2.5 leading-5 sm:px-4"><FeatureCell value={row.starter} /></td>
                  <td className="px-3 py-2.5 leading-5 sm:px-4"><FeatureCell value={row.pro} /></td>
                  <td className="px-3 py-2.5 leading-5 sm:px-4"><FeatureCell value={row.premium} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pointer-events-none absolute inset-y-0 end-0 w-8 bg-gradient-to-l from-surface to-transparent sm:hidden" />
      </div>
    </article>
  )
}

export type PlanCompareViewProps = {
  readonly homeHref: string
  readonly plans: readonly BillingPlanCard[]
  readonly backHref: string
}

/**
 * Maps a billing plan onto the shared pricing card, so the in-app picker and the public
 * pricing page show the same thing. `current` replaces the badge and locks the CTA.
 */
function BillingPlanCardView({ plan, annual, onProHover }: { readonly plan: BillingPlanCard; readonly annual: boolean; readonly onProHover?: () => void }) {
  // A weekly plan has no annual rate, so the switch leaves it alone and its card says why.
  const annualApplies = annual && Boolean(plan.annualPrice)
  const navigate = useNavigate()
  // In the picker, which plan you are on outranks which is popular, so it takes the banner.
  const banner = plan.current ? 'Current plan' : plan.popular ? 'Most Popular' : undefined

  return (
    <PlanCard
      name={plan.name}
      badge={banner ? undefined : plan.tag}
      banner={banner}
      tagline={plan.description}
      amount={<PlanAmount>{annualApplies ? plan.annualPrice : plan.price}</PlanAmount>}
      unit={annualApplies ? plan.annualCadence : plan.cadence}
      // Same as the public page: the features say what is covered, so a terms table would
      // say it a second time. Under annual the note carries what the row used to.
      priceNote={annual ? (plan.annualPrice ? 'Billed yearly' : 'Annual billing does not apply to weekly plans') : undefined}
      features={plan.features}
      ctaLabel={plan.current ? 'Current Plan' : plan.id === 'premium' ? 'Upgrade' : 'Downgrade'}
      onCta={plan.current ? undefined : () => navigate('/v3/billing')}
      ctaDisabled={plan.current}
      note={plan.note}
      plan={plan.id}
      onMouseEnter={plan.id === 'pro' ? onProHover : undefined}
    />
  )
}

export function PlanCompareView({ homeHref, plans, backHref }: PlanCompareViewProps) {
  const navigate = useNavigate()
  const [annual, setAnnual] = useState(true)
  const [showProOffer, setShowProOffer] = useState(false)
  const proOfferTriggeredRef = useRef(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!proOfferTriggeredRef.current) {
        proOfferTriggeredRef.current = true
        setShowProOffer(true)
      }
    }, 60_000)
    return () => window.clearTimeout(timer)
  }, [])

  const triggerProOffer = () => {
    if (proOfferTriggeredRef.current) return
    proOfferTriggeredRef.current = true
    setShowProOffer(true)
  }

  return (
    <AppShell>
      <ShellBar
        homeHref={homeHref}
        parent={{ href: backHref, label: 'Billing & subscription' }}
        current="Choose a plan"
        closeHref={backHref}
        closeLabel="Close plan selection"
      />
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <article className="w-full min-w-0 bg-surface shadow-panel">
          <div className="flex min-h-[5rem] flex-wrap items-center justify-between gap-3 border-b border-border px-4 sm:px-6 lg:px-8">
            <h1 className="font-gowun text-lg font-bold leading-5 text-ink sm:text-xl">Billing &amp; Subscription</h1>
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-medium text-ink">Annual</span>
              <Switch checked={annual} onCheckedChange={setAnnual} />
            </div>
          </div>
          <PlanCarousel count={plans.length}>
            {plans.map((plan) => (
              <BillingPlanCardView key={plan.id} plan={plan} annual={annual} onProHover={triggerProOffer} />
            ))}
          </PlanCarousel>
        </article>
        <FeatureAccessMatrix />
      </section>
      {showProOffer ? <ProOfferWidget onDismiss={() => setShowProOffer(false)} onClaim={() => navigate('/v3/billing?plan=pro&offer=welcome-60')} /> : null}
    </AppShell>
  )
}
