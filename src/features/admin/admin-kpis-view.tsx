import { useState } from 'react'
import { ChevronDown, Settings2 } from 'lucide-react'

import type { AdminKpiCard, AdminRevenueKpis } from '@/contracts/admin-kpis.draft'
import type { AdminDateRange, AdminDateRangeId, AdminNavItem, AdminNotification, AdminSearchResult } from '@/contracts/admin.draft'
import type { UserIdentity } from '@/contracts/identity'
import type { BadgeVariant } from '@/ui'
import {
  Badge,
  Button,
  cn,
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
  formatUsdWhole,
  Skeleton,
} from '@/ui'

import { AdminShell } from './admin-shell'

/* ---------- Status ---------- */

type KpiStatus = 'surplus' | 'achieved' | 'in-progress' | 'at-risk'

type StatusMeta = {
  readonly label: string
  readonly badge: BadgeVariant
  readonly bar: string
  readonly text: string
}

const STATUS_META: Record<KpiStatus, StatusMeta> = {
  surplus: { label: 'Surplus', badge: 'positive', bar: 'bg-positive', text: 'text-positive' },
  achieved: { label: 'Achieved', badge: 'positive', bar: 'bg-positive', text: 'text-positive' },
  'in-progress': { label: 'In progress', badge: 'accent', bar: 'bg-accent', text: 'text-accent-text' },
  'at-risk': { label: 'At risk', badge: 'warning', bar: 'bg-warning', text: 'text-warning' },
}

/** Percent is rounded first so the badge can never disagree with the number printed beside it. */
function percentOfTarget(actualCents: number, targetCents: number) {
  if (targetCents <= 0) return 0
  return Math.round((actualCents / targetCents) * 100)
}

function statusOf(percent: number): KpiStatus {
  if (percent >= 110) return 'surplus'
  if (percent >= 100) return 'achieved'
  if (percent >= 70) return 'in-progress'
  return 'at-risk'
}

/* ---------- Shared pieces ---------- */

function IndicatorBar({ percent, status, className }: {
  readonly percent: number
  readonly status: KpiStatus
  readonly className?: string
}) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-pill bg-surface-subtle', className)}>
      <div
        className={cn('h-full rounded-pill transition-all duration-normal ease-default motion-reduce:transition-none', STATUS_META[status].bar)}
        style={{ inlineSize: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  )
}

