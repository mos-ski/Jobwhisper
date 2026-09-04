import { useState } from 'react'

import type {
  AdminAlert,
  AdminAlertSeverity,
  AdminDateRange,
  AdminDateRangeId,
  AdminKpi,
  AdminNavItem,
  AdminNotification,
  AdminPlanMixRow,
  AdminProductMixRow,
  AdminSearchResult,
  AdminTrendMetric,
  AdminTrendPoint,
} from '@/contracts/admin.draft'
import type { UserIdentity } from '@/contracts/identity'
import { cn, formatUsdWhole, Skeleton } from '@/ui'

import { AdminShell } from './admin-shell'

export type AdminDashboardViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly dateRanges: readonly AdminDateRange[]
  readonly kpis: readonly AdminKpi[]
  readonly trendPoints: readonly AdminTrendPoint[]
  readonly productMix: readonly AdminProductMixRow[]
  readonly planMix: readonly AdminPlanMixRow[]
  readonly alerts: readonly AdminAlert[]
  readonly isLoading?: boolean
}

const countFormatter = new Intl.NumberFormat('en-US')

function formatKpiValue(kpi: AdminKpi): string {
  if (kpi.format === 'usd-cents') return formatUsdWhole(kpi.value)
  if (kpi.format === 'percent') return `${kpi.value}%`
  return countFormatter.format(kpi.value)
}

function KpiTile({ kpi, emphasis = false }: { readonly kpi: AdminKpi; readonly emphasis?: boolean }) {
  const isGoodDelta = kpi.deltaDirection === 'up' ? kpi.higherIsBetter : !kpi.higherIsBetter
  // The sign carries the direction, so no arrow glyph is needed to repeat it.
  const sign = kpi.deltaDirection === 'up' ? '+' : '−'

  return (
    <article className="rounded-panel border border-border bg-surface p-4 shadow-control">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{kpi.label}</h3>
        {kpi.realtime ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-positive">
            <span aria-hidden="true" className="size-1.5 rounded-pill bg-positive" />
            Live
          </span>
        ) : null}
      </div>
      <p className={cn('mt-2 font-gowun font-bold text-ink', emphasis ? 'text-5xl leading-[1.1]' : 'text-3xl leading-9')}>
        {formatKpiValue(kpi)}
      </p>
      <p className={cn('mt-1.5 text-xs font-semibold', isGoodDelta ? 'text-positive' : 'text-danger')}>
        {sign}{kpi.deltaPercent}%
        <span className="ms-1 font-normal text-ink-muted">vs previous period</span>
      </p>
      <p className="mt-2 text-xs leading-5 text-ink-muted">{kpi.caption}</p>
    </article>
  )
}

