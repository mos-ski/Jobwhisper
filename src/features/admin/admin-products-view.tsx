import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CircleSlash,
  RefreshCw,
  TriangleAlert,
} from 'lucide-react'

import type {
  AdminDoneForYouPipelineStatus,
  AdminProductDetail,
  AdminProductErrorGroup,
  AdminProductHealthState,
  AdminProductRow,
  AdminProductSessionOutcome,
  AdminProductSessionRow,
  AdminProductStatFormat,
  AdminProductStatus,
  AdminProductStatusFilter,
  AdminProductSummaryStat,
  AdminProductTierId,
  AdminProductTrendMetric,
  AdminProductTrendPoint,
} from '@/contracts/admin-products.draft'
import type { AdminNavItem, AdminNotification, AdminSearchResult } from '@/contracts/admin.draft'
import type { UserIdentity } from '@/contracts/identity'
import {
  Avatar,
  Badge,
  Button,
  cn,
  DataTable,
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
  EmptyState,
  formatUsdWhole,
  SelectField,
  Skeleton,
  Switch,
  type BadgeVariant,
  type DataTableColumn,
} from '@/ui'

import { AdminShell } from './admin-shell'

const PAGE_SIZE = 10
const countFormatter = new Intl.NumberFormat('en-US')

function formatStat(value: number, format: AdminProductStatFormat): string {
  if (format === 'usd-cents') return formatUsdWhole(value)
  if (format === 'percent') return `${value}%`
  if (format === 'minutes') return `${countFormatter.format(value)} min`
  return countFormatter.format(value)
}

const statusMeta: Record<AdminProductStatus, { readonly label: string; readonly variant: BadgeVariant }> = {
  live: { label: 'Live', variant: 'positive' },
  beta: { label: 'Beta', variant: 'info' },
  degraded: { label: 'Degraded', variant: 'warning' },
  disabled: { label: 'Disabled', variant: 'neutral' },
}

const healthTones: Record<AdminProductHealthState, string> = {
  healthy: 'text-positive',
  watch: 'text-warning',
  critical: 'text-danger',
}

const outcomeMeta: Record<AdminProductSessionOutcome, { readonly label: string; readonly variant: BadgeVariant }> = {
  completed: { label: 'Completed', variant: 'positive' },
  abandoned: { label: 'Abandoned', variant: 'neutral' },
  failed: { label: 'Failed', variant: 'danger' },
}

const tierLabels: Record<AdminProductTierId, string> = {
  unsubscribed: 'Unsubscribed',
  starter: 'Starter',
  pro: 'Pro',
  premium: 'Premium',
}

const errorSeverityTones: Record<AdminProductErrorGroup['severity'], string> = {
  critical: 'text-danger',
  warning: 'text-warning',
  info: 'text-ink-muted',
}

const errorSeverityLabels: Record<AdminProductErrorGroup['severity'], string> = {
  critical: 'Critical',
  warning: 'Warning',
  info: 'For info',
}

const pipelineStatusMeta: Record<AdminDoneForYouPipelineStatus, { readonly label: string; readonly variant: BadgeVariant }> = {
  'queued': { label: 'Queued', variant: 'neutral' },
  'in-progress': { label: 'In progress', variant: 'accent' },
  'completed': { label: 'Completed', variant: 'positive' },
}

const PACKAGE_LABELS: Record<string, string> = {
  'dfy-small': '50 jobs · $497',
  'dfy-large': '100 jobs · $997',
}

const SUCCESS_MANAGERS = ['Daniel Okoye', 'Priya Raghunathan', 'Rachel Adeyemi']

function StatusBadge({ status }: { readonly status: AdminProductStatus }) {
  const meta = statusMeta[status]
  return <Badge variant={meta.variant} size="sm">{meta.label}</Badge>
}

