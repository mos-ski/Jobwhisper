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

/* ---------- Shared bar chart ---------- */

function DistributionBar({ label, count, percent, maxPercent }: {
  readonly label: string
  readonly count: number
  readonly percent: number
  readonly maxPercent: number
}) {
  const widthPercent = maxPercent > 0 ? Math.max(2, (percent / maxPercent) * 100) : 2
  return (
    <li className="py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="text-sm text-ink">
          {countFormatter.format(count)}
          <span className="ms-2 text-xs text-ink-muted">{percent}%</span>
        </p>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-pill bg-surface-subtle">
          <div className="h-full rounded-pill bg-accent" style={{ inlineSize: `${widthPercent}%` }} />
        </div>
        <span className="w-10 shrink-0 text-end text-xs font-medium text-ink-muted">{percent}%</span>
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

  return (
    <section className="bg-surface shadow-panel" aria-label={`Survey: ${distribution.prompt}`}>
      <div className="border-b border-border p-4 sm:px-5">
        <h3 className="font-gowun text-base font-bold text-ink">{distribution.prompt}</h3>
        <p className="mt-1 text-xs text-ink-muted">
          {distribution.type === 'multi-select' ? 'Multi-select' : 'Single-select'} ·{' '}
          {countFormatter.format(distribution.totalResponses)} responses
        </p>
      </div>
      <ul className="divide-y divide-border px-4 sm:px-5">
        {distribution.buckets.map((bucket) => (
          <DistributionBar
            key={bucket.optionId}
            label={bucket.label}
            count={bucket.count}
            percent={bucket.percent}
            maxPercent={maxPercent}
          />
        ))}
      </ul>
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
        {distribution.buckets.map((bucket) => (
          <DistributionBar
            key={bucket.label}
            label={bucket.label}
            count={bucket.count}
            percent={bucket.percent}
            maxPercent={maxPercent}
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
        <div className="mt-3 flex h-40 items-end gap-[2px]" role="img" aria-label="Bar chart of daily average interview score">
          {scoreTrend.points.map((point) => {
            const heightPercent = Math.max(2, (point.averageScore / 100) * 100)
            return (
              <div key={point.label} className="group relative flex h-full flex-1 items-end">
                <div
                  className="w-full bg-accent transition-colors duration-normal ease-default group-hover:bg-accent-hover motion-reduce:transition-none"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-full z-dropdown mb-1 hidden justify-center group-hover:flex">
                  <span className="whitespace-nowrap rounded-soft border border-border bg-surface px-2 py-1 text-[11px] font-medium text-ink shadow-popover">
                    {point.label}: {point.averageScore} avg ({point.sessionCount} sessions)
                  </span>
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-ink-muted">
          <span>{scoreTrend.points[0]?.label}</span>
          <span>{scoreTrend.points[scoreTrend.points.length - 1]?.label}</span>
        </div>
      </section>
    </div>
  )
}

/* ---------- Funnels section ---------- */

function FunnelStageBar({ stage }: { readonly stage: AdminFunnelStage }) {
  const widthPercent = Math.max(2, stage.percentOfTop)
  return (
    <li className="py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-sm font-semibold text-ink">{stage.label}</p>
        <p className="text-sm text-ink">
          {countFormatter.format(stage.count)}
          <span className="ms-2 text-xs text-ink-muted">{stage.percentOfTop}% of top</span>
        </p>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-pill bg-surface-subtle">
          <div className="h-full rounded-pill bg-accent" style={{ inlineSize: `${widthPercent}%` }} />
        </div>
        {stage.dropOffPercent > 0 ? (
          <span className="w-14 shrink-0 text-end text-xs font-semibold text-danger">−{stage.dropOffPercent}%</span>
        ) : (
          <span className="w-14 shrink-0 text-end text-xs text-ink-muted" />
        )}
      </div>
    </li>
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
                <ul className="divide-y divide-border px-4 sm:px-5">
                  {funnels.funnel.stages.map((stage) => (
                    <FunnelStageBar key={stage.id} stage={stage} />
                  ))}
                </ul>
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
