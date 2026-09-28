import { ArrowRight, ArrowUpRight, RotateCw, X } from 'lucide-react'

import type { DesktopCredits, DesktopSessionKind, DesktopSessionSummary } from '@/contracts/desktop.draft'
import { Button, Skeleton, cn } from '@/ui'

export type DesktopHomeViewProps = {
  readonly firstName: string
  readonly calendarPrompt: boolean
  readonly onConnectCalendar: () => void
  readonly onDismissCalendar: () => void
  readonly onLaunch: (kind: DesktopSessionKind) => void
  readonly sessions: { readonly status: 'loading' } | { readonly status: 'error' } | { readonly status: 'ready'; readonly items: readonly DesktopSessionSummary[] }
  readonly credits?: DesktopCredits
  readonly onOpenSession: (id: string) => void
  readonly onViewAllSessions: () => void
  readonly onManageCredits: () => void
  readonly onRetry?: () => void
}

const LAUNCHERS: readonly { readonly kind: DesktopSessionKind; readonly title: string; readonly detail: string; readonly icon: string }[] = [
  { kind: 'interview', title: 'Interview Copilot', detail: 'Live AI assistance during interviews. Real-time suggestions as the conversation happens.', icon: '/v3-assets/figma/action-icon-copilot.svg' },
  { kind: 'coding', title: 'Coding Copilot', detail: 'Live AI assistance for coding interviews. Real-time hints as you work through the problem.', icon: '/v3-assets/figma/action-icon-coding.svg' },
  { kind: 'meeting', title: 'Meeting Copilot', detail: 'Live AI assistance during meetings. Real-time notes and talking points as the conversation happens.', icon: '/v3-assets/figma/action-icon-meeting.svg' },
]

const KIND_LABELS: Record<DesktopSessionKind, string> = { interview: 'Interview', coding: 'Coding', meeting: 'Meeting' }
const when = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })

export function DesktopHomeView({ firstName, calendarPrompt, onConnectCalendar, onDismissCalendar, onLaunch, sessions, credits, onOpenSession, onViewAllSessions, onManageCredits, onRetry }: DesktopHomeViewProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-12 pt-6">
      <h1 className="font-gowun text-3xl text-ink">Welcome {firstName}, what would you like to do today?</h1>
      {calendarPrompt ? (
        <p className="mt-4 flex flex-wrap items-center gap-x-2 text-sm text-ink-muted">
          See your upcoming meetings here.
          <button type="button" onClick={onConnectCalendar} className="min-h-9 rounded-md font-semibold text-accent-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            Connect Google Calendar
          </button>
          <button type="button" aria-label="Dismiss the calendar prompt" onClick={onDismissCalendar} className="grid size-9 place-items-center rounded-md hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <X aria-hidden="true" className="size-4" />
          </button>
        </p>
      ) : null}

      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {LAUNCHERS.map((launcher) => (
          <li key={launcher.kind}>
            <button
              type="button"
              onClick={() => onLaunch(launcher.kind)}
              className="grid h-full w-full content-start gap-3 rounded-panel border border-border bg-surface p-5 text-start transition-shadow hover:shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <img src={launcher.icon} alt="" className="h-14 w-14" />
              <span className="flex items-center gap-2 font-gowun text-base text-ink">
                {launcher.title}
                <ArrowRight aria-hidden="true" className="size-4" />
              </span>
              <span className="text-sm leading-6 text-ink-muted">{launcher.detail}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-4 sm:grid-cols-[2fr_1fr]">
        <section aria-labelledby="desktop-recent" className="rounded-panel border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 id="desktop-recent" className="font-gowun text-base text-ink">Recent sessions</h2>
            <button type="button" onClick={onViewAllSessions} className="min-h-9 rounded-md text-sm font-semibold text-accent-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">View all</button>
          </div>
          {sessions.status === 'loading' ? (
            <div aria-busy="true" aria-label="Loading sessions" className="mt-3 grid gap-3">{[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-12" />)}</div>
          ) : sessions.status === 'error' ? (
            <div role="alert" className="mt-4 grid justify-items-start gap-2 text-sm text-ink-muted">
              We couldn&rsquo;t load your sessions.
              <Button variant="secondary" size="sm" onClick={onRetry} leadingIcon={<RotateCw aria-hidden="true" className="size-4" />}>Try again</Button>
            </div>
          ) : sessions.items.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">No sessions yet. Start one above and it will appear here.</p>
          ) : (
            <ul className="mt-2 divide-y divide-border">
              {sessions.items.map((session) => (
                <li key={session.id}>
                  <button type="button" onClick={() => onOpenSession(session.id)} className="flex min-h-16 w-full items-center justify-between gap-3 py-2 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink">{session.title}</span>
                      <span className="block truncate text-sm text-ink-muted">
                        {[KIND_LABELS[session.kind], session.company, when.format(new Date(session.startedAt))].filter(Boolean).join(' · ')}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3 text-sm text-ink-muted">
                      {session.durationMinutes} min
                      <ArrowUpRight aria-hidden="true" className="size-4 text-ink" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="desktop-credits" className="rounded-panel border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 id="desktop-credits" className="font-gowun text-base text-ink">Credits</h2>
            <button type="button" onClick={onManageCredits} className="min-h-9 rounded-md text-sm font-semibold text-accent-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Manage</button>
          </div>
          {credits ? (
            <>
              <p className="mt-3 text-3xl font-bold text-ink">{credits.balance.toLocaleString('en-US')} credits</p>
              <p className="text-sm text-ink-muted">left to spend</p>
              <div role="progressbar" aria-label="Credits used this period" aria-valuemin={0} aria-valuemax={credits.periodAllowance} aria-valuenow={credits.usedThisPeriod} className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-subtle">
                <div className={cn('h-full rounded-full', credits.usedThisPeriod / credits.periodAllowance > 0.9 ? 'bg-danger' : 'bg-accent')} style={{ width: `${Math.min(100, (credits.usedThisPeriod / credits.periodAllowance) * 100)}%` }} />
              </div>
              <p className="mt-2 text-sm text-ink-muted">{credits.usedThisPeriod.toLocaleString('en-US')} of {credits.periodAllowance.toLocaleString('en-US')} credits this period</p>
            </>
          ) : (
            <Skeleton className="mt-3 h-20" />
          )}
        </section>
      </div>
    </div>
  )
}
