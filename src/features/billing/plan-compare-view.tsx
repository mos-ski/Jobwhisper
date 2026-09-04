import { useState } from 'react'
import { Check, Minus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import type { BillingPlanCard } from '@/contracts/account.draft'
import { AppShell } from '@/features/dashboard/app-nav'
import { Badge, Button, cn, ShellBar, Switch } from '@/ui'

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

function PlanCard({ plan, annual, index }: { readonly plan: BillingPlanCard; readonly annual: boolean; readonly index: number }) {
  const navigate = useNavigate()

  return (
    <article
      style={{ animationDelay: `${index * 70}ms`, animationFillMode: 'backwards' }}
      className={cn(
        'flex animate-ease-in-bottom flex-col rounded-panel border p-6 transition-all duration-normal ease-default hover:-translate-y-0.5 hover:shadow-control',
        plan.current ? 'border-positive' : 'border-border',
      )}
    >
      <div className="flex items-center gap-2">
        <h2 className="font-gowun text-sm font-bold tracking-wide text-ink">{plan.name}</h2>
        {plan.tag ? <span className="text-sm font-medium text-ink-muted">{plan.tag}</span> : null}
        {plan.current ? <Badge variant="positive">Current</Badge> : null}
      </div>

      <p className="mt-4 flex items-baseline gap-1.5">
        <span className="font-gowun text-3xl font-bold text-ink">{annual ? plan.annualPrice : plan.price}</span>
        <span className="text-sm text-ink-muted">{annual ? plan.annualCadence : plan.cadence}</span>
      </p>

      <p className="mt-4 text-sm font-bold text-ink">{plan.credits}</p>
      <p className="mt-2 text-sm leading-5 text-ink-muted">{plan.description}</p>

      <div className="mt-5">
        {plan.current ? (
          <Button variant="secondary" className="w-full" disabled>
            Current Plan
          </Button>
        ) : plan.id === 'premium' ? (
          <Button className="w-full" onClick={() => navigate('/v3/billing')}>
            Upgrade
          </Button>
        ) : (
          <Button variant="secondary" className="w-full" onClick={() => navigate('/v3/billing')}>
            Downgrade
          </Button>
        )}
      </div>

      <ul className="mt-5 grid gap-2.5 border-t border-border pt-5 text-sm leading-5 text-ink-muted">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ink-muted" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm italic leading-5 text-accent-text">{plan.note}</p>
    </article>
  )
}

export function PlanCompareView({ homeHref, plans, backHref }: PlanCompareViewProps) {
  const [annual, setAnnual] = useState(true)

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
              <Badge variant="positive" size="sm">(save 20%)</Badge>
            </div>
          </div>
          <div className="grid gap-5 p-4 sm:p-6 lg:p-8 md:grid-cols-3">
            {plans.map((plan, index) => (
              <PlanCard key={plan.id} plan={plan} annual={annual} index={index} />
            ))}
          </div>
        </article>
        <FeatureAccessMatrix />
      </section>
    </AppShell>
  )
}
