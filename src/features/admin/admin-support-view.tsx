import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  XCircle,
} from 'lucide-react'

import type {
  AdminSupportSummary,
  AdminTicketAssigneeFilter,
  AdminTicketDetail,
  AdminTicketMessage,
  AdminTicketPriority,
  AdminTicketPriorityFilter,
  AdminTicketRow,
  AdminTicketStatus,
  AdminTicketStatusFilter,
} from '@/contracts/admin-support.draft'
import type { AdminModuleId, AdminNavItem, AdminNotification, AdminSearchResult } from '@/contracts/admin.draft'
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
  SelectField,
  Skeleton,
  type BadgeVariant,
  type DataTableColumn,
} from '@/ui'

import { AdminShell } from './admin-shell'

const PAGE_SIZE = 10

const statusLabels: Record<AdminTicketStatus, string> = {
  open: 'Open',
  'in-progress': 'In progress',
  waiting: 'Waiting',
  resolved: 'Resolved',
  closed: 'Closed',
}

const statusVariant: Record<AdminTicketStatus, BadgeVariant> = {
  open: 'accent',
  'in-progress': 'info',
  waiting: 'warning',
  resolved: 'positive',
  closed: 'neutral',
}

const priorityLabels: Record<AdminTicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

const priorityVariant: Record<AdminTicketPriority, BadgeVariant> = {
  low: 'neutral',
  medium: 'info',
  high: 'warning',
  urgent: 'danger',
}

function StatusBadge({ status }: { readonly status: AdminTicketStatus }) {
  return <Badge variant={statusVariant[status]} size="sm">{statusLabels[status]}</Badge>
}

function PriorityBadge({ priority }: { readonly priority: AdminTicketPriority }) {
  return <Badge variant={priorityVariant[priority]} size="sm">{priorityLabels[priority]}</Badge>
}

const TABS = [
  { id: 'all' as const, label: 'All' },
  { id: 'open' as const, label: 'Open' },
  { id: 'in-progress' as const, label: 'In progress' },
  { id: 'waiting' as const, label: 'Waiting' },
  { id: 'resolved' as const, label: 'Resolved' },
  { id: 'closed' as const, label: 'Closed' },
] as const

const priorityFilterValues: readonly AdminTicketPriorityFilter[] = ['all', 'low', 'medium', 'high', 'urgent']

export type AdminSupportViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly summary: AdminSupportSummary
  readonly tickets: readonly AdminTicketRow[]
  readonly tab: AdminTicketStatusFilter
  readonly onTabChange: (tab: AdminTicketStatusFilter) => void
  readonly q: string
  readonly onQChange: (value: string) => void
  readonly priority: AdminTicketPriorityFilter
  readonly onPriorityChange: (value: AdminTicketPriorityFilter) => void
  readonly assignee: AdminTicketAssigneeFilter
  readonly onAssigneeChange: (value: AdminTicketAssigneeFilter) => void
  readonly page: number
  readonly onPageChange: (page: number) => void
  readonly onClearFilters: () => void
  readonly ticketHref: (ticketId: string) => string
  readonly isLoading?: boolean
  readonly errorMessage?: string
  readonly onRetry?: () => void
}

