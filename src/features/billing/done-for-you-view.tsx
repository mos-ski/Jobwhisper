import { useState } from 'react'
import { Check } from 'lucide-react'

import { AppShell } from '@/features/dashboard/app-nav'
import { Button, ShellBar, Tooltip, TooltipContent, TooltipTrigger } from '@/ui'

export type DoneForYouViewProps = {
  readonly homeHref: string
  readonly backHref: string
  readonly usageHref: string
}

const DFY_PACKAGES = [
  { id: 'dfy-small', jobs: '50 Jobs', price: 497, access: '+ 1 month of Jobwhisper access', recommended: false },
  { id: 'dfy-large', jobs: '100 Jobs', price: 997, access: '+ 3 months of Jobwhisper access', recommended: true },
] as const

type PackageDetail = {
  readonly name: string
  readonly jobs: string
  readonly duration: string
  readonly price: string
  readonly includes: string
}

const PACKAGE_DETAILS: readonly PackageDetail[] = [
  {
    name: 'Small',
    jobs: '50',
    duration: '1 month',
    price: '$497',
    includes: 'Resume tailoring, job scouting/filtering, applying, success manager, + 1 month of Jobwhisper product access',
  },
  {
    name: 'Large',
    jobs: '100',
    duration: '1 month',
    price: '$997',
    includes: 'Resume tailoring, job scouting/filtering, applying, success manager, + 3 months of Jobwhisper product access',
  },
]

function PackageDetailsTable() {
  return (
    <article className="mt-6 w-full min-w-0 bg-surface shadow-panel">
      <div className="flex min-h-[5rem] flex-col justify-center gap-1 border-b border-border px-4 sm:px-6 lg:px-8">
        <h2 className="font-gowun text-base font-semibold text-ink">Package details</h2>
        <p className="text-sm text-ink-muted">Sold as flat, committed packages, not open per-job billing.</p>
      </div>
      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-subtle text-ink-muted">
                <th className="px-3 py-2.5 text-start font-semibold sm:px-4">Package</th>
                <th className="px-3 py-2.5 text-start font-semibold sm:px-4">Jobs</th>
                <th className="px-3 py-2.5 text-start font-semibold sm:px-4">Duration</th>
                <th className="px-3 py-2.5 text-start font-semibold sm:px-4">Price</th>
                <th className="px-3 py-2.5 text-start font-semibold sm:px-4">Includes</th>
              </tr>
            </thead>
            <tbody>
              {PACKAGE_DETAILS.map((row) => (
                <tr key={row.name} className="border-b border-border">
                  <td className="px-3 py-2.5 font-medium leading-5 text-ink sm:px-4">{row.name}</td>
                  <td className="px-3 py-2.5 leading-5 text-ink sm:px-4">{row.jobs}</td>
                  <td className="px-3 py-2.5 leading-5 text-ink sm:px-4">{row.duration}</td>
                  <td className="px-3 py-2.5 font-semibold leading-5 text-ink sm:px-4">{row.price}</td>
                  <td className="px-3 py-2.5 leading-5 text-ink-muted sm:px-4">{row.includes}</td>
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

export function DoneForYouView({ homeHref, backHref, usageHref }: DoneForYouViewProps) {
  const [sentId, setSentId] = useState<string | null>(null)

  return (
    <AppShell>
      <ShellBar
        homeHref={homeHref}
        parent={{ href: backHref, label: 'Billing & subscription' }}
        current="Done-For-You"
        closeHref={backHref}
        closeLabel="Close done-for-you"
      />
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <article className="w-full min-w-0 bg-surface shadow-panel">
          <div className="flex min-h-[5rem] flex-wrap items-center justify-between gap-3 border-b border-border px-4 sm:px-6 lg:px-8">
            <h1 className="font-gowun text-lg font-bold leading-5 text-ink sm:text-xl">Done-For-You</h1>
            <Tooltip>
              <TooltipTrigger
                render={
                  <a href={usageHref} className="text-sm font-semibold text-accent-text underline underline-offset-4 hover:text-accent">
                    View usage details
                  </a>
                }
              />
              <TooltipContent>See a breakdown of how your credits were used</TooltipContent>
            </Tooltip>
          </div>
          <div className="grid gap-5 p-4 sm:p-6 lg:p-8 md:grid-cols-2">
            {DFY_PACKAGES.map((pkg, index) => (
              <article
                key={pkg.id}
                style={{ animationDelay: `${index * 70}ms`, animationFillMode: 'backwards' }}
                className="flex animate-ease-in-bottom flex-col rounded-panel border border-border p-6 transition-all duration-normal ease-default hover:-translate-y-0.5 hover:shadow-control"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Premium</p>
                <p className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-gowun text-3xl font-bold text-ink">${pkg.price}</span>
                  <span className="text-sm text-ink-muted">per month</span>
                </p>
                <p className="mt-4 text-sm font-bold text-ink">{pkg.jobs}</p>
                <p className="mt-1 text-sm text-ink-muted">{pkg.access}</p>

                <div className="mt-5">
                  {sentId === pkg.id ? (
                    <p className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-positive/20 bg-positive-surface text-sm font-semibold text-positive">
                      <Check aria-hidden="true" className="size-4" />
                      Request sent
                    </p>
                  ) : (
                    <Button
                      variant={pkg.recommended ? 'primary' : 'secondary'}
                      className="w-full"
                      onClick={() => setSentId(pkg.id)}
                    >
                      Get Started
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </article>
        <PackageDetailsTable />
      </section>
    </AppShell>
  )
}