function DeltaLine({ deltaPercent, deltaDirection, higherIsBetter }: {
  readonly deltaPercent: number
  readonly deltaDirection: 'up' | 'down'
  readonly higherIsBetter: boolean
}) {
  const good = deltaDirection === 'up' ? higherIsBetter : !higherIsBetter
  const sign = deltaDirection === 'up' ? '+' : '−'
  return (
    <p className={cn('mt-1.5 text-xs font-semibold', good ? 'text-positive' : 'text-danger')}>
      {sign}{deltaPercent}%
      <span className="ms-1 font-normal text-ink-muted">vs previous period</span>
    </p>
  )
}

function StatTile({ label, value, caption, deltaPercent, deltaDirection, higherIsBetter }: {
  readonly label: string
  readonly value: string
  readonly caption: string
  readonly deltaPercent: number
  readonly deltaDirection: 'up' | 'down'
  readonly higherIsBetter: boolean
}) {
  return (
    <article className="bg-surface p-4 shadow-panel">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</h3>
      <p className="mt-2 font-gowun text-3xl font-bold leading-9 text-ink">{value}</p>
      <DeltaLine deltaPercent={deltaPercent} deltaDirection={deltaDirection} higherIsBetter={higherIsBetter} />
      <p className="mt-2 text-xs leading-5 text-ink-muted">{caption}</p>
    </article>
  )
}

