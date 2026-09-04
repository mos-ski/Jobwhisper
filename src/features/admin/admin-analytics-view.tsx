import { useState } from 'react'
import { AlertTriangle, ArrowDown, RefreshCw } from 'lucide-react'

import type {
  AdminAnalyticsDemographics,
  AdminAnalyticsFunnels,
  AdminAnalyticsReferrals,
  AdminAnalyticsScores,
  AdminAnalyticsSurveyDistributions,
  AdminDemographicDistribution,
  AdminFunnelStage,
  AdminSurveyDistribution,
  AdminTimeToConvertBucket,
} from '@/contracts/admin-analytics.draft'
import type { AdminDateRange, AdminDateRangeId, AdminModuleId, AdminNavItem, AdminNotification, AdminSearchResult } from '@/contracts/admin.draft'
import type { UserIdentity } from '@/contracts/identity'
import { cn, formatUsdWhole, Skeleton } from '@/ui'

import { AdminShell } from './admin-shell'

const countFormatter = new Intl.NumberFormat('en-US')

/* ---------- Tab types ---------- */

type AdminAnalyticsTab = 'survey' | 'demographics' | 'scores' | 'funnels' | 'referrals'

const TABS: readonly { readonly id: AdminAnalyticsTab; readonly label: string }[] = [
  { id: 'survey', label: 'Survey' },
  { id: 'demographics', label: 'Demographics' },
  { id: 'scores', label: 'Interview scores' },
  { id: 'funnels', label: 'Funnels' },
  { id: 'referrals', label: 'Referrals' },
]

/* ---------- Shared categorical palette ---------- */

const CATEGORY_COLORS = [
  { dot: 'bg-accent', bar: 'bg-accent', var: 'var(--lf-accent)' },
  { dot: 'bg-accent-secondary', bar: 'bg-accent-secondary', var: 'var(--lf-accent-secondary)' },
  { dot: 'bg-positive', bar: 'bg-positive', var: 'var(--lf-positive)' },
  { dot: 'bg-accent-tertiary', bar: 'bg-accent-tertiary', var: 'var(--lf-accent-tertiary)' },
  { dot: 'bg-warning', bar: 'bg-warning', var: 'var(--lf-warning)' },
  { dot: 'bg-danger', bar: 'bg-danger', var: 'var(--lf-danger)' },
  { dot: 'bg-ink-muted', bar: 'bg-ink-muted', var: 'var(--lf-ink-muted)' },
] as const

function categoryColor(index: number) {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length]
}

/* ---------- Donut chart (part-of-whole, single-select) ---------- */

