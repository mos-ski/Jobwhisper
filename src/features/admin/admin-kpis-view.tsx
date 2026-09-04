import { useState, type ReactNode } from 'react'

import type { AdminRevenueKpis } from '@/contracts/admin-kpis.draft'
import type { AdminNavItem, AdminNotification, AdminSearchResult } from '@/contracts/admin.draft'
import type { UserIdentity } from '@/contracts/identity'
import { cn, formatUsdWhole, Skeleton } from '@/ui'

import { AdminShell } from './admin-shell'

function Section({ title, note, children }: { readonly title: string; readonly note?: string; readonly children: ReactNode }) {
  return (
    <section className="grid gap-3">
      <h2 className="font-gowun text-xl font-bold text-ink">{title}</h2>
      {children}
      {note ? <p className="text-sm leading-6 text-ink-muted">{note}</p> : null}
    </section>
  )
}

function Th({ children, align }: { readonly children: ReactNode; readonly align?: 'end' }) {
  return (
    <th scope="col" className={cn('px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-muted', align === 'end' && 'text-end')}>
      {children}
    </th>
  )
}

function Td({ children, align, bold }: { readonly children: ReactNode; readonly align?: 'end'; readonly bold?: boolean }) {
  return (
    <td className={cn('px-4 py-2.5', align === 'end' && 'text-end tabular-nums', bold && 'font-semibold text-ink')}>
      {children}
    </td>
  )
}

function TotalRow({ label, value, colSpan }: { readonly label: string; readonly value: string; readonly colSpan: number }) {
  return (
    <tr className="border-t-2 border-border bg-surface-subtle">
      <Td bold>{label}</Td>
      {colSpan > 2 ? Array.from({ length: colSpan - 2 }, (_, i) => <td key={i} />) : null}
      <Td align="end" bold>{value}</Td>
    </tr>
  )
}

function KpiSkeleton() {
  return (
    <div className="grid gap-6 p-4 sm:p-6">
      <Skeleton className="h-9 w-64" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </div>
  )
}

export type AdminKpisViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly kpis: AdminRevenueKpis
  readonly isLoading?: boolean
}

