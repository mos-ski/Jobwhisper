import { useState } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

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

/* ---------- Donut chart ---------- */

const DONUT_COLORS = ['var(--lf-color-accent)', 'var(--lf-color-positive)', 'var(--lf-color-warning)', 'var(--lf-color-danger)', 'var(--lf-color-ink-muted)', '#8b5cf6', '#06b6d4', '#f97316']

function DonutChart({ buckets, size = 160, strokeWidth = 28 }: {
  readonly buckets: readonly { readonly label: string; readonly count: number; readonly percent: number }[]
  readonly size?: number
  readonly strokeWidth?: number
}) {
  const total = buckets.reduce((sum, b) => sum + b.count, 0)
  if (total === 0) return null
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2
  let accumulated = 0

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {buckets.map((bucket, i) => {
          const pct = bucket.count / total
          const dashLength = circumference * pct
          const dashOffset = circumference * (1 - accumulated / total)
          accumulated += bucket.count
          return (
            <circle
              key={bucket.label}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              className="transition-all duration-normal ease-default"
            />
          )
        })}
      </svg>
      <ul className="grid gap-1.5">
        {buckets.map((bucket, i) => (
          <li key={bucket.label} className="flex items-center gap-2 text-sm">
            <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
            <span className="text-ink-muted">{bucket.label}</span>
            <span className="ms-auto font-medium text-ink">{countFormatter.format(bucket.count)}</span>
            <span className="w-10 text-end text-xs text-ink-muted">{bucket.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------- Horizontal bar chart ---------- */

function HorizontalBarChart({ buckets, maxPercent }: {
  readonly buckets: readonly { readonly label: string; readonly count: number; readonly percent: number }[]
  readonly maxPercent: number
}) {
  return (
    <div className="grid gap-2.5">
      {buckets.map((bucket, i) => {
        const widthPercent = maxPercent > 0 ? Math.max(2, (bucket.percent / maxPercent) * 100) : 2
        return (
          <div key={bucket.label} className="grid gap-1">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-ink">{bucket.label}</span>
              <span className="text-ink-muted">{countFormatter.format(bucket.count)} <span className="text-xs">({bucket.percent}%)</span></span>
            </div>
            <div className="h-3 overflow-hidden rounded-soft bg-surface-subtle">
              <div
                className="h-full rounded-soft transition-all duration-normal ease-default"
                style={{ inlineSize: `${widthPercent}%`, backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ---------- Vertical bar chart (histogram) ---------- */

function VerticalBarChart({ data, height = 180, yLabel }: {
  readonly data: readonly { readonly label: string; readonly value: number }[]
  readonly height?: number
  readonly yLabel?: string
}) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="relative">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${data.length * 40} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={yLabel ?? 'Bar chart'}
        className="w-full"
      >
        {data.map((d, i) => {
          const barHeight = maxValue > 0 ? Math.max(4, (d.value / maxValue) * (height - 30)) : 4
          const x = i * 40 + 4
          const y = height - 24 - barHeight
          return (
            <g key={d.label} className="group">
              <rect
                x={x}
                y={y}
                width={32}
                height={barHeight}
                rx={4}
                fill="var(--lf-color-accent)"
                className="transition-all duration-normal ease-default"
              />
              <text
                x={x + 16}
                y={height - 6}
                textAnchor="middle"
                className="fill-ink-muted"
                fontSize={10}
              >
                {d.label}
              </text>
              <title>{d.label}: {countFormatter.format(d.value)}</title>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* ---------- Line chart ---------- */

function LineChart({ points, height = 160, yMax = 100 }: {
  readonly points: readonly { readonly label: string; readonly value: number }[]
  readonly height?: number
  readonly yMax?: number
}) {
  if (points.length === 0) return null
  const padding = { top: 10, right: 10, bottom: 28, left: 10 }
  const chartW = 400
  const chartH = height
  const innerW = chartW - padding.left - padding.right
  const innerH = chartH - padding.top - padding.bottom

  const coords = points.map((p, i) => ({
    x: padding.left + (i / Math.max(1, points.length - 1)) * innerW,
    y: padding.top + innerH - (yMax > 0 ? (p.value / yMax) * innerH : 0),
    label: p.label,
    value: p.value,
  }))

  const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ')
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${padding.top + innerH} L ${coords[0].x} ${padding.top + innerH} Z`

  return (
    <svg width="100%" height={chartW} viewBox={`0 0 ${chartW} ${chartH}`} role="img" aria-label="Line chart">
      <defs>
        <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--lf-color-accent)" stopOpacity={0.3} />
          <stop offset="100%" stopColor="var(--lf-color-accent)" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#area-fill)" />
      <path d={pathD} fill="none" stroke="var(--lf-color-accent)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((c) => (
        <circle key={c.label} cx={c.x} cy={c.y} r={3} fill="var(--lf-color-accent)" className="opacity-0 transition-opacity group-hover:opacity-100">
          <title>{c.label}: {c.value}</title>
        </circle>
      ))}
      {coords.filter((_, i) => i === 0 || i === coords.length - 1 || i === Math.floor(coords.length / 2)).map((c) => (
        <text key={c.label} x={c.x} y={chartH - 6} textAnchor="middle" className="fill-ink-muted" fontSize={9}>
          {c.label}
        </text>
      ))}
    </svg>
  )
}

/* ---------- Funnel visualization ---------- */

function FunnelChart({ stages }: { readonly stages: readonly AdminFunnelStage[] }) {
  const maxCount = stages[0]?.count ?? 1
  return (
    <div className="grid gap-1">
      {stages.map((stage, i) => {
        const widthPct = maxCount > 0 ? Math.max(12, (stage.count / maxCount) * 100) : 12
        return (
          <div key={stage.id} className="flex items-center gap-4">
            <span className="w-28 shrink-0 text-right text-sm text-ink-muted">{stage.label}</span>
            <div className="flex-1 flex items-center">
              <div
                className="h-10 rounded-soft transition-all duration-normal ease-default flex items-center justify-end px-3"
                style={{
                  inlineSize: `${widthPct}%`,
                  backgroundColor: `color-mix(in srgb, var(--lf-color-accent) ${100 - i * 18}%, var(--lf-color-surface-subtle))`,
                }}
              >
                <span className="text-sm font-semibold text-ink">{countFormatter.format(stage.count)}</span>
              </div>
            </div>
            <span className="w-16 shrink-0 text-right text-sm text-ink-muted">{stage.percentOfTop}%</span>
            {stage.dropOffPercent > 0 ? (
              <span className="w-14 shrink-0 text-right text-xs font-semibold text-danger">−{stage.dropOffPercent}%</span>
            ) : (
              <span className="w-14 shrink-0" />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ---------- Stat card ---------- */

function StatCard({ label, value, caption, accent }: {
  readonly label: string
  readonly value: string
  readonly caption: string
  readonly accent?: boolean
}) {
  return (
    <article className={cn('p-4 shadow-panel', accent ? 'bg-accent-subtle' : 'bg-surface')}>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</h3>
      <p className="mt-2 font-gowun text-3xl font-bold leading-9 text-ink">{value}</p>
      <p className="mt-1.5 text-xs leading-5 text-ink-muted">{caption}</p>
    </article>
  )
}

/* ---------- Survey section ---------- */

function SurveySection({ distribution }: { readonly distribution: AdminSurveyDistribution }) {
  if (distribution.type === 'free-text') {
    return (
      <section className="bg-surface p-5 shadow-panel" aria-label={`Survey: ${distribution.prompt}`}>
        <h3 className="font-gowun text-base font-bold text-ink">{distribution.prompt}</h3>
        <p className="mt-1 text-xs text-ink-muted">
          Free-text · {countFormatter.format(distribution.totalResponses)} responses
        </p>
        <p className="mt-3 text-sm leading-6 text-ink-muted">
          Free-text responses are reviewed manually in the Configuration module. Distribution charts are not applicable.
        </p>
      </section>
    )
  }

  const maxPercent = Math.max(...distribution.buckets.map((b) => b.percent))

  return (
    <section className="bg-surface p-5 shadow-panel" aria-label={`Survey: ${distribution.prompt}`}>
      <h3 className="font-gowun text-base font-bold text-ink">{distribution.prompt}</h3>
      <p className="mt-1 text-xs text-ink-muted">
        {distribution.type === 'multi-select' ? 'Multi-select' : 'Single-select'} ·{' '}
        {countFormatter.format(distribution.totalResponses)} responses
      </p>
      <div className="mt-4">
        <DonutChart buckets={distribution.buckets} />
      </div>
      <div className="mt-4 border-t border-border pt-4">
        <HorizontalBarChart buckets={distribution.buckets} maxPercent={maxPercent} />
      </div>
    </section>
  )
}

/* ---------- Demographics section ---------- */

function DemographicSection({ distribution }: { readonly distribution: AdminDemographicDistribution }) {
  const maxPercent = Math.max(...distribution.buckets.map((b) => b.percent))

  return (
    <section className="bg-surface p-5 shadow-panel" aria-label={distribution.dimension}>
      <h3 className="font-gowun text-base font-bold text-ink">{distribution.dimension}</h3>
      <p className="mt-1 text-xs text-ink-muted">
        {countFormatter.format(distribution.total)} users with data
      </p>
      <div className="mt-4">
        <DonutChart buckets={distribution.buckets} />
      </div>
      <div className="mt-4 border-t border-border pt-4">
        <HorizontalBarChart buckets={distribution.buckets} maxPercent={maxPercent} />
      </div>
    </section>
  )
}

/* ---------- Scores section ---------- */

function ScoreDistributionSection({ scores }: { readonly scores: AdminAnalyticsScores }) {
  const { scoreDistribution, scoreTrend } = scores

  const histData = scoreDistribution.buckets.map((b) => ({ label: b.range, value: b.count }))
  const trendData = scoreTrend.points.map((p) => ({ label: p.label, value: p.averageScore }))

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="bg-surface p-5 shadow-panel" aria-label="Score distribution">
        <h3 className="font-gowun text-base font-bold text-ink">Score distribution</h3>
        <p className="mt-1 text-xs text-ink-muted">
          {countFormatter.format(scoreDistribution.totalSessions)} sessions · Average{' '}
          <span className="font-gowun font-bold text-ink">{scoreDistribution.averageScore}</span>
        </p>
        <div className="mt-4">
          <VerticalBarChart data={histData} yLabel="Sessions per score bucket" />
        </div>
      </section>

      <section className="bg-surface p-5 shadow-panel" aria-label="Score trend over time">
        <h3 className="font-gowun text-base font-bold text-ink">Score trend</h3>
        <p className="mt-1 text-xs text-ink-muted">
          Average score by day across the selected range
        </p>
        <div className="mt-4">
          <LineChart points={trendData} yMax={100} />
        </div>
      </section>
    </div>
  )
}

/* ---------- Funnels section ---------- */

function TimeToConvertSection({ buckets, medianDays, averageDays }: {
  readonly buckets: readonly AdminTimeToConvertBucket[]
  readonly medianDays: number
  readonly averageDays: number
}) {
  const histData = buckets.map((b) => ({ label: b.range, value: b.count }))

  return (
    <section className="bg-surface p-5 shadow-panel" aria-label="Time to convert">
      <h3 className="font-gowun text-base font-bold text-ink">Time to convert</h3>
      <p className="mt-1 text-xs text-ink-muted">
        Signup to subscribe · Median <span className="font-gowun font-bold text-ink">{medianDays}</span> days · Average{' '}
        <span className="font-gowun font-bold text-ink">{averageDays}</span> days
      </p>
      <div className="mt-4">
        <VerticalBarChart data={histData} height={140} yLabel="Users per time bucket" />
      </div>
    </section>
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
              <section className="bg-surface p-5 shadow-panel" aria-label="Acquisition funnel">
                <h3 className="font-gowun text-base font-bold text-ink">Acquisition & conversion funnel</h3>
                <p className="mt-1 text-xs text-ink-muted">
                  {countFormatter.format(funnels.funnel.totalTopOfFunnel)} top-of-funnel visitors in range
                </p>
                <div className="mt-4">
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
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard
                  label="Invites sent"
                  value={countFormatter.format(referrals.stats.invitesSent)}
                  caption="Total referral invitations in range"
                />
                <StatCard
                  label="Signups attributed"
                  value={countFormatter.format(referrals.stats.signupsAttributed)}
                  caption="Accounts created via a referral link"
                />
                <StatCard
                  label="Conversion to paid"
                  value={`${referrals.stats.conversionToPaidRate}%`}
                  caption="Attributed signups that subscribed"
                  accent
                />
                <StatCard
                  label="Credits paid out"
                  value={countFormatter.format(referrals.stats.creditsPaidOut)}
                  caption="Bonus credits issued to referrers"
                />
                <StatCard
                  label="Referral revenue"
                  value={formatUsdWhole(referrals.stats.totalReferralRevenue)}
                  caption="Revenue from attributed signups"
                />
              </div>
              <section className="bg-surface p-5 shadow-panel" aria-label="Referral funnel">
                <h3 className="font-gowun text-base font-bold text-ink">Referral conversion funnel</h3>
                <p className="mt-1 text-xs text-ink-muted">Invites → signups → paid subscribers</p>
                <div className="mt-4">
                  <DonutChart
                    buckets={[
                      { label: 'Converted to paid', count: referrals.stats.signupsAttributed, percent: referrals.stats.conversionToPaidRate },
                      { label: 'Signed up only', count: referrals.stats.invitesSent - referrals.stats.signupsAttributed, percent: 100 - referrals.stats.conversionToPaidRate },
                    ]}
                  />
                </div>
              </section>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  )
}