/** The gear that opens the target dialog. */
function TargetGearButton({ label, onClick }: { readonly label: string; readonly onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Edit the target for ${label}`}
      className="grid size-8 shrink-0 place-items-center rounded-soft text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      <Settings2 aria-hidden="true" className="size-4" />
    </button>
  )
}

/* ---------- Indicator card ---------- */

function KpiIndicatorCard({ card, targetCents, onEditTarget }: {
  readonly card: AdminKpiCard
  readonly targetCents: number
  readonly onEditTarget: () => void
}) {
  const [open, setOpen] = useState(false)
  const percent = percentOfTarget(card.actualCents, targetCents)
  const status = statusOf(percent)
  const meta = STATUS_META[status]

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="flex h-fit flex-col bg-surface shadow-panel">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{card.label}</h3>
          <div className="flex shrink-0 items-center gap-1.5">
            <Badge variant={meta.badge} size="sm">{meta.label}</Badge>
            <TargetGearButton label={card.label} onClick={onEditTarget} />
          </div>
        </div>

        <div className="mt-2 flex items-baseline justify-between gap-3">
          <p className="font-gowun text-3xl font-bold leading-9 text-ink">{formatUsdWhole(card.actualCents)}</p>
          <p className={cn('font-gowun text-lg font-bold tabular-nums', meta.text)}>{percent}%</p>
        </div>

        <IndicatorBar percent={percent} status={status} className="mt-3" />

        <p className="mt-3 text-sm text-ink-muted">of {formatUsdWhole(targetCents)} target</p>
        <p className="mt-1 text-xs leading-5 text-ink-muted">
          {card.actualDetail} · plan assumes {card.targetDetail}
        </p>
      </div>

      <CollapsibleTrigger className="flex min-h-11 w-full items-center justify-between gap-2 border-t border-border px-4 text-sm font-semibold text-accent-text transition-colors hover:bg-surface-subtle sm:px-5">
        <span>{open ? 'Hide breakdown' : 'Breakdown'}</span>
        <ChevronDown aria-hidden="true" className={cn('size-4 transition-transform duration-normal ease-default motion-reduce:transition-none', open && 'rotate-180')} />
      </CollapsibleTrigger>

      <CollapsiblePanel>
        <div className="border-t border-border">
          <table className="w-full text-start text-sm">
            <caption className="sr-only">{card.label} breakdown, target against the current period</caption>
            <thead>
              <tr className="border-b border-border bg-surface-subtle text-ink-muted">
                <th scope="col" className="px-4 py-2 text-start text-xs font-semibold uppercase tracking-wide sm:px-5">Line</th>
                <th scope="col" className="px-4 py-2 text-end text-xs font-semibold uppercase tracking-wide">Target</th>
                <th scope="col" className="px-4 py-2 text-end text-xs font-semibold uppercase tracking-wide sm:px-5">Current</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {card.detailRows.map((row) => {
                const rowPercent = percentOfTarget(row.actualCents, row.targetCents)
                const rowStatus = statusOf(rowPercent)
                return (
                  <tr key={row.id}>
                    <th scope="row" className="px-4 py-3 text-start font-semibold text-ink sm:px-5">
                      <span className="block">{row.label}</span>
                      <span className="mt-0.5 block text-xs font-normal text-ink-muted">{row.targetDetail}</span>
                    </th>
                    <td className="px-4 py-3 text-end align-top tabular-nums text-ink-muted">{formatUsdWhole(row.targetCents)}</td>
                    <td className="px-4 py-3 text-end align-top sm:px-5">
                      <span className="block font-semibold tabular-nums text-ink">{formatUsdWhole(row.actualCents)}</span>
                      <span className={cn('mt-0.5 block text-xs font-semibold tabular-nums', STATUS_META[rowStatus].text)}>
                        {rowPercent}% · {row.actualDetail}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="border-t border-border p-4 text-xs leading-5 text-ink-muted sm:px-5">{card.detailNote}</p>
        </div>
      </CollapsiblePanel>
    </Collapsible>
  )
}

/* ---------- Target dialog ---------- */

type PendingTarget = {
  readonly id: string
  readonly label: string
  readonly currentCents: number
  readonly rangeLabel: string
}

function TargetDialog({ pending, onClose, onSave }: {
  readonly pending: PendingTarget | null
  readonly onClose: () => void
  readonly onSave: (id: string, cents: number) => void
}) {
  // Seeded from the target being edited — the dialog is remounted per target, so this stays in step.
  const [draft, setDraft] = useState(pending ? String(Math.round(pending.currentCents / 100)) : '')

  return (
    <Dialog
      open={pending !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogPopup aria-labelledby="kpi-target-dialog-title">
        <DialogClose aria-label="Cancel" />
        <DialogTitle id="kpi-target-dialog-title">Set the {pending?.label} target</DialogTitle>
        <DialogDescription>
          The target this line is measured against for {pending?.rangeLabel}. Changing it recalculates the
          indicator and its status straight away — it does not change what was actually earned.
        </DialogDescription>
        {pending ? (
          <form
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              const dollars = Number(draft)
              if (draft.trim() !== '' && Number.isFinite(dollars) && dollars >= 0) onSave(pending.id, Math.round(dollars * 100))
              else onClose()
            }}
          >
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-ink">Target amount</span>
              <span className="flex items-center gap-2">
                <span className="font-gowun text-xl font-bold text-ink">$</span>
                <input
                  type="number"
                  min={0}
                  step={100}
                  autoFocus
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  className="min-h-11 w-full rounded-md border border-input bg-surface px-3 font-gowun text-xl font-bold tabular-nums text-ink outline-none focus:border-focus focus:ring-2 focus:ring-focus"
                />
              </span>
            </label>
            <div className="flex flex-wrap justify-end gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save target</Button>
            </div>
          </form>
        ) : null}
      </DialogPopup>
    </Dialog>
  )
}

function KpiSkeleton() {
  return (
    <div className="grid gap-6 p-4 sm:p-6">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-40" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-56" />
        ))}
      </div>
    </div>
  )
}

/* ---------- View ---------- */

export type AdminKpisViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly dateRanges: readonly AdminDateRange[]
  readonly kpis: AdminRevenueKpis
  readonly isLoading?: boolean
}

export function AdminKpisView({ user, navItems, notifications, searchResults, dateRanges, kpis, isLoading = false }: AdminKpisViewProps) {
  const [rangeId, setRangeId] = useState<AdminDateRangeId>(dateRanges[1]?.id ?? '30d')
  const activeRange = dateRanges.find((range) => range.id === rangeId) ?? dateRanges[0]

  // Targets are edited through the dialog and held here — nothing is persisted, matching every
  // other mocked admin mutation in this app. Keyed by range, so a 7-day target and a 30-day
  // target stay separate numbers.
  const [targetOverrides, setTargetOverrides] = useState<Readonly<Record<string, number>>>({})
  const [pendingTarget, setPendingTarget] = useState<PendingTarget | null>(null)

  const period = kpis.periods.find((entry) => entry.rangeId === rangeId) ?? kpis.periods[0]
  const targetFor = (id: string, fallbackCents: number) => targetOverrides[`${rangeId}:${id}`] ?? fallbackCents

  const overallTargetCents = targetFor('overall', period.targetCents)
  const actualCents = period.cards.reduce((sum, card) => sum + card.actualCents, 0)
  const plannedCents = period.cards.reduce((sum, card) => sum + targetFor(card.id, card.targetCents), 0)

  const overallPercent = percentOfTarget(actualCents, overallTargetCents)
  const overallStatus = statusOf(overallPercent)
  const overallMeta = STATUS_META[overallStatus]
  const gapCents = actualCents - overallTargetCents
  const plannedPercent = percentOfTarget(plannedCents, overallTargetCents)

  function saveTarget(id: string, cents: number) {
    setTargetOverrides((prev) => ({ ...prev, [`${rangeId}:${id}`]: cents }))
    setPendingTarget(null)
  }

  return (
    <AdminShell user={user} navItems={navItems} activeModule="kpis" notifications={notifications} searchResults={searchResults}>
      {isLoading ? (
        <KpiSkeleton />
      ) : (
        <div className="grid gap-6 p-4 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-gowun text-3xl font-bold leading-tight text-ink">KPIs</h1>
              <p className="mt-1 text-sm text-ink-muted">
                Every revenue line against its target for {activeRange?.rangeLabel}. Open a card for the breakdown behind it; use the gear to change a target.
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

          <section aria-label="Revenue against target" className="bg-surface p-4 shadow-panel sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Revenue</h2>
                <p className="mt-2 font-gowun text-5xl font-bold leading-[1.1] text-ink">{formatUsdWhole(actualCents)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <Badge variant={overallMeta.badge}>{overallMeta.label}</Badge>
                <TargetGearButton
                  label="revenue"
                  onClick={() => setPendingTarget({
                    id: 'overall',
                    label: 'revenue',
                    currentCents: overallTargetCents,
                    rangeLabel: activeRange?.rangeLabel ?? '',
                  })}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <IndicatorBar percent={overallPercent} status={overallStatus} />
              <span className={cn('shrink-0 font-gowun text-lg font-bold tabular-nums', overallMeta.text)}>{overallPercent}%</span>
            </div>

            <p className="mt-3 text-sm text-ink-muted">
              of {formatUsdWhole(overallTargetCents)} self-sustaining target —{' '}
              <span className={cn('font-semibold', gapCents >= 0 ? 'text-positive' : 'text-warning')}>
                {gapCents >= 0 ? `${formatUsdWhole(gapCents)} surplus` : `${formatUsdWhole(Math.abs(gapCents))} short`}
              </span>
            </p>
            <p className="mt-1 text-xs leading-5 text-ink-muted">
              The four line targets below add up to {formatUsdWhole(plannedCents)}, {plannedPercent}% of target — the plan is deliberately set above the line it has to clear.
            </p>
          </section>

          <section aria-label="Revenue lines" className="grid gap-4 sm:grid-cols-2">
            {period.cards.map((card) => {
              const cardTargetCents = targetFor(card.id, card.targetCents)
              return (
                <KpiIndicatorCard
                  key={card.id}
                  card={card}
                  targetCents={cardTargetCents}
                  onEditTarget={() => setPendingTarget({
                    id: card.id,
                    label: card.label,
                    currentCents: cardTargetCents,
                    rangeLabel: activeRange?.rangeLabel ?? '',
                  })}
                />
              )
            })}
          </section>
        </div>
      )}

      <TargetDialog
        // Remounting per target keeps the field's defaultValue in step with whichever card was opened.
        key={pendingTarget?.id ?? 'none'}
        pending={pendingTarget}
        onClose={() => setPendingTarget(null)}
        onSave={saveTarget}
      />
    </AdminShell>
  )
}
