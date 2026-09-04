import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  CheckCircle2,
  Clock,
  Download,
  RotateCcw,
  Scale,
  XCircle,
} from 'lucide-react'

import type {
  AdminDisputeReason,
  AdminDisputeRow,
  AdminDisputeStatus,
  AdminRefundReason,
  AdminRefundRequestRow,
  AdminTransactionDetail,
  AdminTransactionEventKind,
  AdminTransactionRow,
  AdminTransactionStatus,
  AdminTransactionStatusFilter,
  AdminTransactionsSummary,
  AdminTransactionsTab,
  AdminTransactionType,
} from '@/contracts/admin-transactions.draft'
import type { AdminNavItem, AdminNotification, AdminSearchResult } from '@/contracts/admin.draft'
import type { UserIdentity } from '@/contracts/identity'
import {
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
  formatUsd,
  SelectField,
  Skeleton,
  type DataTableColumn,
} from '@/ui'

import { AdminShell } from './admin-shell'

const PAGE_SIZE = 10

const typeLabels: Record<AdminTransactionType, string> = {
  'subscription-renewal': 'Subscription renewal',
  'credit-top-up': 'Credit top-up',
  'done-for-you': 'Done-For-You package',
  marketplace: 'Marketplace',
  refund: 'Refund',
  payout: 'Payout',
}

const statusLabels: Record<AdminTransactionStatus, string> = {
  succeeded: 'Succeeded',
  pending: 'Pending',
  failed: 'Failed',
  refunded: 'Refunded',
  disputed: 'Disputed',
}

const statusTones: Record<AdminTransactionStatus, string> = {
  succeeded: 'border-positive text-positive',
  pending: 'border-border text-ink-muted',
  failed: 'border-danger text-danger',
  refunded: 'border-warning text-warning',
  disputed: 'border-danger text-danger',
}

const disputeReasonLabels: Record<AdminDisputeReason, string> = {
  fraudulent: 'Fraudulent',
  'product-not-received': 'Product not received',
  duplicate: 'Duplicate charge',
  'subscription-cancelled': 'Subscription cancelled',
}

const disputeStatusLabels: Record<AdminDisputeStatus, string> = {
  'needs-response': 'Needs response',
  'under-review': 'Under review',
  'evidence-submitted': 'Evidence submitted',
  accepted: 'Accepted',
  won: 'Won',
  lost: 'Lost',
}

const refundReasonLabels: Record<AdminRefundReason, string> = {
  'duplicate-charge': 'Duplicate charge',
  'accidental-renewal': 'Accidental renewal',
  'service-not-used': 'Service not used',
  dissatisfied: 'Dissatisfied',
  'billing-error': 'Billing error',
}

const eventIcons: Record<AdminTransactionEventKind, typeof CheckCircle2> = {
  created: Clock,
  authorized: CheckCircle2,
  captured: CheckCircle2,
  failed: XCircle,
  retried: RotateCcw,
  refunded: RotateCcw,
  disputed: Scale,
  'evidence-submitted': Scale,
}

/** Status is carried by the word itself, so it survives color blindness without needing a glyph too. */
function StatusBadge({ status }: { readonly status: AdminTransactionStatus }) {
  return (
    <span className={cn('inline-flex items-center rounded-pill border px-2 py-0.5 text-xs font-semibold', statusTones[status])}>
      {statusLabels[status]}
    </span>
  )
}

function DirectionAmount({ row }: { readonly row: AdminTransactionRow }) {
  const outgoing = row.direction === 'outgoing'
  // A leading minus is how money out actually reads on a ledger, and it needs no glyph.
  return (
    <span className={cn('tabular-nums font-semibold', outgoing ? 'text-warning' : 'text-ink')}>
      <span className="sr-only">{outgoing ? 'Money out ' : 'Money in '}</span>
      {outgoing ? '−' : ''}{formatUsd(row.amountCents)}
    </span>
  )
}

