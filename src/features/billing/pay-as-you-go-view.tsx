import { useState } from 'react'
import { Check } from 'lucide-react'

import type { BillingStandalonePurchase } from '@/contracts/account.draft'
import { AddCreditsDialog } from '@/features/billing/add-credits-dialog'
import { AppShell } from '@/features/dashboard/app-nav'
import { Button, ShellBar } from '@/ui'

export type PayAsYouGoViewProps = {
  readonly homeHref: string
  readonly backHref: string
  readonly purchases: readonly BillingStandalonePurchase[]
}

type PurchaseTerms = {
  readonly feature: string
  readonly minimum: string
  readonly rate: string
  readonly example: string
}

const PURCHASE_TERMS: readonly PurchaseTerms[] = [
  { feature: 'Resume Builder', minimum: '$5', rate: '$0.10 / credit / prompt', example: '$5 → 50 prompts' },
  { feature: 'Auto Apply (AI-run)', minimum: '$10', rate: '$1 / credit / successful application', example: '$10 → 10 successful applications' },
]

function HowItsBoughtTable() {
  return (
    <article className="mt-6 w-full min-w-0 bg-surface shadow-panel">
      <div className="flex min-h-[5rem] flex-col justify-center gap-1 border-b border-border px-4 sm:px-6 lg:px-8">
        <h2 className="font-gowun text-base font-semibold text-ink">How it&apos;s bought</h2>
        <p className="text-sm text-ink-muted">Prepaid credits, purchased upfront. One purchase flow per feature.</p>
      </div>
      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-subtle text-ink-muted">
                <th className="px-3 py-2.5 text-start font-semibold sm:px-4">Feature</th>
                <th className="px-3 py-2.5 text-start font-semibold sm:px-4">Minimum purchase</th>
                <th className="px-3 py-2.5 text-start font-semibold sm:px-4">Rate</th>
                <th className="px-3 py-2.5 text-start font-semibold sm:px-4">Example</th>
              </tr>
            </thead>
            <tbody>
              {PURCHASE_TERMS.map((row) => (
                <tr key={row.feature} className="border-b border-border">
                  <td className="px-3 py-2.5 font-medium leading-5 text-ink sm:px-4">{row.feature}</td>
                  <td className="px-3 py-2.5 leading-5 text-ink sm:px-4">{row.minimum}</td>
                  <td className="px-3 py-2.5 leading-5 text-ink sm:px-4">{row.rate}</td>
                  <td className="px-3 py-2.5 leading-5 text-ink-muted sm:px-4">{row.example}</td>
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

function PurchaseCard({ purchase, index }: { readonly purchase: BillingStandalonePurchase; readonly index: number }) {
  const [balance, setBalance] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <article
      style={{ animationDelay: `${index * 70}ms`, animationFillMode: 'backwards' }}
      className="flex animate-ease-in-bottom flex-col rounded-panel border border-border p-6 transition-all duration-normal ease-default hover:-translate-y-0.5 hover:shadow-control"
    >
      <h2 className="font-gowun text-base font-bold text-ink">{purchase.name}</h2>
      <p className="mt-2 text-sm leading-5 text-ink-muted">{purchase.description}</p>
      <p className="mt-4 text-sm font-bold text-ink">{purchase.rateLabel}</p>

      <ul className="mt-5 grid gap-2.5 text-sm leading-5 text-ink-muted">
        {purchase.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-5">
        <p className="text-sm text-ink-muted">
          Balance: <span className="font-semibold text-ink">{balance} credits</span>
        </p>
        <Button onClick={() => setDialogOpen(true)}>Add credits</Button>
      </div>

      <AddCreditsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Add credits"
        description={purchase.name}
        centsPerCredit={purchase.centsPerCredit}
        minimumDollars={purchase.minimumDollars}
        presetDollars={purchase.presetDollars}
        currentBalanceCredits={balance}
        autoReloadHint={`Buy more automatically when your ${purchase.name} balance runs low.`}
        onPurchase={(credits) => setBalance((prev) => prev + credits)}
      />
    </article>
  )
}

export function PayAsYouGoView({ homeHref, backHref, purchases }: PayAsYouGoViewProps) {
  return (
    <AppShell>
      <ShellBar
        homeHref={homeHref}
        parent={{ href: backHref, label: 'Billing & subscription' }}
        current="Pay-as-you-go"
        closeHref={backHref}
        closeLabel="Close pay-as-you-go"
      />
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <article className="w-full min-w-0 bg-surface shadow-panel">
          <div className="flex min-h-[5rem] flex-wrap items-center justify-between gap-3 border-b border-border px-4 sm:px-6 lg:px-8">
            <h1 className="font-gowun text-lg font-bold leading-5 text-ink sm:text-xl">Pay-as-you-go</h1>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            <p className="text-sm text-ink-muted">
              Resume Builder and Auto Apply aren&apos;t part of any plan, no subscription needed. Buy credits once, spend them at your own pace, valid 12 months.
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {purchases.map((purchase, index) => (
                <PurchaseCard key={purchase.id} purchase={purchase} index={index} />
              ))}
            </div>
          </div>
        </article>
        <HowItsBoughtTable />
      </section>
    </AppShell>
  )
}