function TrendChart({ points, metric, showTable, onToggleTable }: {
  readonly points: readonly AdminTrendPoint[]
  readonly metric: AdminTrendMetric
  readonly showTable: boolean
  readonly onToggleTable: () => void
}) {
  const values = points.map((point) => (metric === 'revenue' ? point.revenueCents : point.creditsConsumed))
  const max = Math.max(...values)
  const barWidth = 100 / (points.length * 2 - 1)

  return (
    <figure className="mt-4">
      <figcaption className="sr-only">
        {metric === 'revenue' ? 'Revenue' : 'Credits consumed'} by day across the selected range
      </figcaption>
      <div className="flex h-48 items-end gap-[2px]" role="img" aria-label={`Bar chart of ${metric === 'revenue' ? 'daily revenue' : 'daily credits consumed'}`}>
        {points.map((point, index) => {
          const value = values[index]
          const heightPercent = max > 0 ? Math.max(2, (value / max) * 100) : 2
          const readable = metric === 'revenue' ? formatUsdWhole(value) : `${countFormatter.format(value)} credits`
          return (
            <div key={point.label} className="group relative flex h-full flex-1 items-end" style={{ minWidth: `${barWidth}%` }}>
              <div
                className="w-full rounded-t-sm bg-accent transition-colors duration-normal ease-default group-hover:bg-accent-hover motion-reduce:transition-none"
                style={{ height: `${heightPercent}%` }}
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-full z-dropdown mb-1 hidden justify-center group-hover:flex">
                <span className="whitespace-nowrap rounded-soft border border-border bg-surface px-2 py-1 text-[11px] font-medium text-ink shadow-popover">
                  {point.label}: {readable}
                </span>
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-ink-muted">
        <span>{points[0]?.label}</span>
        <button
          type="button"
          onClick={onToggleTable}
          aria-expanded={showTable}
          className="min-h-9 rounded-soft px-2 text-xs font-semibold text-accent-text underline underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          {showTable ? 'Hide values' : 'Show values'}
        </button>
        <span>{points[points.length - 1]?.label}</span>
      </div>
      {/* Always in the accessibility tree so the per-bar values, which are otherwise hover-only, are reachable without a pointer. */}
      <div className={cn('mt-3 overflow-x-auto', showTable ? undefined : 'sr-only')}>
        <table className="w-full text-start text-sm">
          <caption className="pb-2 text-start text-xs text-ink-muted">
            {metric === 'revenue' ? 'Revenue' : 'Credits consumed'} by day
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-1.5 pe-3 text-start text-xs font-semibold uppercase tracking-wide text-ink-muted">Day</th>
              <th scope="col" className="py-1.5 text-end text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {metric === 'revenue' ? 'Revenue' : 'Credits'}
              </th>
            </tr>
          </thead>
          <tbody>
            {points.map((point, index) => (
              <tr key={point.label} className="border-b border-border last:border-b-0">
                <th scope="row" className="py-1.5 pe-3 text-start font-medium text-ink">{point.label}</th>
                <td className="py-1.5 text-end tabular-nums text-ink">
                  {metric === 'revenue' ? formatUsdWhole(values[index]) : countFormatter.format(values[index])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}

const alertSeverityLabels: Record<AdminAlertSeverity, string> = {
  critical: 'Critical',
  warning: 'Warning',
  info: 'For info',
}

const alertToneClasses: Record<AdminAlertSeverity, string> = {
  critical: 'text-danger',
  warning: 'text-warning',
  info: 'text-ink-muted',
}

function AlertRow({ alert }: { readonly alert: AdminAlert }) {
  return (
    <li className="border-b border-border last:border-b-0">
      <div className="flex flex-wrap items-start gap-4 p-4">
        {/* Severity reads as a word, not as a colored glyph, so it survives both color blindness and a screen reader. */}
        <p className={cn('w-16 shrink-0 pt-0.5 text-xs font-bold uppercase tracking-wide', alertToneClasses[alert.severity])}>
          {alertSeverityLabels[alert.severity]}
        </p>
        <div className="min-w-0 flex-1">
          <p className="font-gowun text-base font-bold text-ink">{alert.title}</p>
          <p className="mt-0.5 text-sm leading-6 text-ink-muted">{alert.detail}</p>
        </div>
        <a
          href={alert.href}
          className="inline-flex min-h-9 shrink-0 items-center rounded-md border border-input px-3 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          {alert.actionLabel}
        </a>
      </div>
    </li>
  )
}

function MixBar({ label, primary, secondary, sharePercent }: {
  readonly label: string
  readonly primary: string
  readonly secondary: string
  readonly sharePercent: number
}) {
  return (
    <li className="py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="text-sm text-ink">
          {primary}
          <span className="ms-2 text-xs text-ink-muted">{secondary}</span>
        </p>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-pill bg-surface-subtle">
          <div className="h-full rounded-pill bg-accent" style={{ inlineSize: `${sharePercent}%` }} />
        </div>
        <span className="w-10 shrink-0 text-end text-xs font-medium text-ink-muted">{sharePercent}%</span>
      </div>
    </li>
  )
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-6 p-4 sm:p-6">
      <Skeleton className="h-9 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-32 rounded-panel" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-panel" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-panel" />
        <Skeleton className="h-64 rounded-panel" />
      </div>
    </div>
  )
}

export function AdminDashboardView({
  user,
  navItems,
  notifications,
  searchResults,
  dateRanges,
  kpis,
  trendPoints,
  productMix,
  planMix,
  alerts,
  isLoading = false,
}: AdminDashboardViewProps) {
  const [rangeId, setRangeId] = useState<AdminDateRangeId>(dateRanges[1]?.id ?? '30d')
  const [trendMetric, setTrendMetric] = useState<AdminTrendMetric>('revenue')
  const [showTrendTable, setShowTrendTable] = useState(false)
  const activeRange = dateRanges.find((range) => range.id === rangeId) ?? dateRanges[0]
  const headlineKpis = kpis.filter((kpi) => kpi.id === 'mrr' || kpi.id === 'active-subscribers')
  const supportingKpis = kpis.filter((kpi) => kpi.id !== 'mrr' && kpi.id !== 'active-subscribers')

  return (
    <AdminShell
      user={user}
      navItems={navItems}
      activeModule="dashboard"
      notifications={notifications}
      searchResults={searchResults}
    >
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="grid gap-6 p-4 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-gowun text-3xl font-bold leading-tight text-ink">Dashboard</h1>
              <p className="mt-1 text-sm text-ink-muted">
                Platform performance for {activeRange?.rangeLabel}.
              </p>
            </div>
            <div className="flex flex-wrap gap-1 rounded-md border border-border bg-surface p-1" role="group" aria-label="Date range">
              {dateRanges.map((range) => (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => setRangeId(range.id)}
                  aria-pressed={range.id === rangeId}
                  className={cn(
                    'min-h-9 rounded-soft px-3 text-sm font-medium transition-colors duration-normal ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                    range.id === rangeId ? 'bg-accent-subtle text-accent-text' : 'text-ink-muted hover:bg-surface-subtle hover:text-ink',
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <section aria-label="Key performance indicators" className="grid gap-4">
            {/* Revenue and subscriber count are the two numbers the business is actually run on, so they
                get their own weight rather than being flattened into one uniform grid with the rest. */}
            <div className="grid gap-4 sm:grid-cols-2">
              {headlineKpis.map((kpi) => (
                <KpiTile key={kpi.id} kpi={kpi} emphasis />
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {supportingKpis.map((kpi) => (
                <KpiTile key={kpi.id} kpi={kpi} />
              ))}
            </div>
          </section>

          <section className="rounded-panel border border-border bg-surface p-4 shadow-control sm:p-5" aria-label="Trend over time">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-gowun text-lg font-bold text-ink">
                {trendMetric === 'revenue' ? 'Revenue' : 'Credits consumed'} over time
              </h2>
              <div className="flex gap-1 rounded-md border border-border p-1" role="group" aria-label="Trend metric">
                {(['revenue', 'credits'] as const).map((metric) => (
                  <button
                    key={metric}
                    type="button"
                    onClick={() => setTrendMetric(metric)}
                    aria-pressed={metric === trendMetric}
                    className={cn(
                      'min-h-9 rounded-soft px-3 text-sm font-medium transition-colors duration-normal ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                      metric === trendMetric ? 'bg-accent-subtle text-accent-text' : 'text-ink-muted hover:bg-surface-subtle hover:text-ink',
                    )}
                  >
                    {metric === 'revenue' ? 'Revenue' : 'Credits'}
                  </button>
                ))}
              </div>
            </div>
            <TrendChart
              points={trendPoints}
              metric={trendMetric}
              showTable={showTrendTable}
              onToggleTable={() => setShowTrendTable((prev) => !prev)}
            />
          </section>

          <section className="rounded-panel border border-border bg-surface shadow-control" aria-label="Needs attention">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border p-4 sm:px-5">
              <h2 className="font-gowun text-lg font-bold text-ink">Needs attention</h2>
              <p className="text-sm text-ink-muted">{alerts.length} open items</p>
            </div>
            <ul>
              {alerts.map((alert) => (
                <AlertRow key={alert.id} alert={alert} />
              ))}
            </ul>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-panel border border-border bg-surface p-4 shadow-control sm:p-5" aria-label="Revenue by product">
              <h2 className="font-gowun text-lg font-bold text-ink">Revenue by product</h2>
              <p className="mt-1 text-sm text-ink-muted">Share of revenue across the selected range.</p>
              <ul className="mt-2 divide-y divide-border">
                {productMix.map((row) => (
                  <MixBar
                    key={row.id}
                    label={row.label}
                    primary={formatUsdWhole(row.revenueCents)}
                    secondary={`${countFormatter.format(row.activeUsers)} users`}
                    sharePercent={row.sharePercent}
                  />
                ))}
              </ul>
            </section>

            <section className="rounded-panel border border-border bg-surface p-4 shadow-control sm:p-5" aria-label="Subscribers by plan">
              <h2 className="font-gowun text-lg font-bold text-ink">Subscribers by plan</h2>
              <p className="mt-1 text-sm text-ink-muted">Ace Your Interview tiers, plus the unsubscribed base.</p>
              <ul className="mt-2 divide-y divide-border">
                {planMix.map((row) => (
                  <MixBar
                    key={row.id}
                    label={row.label}
                    primary={countFormatter.format(row.subscribers)}
                    secondary={row.mrrCents > 0 ? `${formatUsdWhole(row.mrrCents)} MRR` : 'No MRR'}
                    sharePercent={row.sharePercent}
                  />
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