function SummaryTiles({ summary }: { readonly summary: AdminTransactionsSummary }) {
  const tiles = [
    { label: 'Gross volume', value: formatUsd(summary.grossVolumeCents), caption: `${summary.grossVolumeCount} payments` },
    { label: 'Net revenue', value: formatUsd(summary.netRevenueCents), caption: `${summary.netRevenueCount} settled` },
    { label: 'Refunded', value: formatUsd(summary.refundedCents), caption: `${summary.refundedCount} refunds` },
    { label: 'In dispute', value: formatUsd(summary.disputedCents), caption: `${summary.disputedCount} open disputes` },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile) => (
        <article key={tile.label} className="bg-surface p-4 shadow-panel">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{tile.label}</h3>
          <p className="mt-2 font-gowun text-3xl font-bold leading-9 text-ink">{tile.value}</p>
          <p className="mt-1 text-xs text-ink-muted">{tile.caption}</p>
        </article>
      ))}
    </div>
  )
}

const TABS: readonly { readonly id: AdminTransactionsTab; readonly label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'incoming', label: 'Incoming' },
  { id: 'outgoing', label: 'Outgoing' },
  { id: 'disputes', label: 'Disputes' },
  { id: 'refunds', label: 'Refunds' },
]

export type AdminTransactionsViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly summary: AdminTransactionsSummary
  readonly transactions: readonly AdminTransactionRow[]
  readonly disputes: readonly AdminDisputeRow[]
  readonly refundRequests: readonly AdminRefundRequestRow[]
  readonly tab: AdminTransactionsTab
  readonly onTabChange: (tab: AdminTransactionsTab) => void
  readonly q: string
  readonly onQChange: (value: string) => void
  readonly status: AdminTransactionStatusFilter
  readonly onStatusChange: (value: AdminTransactionStatusFilter) => void
  readonly page: number
  readonly onPageChange: (page: number) => void
  readonly onClearFilters: () => void
  readonly transactionHref: (transactionId: string) => string
  readonly isLoading?: boolean
  readonly errorMessage?: string
  readonly onRetry?: () => void
}