function DonutChart({ buckets, size = 152, strokeWidth = 26 }: {
  readonly buckets: readonly { readonly label: string; readonly count: number; readonly percent: number }[]
  readonly size?: number
  readonly strokeWidth?: number
}) {
  const total = buckets.reduce((sum, bucket) => sum + bucket.count, 0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2
  let accumulated = 0

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 shrink-0" aria-hidden="true">
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--lf-surface-subtle)" strokeWidth={strokeWidth} />
        {total > 0
          ? buckets.map((bucket, index) => {
              const dashLength = circumference * (bucket.count / total)
              const dashOffset = circumference * (1 - accumulated / total)
              accumulated += bucket.count
              return (
                <circle
                  key={bucket.label}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={categoryColor(index).var}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  strokeDashoffset={dashOffset}
                />
              )
            })
          : null}
      </svg>
      <ul className="grid min-w-0 flex-1 gap-2" aria-label="Response breakdown">
        {buckets.map((bucket, index) => (
          <li key={bucket.label} className="flex items-center gap-2 text-sm">
            <span aria-hidden="true" className={cn('size-2.5 shrink-0 rounded-full', categoryColor(index).dot)} />
            <span className="min-w-0 flex-1 truncate text-ink">{bucket.label}</span>
            <span className="shrink-0 font-medium text-ink">{countFormatter.format(bucket.count)}</span>
            <span className="w-9 shrink-0 text-end text-xs text-ink-muted">{bucket.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------- Color-coded horizontal bar chart (multi-select / many categories) ---------- */

function CategoryBar({ label, count, percent, maxPercent, colorIndex }: {
  readonly label: string
  readonly count: number
  readonly percent: number
  readonly maxPercent: number
  readonly colorIndex: number
}) {
  const widthPercent = maxPercent > 0 ? Math.max(2, (percent / maxPercent) * 100) : 2
  const color = categoryColor(colorIndex)
  return (
    <li className="py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <span aria-hidden="true" className={cn('size-2.5 shrink-0 rounded-full', color.dot)} />
          {label}
        </p>
        <p className="text-sm text-ink">
          {countFormatter.format(count)}
          <span className="ms-2 text-xs text-ink-muted">{percent}%</span>
        </p>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-pill bg-surface-subtle">
        <div className={cn('h-full rounded-pill', color.bar)} style={{ inlineSize: `${widthPercent}%` }} />
      </div>
    </li>
  )
}

/* ---------- Survey section ---------- */

function SurveySection({ distribution }: { readonly distribution: AdminSurveyDistribution }) {
  if (distribution.type === 'free-text') {
    return (
      <section className="bg-surface shadow-panel" aria-label={`Survey: ${distribution.prompt}`}>
        <div className="border-b border-border p-4 sm:px-5">
          <h3 className="font-gowun text-base font-bold text-ink">{distribution.prompt}</h3>
          <p className="mt-1 text-xs text-ink-muted">
            Free-text · {countFormatter.format(distribution.totalResponses)} responses
          </p>
        </div>
        <div className="p-4 sm:px-5">
          <p className="text-sm leading-6 text-ink-muted">
            Free-text responses are reviewed manually in the Configuration module. Distribution charts are not applicable.
          </p>
        </div>
      </section>
    )
  }

  const maxPercent = Math.max(...distribution.buckets.map((b) => b.percent))
  const isSingleSelect = distribution.type === 'single-select'

  return (
    <section className="bg-surface shadow-panel" aria-label={`Survey: ${distribution.prompt}`}>
      <div className="border-b border-border p-4 sm:px-5">
        <h3 className="font-gowun text-base font-bold text-ink">{distribution.prompt}</h3>
        <p className="mt-1 text-xs text-ink-muted">
          {distribution.type === 'multi-select' ? 'Multi-select' : 'Single-select'} ·{' '}
          {countFormatter.format(distribution.totalResponses)} responses
        </p>
      </div>
      {isSingleSelect ? (
        <div className="p-4 sm:px-5">
          <DonutChart buckets={distribution.buckets} />
        </div>
      ) : (
        <ul className="divide-y divide-border px-4 sm:px-5">
          {distribution.buckets.map((bucket, index) => (
            <CategoryBar
              key={bucket.optionId}
              label={bucket.label}
              count={bucket.count}
              percent={bucket.percent}
              maxPercent={maxPercent}
              colorIndex={index}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

/* ---------- Demographics section ---------- */

function DemographicSection({ distribution }: { readonly distribution: AdminDemographicDistribution }) {
  const maxPercent = Math.max(...distribution.buckets.map((b) => b.percent))

  return (
    <section className="bg-surface shadow-panel" aria-label={distribution.dimension}>
      <div className="border-b border-border p-4 sm:px-5">
        <h3 className="font-gowun text-base font-bold text-ink">{distribution.dimension}</h3>
        <p className="mt-1 text-xs text-ink-muted">
          {countFormatter.format(distribution.total)} users with data
        </p>
      </div>
      <ul className="divide-y divide-border px-4 sm:px-5">
        {distribution.buckets.map((bucket, index) => (
          <CategoryBar
            key={bucket.label}
            label={bucket.label}
            count={bucket.count}
            percent={bucket.percent}
            maxPercent={maxPercent}
            colorIndex={index}
          />
        ))}
      </ul>
    </section>
  )
}

/* ---------- Scores section ---------- */

function ScoreDistributionSection({ scores }: { readonly scores: AdminAnalyticsScores }) {
  const { scoreDistribution, scoreTrend } = scores
  const maxCount = Math.max(...scoreDistribution.buckets.map((b) => b.count))

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="bg-surface p-4 shadow-panel sm:p-5" aria-label="Score distribution">
        <h3 className="font-gowun text-base font-bold text-ink">Score distribution</h3>
        <p className="mt-1 text-xs text-ink-muted">
          {countFormatter.format(scoreDistribution.totalSessions)} sessions · Average{' '}
          <span className="font-gowun font-bold text-ink">{scoreDistribution.averageScore}</span>
        </p>
        <ul className="mt-3 flex h-40 items-end gap-1" role="img" aria-label="Histogram of interview scores">
          {scoreDistribution.buckets.map((bucket) => {
            const heightPercent = maxCount > 0 ? Math.max(2, (bucket.count / maxCount) * 100) : 2
            return (
              <div key={bucket.range} className="group relative flex h-full flex-1 items-end">
                <div
                  className="w-full bg-accent transition-colors duration-normal ease-default group-hover:bg-accent-hover motion-reduce:transition-none"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-full z-dropdown mb-1 hidden justify-center group-hover:flex">
                  <span className="whitespace-nowrap rounded-soft border border-border bg-surface px-2 py-1 text-[11px] font-medium text-ink shadow-popover">
                    {bucket.range}: {countFormatter.format(bucket.count)} sessions
                  </span>
                </span>
              </div>
            )
          })}
        </ul>
        <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-ink-muted">
          {scoreDistribution.buckets.map((bucket) => (
            <span key={bucket.range} className="flex-1 text-center">{bucket.range}</span>
          ))}
        </div>
      </section>

      <section className="bg-surface p-4 shadow-panel sm:p-5" aria-label="Score trend over time">
        <h3 className="font-gowun text-base font-bold text-ink">Score trend</h3>
        <p className="mt-1 text-xs text-ink-muted">
          Average score by day across the selected range
        </p>
        <div className="mt-3">
          <LineAreaChart
            points={scoreTrend.points.map((point) => ({
              label: point.label,
              value: point.averageScore,
              detail: `${point.averageScore} avg (${point.sessionCount} sessions)`,
            }))}
            yMax={100}
            valueLabel="daily average interview score"
          />
        </div>
      </section>
    </div>
  )
}

/* ---------- Line + area chart (time series) ---------- */

function LineAreaChart({ points, yMax, valueLabel }: {
  readonly points: readonly { readonly label: string; readonly value: number; readonly detail: string }[]
  readonly yMax: number
  readonly valueLabel: string
}) {
  if (points.length === 0) return null
  const width = 480
  const height = 160
  const padding = { top: 12, right: 8, bottom: 22, left: 8 }
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom

  const coords = points.map((point, index) => ({
    x: padding.left + (points.length === 1 ? 0 : (index / (points.length - 1)) * innerW),
    y: padding.top + innerH - (yMax > 0 ? (point.value / yMax) * innerH : 0),
    point,
  }))

  const pathD = coords.map((c, index) => `${index === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ')
  const baselineY = padding.top + innerH
  const areaD = `${pathD} L ${coords[coords.length - 1]!.x.toFixed(1)} ${baselineY} L ${coords[0]!.x.toFixed(1)} ${baselineY} Z`

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="w-full"
      role="img"
      aria-label={`Line chart of ${valueLabel} across the selected range`}
    >
      <defs>
        <linearGradient id="analytics-area-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--lf-accent)" stopOpacity={0.22} />
          <stop offset="100%" stopColor="var(--lf-accent)" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#analytics-area-fill)" />
      <path d={pathD} fill="none" stroke="var(--lf-accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {coords.map(({ x, y, point }) => (
        <circle key={point.label} cx={x} cy={y} r={2.5} fill="var(--lf-accent)" vectorEffect="non-scaling-stroke">
          <title>{point.label}: {point.detail}</title>
        </circle>
      ))}
      <text x={coords[0]!.x} y={height - 4} textAnchor="start" className="fill-ink-muted" fontSize={10}>
        {points[0]!.label}
      </text>
      <text x={coords[coords.length - 1]!.x} y={height - 4} textAnchor="end" className="fill-ink-muted" fontSize={10}>
        {points[points.length - 1]!.label}
      </text>
    </svg>
  )
}

/* ---------- Funnels section ---------- */

function FunnelChart({ stages }: { readonly stages: readonly AdminFunnelStage[] }) {
  const maxCount = stages[0]?.count ?? 1
  return (
    <ol className="grid gap-1.5">
      {stages.map((stage, index) => {
        const widthPercent = maxCount > 0 ? Math.max(14, (stage.count / maxCount) * 100) : 14
        return (
          <li key={stage.id}>
            {index > 0 && stage.dropOffPercent > 0 ? (
              <p className="flex items-center justify-center gap-1 py-1 text-xs font-semibold text-danger">
                <ArrowDown aria-hidden="true" className="size-3" />
                {stage.dropOffPercent}% drop-off
              </p>
            ) : null}
            <div className="flex items-center gap-3">
              <span className="w-40 shrink-0 truncate text-end text-sm text-ink-muted">{stage.label}</span>
              <div className="flex flex-1 justify-center">
                <div
                  className="flex h-11 items-center justify-center rounded-soft bg-accent px-3 transition-all duration-normal ease-default"
                  style={{ inlineSize: `${widthPercent}%` }}
                >
                  <span className="truncate text-sm font-semibold text-on-accent">{countFormatter.format(stage.count)}</span>
                </div>
              </div>
              <span className="w-16 shrink-0 text-sm text-ink-muted">{stage.percentOfTop}%</span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function TimeToConvertSection({ buckets, medianDays, averageDays }: {
  readonly buckets: readonly AdminTimeToConvertBucket[]
  readonly medianDays: number
  readonly averageDays: number
}) {
  const maxCount = Math.max(...buckets.map((b) => b.count))

  return (
    <section className="bg-surface p-4 shadow-panel sm:p-5" aria-label="Time to convert">
      <h3 className="font-gowun text-base font-bold text-ink">Time to convert</h3>
      <p className="mt-1 text-xs text-ink-muted">
        Signup to subscribe · Median <span className="font-gowun font-bold text-ink">{medianDays}</span> days · Average{' '}
        <span className="font-gowun font-bold text-ink">{averageDays}</span> days
      </p>
      <ul className="mt-3 flex h-32 items-end gap-1" role="img" aria-label="Histogram of time to convert">
        {buckets.map((bucket) => {
          const heightPercent = maxCount > 0 ? Math.max(2, (bucket.count / maxCount) * 100) : 2
          return (
            <div key={bucket.range} className="group relative flex h-full flex-1 items-end">
              <div
                className="w-full bg-accent transition-colors duration-normal ease-default group-hover:bg-accent-hover motion-reduce:transition-none"
                style={{ height: `${heightPercent}%` }}
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-full z-dropdown mb-1 hidden justify-center group-hover:flex">
                <span className="whitespace-nowrap rounded-soft border border-border bg-surface px-2 py-1 text-[11px] font-medium text-ink shadow-popover">
                  {bucket.range}: {countFormatter.format(bucket.count)}
                </span>
              </span>
            </div>
          )
        })}
      </ul>
      <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-ink-muted">
        {buckets.map((bucket) => (
          <span key={bucket.range} className="flex-1 text-center">{bucket.range}</span>
        ))}
      </div>
    </section>
  )
}

/* ---------- Referrals section ---------- */

function ReferralStatCard({ label, value, caption }: {
  readonly label: string
  readonly value: string
  readonly caption: string
}) {
  return (
    <article className="bg-surface p-4 shadow-panel">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</h3>
      <p className="mt-2 font-gowun text-3xl font-bold leading-9 text-ink">{value}</p>
      <p className="mt-1.5 text-xs leading-5 text-ink-muted">{caption}</p>
    </article>
  )
}

/* ---------- Skeleton ---------- */

function AnalyticsSkeleton() {
  return (
    <div className="grid gap-6 p-4 sm:p-6">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-12" />
      <Skeleton className="h-96" />
    </div>
  )
}

/* ---------- View ---------- */

export type AdminAnalyticsViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly dateRanges: readonly AdminDateRange[]
  readonly surveyDistributions: AdminAnalyticsSurveyDistributions
  readonly demographics: AdminAnalyticsDemographics
  readonly scores: AdminAnalyticsScores
  readonly funnels: AdminAnalyticsFunnels
  readonly referrals: AdminAnalyticsReferrals
  readonly isLoading?: boolean
  readonly errorMessage?: string
  readonly onRetry?: () => void
}

export function AdminAnalyticsView({
  user,
  navItems,
  notifications,
  searchResults,
  dateRanges,
  surveyDistributions,
  demographics,
  scores,
  funnels,
  referrals,
  isLoading = false,
  errorMessage,
  onRetry,
}: AdminAnalyticsViewProps) {
  const [rangeId, setRangeId] = useState<AdminDateRangeId>(dateRanges[1]?.id ?? '30d')
  const [tab, setTab] = useState<AdminAnalyticsTab>('survey')
  const activeRange = dateRanges.find((range) => range.id === rangeId) ?? dateRanges[0]

  return (
    <AdminShell
      user={user}
      navItems={navItems}
      activeModule={'analytics' as AdminModuleId}
      notifications={notifications}
      searchResults={searchResults}
    >
      {isLoading ? (
        <AnalyticsSkeleton />
      ) : errorMessage ? (
        <div className="grid gap-6 p-4 sm:p-6">
          <div role="alert" className="bg-danger-surface p-6 text-center shadow-panel">
            <AlertTriangle aria-hidden="true" className="mx-auto size-6 text-danger" />
            <p className="mt-3 text-sm font-semibold text-ink">Could not load analytics data</p>
            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-ink-muted">{errorMessage}</p>
            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <RefreshCw aria-hidden="true" className="size-4" />
                Try again
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 p-4 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-gowun text-3xl font-bold leading-tight text-ink">Analytics</h1>
              <p className="mt-1 text-sm text-ink-muted">
                User behaviour, demographics, and funnel performance for {activeRange?.rangeLabel}.
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

          <div className="border-b border-border">
            <div role="tablist" aria-label="Analytics sections" className="flex flex-wrap gap-1">
              {TABS.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  role="tab"
                  aria-selected={entry.id === tab}
                  onClick={() => setTab(entry.id)}
                  className={cn(
                    'inline-flex min-h-11 items-center gap-2 border-b-2 px-3 text-sm font-semibold transition-colors duration-normal ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                    entry.id === tab ? 'border-accent text-accent-text' : 'border-transparent text-ink-muted hover:text-ink',
                  )}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          </div>

          {tab === 'survey' && (
            <div className="grid gap-4">
              {surveyDistributions.distributions.map((dist) => (
                <SurveySection key={dist.questionId} distribution={dist} />
              ))}
            </div>
          )}

          {tab === 'demographics' && (
            <div className="grid gap-4">
              {demographics.distributions.map((dist) => (
                <DemographicSection key={dist.dimension} distribution={dist} />
              ))}
            </div>
          )}

          {tab === 'scores' && <ScoreDistributionSection scores={scores} />}

          {tab === 'funnels' && (
            <div className="grid gap-4">
              <section className="bg-surface shadow-panel" aria-label="Acquisition funnel">
                <div className="border-b border-border p-4 sm:px-5">
                  <h3 className="font-gowun text-base font-bold text-ink">Acquisition & conversion funnel</h3>
                  <p className="mt-1 text-xs text-ink-muted">
                    {countFormatter.format(funnels.funnel.totalTopOfFunnel)} top-of-funnel visitors in range
                  </p>
                </div>
                <div className="p-4 sm:px-5">
                  <FunnelChart stages={funnels.funnel.stages} />
                </div>
              </section>
              <TimeToConvertSection
                buckets={funnels.timeToConvert.buckets}
                medianDays={funnels.timeToConvert.medianDays}
                averageDays={funnels.timeToConvert.averageDays}
              />
            </div>
          )}

          {tab === 'referrals' && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <ReferralStatCard
                label="Invites sent"
                value={countFormatter.format(referrals.stats.invitesSent)}
                caption="Total referral invitations in range"
              />
              <ReferralStatCard
                label="Signups attributed"
                value={countFormatter.format(referrals.stats.signupsAttributed)}
                caption="Accounts created via a referral link"
              />
              <ReferralStatCard
                label="Conversion to paid"
                value={`${referrals.stats.conversionToPaidRate}%`}
                caption="Attributed signups that subscribed"
              />
              <ReferralStatCard
                label="Credits paid out"
                value={countFormatter.format(referrals.stats.creditsPaidOut)}
                caption="Bonus credits issued to referrers"
              />
              <ReferralStatCard
                label="Referral revenue"
                value={formatUsdWhole(referrals.stats.totalReferralRevenue)}
                caption="Revenue from attributed signups"
              />
            </div>
          )}
        </div>
      )}
    </AdminShell>
  )
}