/** Mirrors the dashboard's chart: no chart library, and per-bar values also reachable without hover. */
function TrendChart({ points, metric, showTable, onToggleTable }: {
  readonly points: readonly AdminProductTrendPoint[]
  readonly metric: AdminProductTrendMetric
  readonly showTable: boolean
  readonly onToggleTable: () => void
}) {
  const values = points.map((point) => (metric === 'sessions' ? point.sessions : point.creditsConsumed))
  const max = Math.max(...values, 1)
  const heading = metric === 'sessions' ? 'Sessions' : 'Credits consumed'

  return (
    <figure className="mt-4">
      <figcaption className="sr-only">{heading} by day across the selected range</figcaption>
      <div className="flex h-40 items-end gap-[2px]" role="img" aria-label={`Bar chart of daily ${heading.toLowerCase()}`}>
        {points.map((point, index) => (
          <div key={point.label} className="group relative flex h-full flex-1 items-end">
            <div
              className="w-full bg-accent transition-colors duration-normal ease-default group-hover:bg-accent-hover motion-reduce:transition-none"
              style={{ height: `${Math.max(2, (values[index] / max) * 100)}%` }}
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-full z-dropdown mb-1 hidden justify-center group-hover:flex">
              <span className="whitespace-nowrap rounded-soft border border-border bg-surface px-2 py-1 text-[11px] font-medium text-ink shadow-popover">
                {point.label}: {countFormatter.format(values[index])}
              </span>
            </span>
          </div>
        ))}
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
      <div className={cn('mt-3 overflow-x-auto', showTable ? undefined : 'sr-only')}>
        <table className="w-full text-start text-sm">
          <caption className="pb-2 text-start text-xs text-ink-muted">{heading} by day</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-1.5 pe-3 text-start text-xs font-semibold uppercase tracking-wide text-ink-muted">Day</th>
              <th scope="col" className="py-1.5 text-end text-xs font-semibold uppercase tracking-wide text-ink-muted">{heading}</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point, index) => (
              <tr key={point.label} className="border-b border-border last:border-b-0">
                <th scope="row" className="py-1.5 pe-3 text-start font-medium text-ink">{point.label}</th>
                <td className="py-1.5 text-end tabular-nums text-ink">{countFormatter.format(values[index])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}

export type AdminProductsViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly rangeLabel: string
  readonly summary: readonly AdminProductSummaryStat[]
  readonly products: readonly AdminProductRow[]
  readonly status: AdminProductStatusFilter
  readonly onStatusChange: (value: AdminProductStatusFilter) => void
  readonly onClearFilters: () => void
  readonly isLoading?: boolean
  readonly errorMessage?: string
  readonly onRetry?: () => void
}

export function AdminProductsView({
  user,
  navItems,
  notifications,
  searchResults,
  rangeLabel,
  summary,
  products,
  status,
  onStatusChange,
  onClearFilters,
  isLoading = false,
  errorMessage,
  onRetry,
}: AdminProductsViewProps) {
  // Nothing persists in this mock, so a confirmed availability change is held here to show the resulting state.
  const [availabilityOverrides, setAvailabilityOverrides] = useState<Readonly<Record<string, boolean>>>({})
  const [pendingDisable, setPendingDisable] = useState<AdminProductRow | null>(null)

  function isEnabled(row: AdminProductRow): boolean {
    return availabilityOverrides[row.id] ?? row.status !== 'disabled'
  }

  const filtered = products.filter((row) => {
    if (status === 'all') return true
    if (status === 'disabled') return !isEnabled(row)
    return isEnabled(row) && row.status === status
  })

  return (
    <AdminShell user={user} navItems={navItems} activeModule="products" notifications={notifications} searchResults={searchResults}>
      <div className="grid gap-6 p-4 sm:p-6">
        <div>
          <h1 className="font-gowun text-3xl font-bold leading-tight text-ink">Products</h1>
          <p className="mt-1 text-sm text-ink-muted">Adoption, usage, and health across every product for {rangeLabel}.</p>
        </div>

        {isLoading ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-32" />)}
            </div>
            <Skeleton className="h-96" />
          </>
        ) : errorMessage ? (
          <div role="alert" className="bg-danger-surface p-6 text-center shadow-panel">
            <AlertTriangle aria-hidden="true" className="mx-auto size-6 text-danger" />
            <p className="mt-3 text-sm font-semibold text-ink">Could not load products</p>
            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-ink-muted">{errorMessage}</p>
            {onRetry ? (
              <Button variant="secondary" leadingIcon={<RefreshCw aria-hidden="true" />} onClick={onRetry} className="mt-4">Try again</Button>
            ) : null}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {summary.map((stat) => (
                <StatTile
                  key={stat.id}
                  label={stat.label}
                  value={formatStat(stat.value, stat.format)}
                  caption={stat.caption}
                  deltaPercent={stat.deltaPercent}
                  deltaDirection={stat.deltaDirection}
                  higherIsBetter={stat.higherIsBetter}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <SelectField
                id="product-status-filter"
                label="Status"
                value={status}
                onValueChange={(value) => onStatusChange(value as AdminProductStatusFilter)}
                options={[
                  { value: 'all', label: 'Any status' },
                  { value: 'live', label: 'Live' },
                  { value: 'beta', label: 'Beta' },
                  { value: 'degraded', label: 'Degraded' },
                  { value: 'disabled', label: 'Disabled' },
                ]}
                className="w-48"
              />
              <p className="ms-auto text-sm text-ink-muted">{filtered.length} of {products.length} shown</p>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                title="No products match this status"
                description="Clear the filter to see every product on the platform."
                action={<Button onClick={onClearFilters}>Clear filters</Button>}
              />
            ) : (
              <ul className="grid gap-3">
                {filtered.map((row) => {
                  const enabled = isEnabled(row)
                  const effectiveStatus: AdminProductStatus = enabled ? row.status : 'disabled'
                  return (
                    <li key={row.id} className="bg-surface p-4 shadow-panel sm:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-gowun text-lg font-bold text-ink">
                              <a href={row.detailHref} className="rounded-soft underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                                {row.name}
                              </a>
                            </h2>
                            <StatusBadge status={effectiveStatus} />
                          </div>
                          <p className="mt-1 text-sm leading-6 text-ink-muted">{row.summary}</p>
                          <p className="mt-1 text-xs text-ink-muted">Included with: {row.tierNote}</p>
                          {effectiveStatus === 'degraded' && row.statusReason ? (
                            <p className="mt-2 inline-flex items-start gap-1.5 text-xs font-semibold text-warning">
                              <TriangleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                              {row.statusReason}
                            </p>
                          ) : null}
                          {!enabled ? (
                            <p className="mt-2 inline-flex items-start gap-1.5 text-xs font-semibold text-ink-muted">
                              <CircleSlash aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                              Hidden from {row.blastRadiusLabel}.
                            </p>
                          ) : null}
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold', healthTones[row.health.state])}>
                            <Activity aria-hidden="true" className="size-3.5" />
                            {row.health.label}
                          </span>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(next) => {
                              if (next) setAvailabilityOverrides((prev) => ({ ...prev, [row.id]: true }))
                              else setPendingDisable(row)
                            }}
                            aria-label={`${enabled ? 'Disable' : 'Enable'} ${row.name}`}
                          />
                        </div>
                      </div>

                      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 sm:grid-cols-5">
                        <div><dt className="text-xs text-ink-muted">Active users</dt><dd className="text-sm font-semibold tabular-nums text-ink">{countFormatter.format(row.activeUsers)}</dd></div>
                        <div><dt className="text-xs text-ink-muted">Sessions</dt><dd className="text-sm font-semibold tabular-nums text-ink">{countFormatter.format(row.sessionsInRange)}</dd></div>
                        <div><dt className="text-xs text-ink-muted">Credits</dt><dd className="text-sm font-semibold tabular-nums text-ink">{countFormatter.format(row.creditsConsumed)}</dd></div>
                        <div><dt className="text-xs text-ink-muted">Revenue</dt><dd className="text-sm font-semibold tabular-nums text-ink">{formatUsdWhole(row.revenueCents)}</dd></div>
                        <div><dt className="text-xs text-ink-muted">Adoption</dt><dd className="text-sm font-semibold tabular-nums text-ink">{row.adoptionPercent}%</dd></div>
                      </dl>
                    </li>
                  )
                })}
              </ul>
            )}
          </>
        )}
      </div>

      <Dialog open={pendingDisable !== null} onOpenChange={(open) => { if (!open) setPendingDisable(null) }}>
        <DialogPopup aria-label="Confirm disabling this product">
          <DialogTitle>Disable {pendingDisable?.name}?</DialogTitle>
          <DialogDescription>
            This immediately hides {pendingDisable?.name} for {pendingDisable?.blastRadiusLabel}. Sessions already running are not interrupted, but no one can start a new one until it is re-enabled.
          </DialogDescription>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <DialogClose className="static inline-flex min-h-9 items-center rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              Keep it live
            </DialogClose>
            <Button
              variant="danger"
              onClick={() => {
                if (pendingDisable) setAvailabilityOverrides((prev) => ({ ...prev, [pendingDisable.id]: false }))
                setPendingDisable(null)
              }}
            >
              Disable for everyone
            </Button>
          </div>
        </DialogPopup>
      </Dialog>
    </AdminShell>
  )
}