export function AdminTransactionsView({
  user,
  navItems,
  notifications,
  searchResults,
  summary,
  transactions,
  disputes,
  refundRequests,
  tab,
  onTabChange,
  q,
  onQChange,
  status,
  onStatusChange,
  page,
  onPageChange,
  onClearFilters,
  transactionHref,
  isLoading = false,
  errorMessage,
  onRetry,
}: AdminTransactionsViewProps) {
  const [resolvedDisputes, setResolvedDisputes] = useState<Readonly<Record<string, AdminDisputeStatus>>>({})
  const [resolvedRefunds, setResolvedRefunds] = useState<Readonly<Record<string, 'approved' | 'denied'>>>({})
  const [disputeAction, setDisputeAction] = useState<{ readonly row: AdminDisputeRow; readonly kind: 'evidence' | 'accept' } | null>(null)
  const [refundAction, setRefundAction] = useState<{ readonly row: AdminRefundRequestRow; readonly kind: 'approve' | 'deny' } | null>(null)
  const [denyReason, setDenyReason] = useState('')

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return transactions.filter((row) => {
      if (tab === 'incoming' && row.direction !== 'incoming') return false
      if (tab === 'outgoing' && row.direction !== 'outgoing') return false
      if (status !== 'all' && row.status !== status) return false
      if (!needle) return true
      return `${row.id} ${row.customerName} ${row.customerEmail} ${row.productLabel}`.toLowerCase().includes(needle)
    })
  }, [transactions, tab, status, q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const visibleRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const openDisputeCount = disputes.filter((row) => !resolvedDisputes[row.id]).length
  const pendingRefundCount = refundRequests.filter((row) => !resolvedRefunds[row.id]).length

  const columns: readonly DataTableColumn<AdminTransactionRow>[] = [
    {
      key: 'id',
      label: 'Transaction',
      sortable: true,
      sortValue: (row) => row.id,
      render: (row) => (
        <a href={transactionHref(row.id)} className="font-semibold text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          {row.id}
        </a>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      sortValue: (row) => row.customerName,
      render: (row) => (
        <span className="block min-w-0">
          <span className="block truncate font-medium text-ink">{row.customerName}</span>
          <span className="block truncate text-xs text-ink-muted">{row.customerEmail}</span>
        </span>
      ),
    },
    { key: 'product', label: 'Product', render: (row) => <span className="block max-w-56 truncate">{row.productLabel}</span> },
    { key: 'type', label: 'Type', sortable: true, sortValue: (row) => typeLabels[row.type], render: (row) => typeLabels[row.type] },
    { key: 'amount', label: 'Amount', className: 'text-end', headerClassName: 'text-end', sortable: true, sortValue: (row) => row.amountCents, render: (row) => <DirectionAmount row={row} /> },
    { key: 'method', label: 'Method', render: (row) => <span className="whitespace-nowrap text-ink-muted">{row.method.label}</span> },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      sortValue: (row) => statusLabels[row.status],
      render: (row) => (
        <span className="grid gap-1">
          <StatusBadge status={row.status} />
          {row.failureReason ? <span className="text-xs text-ink-muted">{row.failureReason}</span> : null}
        </span>
      ),
    },
    { key: 'date', label: 'Date', sortable: true, sortValue: (row) => row.dateLabel, render: (row) => <span className="whitespace-nowrap">{row.dateLabel}</span> },
  ]

  function renderLedger() {
    if (filtered.length === 0) {
      return (
        <EmptyState
          title="No transactions match these filters"
          description="Try a different status, or clear the filters to see every transaction in the range."
          action={<Button onClick={onClearFilters}>Clear filters</Button>}
        />
      )
    }
    return (
      <DataTable
        rows={visibleRows}
        columns={columns}
        itemLabel={(row) => `${row.id}, ${row.customerName}`}
        searchValue={q}
        onSearchChange={onQChange}
        searchLabel="Search transactions by id, customer, or product"
        searchPlaceholder="Search id, customer, or product"
        minTableWidthClassName="min-w-[76rem]"
        pagination={{ page: safePage, totalPages, totalItems: filtered.length, pageSize: PAGE_SIZE }}
        onPageChange={onPageChange}
      />
    )
  }

  function renderDisputes() {
    if (disputes.length === 0) {
      return <EmptyState title="No open disputes" description="Disputes raised by a cardholder's bank will appear here with their evidence deadline." />
    }
    return (
      <ul className="grid gap-3">
        {disputes.map((row) => {
          const resolved = resolvedDisputes[row.id]
          const overdue = row.daysUntilEvidenceDue < 0
          const urgent = !resolved && row.daysUntilEvidenceDue <= 3
          return (
            <li key={row.id} className="bg-surface p-4 shadow-panel">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink">{row.customerName}</p>
                    <Badge variant="neutral">{disputeReasonLabels[row.reason]}</Badge>
                    <span className="text-sm font-semibold text-ink">{formatUsd(row.amountCents)}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{row.productLabel} · {row.customerEmail}</p>
                  <p className="mt-2 text-sm leading-6 text-ink">“{row.reasonDetail}”</p>
                  <p className={cn('mt-2 inline-flex items-center gap-1.5 text-xs font-semibold', urgent || overdue ? 'text-danger' : 'text-ink-muted')}>
                    {urgent || overdue ? <AlertTriangle aria-hidden="true" className="size-3.5" /> : null}
                    Opened {row.openedLabel} · Evidence due {row.evidenceDueLabel}
                    {overdue ? ' (overdue)' : row.daysUntilEvidenceDue <= 3 ? ` (${row.daysUntilEvidenceDue} days left)` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {resolved ? (
                    <Badge variant="neutral">{disputeStatusLabels[resolved]}</Badge>
                  ) : (
                    <>
                      <Badge variant="neutral">{disputeStatusLabels[row.status]}</Badge>
                      <Button variant="secondary" onClick={() => setDisputeAction({ row, kind: 'evidence' })}>Submit evidence</Button>
                      <Button variant="ghost" onClick={() => setDisputeAction({ row, kind: 'accept' })}>Accept dispute</Button>
                    </>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  function renderRefunds() {
    if (refundRequests.length === 0) {
      return <EmptyState title="No refund requests" description="Requests raised by support or by a customer will queue here for approval." />
    }
    return (
      <ul className="grid gap-3">
        {refundRequests.map((row) => {
          const resolved = resolvedRefunds[row.id]
          const partial = row.amountCents < row.originalAmountCents
          return (
            <li key={row.id} className="bg-surface p-4 shadow-panel">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink">{row.requesterName}</p>
                    <Badge variant="neutral">{refundReasonLabels[row.reason]}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{row.productLabel} · {row.requesterEmail}</p>
                  <p className="mt-2 text-sm leading-6 text-ink">“{row.note}”</p>
                  <p className="mt-2 text-xs text-ink-muted">Requested {row.requestedLabel} · against {row.transactionId}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <p className="text-lg font-bold text-ink">{formatUsd(row.amountCents)}</p>
                  {partial ? <p className="text-xs text-ink-muted">Partial of {formatUsd(row.originalAmountCents)}</p> : null}
                  {resolved ? (
                    <Badge variant="neutral">{resolved === 'approved' ? 'Approved' : 'Denied'}</Badge>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={() => setRefundAction({ row, kind: 'approve' })}>Approve</Button>
                      <Button variant="ghost" onClick={() => { setDenyReason(''); setRefundAction({ row, kind: 'deny' }) }}>Deny</Button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <AdminShell user={user} navItems={navItems} activeModule="transactions" notifications={notifications} searchResults={searchResults}>
      <div className="grid gap-6 p-4 sm:p-6">
        <div>
          <h1 className="font-gowun text-3xl font-bold leading-tight text-ink">Transactions</h1>
          <p className="mt-1 text-sm text-ink-muted">Money in and out for {summary.rangeLabel}.</p>
        </div>

        {isLoading ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28" />)}
            </div>
            <Skeleton className="h-96" />
          </>
        ) : errorMessage ? (
          <EmptyState
            title="Could not load transactions"
            description={errorMessage}
            action={onRetry ? <Button onClick={onRetry}>Try again</Button> : undefined}
          />
        ) : (
          <>
            <SummaryTiles summary={summary} />

            {summary.failedRenewalCount > 0 ? (
              <div role="status" className="flex flex-wrap items-center justify-between gap-3 bg-warning-surface px-4 py-3 text-sm text-warning">
                <span className="inline-flex items-center gap-2 font-semibold">
                  <AlertTriangle aria-hidden="true" className="size-4" />
                  {summary.failedRenewalCount} failed renewals worth {formatUsd(summary.failedRenewalCents)} in the last 48 hours
                </span>
                <button
                  type="button"
                  onClick={() => { onStatusChange('failed'); onTabChange('incoming') }}
                  className="min-h-9 shrink-0 rounded-soft px-2 font-semibold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  Show failed payments
                </button>
              </div>
            ) : null}

            <div className="border-b border-border">
              <div role="tablist" aria-label="Transaction views" className="flex flex-wrap gap-1">
                {TABS.map((entry) => {
                  const count = entry.id === 'disputes' ? openDisputeCount : entry.id === 'refunds' ? pendingRefundCount : 0
                  const selected = entry.id === tab
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => onTabChange(entry.id)}
                      className={cn(
                        'inline-flex min-h-11 items-center gap-2 border-b-2 px-3 text-sm font-semibold transition-colors duration-normal ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                        selected ? 'border-accent text-accent-text' : 'border-transparent text-ink-muted hover:text-ink',
                      )}
                    >
                      {entry.label}
                      {count > 0 ? (
                        <span className="rounded-pill bg-danger px-1.5 text-[11px] font-bold leading-5 text-on-danger">
                          {count}
                          <span className="sr-only"> awaiting action</span>
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </div>

            {tab === 'disputes' ? renderDisputes() : tab === 'refunds' ? renderRefunds() : (
              <>
                <div className="flex flex-wrap items-end gap-3">
                  <SelectField
                    id="transaction-status-filter"
                    label="Status"
                    value={status}
                    onValueChange={(value) => onStatusChange(value as AdminTransactionStatusFilter)}
                    options={[
                      { value: 'all', label: 'Any status' },
                      ...(Object.keys(statusLabels) as AdminTransactionStatus[]).map((key) => ({ value: key, label: statusLabels[key] })),
                    ]}
                    className="w-48"
                  />
                  <p className="ms-auto text-sm text-ink-muted">{filtered.length} of {transactions.length} shown</p>
                </div>
                {renderLedger()}
              </>
            )}
          </>
        )}
      </div>

      <Dialog open={disputeAction !== null} onOpenChange={(open) => { if (!open) setDisputeAction(null) }}>
        <DialogPopup aria-label="Confirm dispute action">
          <DialogTitle>{disputeAction?.kind === 'accept' ? 'Accept this dispute?' : 'Submit evidence for this dispute?'}</DialogTitle>
          <DialogDescription>
            {disputeAction?.kind === 'accept'
              ? `Accepting forfeits ${disputeAction ? formatUsd(disputeAction.row.amountCents) : ''} to ${disputeAction?.row.customerName} and closes the case. This cannot be undone.`
              : `Evidence for ${disputeAction ? formatUsd(disputeAction.row.amountCents) : ''} against ${disputeAction?.row.customerName} will be sent to the card network. You cannot edit it after submitting.`}
          </DialogDescription>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <DialogClose className="static inline-flex min-h-9 items-center rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              Cancel
            </DialogClose>
            <Button
              variant={disputeAction?.kind === 'accept' ? 'danger' : 'primary'}
              onClick={() => {
                if (disputeAction) {
                  setResolvedDisputes((prev) => ({ ...prev, [disputeAction.row.id]: disputeAction.kind === 'accept' ? 'accepted' : 'evidence-submitted' }))
                }
                setDisputeAction(null)
              }}
            >
              {disputeAction?.kind === 'accept' ? 'Accept and forfeit' : 'Submit evidence'}
            </Button>
          </div>
        </DialogPopup>
      </Dialog>

      <Dialog open={refundAction !== null} onOpenChange={(open) => { if (!open) setRefundAction(null) }}>
        <DialogPopup aria-label="Confirm refund decision">
          <DialogTitle>{refundAction?.kind === 'approve' ? 'Approve this refund?' : 'Deny this refund?'}</DialogTitle>
          <DialogDescription>
            {refundAction?.kind === 'approve'
              ? `${refundAction ? formatUsd(refundAction.row.amountCents) : ''} will be returned to ${refundAction?.row.requesterName} on the original payment method, against ${refundAction?.row.transactionId}. Refunds cannot be reversed.`
              : `${refundAction?.row.requesterName} will be told their refund was declined. Give a reason they can act on.`}
          </DialogDescription>
          {refundAction?.kind === 'deny' ? (
            <div className="mt-4">
              <label htmlFor="refund-deny-reason" className="block text-sm font-semibold text-ink">Reason for denial</label>
              <textarea
                id="refund-deny-reason"
                value={denyReason}
                onChange={(event) => setDenyReason(event.target.value)}
                rows={3}
                className="mt-1.5 w-full rounded-lg border border-input bg-canvas p-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                placeholder="e.g. Session was fully used and falls outside the 7-day window."
              />
              <p aria-live="polite" className="mt-1 text-xs text-ink-muted">
                {denyReason.trim() ? 'Ready to send.' : 'A reason is required before you can deny this request.'}
              </p>
            </div>
          ) : null}
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <DialogClose className="static inline-flex min-h-9 items-center rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              Cancel
            </DialogClose>
            <Button
              variant={refundAction?.kind === 'deny' ? 'danger' : 'primary'}
              disabled={refundAction?.kind === 'deny' && !denyReason.trim()}
              onClick={() => {
                if (refundAction) {
                  setResolvedRefunds((prev) => ({ ...prev, [refundAction.row.id]: refundAction.kind === 'approve' ? 'approved' : 'denied' }))
                }
                setRefundAction(null)
              }}
            >
              {refundAction?.kind === 'approve' ? 'Approve refund' : 'Deny request'}
            </Button>
          </div>
        </DialogPopup>
      </Dialog>
    </AdminShell>
  )
}

export type AdminTransactionDetailViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly transaction: AdminTransactionDetail | null
  readonly transactionsHref: string
  readonly isLoading?: boolean
  readonly errorMessage?: string
  readonly onRetry?: () => void
}

export function AdminTransactionDetailView({
  user,
  navItems,
  notifications,
  searchResults,
  transaction,
  transactionsHref,
  isLoading = false,
  errorMessage,
  onRetry,
}: AdminTransactionDetailViewProps) {
  const [refundOpen, setRefundOpen] = useState(false)
  const [refunded, setRefunded] = useState(false)

  return (
    <AdminShell user={user} navItems={navItems} activeModule="transactions" notifications={notifications} searchResults={searchResults}>
      <div className="grid gap-6 p-4 sm:p-6">
        <a href={transactionsHref} className="inline-flex min-h-9 w-fit items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <ArrowLeft aria-hidden="true" className="size-4" />
          All transactions
        </a>

        {isLoading ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-80" />
          </>
        ) : errorMessage ? (
          <EmptyState title="Could not load this transaction" description={errorMessage} action={onRetry ? <Button onClick={onRetry}>Try again</Button> : undefined} />
        ) : !transaction ? (
          <EmptyState
            title="Transaction not found"
            description="This id does not match any transaction. It may have been from a different environment."
            action={<Button onClick={() => { window.location.href = transactionsHref }}>Back to transactions</Button>}
          />
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="font-gowun text-3xl font-bold leading-tight text-ink">{formatUsd(transaction.totalCents)}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={refunded ? 'refunded' : transaction.status} />
                  <span className="text-sm text-ink-muted">{transaction.id} · {transaction.invoiceNumber} · {transaction.dateLabel}</span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">Statement descriptor: {transaction.statementDescriptor}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Button variant="secondary" onClick={() => undefined} aria-label={`Download invoice ${transaction.invoiceFileName}`}>
                  <Download aria-hidden="true" className="size-4" />
                  Download invoice
                </Button>
                {transaction.direction === 'incoming' && !refunded && transaction.refundedCents === 0 ? (
                  <Button variant="ghost" onClick={() => setRefundOpen(true)}>
                    <RotateCcw aria-hidden="true" className="size-4" />
                    Refund
                  </Button>
                ) : null}
              </div>
            </div>

            {transaction.dispute ? (
              <div role="status" className="bg-danger-surface p-4">
                <p className="inline-flex items-center gap-2 text-sm font-bold text-danger">
                  <Scale aria-hidden="true" className="size-4" />
                  Disputed, {disputeReasonLabels[transaction.dispute.reason]}
                </p>
                <p className="mt-1 text-sm leading-6 text-danger">
                  Evidence due {transaction.dispute.evidenceDueLabel}
                  {transaction.dispute.daysUntilEvidenceDue < 0 ? ' (overdue)' : ` (${transaction.dispute.daysUntilEvidenceDue} days left)`}. “{transaction.dispute.reasonDetail}”
                </p>
              </div>
            ) : null}

            {transaction.failureReason ? (
              <div role="status" className="bg-warning-surface p-4 text-sm font-semibold text-warning">
                <span className="inline-flex items-center gap-2">
                  <AlertTriangle aria-hidden="true" className="size-4" />
                  {transaction.failureReason}
                </span>
              </div>
            ) : null}

            <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <section className="bg-surface shadow-panel" aria-label="Invoice line items">
                <h2 className="border-b border-border p-4 font-gowun text-lg font-bold text-ink sm:px-5">Line items</h2>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[34rem] text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th scope="col" className="p-4 text-start text-xs font-semibold uppercase tracking-wide text-ink-muted sm:px-5">Description</th>
                        <th scope="col" className="p-4 text-end text-xs font-semibold uppercase tracking-wide text-ink-muted">Qty</th>
                        <th scope="col" className="p-4 text-end text-xs font-semibold uppercase tracking-wide text-ink-muted">Unit</th>
                        <th scope="col" className="p-4 text-end text-xs font-semibold uppercase tracking-wide text-ink-muted sm:px-5">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaction.lineItems.map((item) => (
                        <tr key={item.id} className="border-b border-border last:border-b-0">
                          <td className="p-4 sm:px-5">
                            <span className="block font-medium text-ink">{item.description}</span>
                            <span className="block text-xs text-ink-muted">{item.detail}</span>
                          </td>
                          <td className="p-4 text-end tabular-nums text-ink">{item.quantity}</td>
                          <td className="p-4 text-end tabular-nums text-ink-muted">{formatUsd(item.unitAmountCents)}</td>
                          <td className="p-4 text-end tabular-nums font-semibold text-ink sm:px-5">{formatUsd(item.amountCents)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="p-4 text-end text-ink-muted sm:px-5">Subtotal</td>
                        <td className="p-4 text-end tabular-nums text-ink sm:px-5">{formatUsd(transaction.subtotalCents)}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-4 pb-2 text-end text-ink-muted sm:px-5">{transaction.taxLabel}</td>
                        <td className="px-4 pb-2 text-end tabular-nums text-ink sm:px-5">{formatUsd(transaction.taxCents)}</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td colSpan={3} className="p-4 text-end font-bold text-ink sm:px-5">Total</td>
                        <td className="p-4 text-end tabular-nums text-lg font-bold text-ink sm:px-5">{formatUsd(transaction.totalCents)}</td>
                      </tr>
                      {transaction.refundedCents > 0 || refunded ? (
                        <tr>
                          <td colSpan={3} className="px-4 pb-4 text-end font-semibold text-warning sm:px-5">Refunded</td>
                          <td className="px-4 pb-4 text-end tabular-nums font-semibold text-warning sm:px-5">
                            −{formatUsd(refunded ? transaction.totalCents : transaction.refundedCents)}
                          </td>
                        </tr>
                      ) : null}
                    </tfoot>
                  </table>
                </div>
              </section>

              <div className="grid gap-4">
                <section className="bg-surface p-4 shadow-panel sm:p-5" aria-label="Customer">
                  <h2 className="font-gowun text-lg font-bold text-ink">Customer</h2>
                  <a href={transaction.customer.accountHref} className="mt-2 block font-semibold text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    {transaction.customer.name}
                  </a>
                  <p className="text-sm text-ink-muted">{transaction.customer.email}</p>
                  <dl className="mt-3 grid gap-1 text-sm">
                    <div className="flex justify-between gap-3"><dt className="text-ink-muted">Plan</dt><dd className="text-ink">{transaction.customer.planLabel}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-ink-muted">Customer since</dt><dd className="text-ink">{transaction.customer.customerSinceLabel}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-ink-muted">Method</dt><dd className="text-ink">{transaction.method.label}</dd></div>
                  </dl>
                  <address className="mt-3 not-italic text-sm leading-6 text-ink-muted">
                    {transaction.customer.billingAddressLines.map((line) => <span key={line} className="block">{line}</span>)}
                  </address>
                </section>

                <section className="bg-surface p-4 shadow-panel sm:p-5" aria-label="Event timeline">
                  <h2 className="font-gowun text-lg font-bold text-ink">Timeline</h2>
                  <ol className="mt-3 grid gap-3">
                    {transaction.events.map((event) => {
                      const Icon = eventIcons[event.kind]
                      const bad = event.kind === 'failed' || event.kind === 'disputed'
                      return (
                        <li key={event.id} className="flex gap-3">
                          <span className={cn('mt-0.5 grid size-7 shrink-0 place-items-center rounded-soft border', bad ? 'border-danger text-danger' : 'border-border text-ink-muted')}>
                            <Icon aria-hidden="true" className="size-3.5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-ink">{event.label}</span>
                            <span className="block text-xs leading-5 text-ink-muted">{event.detail}</span>
                            <span className="block text-xs text-ink-muted">{event.timestampLabel} · {event.actor}</span>
                          </span>
                        </li>
                      )
                    })}
                  </ol>
                </section>
              </div>
            </div>
          </>
        )}
      </div>

      <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
        <DialogPopup aria-label="Confirm refund">
          <DialogTitle>Refund {transaction ? formatUsd(transaction.totalCents) : ''}?</DialogTitle>
          <DialogDescription>
            This returns {transaction ? formatUsd(transaction.totalCents) : ''} to {transaction?.customer.name} on {transaction?.method.label}. Refunds cannot be reversed.
          </DialogDescription>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <DialogClose className="static inline-flex min-h-9 items-center rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              Cancel
            </DialogClose>
            <Button variant="danger" onClick={() => { setRefunded(true); setRefundOpen(false) }}>
              <Ban aria-hidden="true" className="size-4" />
              Refund in full
            </Button>
          </div>
        </DialogPopup>
      </Dialog>
    </AdminShell>
  )
}
