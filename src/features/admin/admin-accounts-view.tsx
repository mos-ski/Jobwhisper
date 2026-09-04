import { useState, type ReactNode } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Ban,
  CalendarPlus,
  CheckCircle2,
  Coins,
  Download,
  Eye,
  LogIn,
  MoreHorizontal,
  RefreshCw,
  ShieldCheck,
  UserPlus,
  UserX,
  Users,
} from 'lucide-react'

import type {
  AdminAccountAuditEntry,
  AdminAccountDetail,
  AdminAccountDetailTab,
  AdminAccountPlanFilter,
  AdminAccountRow,
  AdminAccountStatus,
  AdminAccountStatusFilter,
  AdminAccountsSummary,
  AdminActivityOutcome,
  AdminCreditEntry,
  AdminCreditEntryKind,
} from '@/contracts/admin-accounts.draft'
import type { AdminDoneForYouLead } from '@/contracts/admin-products.draft'
import type { AdminNavItem, AdminNotification, AdminPlanId, AdminSearchResult } from '@/contracts/admin.draft'
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
  formatUsd,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  ProgressBar,
  SelectField,
  Skeleton,
  StatCard,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextField,
  type BadgeVariant,
  type DataTableColumn,
} from '@/ui'

import { AdminShell } from './admin-shell'
import { contactPreferenceLabels, downloadLeadPacket, googleCalendarUrl, PACKAGE_LABELS, stageMeta } from './admin-products-view'

const PAGE_SIZE = 8

export type AdminAccountsListTab = 'subscribers' | 'dfy-clients'

const countFormatter = new Intl.NumberFormat('en-US')

