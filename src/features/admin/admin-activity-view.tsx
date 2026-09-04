import { useMemo, useState } from 'react'
import { CircleDollarSign, LogIn, Search, Undo2, UserPlus, Wallet } from 'lucide-react'

import type { AdminActivityEvent, AdminActivityEventKind, AdminActivityFeed } from '@/contracts/admin-activity.draft'
import type { AdminNavItem, AdminNotification, AdminSearchResult } from '@/contracts/admin.draft'
import type { UserIdentity } from '@/contracts/identity'
import { cn, EmptyState, formatUsdWhole, Skeleton } from '@/ui'

import { AdminShell } from './admin-shell'

const countFormatter = new Intl.NumberFormat('en-US')

const KIND_FILTERS: readonly { readonly id: AdminActivityEventKind | 'all'; readonly label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'signup', label: 'Signups' },
  { id: 'login', label: 'Logins' },
  { id: 'payment', label: 'Income' },
  { id: 'refund', label: 'Refunds' },
  { id: 'payout', label: 'Payouts' },
]

const KIND_META: Record<AdminActivityEventKind, { readonly label: string; readonly icon: typeof UserPlus; readonly iconClassName: string }> = {
  signup: { label: 'New signup', icon: UserPlus, iconClassName: 'bg-positive-surface text-positive' },
  login: { label: 'Login', icon: LogIn, iconClassName: 'bg-accent-subtle text-accent-text' },
  payment: { label: 'Payment', icon: CircleDollarSign, iconClassName: 'bg-positive-surface text-positive' },
  refund: { label: 'Refund', icon: Undo2, iconClassName: 'bg-warning-surface text-warning' },
  payout: { label: 'Payout', icon: Wallet, iconClassName: 'bg-surface-subtle text-ink-muted' },
}

function ActivityRow({ event }: { readonly event: AdminActivityEvent }) {
  const meta = KIND_META[event.kind]
  const Icon = meta.icon
  return (
    <li className="border-b border-border last:border-b-0">
      <a
        href={event.href}
        className="flex items-start gap-3 p-4 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:px-5"
      >
        <span aria-hidden="true" className={cn('mt-0.5 grid size-8 shrink-0 place-items-center rounded-pill', meta.iconClassName)}>
          <Icon className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <span className="truncate text-sm font-semibold text-ink">
              {meta.label} · {event.actorName}
            </span>
            {event.amountCents !== undefined ? (
              <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">{formatUsdWhole(event.amountCents)}</span>
            ) : null}
          </span>
          <span className="mt-0.5 block truncate text-xs text-ink-muted">{event.detail}</span>
          <span className="mt-1 block text-[11px] text-ink-muted">{event.actorEmail} · {event.timeAgo}</span>
        </span>
      </a>
    </li>
  )
}

function ActivitySkeleton() {
  return (
    <div className="grid gap-6 p-4 sm:p-6">
      <Skeleton className="h-9 w-64" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  )
}

export type AdminActivityViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly feed: AdminActivityFeed
  readonly isLoading?: boolean
}

export function AdminActivityView({ user, navItems, notifications, searchResults, feed, isLoading = false }: AdminActivityViewProps) {
  const [kind, setKind] = useState<AdminActivityEventKind | 'all'>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return feed.events.filter((event) => {
      if (kind !== 'all' && event.kind !== kind) return false
      if (!needle) return true
      return `${event.actorName} ${event.actorEmail} ${event.detail}`.toLowerCase().includes(needle)
    })
  }, [feed.events, kind, query])

  return (
    <AdminShell
      user={user}
      navItems={navItems}
      activeModule="activity"
      notifications={notifications}
      searchResults={searchResults}
    >
      {isLoading ? (
        <ActivitySkeleton />
      ) : (
        <div className="grid gap-6 p-4 sm:p-6">
          <div>
            <h1 className="flex items-center gap-3 font-gowun text-3xl font-bold leading-tight text-ink">
              Activity
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-positive">
                <span aria-hidden="true" className="size-1.5 rounded-pill bg-positive" />
                Live
              </span>
            </h1>
            <p className="mt-1 text-sm text-ink-muted">Every signup, login, and payment across the platform, newest first.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <article className="bg-surface p-4 shadow-panel">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">New signups today</h2>
              <p className="mt-2 font-gowun text-3xl font-bold leading-9 text-ink">{countFormatter.format(feed.signupsToday)}</p>
            </article>
            <article className="bg-surface p-4 shadow-panel">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Logins today</h2>
              <p className="mt-2 font-gowun text-3xl font-bold leading-9 text-ink">{countFormatter.format(feed.loginsToday)}</p>
            </article>
            <article className="bg-surface p-4 shadow-panel">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Income today</h2>
              <p className="mt-2 font-gowun text-3xl font-bold leading-9 text-ink">{formatUsdWhole(feed.incomeTodayCents)}</p>
            </article>
          </div>

          <section className="bg-surface shadow-panel">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4 sm:px-5">
              <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by event type">
                {KIND_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setKind(filter.id)}
                    aria-pressed={filter.id === kind}
                    className={cn(
                      'min-h-9 rounded-soft px-3 text-sm font-medium transition-colors duration-normal ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                      filter.id === kind ? 'bg-accent-subtle text-accent-text' : 'text-ink-muted hover:bg-surface-subtle hover:text-ink',
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <div className="relative min-w-0 flex-1 sm:max-w-xs">
                <Search aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-ink-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Search activity by name or email"
                  placeholder="Search name or email…"
                  className="h-9 w-full rounded-lg border border-input bg-canvas ps-9 pe-3 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="p-4 sm:p-6">
                <EmptyState title="No matching activity" description="Try a different filter or search term." />
              </div>
            ) : (
              <ul className="max-h-[42rem] overflow-y-auto">
                {filtered.map((event) => (
                  <ActivityRow key={event.id} event={event} />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </AdminShell>
  )
}