export function AdminKpisView({ user, navItems, notifications, searchResults, kpis, isLoading = false }: AdminKpisViewProps) {
  const [targetDollars, setTargetDollars] = useState(String(kpis.targetCents / 100))
  const targetCents = Math.max(0, Math.round((Number(targetDollars) || 0) * 100))

  const projectedCents = kpis.pathToTarget.reduce((sum, line) => sum + line.revenueCents, 0)
  const gapCents = projectedCents - targetCents
  const clearsTarget = gapCents >= 0

  const [renewalRatePercent, setRenewalRatePercent] = useState(String(kpis.vslForecast.renewalRatePercent))
  const renewalRate = Math.max(0, Math.min(100, Number(renewalRatePercent) || 0))
  const renewingCount = Math.round((kpis.vslForecast.monthlySignups * renewalRate) / 100)
  const renewalRevenueCents = renewingCount * kpis.vslForecast.renewalPriceCents

  return (
    <AdminShell user={user} navItems={navItems} activeModule="kpis" notifications={notifications} searchResults={searchResults}>
      {isLoading ? (
        <KpiSkeleton />
      ) : (
        <div className="grid gap-8 p-4 sm:p-6">
          <div>
            <h1 className="font-gowun text-3xl font-bold leading-tight text-ink">Revenue & KPIs</h1>
            <p className="mt-1 text-sm text-ink-muted">How Jobwhisper makes money, and the path to a self-sustaining monthly target.</p>
          </div>

          <section className="grid gap-4 sm:grid-cols-3">
            <article className="bg-surface p-4 shadow-panel">
              <label htmlFor="kpi-target" className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Monthly target
              </label>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-gowun text-2xl font-bold text-ink">$</span>
                <input
                  id="kpi-target"
                  type="number"
                  min={0}
                  step={100}
                  value={targetDollars}
                  onChange={(event) => setTargetDollars(event.target.value)}
                  className="w-full min-w-0 border-b border-dashed border-input bg-transparent font-gowun text-3xl font-bold leading-9 text-ink focus-visible:outline-none focus-visible:border-accent"
                />
              </div>
              <p className="mt-1.5 text-xs text-ink-muted">Editable — the self-sustaining line this page plans around.</p>
            </article>
            <article className="bg-surface p-4 shadow-panel">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Projected revenue</h2>
              <p className="mt-2 font-gowun text-3xl font-bold leading-9 text-ink">{formatUsdWhole(projectedCents)}</p>
              <p className="mt-1.5 text-xs text-ink-muted">Sum of the plan mix below</p>
            </article>
            <article className={cn('p-4 shadow-panel', clearsTarget ? 'bg-positive-surface' : 'bg-warning-surface')}>
              <h2 className={cn('text-xs font-semibold uppercase tracking-wide', clearsTarget ? 'text-positive' : 'text-warning')}>
                {clearsTarget ? 'Surplus' : 'Shortfall'}
              </h2>
              <p className={cn('mt-2 font-gowun text-3xl font-bold leading-9', clearsTarget ? 'text-positive' : 'text-warning')}>
                {clearsTarget ? '+' : '−'}{formatUsdWhole(Math.abs(gapCents))}
              </p>
              <p className={cn('mt-1.5 text-xs', clearsTarget ? 'text-positive' : 'text-warning')}>
                {clearsTarget ? 'This mix clears the target.' : 'This mix falls short of the target.'}
              </p>
            </article>
          </section>

          <Section title="The three plans">
            <div className="overflow-x-auto bg-surface shadow-panel">
              <table className="w-full min-w-[40rem] text-start text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <Th>Plan</Th>
                    <Th>How it works</Th>
                    <Th align="end">Price</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {kpis.plans.map((plan) => (
                    <tr key={plan.label}>
                      <Td bold>{plan.label}</Td>
                      <Td>{plan.howItWorks}</Td>
                      <Td align="end">{plan.priceLabel}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Path to target — self-sustaining" note={kpis.pathToTargetNote}>
            <div className="overflow-x-auto bg-surface shadow-panel">
              <table className="w-full min-w-[40rem] text-start text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <Th>Plan</Th>
                    <Th>Volume</Th>
                    <Th align="end">Revenue</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {kpis.pathToTarget.map((line) => (
                    <tr key={line.id}>
                      <Td bold>{line.label}</Td>
                      <Td>{line.volumeLabel}</Td>
                      <Td align="end">{formatUsdWhole(line.revenueCents)}</Td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <TotalRow label="Total" value={formatUsdWhole(projectedCents)} colSpan={3} />
                </tfoot>
              </table>
            </div>
          </Section>

          <Section title="Done For You — package mix" note={kpis.doneForYouNote}>
            <div className="overflow-x-auto bg-surface shadow-panel">
              <table className="w-full min-w-[32rem] text-start text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <Th>Package</Th>
                    <Th align="end">Price</Th>
                    <Th align="end">Sales</Th>
                    <Th align="end">Revenue</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {kpis.doneForYouPackages.map((pkg) => (
                    <tr key={pkg.label}>
                      <Td bold>{pkg.label}</Td>
                      <Td align="end">{formatUsdWhole(pkg.priceCents)}</Td>
                      <Td align="end">{pkg.sales}</Td>
                      <Td align="end">{formatUsdWhole(pkg.revenueCents)}</Td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <TotalRow
                    label="Total"
                    value={formatUsdWhole(kpis.doneForYouPackages.reduce((sum, pkg) => sum + pkg.revenueCents, 0))}
                    colSpan={4}
                  />
                </tfoot>
              </table>
            </div>
          </Section>

          <Section title="Ace Your Interview — tier mix" note={kpis.aceYourInterviewNote}>
            <div className="overflow-x-auto bg-surface shadow-panel">
              <table className="w-full min-w-[36rem] text-start text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <Th>Tier</Th>
                    <Th align="end">Price</Th>
                    <Th align="end">Mix</Th>
                    <Th align="end">Subscribers</Th>
                    <Th align="end">Revenue</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {kpis.aceYourInterviewTiers.map((tier) => (
                    <tr key={tier.label}>
                      <Td bold>{tier.label}</Td>
                      <Td align="end">{formatUsdWhole(tier.priceCents)}/mo</Td>
                      <Td align="end">{tier.mixPercent}%</Td>
                      <Td align="end">{tier.subscribers}</Td>
                      <Td align="end">{formatUsdWhole(tier.revenueCents)}</Td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <TotalRow
                    label="Total"
                    value={formatUsdWhole(kpis.aceYourInterviewTiers.reduce((sum, tier) => sum + tier.revenueCents, 0))}
                    colSpan={5}
                  />
                </tfoot>
              </table>
            </div>
          </Section>

          <Section title="Find Your Job & credit top-ups" note={kpis.findYourJobNote}>
            <div className="overflow-x-auto bg-surface shadow-panel">
              <table className="w-full min-w-[40rem] text-start text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <Th>Source</Th>
                    <Th>Volume</Th>
                    <Th align="end">Revenue</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {kpis.findYourJobSources.map((source) => (
                    <tr key={source.label}>
                      <Td bold>{source.label}</Td>
                      <Td>{source.volumeLabel}</Td>
                      <Td align="end">{formatUsdWhole(source.revenueCents)}</Td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <TotalRow
                    label="Total"
                    value={formatUsdWhole(kpis.findYourJobSources.reduce((sum, source) => sum + source.revenueCents, 0))}
                    colSpan={3}
                  />
                </tfoot>
              </table>
            </div>
          </Section>

          <Section title="What's underneath the pricing">
            <p className="text-sm leading-6 text-ink-muted">{kpis.pricingNote}</p>
          </Section>

          <Section title="Upsell layer">
            <div className="overflow-x-auto bg-surface shadow-panel">
              <table className="w-full min-w-[40rem] text-start text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <Th>Upsell</Th>
                    <Th>Where it happens</Th>
                    <Th>Offer</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {kpis.upsells.map((upsell) => (
                    <tr key={upsell.label}>
                      <Td bold>{upsell.label}</Td>
                      <Td>{upsell.where}</Td>
                      <Td>{upsell.offer}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Acquisition & CAC">
            <div className="grid gap-3">
              {kpis.acquisitionNotes.map((note) => (
                <p key={note.title} className="text-sm leading-6 text-ink-muted">
                  <span className="font-semibold text-ink">{note.title}: </span>
                  {note.body}
                </p>
              ))}
            </div>
          </Section>

          <Section title="VSL renewal forecast">
            <div className="bg-surface p-4 shadow-panel">
              <p className="text-sm leading-6 text-ink-muted">
                If <span className="font-semibold text-ink">{kpis.vslForecast.monthlySignups}</span> people take the{' '}
                {formatUsdWhole(kpis.vslForecast.firstMonthPriceCents)} VSL first-month offer this month, that's{' '}
                <span className="font-semibold text-ink">{formatUsdWhole(kpis.vslForecast.monthlySignups * kpis.vslForecast.firstMonthPriceCents)}</span> in first-month revenue from the cohort.
              </p>
              <div className="mt-4 flex flex-wrap items-end gap-3">
                <label htmlFor="kpi-renewal-rate" className="text-sm font-medium text-ink">
                  At a renewal rate of
                </label>
                <div className="flex items-baseline gap-1">
                  <input
                    id="kpi-renewal-rate"
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={renewalRatePercent}
                    onChange={(event) => setRenewalRatePercent(event.target.value)}
                    className="w-16 border-b border-dashed border-input bg-transparent font-gowun text-lg font-bold text-ink focus-visible:outline-none focus-visible:border-accent"
                  />
                  <span className="text-sm font-medium text-ink">%</span>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                <span className="font-semibold text-ink">{renewingCount}</span> of those {kpis.vslForecast.monthlySignups} renew into month two at{' '}
                {formatUsdWhole(kpis.vslForecast.renewalPriceCents)}/mo — that's{' '}
                <span className="font-gowun text-lg font-bold text-positive">{formatUsdWhole(renewalRevenueCents)}/month</span> in ongoing renewal
                revenue from this one month's VSL cohort, compounding as every subsequent month's cohort renews on top of it.
              </p>
            </div>
          </Section>
        </div>
      )}
    </AdminShell>
  )
}