export type AdminProductDetailViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly product: AdminProductDetail | null
  readonly productsHref: string
  readonly outcome: AdminProductSessionOutcome | 'all'
  readonly onOutcomeChange: (value: AdminProductSessionOutcome | 'all') => void
  readonly q: string
  readonly onQChange: (value: string) => void
  readonly page: number
  readonly onPageChange: (page: number) => void
  readonly onClearFilters: () => void
  readonly isLoading?: boolean
  readonly errorMessage?: string
  readonly onRetry?: () => void
}

export function AdminProductDetailView({
  user,
  navItems,
  notifications,
  searchResults,
  product,
  productsHref,
  outcome,
  onOutcomeChange,
  q,
  onQChange,
  page,
  onPageChange,
  onClearFilters,
  isLoading = false,
  errorMessage,
  onRetry,
}: AdminProductDetailViewProps) {
  const [trendMetric, setTrendMetric] = useState<AdminProductTrendMetric>('sessions')
  const [showTrendTable, setShowTrendTable] = useState(false)
  const [applicantManagerOverrides, setApplicantManagerOverrides] = useState<Readonly<Record<string, string>>>({})
  const [applicantStatusOverrides, setApplicantStatusOverrides] = useState<Readonly<Record<string, AdminDoneForYouPipelineStatus>>>({})

  const filteredSessions = useMemo(() => {
    if (!product) return []
    const needle = q.trim().toLowerCase()
    return product.sessions.filter((row) => {
      if (outcome !== 'all' && row.outcome !== outcome) return false
      if (!needle) return true
      return `${row.id} ${row.userName} ${row.userEmail} ${row.targetRole} ${row.targetCompany}`.toLowerCase().includes(needle)
    })
  }, [product, outcome, q])

  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const visibleSessions = filteredSessions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const columns: readonly DataTableColumn<AdminProductSessionRow>[] = [
    { key: 'id', label: 'Session', sortable: true, sortValue: (row) => row.id, render: (row) => <span className="font-medium text-ink">{row.id}</span> },
    {
      key: 'user',
      label: 'User',
      sortable: true,
      sortValue: (row) => row.userName,
      render: (row) => (
        <span className="block min-w-0">
          <span className="block truncate font-medium text-ink">{row.userName}</span>
          <span className="block truncate text-xs text-ink-muted">{row.userEmail} · {tierLabels[row.plan]}</span>
        </span>
      ),
    },
    {
      key: 'target',
      label: 'Target',
      render: (row) => (
        <span className="block min-w-0">
          <span className="block truncate text-ink">{row.targetRole}</span>
          <span className="block truncate text-xs text-ink-muted">{row.targetCompany}</span>
        </span>
      ),
    },
    { key: 'started', label: 'Started', sortable: true, sortValue: (row) => row.startedLabel, render: (row) => <span className="whitespace-nowrap">{row.startedLabel}</span> },
    { key: 'duration', label: 'Duration', className: 'text-end', headerClassName: 'text-end', sortable: true, sortValue: (row) => row.durationMinutes, render: (row) => <span className="tabular-nums">{row.durationLabel}</span> },
    { key: 'credits', label: 'Credits', className: 'text-end', headerClassName: 'text-end', sortable: true, sortValue: (row) => row.creditsUsed, render: (row) => <span className="tabular-nums">{row.creditsUsed}</span> },
    {
      key: 'outcome',
      label: 'Outcome',
      sortable: true,
      sortValue: (row) => outcomeMeta[row.outcome].label,
      render: (row) => (
        <span className="grid gap-1">
          <Badge variant={outcomeMeta[row.outcome].variant} size="sm">{outcomeMeta[row.outcome].label}</Badge>
          {row.failureReason ? <span className="text-xs text-ink-muted">{row.failureReason}</span> : null}
        </span>
      ),
    },
  ]

  return (
    <AdminShell user={user} navItems={navItems} activeModule="products" notifications={notifications} searchResults={searchResults}>
      <div className="grid gap-6 p-4 sm:p-6">
        <a href={productsHref} className="inline-flex min-h-9 w-fit items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <ArrowLeft aria-hidden="true" className="size-4" />
          All products
        </a>

        {isLoading ? (
          <>
            <Skeleton className="h-20" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-32" />)}
            </div>
            <Skeleton className="h-80" />
          </>
        ) : errorMessage ? (
          <div role="alert" className="bg-danger-surface p-6 text-center shadow-panel">
            <AlertTriangle aria-hidden="true" className="mx-auto size-6 text-danger" />
            <p className="mt-3 text-sm font-semibold text-ink">Could not load this product</p>
            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-ink-muted">{errorMessage}</p>
            {onRetry ? <Button variant="secondary" leadingIcon={<RefreshCw aria-hidden="true" />} onClick={onRetry} className="mt-4">Try again</Button> : null}
          </div>
        ) : !product ? (
          <EmptyState
            title="Product not found"
            description="This product id does not match anything on the platform."
            action={
              <a href={productsHref} className="inline-flex min-h-9 items-center justify-center rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                Back to all products
              </a>
            }
          />
        ) : (
          <>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-gowun text-3xl font-bold leading-tight text-ink">{product.name}</h1>
                <StatusBadge status={product.status} />
              </div>
              <p className="mt-1 text-sm text-ink-muted">{product.summary}</p>
              <p className="mt-1 text-xs text-ink-muted">Included with: {product.tierNote} · {product.rangeLabel}</p>
              {product.statusReason ? (
                <p className="mt-2 inline-flex items-start gap-1.5 text-sm font-semibold text-warning">
                  <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  {product.statusReason}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {product.stats.map((stat) => (
                <StatTile
                  key={stat.id}
                  label={stat.label}
                  value={formatStat(stat.value, stat.format)}
                  caption={stat.caption}
                  deltaPercent={stat.deltaPercent}
                  deltaDirection={stat.deltaDirection}
                  higherIsBetter={stat.higherIsBetter}
                />
              ))}
            </div>

            <section className="bg-surface p-4 shadow-panel sm:p-5" aria-label="Usage over time">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-gowun text-lg font-bold text-ink">{trendMetric === 'sessions' ? 'Sessions' : 'Credits consumed'} over time</h2>
                <div className="flex gap-1 rounded-md border border-border p-1" role="group" aria-label="Trend metric">
                  {(['sessions', 'credits'] as const).map((metric) => (
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
                      {metric === 'sessions' ? 'Sessions' : 'Credits'}
                    </button>
                  ))}
                </div>
              </div>
              <TrendChart
                points={product.trend}
                metric={trendMetric}
                showTable={showTrendTable}
                onToggleTable={() => setShowTrendTable((prev) => !prev)}
              />
            </section>

            {product.errorGroups.length > 0 ? (
              <section className="bg-surface shadow-panel" aria-label="Recent errors">
                <h2 className="border-b border-border p-4 font-gowun text-lg font-bold text-ink sm:px-5">Recent errors</h2>
                <ul>
                  {product.errorGroups.map((group) => (
                    <li key={group.id} className="flex flex-wrap items-start gap-4 border-b border-border p-4 last:border-b-0 sm:px-5">
                      <p className={cn('w-16 shrink-0 pt-0.5 text-xs font-bold uppercase tracking-wide', errorSeverityTones[group.severity])}>
                        {errorSeverityLabels[group.severity]}
                      </p>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-ink">{group.reason}</p>
                        <p className="mt-0.5 text-xs text-ink-muted">Last seen {group.lastSeenLabel}</p>
                      </div>
                      <p className="shrink-0 text-end">
                        <span className="block text-sm font-bold tabular-nums text-ink">{countFormatter.format(group.count)}</span>
                        <span className="block text-xs text-ink-muted">{group.sharePercent}% of failures</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section aria-label="Session log" className="grid gap-3">
              <h2 className="font-gowun text-lg font-bold text-ink">Session log</h2>
              <div className="flex flex-wrap items-end gap-3">
                <SelectField
                  id="session-outcome-filter"
                  label="Outcome"
                  value={outcome}
                  onValueChange={(value) => onOutcomeChange(value as AdminProductSessionOutcome | 'all')}
                  options={[
                    { value: 'all', label: 'Any outcome' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'abandoned', label: 'Abandoned' },
                    { value: 'failed', label: 'Failed' },
                  ]}
                  className="w-44"
                />
                <p className="ms-auto text-sm text-ink-muted">{filteredSessions.length} of {product.sessions.length} shown</p>
              </div>

              {product.sessions.length === 0 ? (
                <EmptyState
                  title="No sessions yet"
                  description="Once someone runs this product, every session shows up here with its duration, credit cost, and outcome."
                />
              ) : filteredSessions.length === 0 ? (
                <EmptyState
                  title="No sessions match these filters"
                  description="Try a different outcome, or clear the filters to see the full log."
                  action={<Button onClick={onClearFilters}>Clear filters</Button>}
                />
              ) : (
                <DataTable
                  rows={visibleSessions}
                  columns={columns}
                  itemLabel={(row) => `${row.id}, ${row.userName}`}
                  searchValue={q}
                  onSearchChange={onQChange}
                  searchLabel="Search sessions by id, user, role, or company"
                  searchPlaceholder="Search id, user, role, or company"
                  minTableWidthClassName="min-w-[72rem]"
                  pagination={{ page: safePage, totalPages, totalItems: filteredSessions.length, pageSize: PAGE_SIZE }}
                  onPageChange={onPageChange}
                />
              )}
            </section>

            {product.id === 'done-for-you' && product.doneForYouApplicants ? (
              <section aria-label="Applicant pipeline" className="grid gap-3">
                <h2 className="font-gowun text-lg font-bold text-ink">Applicant pipeline</h2>
                <div className="flex flex-wrap items-end gap-3">
                  <p className="ms-auto text-sm text-ink-muted">{product.doneForYouApplicants.length} applicants</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-start text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th scope="col" className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">Applicant</th>
                        <th scope="col" className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">Target</th>
                        <th scope="col" className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">Package</th>
                        <th scope="col" className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">Jobs submitted</th>
                        <th scope="col" className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">Status</th>
                        <th scope="col" className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">Success manager</th>
                        <th scope="col" className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">Started</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.doneForYouApplicants.map((applicant) => {
                        const effectiveManager = applicantManagerOverrides[applicant.id] ?? applicant.assignedSuccessManager
                        const effectiveStatus = applicantStatusOverrides[applicant.id] ?? applicant.pipelineStatus
                        const statusMeta = pipelineStatusMeta[effectiveStatus]
                        return (
                          <tr key={applicant.id} className="border-b border-border last:border-b-0">
                            <td className="px-4 py-3">
                              <span className="flex items-center gap-2">
                                <Avatar name={applicant.userName} size="xs" />
                                <span className="min-w-0">
                                  <span className="block truncate font-medium text-ink">{applicant.userName}</span>
                                  <span className="block truncate text-xs text-ink-muted">{applicant.userEmail}</span>
                                </span>
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="block min-w-0">
                                <span className="block truncate text-ink">{applicant.targetRole}</span>
                                <span className="block truncate text-xs text-ink-muted">{applicant.targetCompany}</span>
                              </span>
                            </td>
                            <td className="px-4 py-3 text-ink-muted">{PACKAGE_LABELS[applicant.packageId] ?? applicant.packageId}</td>
                            <td className="px-4 py-3 tabular-nums text-ink">{applicant.jobsSubmittedCount}</td>
                            <td className="px-4 py-3">
                              <Badge variant={statusMeta.variant} size="sm">{statusMeta.label}</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <span className="flex items-center gap-1.5">
                                <Avatar name={effectiveManager} size="xs" />
                                <span className="truncate">{effectiveManager}</span>
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-ink-muted">{applicant.startedLabel}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor="dfy-applicant-manager" className="text-xs font-semibold text-ink-muted">Reassign manager for:</label>
                    <select
                      id="dfy-applicant-manager"
                      className="rounded-lg border border-input bg-canvas px-2 py-1.5 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      defaultValue=""
                      onChange={(e) => {
                        const applicantId = e.target.value
                        if (!applicantId) return
                        const current = applicantManagerOverrides[applicantId] ?? product.doneForYouApplicants!.find((a) => a.id === applicantId)!.assignedSuccessManager
                        const idx = SUCCESS_MANAGERS.indexOf(current)
                        const next = SUCCESS_MANAGERS[(idx + 1) % SUCCESS_MANAGERS.length]
                        setApplicantManagerOverrides((prev) => ({ ...prev, [applicantId]: next }))
                        e.target.value = ''
                      }}
                    >
                      <option value="">Select applicant…</option>
                      {product.doneForYouApplicants.map((a) => (
                        <option key={a.id} value={a.id}>{a.userName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="dfy-applicant-status" className="text-xs font-semibold text-ink-muted">Set status for:</label>
                    <select
                      id="dfy-applicant-status"
                      className="rounded-lg border border-input bg-canvas px-2 py-1.5 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      defaultValue=""
                      onChange={(e) => {
                        const applicantId = e.target.value
                        if (!applicantId) return
                        const current = applicantStatusOverrides[applicantId] ?? product.doneForYouApplicants!.find((a) => a.id === applicantId)!.pipelineStatus
                        const cycle: readonly AdminDoneForYouPipelineStatus[] = ['queued', 'in-progress', 'completed']
                        const idx = cycle.indexOf(current)
                        const next = cycle[(idx + 1) % cycle.length]
                        setApplicantStatusOverrides((prev) => ({ ...prev, [applicantId]: next }))
                        e.target.value = ''
                      }}
                    >
                      <option value="">Select applicant…</option>
                      {product.doneForYouApplicants.map((a) => (
                        <option key={a.id} value={a.id}>{a.userName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>
    </AdminShell>
  )
}