export function AdminSupportView({
  user,
  navItems,
  notifications,
  searchResults,
  summary,
  tickets,
  tab,
  onTabChange,
  q,
  onQChange,
  priority,
  onPriorityChange,
  assignee,
  onAssigneeChange,
  page,
  onPageChange,
  onClearFilters,
  ticketHref,
  isLoading = false,
  errorMessage,
  onRetry,
}: AdminSupportViewProps) {
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return tickets.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (priority !== 'all' && row.priority !== priority) return false
      if (assignee === 'unassigned' && row.assignedToName !== null) return false
      if (assignee !== 'all' && assignee !== 'unassigned' && row.assignedToName !== assignee) return false
      if (!needle) return true
      return `${row.id} ${row.subject} ${row.accountName} ${row.accountEmail}`.toLowerCase().includes(needle)
    })
  }, [tickets, tab, priority, assignee, q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const visibleRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tickets.length }
    for (const row of tickets) {
      counts[row.status] = (counts[row.status] ?? 0) + 1
    }
    return counts
  }, [tickets])

  const columns: readonly DataTableColumn<AdminTicketRow>[] = [
    {
      key: 'id',
      label: 'Ticket',
      className: 'w-[10%]',
      sortable: true,
      sortValue: (row) => row.id,
      render: (row) => (
        <span className="flex items-center gap-2">
          <a href={ticketHref(row.id)} className="font-semibold text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            {row.id}
          </a>
          {row.unreadCount > 0 ? (
            <span className="rounded-pill bg-danger px-1.5 text-[11px] font-bold leading-5 text-on-danger">
              {row.unreadCount}
            </span>
          ) : null}
        </span>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      className: 'w-[24%]',
      sortable: true,
      sortValue: (row) => row.subject,
      render: (row) => (
        <span className="block min-w-0">
          <a href={ticketHref(row.id)} className="block truncate font-medium text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            {row.subject}
          </a>
          <span className="block truncate text-xs text-ink-muted">{row.lastMessagePreview}</span>
        </span>
      ),
    },
    {
      key: 'account',
      label: 'Account',
      className: 'w-[16%]',
      sortable: true,
      sortValue: (row) => row.accountName,
      render: (row) => (
        <span className="block min-w-0">
          <span className="block truncate font-medium text-ink">{row.accountName}</span>
          <span className="block truncate text-xs text-ink-muted">{row.accountEmail}</span>
        </span>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      className: 'w-[9%]',
      sortable: true,
      sortValue: (row) => row.priority,
      render: (row) => <PriorityBadge priority={row.priority} />,
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-[10%]',
      sortable: true,
      sortValue: (row) => row.status,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'assignee',
      label: 'Assignee',
      className: 'w-[13%]',
      sortable: true,
      sortValue: (row) => row.assignedToName ?? 'zzz',
      render: (row) => (
        row.assignedToName
          ? <span className="flex items-center gap-1.5"><Avatar name={row.assignedToName} size="xs" /><span className="truncate">{row.assignedToName}</span></span>
          : <span className="text-ink-muted">Unassigned</span>
      ),
    },
    {
      key: 'messages',
      label: 'Messages',
      className: 'w-[5%] text-center',
      headerClassName: 'text-center',
      sortable: true,
      sortValue: (row) => row.messageCount,
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-ink-muted">
          <MessageSquare aria-hidden="true" className="size-3.5" />
          {row.messageCount}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last reply',
      className: 'w-[13%] whitespace-nowrap text-ink-muted',
      sortable: true,
      sortValue: (row) => row.lastMessageAtLabel,
      render: (row) => row.lastMessageAtLabel,
    },
  ]

  function renderList() {
    if (filtered.length === 0) {
      return (
        <EmptyState
          title="No tickets match these filters"
          description="Try a different status or priority, or clear the filters to see every ticket."
          action={<Button onClick={onClearFilters}>Clear filters</Button>}
        />
      )
    }
    return (
      <DataTable
        rows={visibleRows}
        columns={columns}
        itemLabel={(row) => `${row.id}, ${row.subject}`}
        searchValue={q}
        onSearchChange={onQChange}
        searchLabel="Search tickets by id, subject, or account"
        searchPlaceholder="Search id, subject, or account"
        minTableWidthClassName="min-w-[72rem]"
        pagination={{ page: safePage, totalPages, totalItems: filtered.length, pageSize: PAGE_SIZE }}
        onPageChange={onPageChange}
      />
    )
  }

  return (
    <AdminShell user={user} navItems={navItems} activeModule={'support' as AdminModuleId} notifications={notifications} searchResults={searchResults}>
      <div className="grid gap-6 p-4 sm:p-6">
        <div>
          <h1 className="font-gowun text-3xl font-bold leading-tight text-ink">Support</h1>
          <p className="mt-1 text-sm text-ink-muted">Customer ticket queue. {summary.totalOpen} open tickets, {summary.resolvedToday} resolved today.</p>
        </div>

        {isLoading ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-24" />)}
            </div>
            <Skeleton className="h-96" />
          </>
        ) : errorMessage ? (
          <EmptyState
            title="Could not load tickets"
            description={errorMessage}
            action={onRetry ? <Button onClick={onRetry}>Try again</Button> : undefined}
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <article className="bg-surface p-4 shadow-panel">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Open tickets</h3>
                <p className="mt-2 font-gowun text-3xl font-bold leading-9 text-ink">{summary.openCount}</p>
                <p className="mt-1 text-xs text-ink-muted">Awaiting first response</p>
              </article>
              <article className="bg-surface p-4 shadow-panel">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">In progress</h3>
                <p className="mt-2 font-gowun text-3xl font-bold leading-9 text-ink">{summary.inProgressCount}</p>
                <p className="mt-1 text-xs text-ink-muted">Assigned and active</p>
              </article>
              <article className="bg-surface p-4 shadow-panel">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Waiting on customer</h3>
                <p className="mt-2 font-gowun text-3xl font-bold leading-9 text-ink">{summary.waitingCount}</p>
                <p className="mt-1 text-xs text-ink-muted">Pending user reply</p>
              </article>
              <article className="bg-surface p-4 shadow-panel">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">SLA compliance</h3>
                <p className="mt-2 font-gowun text-3xl font-bold leading-9 text-ink">{summary.slaCompliancePercent}%</p>
                <p className="mt-1 text-xs text-ink-muted">First response under {summary.avgFirstResponseMinutes} min avg</p>
              </article>
            </div>

            <div className="border-b border-border">
              <div role="tablist" aria-label="Ticket views" className="flex flex-wrap gap-1">
                {TABS.map((entry) => {
                  const count = tabCounts[entry.id] ?? 0
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
                      {count > 0 && entry.id !== 'all' ? (
                        <span className="rounded-pill bg-surface-subtle px-1.5 text-[11px] font-bold leading-5 text-ink-muted">
                          {count}
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <SelectField
                id="support-priority-filter"
                label="Priority"
                value={priority}
                onValueChange={(value) => onPriorityChange(value as AdminTicketPriorityFilter)}
                options={[
                  { value: 'all', label: 'Any priority' },
                  ...priorityFilterValues.filter((v) => v !== 'all').map((v) => ({ value: v, label: priorityLabels[v] })),
                ]}
                className="w-44"
              />
              <SelectField
                id="support-assignee-filter"
                label="Assignee"
                value={assignee}
                onValueChange={(value) => onAssigneeChange(value as AdminTicketAssigneeFilter)}
                options={[
                  { value: 'all', label: 'Anyone' },
                  { value: 'unassigned', label: 'Unassigned' },
                  { value: 'Daniel Okoye', label: 'Daniel Okoye' },
                  { value: 'Priya Raghunathan', label: 'Priya Raghunathan' },
                  { value: 'Rachel Adeyemi', label: 'Rachel Adeyemi' },
                ]}
                className="w-48"
              />
              <p className="ms-auto text-sm text-ink-muted">{filtered.length} of {tickets.length} shown</p>
            </div>

            {renderList()}
          </>
        )}
      </div>
    </AdminShell>
  )
}

export type AdminSupportTicketViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly ticket: AdminTicketDetail | null
  readonly ticketsHref: string
  readonly isLoading?: boolean
  readonly errorMessage?: string
  readonly onRetry?: () => void
}

export function AdminSupportTicketView({
  user,
  navItems,
  notifications,
  searchResults,
  ticket,
  ticketsHref,
  isLoading = false,
  errorMessage,
  onRetry,
}: AdminSupportTicketViewProps) {
  const [statusOverride, setStatusOverride] = useState<AdminTicketStatus | null>(null)
  const [assigneeOverride, setAssigneeOverride] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [localMessages, setLocalMessages] = useState<readonly AdminTicketMessage[]>([])
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false)
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  const status = statusOverride ?? ticket?.status ?? 'open'
  const assignee = assigneeOverride ?? ticket?.assignedToName ?? null
  const messages = ticket ? [...localMessages, ...ticket.messages] : []

  function handleSendReply() {
    if (!ticket || !replyText.trim()) return
    const newMessage: AdminTicketMessage = {
      id: `msg_local_${localMessages.length + 1}`,
      authorKind: 'admin',
      authorName: user.name,
      authorAvatar: null,
      body: replyText.trim(),
      timestampLabel: 'Just now',
    }
    setLocalMessages((prev) => [newMessage, ...prev])
    setReplyText('')
    setActionNotice('Reply sent.')
  }

  function handleResolve() {
    if (!ticket) return
    setStatusOverride('resolved')
    setResolveDialogOpen(false)
    setActionNotice('Ticket resolved.')
  }

  function handleClose() {
    if (!ticket) return
    setStatusOverride('closed')
    setStatusDialogOpen(false)
    setActionNotice('Ticket closed.')
  }

  function handleReopen() {
    if (!ticket) return
    setStatusOverride('open')
    setStatusDialogOpen(false)
    setActionNotice('Ticket reopened as open.')
  }

  if (isLoading) {
    return (
      <AdminShell user={user} navItems={navItems} activeModule={'support' as AdminModuleId} notifications={notifications} searchResults={searchResults}>
        <div className="grid gap-6 p-4 sm:p-6">
          <Skeleton className="h-24" />
          <Skeleton className="h-80" />
        </div>
      </AdminShell>
    )
  }

  if (errorMessage || !ticket) {
    return (
      <AdminShell user={user} navItems={navItems} activeModule={'support' as AdminModuleId} notifications={notifications} searchResults={searchResults}>
        <div className="grid gap-6 p-4 sm:p-6">
          <a href={ticketsHref} className="inline-flex min-h-9 w-fit items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <ArrowLeft aria-hidden="true" className="size-4" />
            All tickets
          </a>
          <h1 className="font-gowun text-3xl font-bold leading-tight text-ink">Ticket</h1>
          {errorMessage ? (
            <EmptyState title="Could not load this ticket" description={errorMessage} action={onRetry ? <Button onClick={onRetry}>Try again</Button> : undefined} />
          ) : (
            <EmptyState
              title="Ticket not found"
              description="This ticket id does not match any record. It may have been merged or deleted."
              action={<Button onClick={() => { window.location.href = ticketsHref }}>Back to tickets</Button>}
            />
          )}
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell user={user} navItems={navItems} activeModule={'support' as AdminModuleId} notifications={notifications} searchResults={searchResults}>
      <div className="grid gap-6 p-4 sm:p-6">
        <a href={ticketsHref} className="inline-flex min-h-9 w-fit items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <ArrowLeft aria-hidden="true" className="size-4" />
          All tickets
        </a>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-gowun text-2xl font-bold leading-tight text-ink">{ticket.subject}</h1>
              <span className="text-sm text-ink-muted">{ticket.id}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={status} />
              <PriorityBadge priority={ticket.priority} />
              {ticket.labels.map((label) => (
                <Badge key={label} variant="neutral" size="sm">{label}</Badge>
              ))}
              <span className="text-xs text-ink-muted">Created {ticket.createdAtLabel}</span>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {status === 'resolved' || status === 'closed' ? (
              <Button variant="secondary" onClick={() => { setStatusOverride('open'); setActionNotice('Ticket reopened as open.') }}>
                Reopen ticket
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setResolveDialogOpen(true)}>
                  <CheckCircle2 aria-hidden="true" className="size-4" />
                  Resolve
                </Button>
                <Button variant="ghost" onClick={() => setStatusDialogOpen(true)}>
                  <XCircle aria-hidden="true" className="size-4" />
                  Close
                </Button>
              </>
            )}
          </div>
        </div>

        <p aria-live="polite" className={cn('text-sm font-medium text-ink', actionNotice ? undefined : 'sr-only')}>
          {actionNotice}
        </p>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <section className="bg-surface shadow-panel" aria-label="Message thread">
            <h2 className="border-b border-border p-4 font-gowun text-lg font-bold text-ink sm:px-5">Conversation</h2>
            <div className="max-h-[32rem] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="p-4 text-sm text-ink-muted">No messages yet.</p>
              ) : (
                <ol className="grid gap-0">
                  {[...messages].reverse().map((msg) => (
                    <li key={msg.id} className="flex gap-3 border-b border-border p-4 last:border-b-0 sm:px-5">
                      {msg.authorKind === 'system' ? (
                        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-soft border border-border text-ink-muted">
                          <Clock aria-hidden="true" className="size-3.5" />
                        </span>
                      ) : (
                        <Avatar name={msg.authorName} size="sm" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-ink">{msg.authorName}</span>
                          {msg.authorKind === 'admin' ? <Badge variant="accent" size="sm">Admin</Badge> : null}
                          {msg.authorKind === 'system' ? <Badge variant="neutral" size="sm">System</Badge> : null}
                          <span className="text-xs text-ink-muted">{msg.timestampLabel}</span>
                        </p>
                        <p className="mt-1 text-sm leading-6 text-ink whitespace-pre-wrap">{msg.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {status !== 'resolved' && status !== 'closed' ? (
              <div className="border-t border-border p-4 sm:px-5">
                <label htmlFor="support-reply" className="sr-only">Reply to this ticket</label>
                <textarea
                  id="support-reply"
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-input bg-canvas p-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  placeholder="Type your reply..."
                />
                <div className="mt-2 flex justify-end">
                  <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                    <Send aria-hidden="true" className="size-4" />
                    Send reply
                  </Button>
                </div>
              </div>
            ) : null}
          </section>

          <div className="grid gap-4">
            <section className="bg-surface p-4 shadow-panel sm:p-5" aria-label="Linked account">
              <h2 className="font-gowun text-lg font-bold text-ink">Account</h2>
              <a href={ticket.account.accountHref} className="mt-2 block font-semibold text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                {ticket.account.name}
              </a>
              <p className="text-sm text-ink-muted">{ticket.account.email}</p>
              <dl className="mt-3 grid gap-1 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-muted">Plan</dt>
                  <dd className="text-ink">{ticket.account.planLabel}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-muted">Account id</dt>
                  <dd className="font-medium text-ink">{ticket.account.id}</dd>
                </div>
              </dl>
            </section>

            <section className="bg-surface p-4 shadow-panel sm:p-5" aria-label="Ticket details">
              <h2 className="font-gowun text-lg font-bold text-ink">Details</h2>
              <dl className="mt-3 grid gap-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-muted">Status</dt>
                  <dd><StatusBadge status={status} /></dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-muted">Priority</dt>
                  <dd><PriorityBadge priority={ticket.priority} /></dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-muted">Assignee</dt>
                  <dd className="text-ink">
                    {assignee ? (
                      <span className="flex items-center gap-1.5">
                        <Avatar name={assignee} size="xs" />
                        {assignee}
                      </span>
                    ) : (
                      <span className="text-ink-muted">Unassigned</span>
                    )}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-muted">Messages</dt>
                  <dd className="text-ink">{ticket.messages.length + localMessages.length}</dd>
                </div>
                <div className="flex justify-between gap-3 border-t border-border pt-2">
                  <dt className="text-ink-muted">Created</dt>
                  <dd className="text-ink">{ticket.createdAtLabel}</dd>
                </div>
              </dl>
              {status !== 'resolved' && status !== 'closed' ? (
                <div className="mt-3 border-t border-border pt-3">
                  <label htmlFor="support-assignee-select" className="block text-xs font-semibold text-ink-muted">Reassign to</label>
                  <select
                    id="support-assignee-select"
                    value={assignee ?? ''}
                    onChange={(event) => {
                      const value = event.target.value || null
                      setAssigneeOverride(value)
                      setActionNotice(value ? `Reassigned to ${value}.` : 'Unassigned ticket.')
                    }}
                    className="mt-1.5 w-full rounded-lg border border-input bg-canvas p-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    <option value="">Unassigned</option>
                    <option value="Daniel Okoye">Daniel Okoye</option>
                    <option value="Priya Raghunathan">Priya Raghunathan</option>
                    <option value="Rachel Adeyemi">Rachel Adeyemi</option>
                  </select>
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </div>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogPopup aria-labelledby="support-status-dialog-title">
          <DialogClose aria-label="Cancel" />
          <DialogTitle id="support-status-dialog-title">
            {status === 'closed' ? 'Reopen this ticket?' : 'Close this ticket?'}
          </DialogTitle>
          <DialogDescription>
            {status === 'closed'
              ? 'Reopening moves this ticket back to Open so it can be worked on again.'
              : 'Closing this ticket marks it as done. The customer will not be able to reply unless the ticket is reopened.'}
          </DialogDescription>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
            <Button variant={status === 'closed' ? 'primary' : 'danger'} onClick={status === 'closed' ? handleReopen : handleClose}>
              {status === 'closed' ? 'Reopen ticket' : 'Close ticket'}
            </Button>
          </div>
        </DialogPopup>
      </Dialog>

      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogPopup aria-labelledby="support-resolve-dialog-title">
          <DialogClose aria-label="Cancel" />
          <DialogTitle id="support-resolve-dialog-title">Resolve this ticket?</DialogTitle>
          <DialogDescription>
            Marking this ticket as resolved means the customer issue has been addressed. The ticket can be reopened later if needed.
          </DialogDescription>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setResolveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleResolve}>Resolve ticket</Button>
          </div>
        </DialogPopup>
      </Dialog>
    </AdminShell>
  )
}