function DfyClientsTab({ clients }: { readonly clients: readonly AdminDoneForYouLead[] }) {
  const [query, setQuery] = useState('')

  const rows = clients
    .map((lead) => ({ id: lead.id, lead }))
    .filter(({ lead }) => `${lead.userName} ${lead.userEmail}`.toLowerCase().includes(query.trim().toLowerCase()))

  const columns: readonly DataTableColumn<{ readonly id: string; readonly lead: AdminDoneForYouLead }>[] = [
    {
      key: 'client',
      label: 'Client',
      sortValue: ({ lead }) => lead.userName,
      render: ({ lead }) => (
        <span className="flex items-center gap-2">
          <Avatar name={lead.userName} size="sm" />
          <span className="min-w-0">
            <span className="block truncate font-semibold text-ink">{lead.userName}</span>
            <span className="block truncate text-xs text-ink-muted">{lead.userEmail}</span>
          </span>
        </span>
      ),
    },
    { key: 'package', label: 'Package', render: ({ lead }) => <span className="text-ink-muted">{PACKAGE_LABELS[lead.packageId] ?? lead.packageId}</span> },
    {
      key: 'contact',
      label: 'Contact',
      render: ({ lead }) => (
        <span className="block min-w-0">
          <span className="block text-ink">{contactPreferenceLabels[lead.contactPreference]}</span>
          {lead.contactNote ? <span className="block truncate text-xs text-ink-muted">{lead.contactNote}</span> : null}
        </span>
      ),
    },
    { key: 'signedUp', label: 'Signed up', sortValue: ({ lead }) => lead.signedUpLabel, render: ({ lead }) => <span className="whitespace-nowrap text-ink-muted">{lead.signedUpLabel}</span> },
    {
      key: 'stage',
      label: 'Stage',
      sortValue: ({ lead }) => lead.stage,
      render: ({ lead }) => {
        const meta = stageMeta[lead.stage]
        return <Badge variant={meta.variant} size="sm">{meta.label}</Badge>
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'w-16',
      headerClassName: 'text-end',
      sortable: false,
      hideInMobileDetail: true,
      render: ({ lead }) => {
        const canScheduleCall = lead.stage === 'new' || lead.stage === 'call'
        return (
          <span className="flex justify-end" onClick={(event) => event.stopPropagation()}>
            <Menu>
              <MenuTrigger
                aria-label={`Actions for ${lead.userName}`}
                className="grid size-11 place-items-center rounded-soft text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <MoreHorizontal aria-hidden="true" className="size-4" />
              </MenuTrigger>
              <MenuContent>
                {canScheduleCall ? (
                  <MenuItem icon={<CalendarPlus />}>
                    <a
                      href={googleCalendarUrl(lead)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    >
                      Schedule call
                    </a>
                  </MenuItem>
                ) : null}
                <MenuItem icon={<Download />} onClick={() => downloadLeadPacket(lead)}>
                  Download packet
                </MenuItem>
              </MenuContent>
            </Menu>
          </span>
        )
      },
    },
  ]

  const newCount = clients.filter((lead) => lead.stage === 'new').length
  const fulfillmentCount = clients.filter((lead) => lead.stage === 'call').length
  const completedCount = clients.filter((lead) => lead.stage === 'completed').length

  return (
    <div className="grid gap-6">
      <section aria-label="DFY client totals" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total DFY clients" value={countFormatter.format(clients.length)} icon={<Users />} />
        <StatCard label="New" value={countFormatter.format(newCount)} icon={<UserPlus />} />
        <StatCard label="In fulfillment" value={countFormatter.format(fulfillmentCount)} icon={<CalendarPlus />} />
        <StatCard label="Completed" value={countFormatter.format(completedCount)} icon={<CheckCircle2 />} />
      </section>

      {clients.length === 0 ? (
        <section className="bg-surface shadow-panel">
          <EmptyState title="No DFY clients yet" description="Everyone who signs up and pays for Done-For-You shows up here." />
        </section>
      ) : (
        <section aria-label="DFY clients" className="bg-surface shadow-panel">
          <DataTable
            bare
            selectable={false}
            className="p-4"
            columns={columns}
            rows={rows}
            itemLabel={({ lead }) => lead.userName}
            filterRow={() => true}
            searchValue={query}
            onSearchChange={setQuery}
            searchLabel="Search DFY clients by name or email"
            searchPlaceholder="Search name or email"
            minTableWidthClassName="min-w-[56rem]"
          />
        </section>
      )}
    </div>
  )
}

const planBadgeVariants: Record<AdminPlanId, BadgeVariant> = {
  starter: 'neutral',
  pro: 'accent',
  premium: 'info',
  unsubscribed: 'neutral',
}

const planShortLabels: Record<AdminPlanId, string> = {
  starter: 'Starter',
  pro: 'Pro',
  premium: 'Premium',
  unsubscribed: 'Unsubscribed',
}

type StatusMeta = {
  readonly label: string
  readonly variant: BadgeVariant
}

const statusMeta: Record<AdminAccountStatus, StatusMeta> = {
  active: { label: 'Active', variant: 'positive' },
  suspended: { label: 'Suspended', variant: 'danger' },
  pending: { label: 'Pending', variant: 'warning' },
}

function StatusBadge({ status }: { readonly status: AdminAccountStatus }) {
  const meta = statusMeta[status]
  return <Badge variant={meta.variant} size="sm">{meta.label}</Badge>
}

function PlanBadge({ plan, label }: { readonly plan: AdminPlanId; readonly label: string }) {
  return (
    <Badge variant={planBadgeVariants[plan]} size="sm" title={label}>
      {planShortLabels[plan]}
    </Badge>
  )
}

const statusFilterOptions = [
  { value: 'all', label: 'Any status' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'pending', label: 'Pending' },
]

const planFilterOptions = [
  { value: 'all', label: 'Any plan' },
  { value: 'starter', label: 'Starter · $47/mo' },
  { value: 'pro', label: 'Pro · $99/mo' },
  { value: 'premium', label: 'Premium · $197/mo' },
  { value: 'unsubscribed', label: 'Unsubscribed' },
]

function isStatusFilter(value: string): value is AdminAccountStatusFilter {
  return value === 'all' || value === 'active' || value === 'suspended' || value === 'pending'
}

function isPlanFilter(value: string): value is AdminAccountPlanFilter {
  return value === 'all' || value === 'starter' || value === 'pro' || value === 'premium' || value === 'unsubscribed'
}

function ErrorPanel({ message, onRetry }: { readonly message: string; readonly onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="bg-danger-surface p-6 text-center shadow-panel"
    >
      <AlertTriangle aria-hidden="true" className="mx-auto size-6 text-danger" />
      <p className="mt-3 text-sm font-semibold text-ink">Could not load accounts</p>
      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-ink-muted">{message}</p>
      {onRetry ? (
        <Button variant="secondary" leadingIcon={<RefreshCw aria-hidden="true" />} onClick={onRetry} className="mt-4">
          Try again
        </Button>
      ) : null}
    </div>
  )
}

export type AdminAccountsListViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly accounts: readonly AdminAccountRow[]
  readonly summary: AdminAccountsSummary
  /** Mirrored to the `tab` query param. */
  readonly tab: AdminAccountsListTab
  readonly onTabChange: (tab: AdminAccountsListTab) => void
  readonly dfyClients: readonly AdminDoneForYouLead[]
  /** Search term, mirrored to the `q` query param. */
  readonly q: string
  readonly onQChange: (value: string) => void
  /** Mirrored to the `status` query param. */
  readonly status: AdminAccountStatusFilter
  readonly onStatusChange: (value: AdminAccountStatusFilter) => void
  /** Mirrored to the `plan` query param. */
  readonly plan: AdminAccountPlanFilter
  readonly onPlanChange: (value: AdminAccountPlanFilter) => void
  /** Mirrored to the `page` query param, 1-based. */
  readonly page: number
  readonly onPageChange: (page: number) => void
  readonly onClearFilters: () => void
  readonly accountHref: (accountId: string) => string
  readonly onImpersonate?: (account: AdminAccountRow) => void
  readonly onSuspend?: (account: AdminAccountRow) => void
  readonly onReinstate?: (account: AdminAccountRow) => void
  readonly isLoading?: boolean
  readonly errorMessage?: string
  readonly onRetry?: () => void
}

export function AdminAccountsListView({
  user,
  navItems,
  notifications,
  searchResults,
  accounts,
  summary,
  tab,
  onTabChange,
  dfyClients,
  q,
  onQChange,
  status,
  onStatusChange,
  plan,
  onPlanChange,
  page,
  onPageChange,
  onClearFilters,
  accountHref,
  onImpersonate,
  onSuspend,
  onReinstate,
  isLoading = false,
  errorMessage,
  onRetry,
}: AdminAccountsListViewProps) {
  // Nothing persists in this mock, so a confirmed suspension is held here to show the resulting row state.
  const [statusOverrides, setStatusOverrides] = useState<Readonly<Record<string, AdminAccountStatus>>>({})
  const [pendingStatusChange, setPendingStatusChange] = useState<AdminAccountRow | null>(null)
  const [pendingImpersonation, setPendingImpersonation] = useState<AdminAccountRow | null>(null)
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  function resolveStatus(row: AdminAccountRow): AdminAccountStatus {
    return statusOverrides[row.id] ?? row.status
  }

  const trimmedQuery = q.trim().toLowerCase()
  const filtered = accounts.filter((row) => {
    const rowStatus = resolveStatus(row)
    if (status !== 'all' && rowStatus !== status) return false
    if (plan !== 'all' && row.plan !== plan) return false
    if (!trimmedQuery) return true
    return `${row.name} ${row.email} ${row.id}`.toLowerCase().includes(trimmedQuery)
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const visibleRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const hasFilters = trimmedQuery.length > 0 || status !== 'all' || plan !== 'all'
  const isFirstRun = accounts.length === 0
  const isNoResults = !isFirstRun && filtered.length === 0

  function confirmStatusChange() {
    const row = pendingStatusChange
    if (!row) return
    const next: AdminAccountStatus = resolveStatus(row) === 'suspended' ? 'active' : 'suspended'
    setStatusOverrides((prev) => ({ ...prev, [row.id]: next }))
    if (next === 'suspended') onSuspend?.(row)
    else onReinstate?.(row)
    setActionNotice(
      next === 'suspended'
        ? `${row.name} is now suspended. Sessions in progress were ended.`
        : `${row.name} is active again and can start new sessions.`,
    )
    setPendingStatusChange(null)
  }

  function confirmImpersonation() {
    const row = pendingImpersonation
    if (!row) return
    setPendingImpersonation(null)
    onImpersonate?.(row)
  }

  function rowMenu(row: AdminAccountRow) {
    const rowStatus = resolveStatus(row)
    return (
      <Menu>
        <MenuTrigger
          aria-label={`Actions for ${row.name}`}
          className="grid size-11 place-items-center rounded-soft text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <MoreHorizontal aria-hidden="true" className="size-4" />
        </MenuTrigger>
        <MenuContent>
          <MenuItem icon={<Eye />}>
            <a
              href={accountHref(row.id)}
              className="flex-1 rounded-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              View account
            </a>
          </MenuItem>
          <MenuItem icon={<LogIn />} onClick={() => setPendingImpersonation(row)}>
            Log in as user
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            icon={rowStatus === 'suspended' ? <ShieldCheck /> : <Ban />}
            variant={rowStatus === 'suspended' ? 'default' : 'danger'}
            onClick={() => setPendingStatusChange(row)}
          >
            {rowStatus === 'suspended' ? 'Reinstate account' : 'Suspend account'}
          </MenuItem>
        </MenuContent>
      </Menu>
    )
  }

  const columns: readonly DataTableColumn<AdminAccountRow>[] = [
    {
      key: 'name',
      label: 'Name',
      className: 'w-[22%]',
      sortValue: (row) => row.name,
      render: (row) => (
        <span className="flex min-w-0 items-center gap-2.5">
          <Avatar name={row.name} size="sm" />
          <a
            href={accountHref(row.id)}
            title={row.name}
            className="min-w-0 truncate font-semibold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {row.name}
          </a>
        </span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      className: 'w-[24%] text-ink-muted',
      sortValue: (row) => row.email,
      render: (row) => (
        <span className="block truncate" title={row.email}>
          {row.email}
        </span>
      ),
    },
    {
      key: 'plan',
      label: 'Plan',
      className: 'w-[12%]',
      sortValue: (row) => row.planLabel,
      render: (row) => <PlanBadge plan={row.plan} label={row.planLabel} />,
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-[12%]',
      sortValue: (row) => resolveStatus(row),
      render: (row) => <StatusBadge status={resolveStatus(row)} />,
    },
    {
      key: 'credits',
      label: 'Credits left',
      className: 'w-[12%] tabular-nums',
      sortValue: (row) => row.creditsRemaining,
      render: (row) => (
        <span className="whitespace-nowrap">
          {countFormatter.format(row.creditsRemaining)}
          <span className="text-ink-muted"> / {countFormatter.format(row.creditsAllowance)}</span>
        </span>
      ),
    },
    {
      key: 'signedUp',
      label: 'Signed up',
      className: 'w-[10%] whitespace-nowrap text-ink-muted',
      sortValue: (row) => row.signedUp,
      render: (row) => row.signedUp,
    },
    {
      key: 'lastActive',
      label: 'Last active',
      className: 'w-[10%] whitespace-nowrap text-ink-muted',
      sortValue: (row) => row.lastActive,
      render: (row) => row.lastActive,
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'w-16',
      headerClassName: 'text-end',
      sortable: false,
      hideInMobileDetail: true,
      render: (row) => (
        <span className="flex justify-end" onClick={(event) => event.stopPropagation()}>
          {rowMenu(row)}
        </span>
      ),
    },
  ]

  const pendingStatusIsSuspend = pendingStatusChange ? resolveStatus(pendingStatusChange) !== 'suspended' : false

  return (
    <AdminShell
      user={user}
      navItems={navItems}
      activeModule="accounts"
      notifications={notifications}
      searchResults={searchResults}
    >
      <div className="grid gap-6 p-4 sm:p-6">
        <div>
          <h1 className="font-gowun text-3xl font-bold leading-tight text-ink">Accounts</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {countFormatter.format(summary.totalAccounts)} accounts on the platform. This table lists the{' '}
            {countFormatter.format(accounts.length)} most recently active.
          </p>
        </div>

        <Tabs value={tab} onValueChange={(value) => { if (value === 'subscribers' || value === 'dfy-clients') onTabChange(value) }}>
          <TabsList aria-label="Account sections">
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="dfy-clients">DFY Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="subscribers">
            <div className="grid gap-6">
        <section aria-label="Account totals" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-24" />)
          ) : (
            <>
              <StatCard label="Total accounts" value={countFormatter.format(summary.totalAccounts)} icon={<Users />} />
              <StatCard
                label="Active subscribers"
                value={countFormatter.format(summary.activeSubscribers)}
                icon={<ShieldCheck />}
              />
              <StatCard label="Suspended" value={countFormatter.format(summary.suspended)} icon={<UserX />} />
              <StatCard label="New this week" value={countFormatter.format(summary.newThisWeek)} icon={<UserPlus />} />
            </>
          )}
        </section>

        <p aria-live="polite" className={cn('text-sm font-medium text-ink', actionNotice ? undefined : 'sr-only')}>
          {actionNotice}
        </p>

        {errorMessage ? (
          <ErrorPanel message={errorMessage} onRetry={onRetry} />
        ) : isFirstRun && !isLoading ? (
          <section className="bg-surface shadow-panel">
            <EmptyState
              icon={<Users />}
              title="No accounts yet"
              description="Nobody has signed up on this environment. Accounts appear here the moment someone creates one, or you can invite a teammate to test the flow."
              action={
                <Button leadingIcon={<UserPlus aria-hidden="true" />} onClick={onClearFilters}>
                  Invite a test user
                </Button>
              }
            />
          </section>
        ) : (
          <section aria-label="All accounts" className="bg-surface shadow-panel">
            <div className="flex flex-wrap items-end gap-3 border-b border-border p-4">
              <div className="min-w-[10rem] flex-1 sm:max-w-[14rem]">
                <SelectField
                  id="accounts-status-filter"
                  label="Status"
                  options={statusFilterOptions}
                  value={status}
                  onValueChange={(value) => {
                    if (isStatusFilter(value)) onStatusChange(value)
                  }}
                />
              </div>
              <div className="min-w-[10rem] flex-1 sm:max-w-[14rem]">
                <SelectField
                  id="accounts-plan-filter"
                  label="Plan"
                  options={planFilterOptions}
                  value={plan}
                  onValueChange={(value) => {
                    if (isPlanFilter(value)) onPlanChange(value)
                  }}
                />
              </div>
              <div className="flex flex-1 items-center justify-end gap-3">
                <p className="text-sm text-ink-muted">
                  {countFormatter.format(filtered.length)} of {countFormatter.format(accounts.length)} shown
                </p>
                {hasFilters ? (
                  <Button variant="secondary" size="sm" onClick={onClearFilters} className="min-h-11">
                    Clear filters
                  </Button>
                ) : null}
              </div>
            </div>

            {isNoResults && !isLoading ? (
              <div className="border-b border-border bg-warning-surface px-4 py-3">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-warning">
                  <AlertTriangle aria-hidden="true" className="size-4 shrink-0" />
                  No accounts match this search and filter combination.
                </p>
              </div>
            ) : null}

            <DataTable
              bare
              selectable={false}
              className="p-4"
              columns={columns}
              rows={visibleRows}
              itemLabel={(row) => row.name}
              filterRow={() => true}
              searchValue={q}
              onSearchChange={onQChange}
              searchLabel="Search accounts by name, email, or account id"
              searchPlaceholder="Search name, email, or account id"
              minTableWidthClassName="min-w-[68rem]"
              loading={isLoading}
              pagination={{
                page: safePage,
                totalPages,
                totalItems: filtered.length,
                pageSize: PAGE_SIZE,
              }}
              onPageChange={onPageChange}
              onRowClick={(row) => {
                window.location.href = accountHref(row.id)
              }}
              rowActions={(row) => (
                <>
                  <a
                    href={accountHref(row.id)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-input bg-surface px-4 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    <Eye aria-hidden="true" className="size-4" />
                    View account
                  </a>
                  <Button variant="secondary" onClick={() => setPendingImpersonation(row)}>
                    Log in as user
                  </Button>
                  <Button
                    variant={resolveStatus(row) === 'suspended' ? 'secondary' : 'danger'}
                    onClick={() => setPendingStatusChange(row)}
                  >
                    {resolveStatus(row) === 'suspended' ? 'Reinstate' : 'Suspend'}
                  </Button>
                </>
              )}
            />
          </section>
        )}
            </div>
          </TabsContent>

          <TabsContent value="dfy-clients">
            <DfyClientsTab clients={dfyClients} />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog
        open={pendingStatusChange !== null}
        onOpenChange={(open) => {
          if (!open) setPendingStatusChange(null)
        }}
      >
        <DialogPopup aria-labelledby="accounts-status-dialog-title">
          <DialogClose aria-label="Cancel" />
          <DialogTitle id="accounts-status-dialog-title">
            {pendingStatusIsSuspend ? 'Suspend this account?' : 'Reinstate this account?'}
          </DialogTitle>
          <DialogDescription>
            {pendingStatusChange
              ? pendingStatusIsSuspend
                ? `${pendingStatusChange.name} (${pendingStatusChange.email}) will be signed out, any Copilot or Prep session in progress ends immediately, and the ${planShortLabels[pendingStatusChange.plan]} renewal is paused. Their ${countFormatter.format(pendingStatusChange.creditsRemaining)} remaining credits are kept, not refunded.`
                : `${pendingStatusChange.name} (${pendingStatusChange.email}) can sign in again straight away, the ${planShortLabels[pendingStatusChange.plan]} renewal resumes on the next billing date, and their ${countFormatter.format(pendingStatusChange.creditsRemaining)} credits become spendable again.`
              : null}
          </DialogDescription>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setPendingStatusChange(null)}>
              Cancel
            </Button>
            <Button variant={pendingStatusIsSuspend ? 'danger' : 'primary'} onClick={confirmStatusChange}>
              {pendingStatusIsSuspend ? 'Suspend account' : 'Reinstate account'}
            </Button>
          </div>
        </DialogPopup>
      </Dialog>

      <Dialog
        open={pendingImpersonation !== null}
        onOpenChange={(open) => {
          if (!open) setPendingImpersonation(null)
        }}
      >
        <DialogPopup aria-labelledby="accounts-impersonate-dialog-title">
          <DialogClose aria-label="Cancel" />
          <DialogTitle id="accounts-impersonate-dialog-title">Log in as this user?</DialogTitle>
          <DialogDescription>
            {pendingImpersonation
              ? `You will see ${pendingImpersonation.name}'s account exactly as they see it, in read-only mode. You cannot start sessions, spend credits, or change settings on their behalf. The impersonation is written to this account's audit log under your name.`
              : null}
          </DialogDescription>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setPendingImpersonation(null)}>
              Cancel
            </Button>
            <Button leadingIcon={<LogIn aria-hidden="true" />} onClick={confirmImpersonation}>
              Open read-only view
            </Button>
          </div>
        </DialogPopup>
      </Dialog>
    </AdminShell>
  )
}

const creditKindMeta: Record<AdminCreditEntryKind, { readonly label: string; readonly variant: BadgeVariant }> = {
  grant: { label: 'Grant', variant: 'info' },
  spend: { label: 'Spend', variant: 'neutral' },
  refund: { label: 'Refund', variant: 'positive' },
  'top-up': { label: 'Top-up', variant: 'accent' },
}

const activityOutcomeMeta: Record<AdminActivityOutcome, { readonly variant: BadgeVariant }> = {
  completed: { variant: 'positive' },
  'in-progress': { variant: 'accent' },
  failed: { variant: 'danger' },
  cancelled: { variant: 'neutral' },
}

const creditReasonOptions = [
  { value: 'goodwill', label: 'Goodwill credit' },
  { value: 'session-failure', label: 'Session failure' },
  { value: 'billing-correction', label: 'Billing correction' },
  { value: 'support-resolution', label: 'Support resolution' },
  { value: 'migration', label: 'Migration adjustment' },
]

function Panel({ title, description, children, action }: {
  readonly title: string
  readonly description?: string
  readonly children: ReactNode
  readonly action?: ReactNode
}) {
  return (
    <section className="bg-surface p-4 shadow-panel sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-gowun text-lg font-bold text-ink">{title}</h2>
          {description ? <p className="mt-1 text-sm text-ink-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function DetailSkeleton() {
  return (
    <div className="grid gap-6 p-4 sm:p-6">
      <Skeleton className="h-24" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-56" />
        <Skeleton className="h-56" />
        <Skeleton className="h-56" />
      </div>
      <Skeleton className="h-96" />
    </div>
  )
}

export type AdminAccountDetailViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  /** Null once loading finishes means the id in the URL matched nothing. */
  readonly account: AdminAccountDetail | null
  readonly accountsHref: string
  /** Mirrored to the `tab` query param. */
  readonly tab: AdminAccountDetailTab
  readonly onTabChange: (tab: AdminAccountDetailTab) => void
  /** Mirrored to the `impersonating` query param. */
  readonly impersonating: boolean
  readonly onStartImpersonation: () => void
  readonly onExitImpersonation: () => void
  readonly isLoading?: boolean
  readonly errorMessage?: string
  readonly onRetry?: () => void
}

export function AdminAccountDetailView({
  user,
  navItems,
  notifications,
  searchResults,
  account,
  accountsHref,
  tab,
  onTabChange,
  impersonating,
  onStartImpersonation,
  onExitImpersonation,
  isLoading = false,
  errorMessage,
  onRetry,
}: AdminAccountDetailViewProps) {
  const [statusOverride, setStatusOverride] = useState<AdminAccountStatus | null>(null)
  const [creditDelta, setCreditDelta] = useState(0)
  const [addedCreditEntries, setAddedCreditEntries] = useState<readonly AdminCreditEntry[]>([])
  const [addedAuditEntries, setAddedAuditEntries] = useState<readonly AdminAccountAuditEntry[]>([])
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [impersonateDialogOpen, setImpersonateDialogOpen] = useState(false)
  const [creditsDialogOpen, setCreditsDialogOpen] = useState(false)
  const [creditAmount, setCreditAmount] = useState('')
  const [creditReason, setCreditReason] = useState('goodwill')
  const [creditNote, setCreditNote] = useState('')
  const [creditError, setCreditError] = useState<string | undefined>(undefined)
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  const canManageCredits = user.permissions.includes('admin:credits:manage')

  const status = statusOverride ?? account?.status ?? 'active'
  const isSuspended = status === 'suspended'
  const creditsRemaining = (account?.creditsRemaining ?? 0) + creditDelta
  const creditHistory = account ? [...addedCreditEntries, ...account.creditHistory] : []
  const auditLog = account ? [...addedAuditEntries, ...account.auditLog] : []

  function confirmStatusChange() {
    if (!account) return
    const next: AdminAccountStatus = isSuspended ? 'active' : 'suspended'
    setStatusOverride(next)
    setAddedAuditEntries((prev) => [
      {
        id: `aud_local_${prev.length + 1}`,
        adminName: user.name,
        action: next === 'suspended' ? 'suspended this account' : 'reinstated this account',
        detail:
          next === 'suspended'
            ? 'Suspended from the account detail screen. Sessions in progress were ended.'
            : 'Reinstated from the account detail screen. Billing resumes on the next renewal date.',
        occurredAt: 'Just now',
      },
      ...prev,
    ])
    setActionNotice(
      next === 'suspended'
        ? `${account.name} is now suspended.`
        : `${account.name} is active again.`,
    )
    setStatusDialogOpen(false)
  }

  function confirmCreditAdjustment() {
    if (!account) return
    const parsed = Number(creditAmount)
    if (!creditAmount.trim() || !Number.isInteger(parsed) || parsed === 0) {
      setCreditError('Enter a whole number of credits. Use a negative number to remove credits.')
      return
    }
    if (creditsRemaining + parsed < 0) {
      setCreditError(`This would take the balance below zero. The account holds ${countFormatter.format(creditsRemaining)} credits.`)
      return
    }
    const reasonLabel = creditReasonOptions.find((option) => option.value === creditReason)?.label ?? 'Adjustment'
    const nextBalance = creditsRemaining + parsed
    setCreditDelta((prev) => prev + parsed)
    setAddedCreditEntries((prev) => [
      {
        id: `cr_local_${prev.length + 1}`,
        kind: parsed > 0 ? 'grant' : 'spend',
        description: creditNote.trim() ? `${reasonLabel}, ${creditNote.trim()}` : reasonLabel,
        product: null,
        productLabel: 'Wallet',
        amountCredits: parsed,
        balanceAfter: nextBalance,
        occurredAt: 'Just now',
        actor: user.name,
      },
      ...prev,
    ])
    setAddedAuditEntries((prev) => [
      {
        id: `aud_local_credit_${prev.length + 1}`,
        adminName: user.name,
        action: parsed > 0 ? `granted ${countFormatter.format(parsed)} credits` : `removed ${countFormatter.format(Math.abs(parsed))} credits`,
        detail: creditNote.trim() ? `${reasonLabel}. ${creditNote.trim()}` : reasonLabel,
        occurredAt: 'Just now',
      },
      ...prev,
    ])
    setActionNotice(
      `Balance adjusted by ${parsed > 0 ? '+' : ''}${countFormatter.format(parsed)} credits. New balance ${countFormatter.format(nextBalance)}.`,
    )
    setCreditAmount('')
    setCreditNote('')
    setCreditError(undefined)
    setCreditsDialogOpen(false)
  }

  if (isLoading) {
    return (
      <AdminShell
        user={user}
        navItems={navItems}
        activeModule="accounts"
        notifications={notifications}
        searchResults={searchResults}
      >
        <DetailSkeleton />
      </AdminShell>
    )
  }

  if (errorMessage || !account) {
    return (
      <AdminShell
        user={user}
        navItems={navItems}
        activeModule="accounts"
        notifications={notifications}
        searchResults={searchResults}
      >
        <div className="grid gap-6 p-4 sm:p-6">
          <a
            href={accountsHref}
            className="inline-flex w-fit min-h-11 items-center gap-1.5 rounded-soft text-sm font-semibold text-accent-text underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            All accounts
          </a>
          <h1 className="font-gowun text-3xl font-bold leading-tight text-ink">Account</h1>
          {errorMessage ? (
            <ErrorPanel message={errorMessage} onRetry={onRetry} />
          ) : (
            <section className="bg-surface shadow-panel">
              <EmptyState
                icon={<Users />}
                title="Account not found"
                description="This account id does not exist, or the account was permanently deleted after a data-removal request."
                action={
                  <a
                    href={accountsHref}
                    className="inline-flex min-h-9 items-center justify-center rounded-lg border border-input px-4 text-sm font-semibold text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    Back to all accounts
                  </a>
                }
              />
            </section>
          )}
        </div>
      </AdminShell>
    )
  }

  const creditsPercent = account.creditsAllowance > 0 ? Math.round((creditsRemaining / account.creditsAllowance) * 100) : 0

  return (
    <AdminShell
      user={user}
      navItems={navItems}
      activeModule="accounts"
      notifications={notifications}
      searchResults={searchResults}
    >
      {impersonating ? (
        <div className="sticky top-14 z-shell border-b-2 border-warning bg-warning-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <p className="flex items-center gap-2 text-sm font-bold text-warning">
              <Eye aria-hidden="true" className="size-4 shrink-0" />
              You are viewing as {account.name}. Read only, no action you take here reaches their account.
            </p>
            <Button variant="secondary" size="sm" className="min-h-11" onClick={onExitImpersonation}>
              Exit read-only view
            </Button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 p-4 sm:p-6">
        <a
          href={accountsHref}
          className="inline-flex w-fit min-h-11 items-center gap-1.5 rounded-soft text-sm font-semibold text-accent-text underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          All accounts
        </a>

        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <Avatar name={account.name} size="xl" />
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-semibold leading-tight text-ink">{account.name}</h1>
              <p className="mt-1 break-all text-sm text-ink-muted">{account.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <PlanBadge plan={account.plan} label={account.planLabel} />
                <StatusBadge status={status} />
                <span className="text-xs text-ink-muted">Joined {account.joinedOn}</span>
                <span className="text-xs text-ink-muted">Last active {account.lastActive}</span>
              </div>
              <p className="mt-2 text-xs text-ink-muted">
                Account id <span className="font-medium text-ink">{account.id}</span> · {account.location} ·
                targeting {account.targetRole}
              </p>
            </div>
          </div>

          {impersonating ? (
            <p className="max-w-xs text-sm text-ink-muted">
              Admin actions are hidden while you are viewing as this user. Exit the read-only view to suspend the
              account or adjust credits.
            </p>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={isSuspended ? 'primary' : 'danger'}
                leadingIcon={isSuspended ? <ShieldCheck aria-hidden="true" /> : <Ban aria-hidden="true" />}
                onClick={() => setStatusDialogOpen(true)}
              >
                {isSuspended ? 'Reinstate' : 'Suspend'}
              </Button>
              <Button
                variant="secondary"
                leadingIcon={<LogIn aria-hidden="true" />}
                onClick={() => setImpersonateDialogOpen(true)}
              >
                Log in as user
              </Button>
              <Button
                variant="secondary"
                leadingIcon={<Coins aria-hidden="true" />}
                disabled={!canManageCredits}
                aria-describedby={canManageCredits ? undefined : 'adjust-credits-permission'}
                onClick={() => setCreditsDialogOpen(true)}
              >
                Adjust credits
              </Button>
            </div>
          )}
        </header>

        {!canManageCredits && !impersonating ? (
          <p id="adjust-credits-permission" className="text-sm text-ink-muted">
            Adjusting credits needs the <span className="font-medium text-ink">admin:credits:manage</span> permission,
            which your account does not have. A workspace owner can grant it in Systems, Admins.
          </p>
        ) : null}

        <p aria-live="polite" className={cn('text-sm font-medium text-ink', actionNotice ? undefined : 'sr-only')}>
          {actionNotice}
        </p>

        {isSuspended ? (
          <div role="status" className="bg-danger-surface p-4">
            <p className="flex items-start gap-2 text-sm font-bold text-danger">
              <Ban aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              This account is suspended{account.suspendedOn ? ` since ${account.suspendedOn}` : ''}.
            </p>
            <p className="mt-1 ps-6 text-sm leading-6 text-ink">
              {account.suspensionReason ??
                'The user cannot sign in, no sessions can start, and the subscription renewal is paused. Credits on the balance are kept.'}
            </p>
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-3">
          <Panel title="Subscription" description={account.subscription.planLabel}>
            <dl className="mt-3 grid gap-2 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Price</dt>
                <dd className="font-semibold text-ink">
                  {account.subscription.priceCents > 0
                    ? `${formatUsd(account.subscription.priceCents)} ${account.subscription.billingPeriodLabel}`
                    : 'No charge'}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Started</dt>
                <dd className="text-ink">{account.subscription.startedOn}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Renews on</dt>
                <dd className="text-ink">
                  {isSuspended ? 'Paused while suspended' : account.subscription.renewsOn ?? 'Does not renew'}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Payment method</dt>
                <dd className="text-end text-ink">
                  {account.subscription.paymentMethodLabel}
                  <span className="block text-xs text-ink-muted">{account.subscription.paymentMethodExpiry}</span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-t border-border pt-2">
                <dt className="text-ink-muted">Lifetime value</dt>
                <dd className="font-semibold text-ink">
                  {formatUsd(account.subscription.lifetimeValueCents)}
                  <span className="block text-xs font-normal text-ink-muted">
                    {account.subscription.invoiceCount} invoices
                  </span>
                </dd>
              </div>
            </dl>
          </Panel>

          <Panel title="Credit balance" description={`Resets ${account.creditsResetsOn}`}>
            <p className="mt-3 font-gowun text-3xl font-bold leading-9 text-ink">{countFormatter.format(creditsRemaining)}</p>
            <p className="text-sm text-ink-muted">
              of {countFormatter.format(account.creditsAllowance)} credits this cycle, 1 credit is 1 minute of Copilot
            </p>
            <ProgressBar
              className="mt-3"
              value={creditsRemaining}
              max={account.creditsAllowance}
              label="Credits remaining"
              showValue
              color={creditsPercent < 15 ? 'warning' : 'accent'}
            />
            {creditsPercent < 15 ? (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-warning">
                <AlertTriangle aria-hidden="true" className="size-3.5 shrink-0" />
                Below 15 percent of the cycle allowance
              </p>
            ) : null}
          </Panel>

          <Panel title="Usage by product" description="Current billing cycle unless noted">
            <ul className="mt-3 divide-y divide-border">
              {account.usage.map((row) => (
                <li key={row.id} className="flex items-baseline justify-between gap-3 py-2">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">{row.label}</span>
                    <span className="block text-xs text-ink-muted">{row.detail}</span>
                  </span>
                  <span className="shrink-0 text-end">
                    <span className="block text-sm font-bold tabular-nums text-ink">
                      {countFormatter.format(row.value)}
                    </span>
                    <span className="block text-xs text-ink-muted">{row.unit}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <section className="bg-surface p-4 shadow-panel sm:p-5" aria-label="Account records">
          <Tabs value={tab} onValueChange={(value) => onTabChange(value as AdminAccountDetailTab)}>
            <TabsList>
              <TabsTrigger value="credits" className="min-h-11">Credit history</TabsTrigger>
              <TabsTrigger value="activity" className="min-h-11">Activity</TabsTrigger>
              <TabsTrigger value="audit" className="min-h-11">Audit log</TabsTrigger>
            </TabsList>

            <TabsContent value="credits">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[52rem] border-collapse text-sm">
                  <caption className="pb-3 text-start text-sm text-ink-muted">
                    Every credit movement on this account, newest first.
                  </caption>
                  <thead>
                    <tr className="border-b border-border bg-surface-subtle text-ink-muted">
                      <th scope="col" className="px-3 py-2.5 text-start font-semibold">Date</th>
                      <th scope="col" className="px-3 py-2.5 text-start font-semibold">Type</th>
                      <th scope="col" className="px-3 py-2.5 text-start font-semibold">Description</th>
                      <th scope="col" className="px-3 py-2.5 text-start font-semibold">Product</th>
                      <th scope="col" className="px-3 py-2.5 text-end font-semibold">Credits</th>
                      <th scope="col" className="px-3 py-2.5 text-end font-semibold">Balance</th>
                      <th scope="col" className="px-3 py-2.5 text-start font-semibold">By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditHistory.map((entry) => (
                      <tr key={entry.id} className="border-b border-border last:border-b-0">
                        <td className="whitespace-nowrap px-3 py-2.5 text-ink-muted">{entry.occurredAt}</td>
                        <td className="px-3 py-2.5">
                          <Badge variant={creditKindMeta[entry.kind].variant} size="sm">
                            {creditKindMeta[entry.kind].label}
                          </Badge>
                        </td>
                        <td className="px-3 py-2.5 text-ink">{entry.description}</td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-ink-muted">{entry.productLabel}</td>
                        <td
                          className={cn(
                            'whitespace-nowrap px-3 py-2.5 text-end font-semibold tabular-nums',
                            entry.amountCredits < 0 ? 'text-ink' : 'text-positive',
                          )}
                        >
                          {entry.amountCredits > 0 ? '+' : ''}
                          {countFormatter.format(entry.amountCredits)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-end tabular-nums text-ink">
                          {countFormatter.format(entry.balanceAfter)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-ink-muted">{entry.actor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              {account.activity.length === 0 ? (
                <EmptyState
                  icon={<Activity />}
                  title="No product activity yet"
                  description="This account has signed up but has not started a Copilot session, a Prep session, an Auto Apply run, or a resume."
                />
              ) : (
                <ol className="relative grid gap-0">
                  {account.activity.map((event) => (
                    <li key={event.id} className="flex gap-3 border-b border-border py-3 last:border-b-0">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 size-2 shrink-0 rounded-pill bg-accent"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-ink">{event.title}</span>
                          <Badge variant="neutral" size="sm">{event.productLabel}</Badge>
                          <Badge variant={activityOutcomeMeta[event.outcome].variant} size="sm">
                            {event.outcomeLabel}
                          </Badge>
                        </p>
                        <p className="mt-1 text-sm leading-6 text-ink-muted">{event.detail}</p>
                      </div>
                      <p className="shrink-0 whitespace-nowrap text-xs text-ink-muted">{event.occurredAt}</p>
                    </li>
                  ))}
                </ol>
              )}
            </TabsContent>

            <TabsContent value="audit">
              <p className="text-sm text-ink-muted">
                Admin actions taken on this account. The platform-wide log lives in Systems.
              </p>
              <ol className="mt-3 grid gap-0">
                {auditLog.map((entry) => (
                  <li key={entry.id} className="flex flex-wrap gap-x-3 gap-y-1 border-b border-border py-3 last:border-b-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink">
                        <span className="font-semibold">{entry.adminName}</span> {entry.action}
                      </p>
                      <p className="mt-0.5 text-sm leading-6 text-ink-muted">{entry.detail}</p>
                    </div>
                    <p className="shrink-0 whitespace-nowrap text-xs text-ink-muted">{entry.occurredAt}</p>
                  </li>
                ))}
              </ol>
            </TabsContent>
          </Tabs>
        </section>
      </div>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogPopup aria-labelledby="account-status-dialog-title">
          <DialogClose aria-label="Cancel" />
          <DialogTitle id="account-status-dialog-title">
            {isSuspended ? 'Reinstate this account?' : 'Suspend this account?'}
          </DialogTitle>
          <DialogDescription>
            {isSuspended
              ? `${account.name} (${account.email}) can sign in again straight away, the ${account.subscription.planLabel} renewal resumes on ${account.subscription.renewsOn ?? 'the next billing date'}, and their ${countFormatter.format(creditsRemaining)} credits become spendable again.`
              : `${account.name} (${account.email}) will be signed out, any Copilot or Prep session in progress ends immediately, and the ${account.subscription.planLabel} renewal is paused. Their ${countFormatter.format(creditsRemaining)} remaining credits are kept, not refunded. This is written to the audit log under your name.`}
          </DialogDescription>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant={isSuspended ? 'primary' : 'danger'} onClick={confirmStatusChange}>
              {isSuspended ? 'Reinstate account' : 'Suspend account'}
            </Button>
          </div>
        </DialogPopup>
      </Dialog>

      <Dialog open={impersonateDialogOpen} onOpenChange={setImpersonateDialogOpen}>
        <DialogPopup aria-labelledby="account-impersonate-dialog-title">
          <DialogClose aria-label="Cancel" />
          <DialogTitle id="account-impersonate-dialog-title">Log in as {account.name}?</DialogTitle>
          <DialogDescription>
            This opens a read-only view of {account.name}&apos;s account. You can see their sessions, documents, and
            balance exactly as they do, but you cannot start a session, spend credits, or change a setting on their
            behalf. The impersonation is recorded in this account&apos;s audit log under your name.
          </DialogDescription>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setImpersonateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              leadingIcon={<LogIn aria-hidden="true" />}
              onClick={() => {
                setImpersonateDialogOpen(false)
                setAddedAuditEntries((prev) => [
                  {
                    id: `aud_local_impersonate_${prev.length + 1}`,
                    adminName: user.name,
                    action: 'logged in as this user',
                    detail: 'Read-only impersonation opened from the account detail screen.',
                    occurredAt: 'Just now',
                  },
                  ...prev,
                ])
                onStartImpersonation()
              }}
            >
              Open read-only view
            </Button>
          </div>
        </DialogPopup>
      </Dialog>

      <Dialog
        open={creditsDialogOpen}
        onOpenChange={(open) => {
          setCreditsDialogOpen(open)
          if (!open) setCreditError(undefined)
        }}
      >
        <DialogPopup aria-labelledby="account-credits-dialog-title">
          <DialogClose aria-label="Cancel" />
          <DialogTitle id="account-credits-dialog-title">Adjust credit balance</DialogTitle>
          <DialogDescription>
            {account.name} holds {countFormatter.format(creditsRemaining)} credits. A positive number adds credits, a
            negative number removes them. The change is applied immediately and written to the credit history and the
            audit log under your name.
          </DialogDescription>
          <form
            className="mt-4 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              confirmCreditAdjustment()
            }}
          >
            <TextField
              id="credit-adjust-amount"
              label="Credits to add or remove"
              type="number"
              step={1}
              inputMode="numeric"
              placeholder="250"
              value={creditAmount}
              onChange={(event) => {
                setCreditAmount(event.target.value)
                setCreditError(undefined)
              }}
              error={creditError}
            />
            <SelectField
              id="credit-adjust-reason"
              label="Reason"
              options={creditReasonOptions}
              value={creditReason}
              onValueChange={setCreditReason}
            />
            <TextField
              id="credit-adjust-note"
              label="Note for the audit log (optional)"
              placeholder="Ticket #48213, audio dropped mid-session"
              value={creditNote}
              onChange={(event) => setCreditNote(event.target.value)}
            />
            <div className="flex flex-wrap justify-end gap-3">
              <Button variant="secondary" onClick={() => setCreditsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" leadingIcon={<Coins aria-hidden="true" />}>
                Apply adjustment
              </Button>
            </div>
          </form>
        </DialogPopup>
      </Dialog>
    </AdminShell>
  )
}
