import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  BellOff,
  ChevronDown,
  Info,
  Mail,
  MessageSquare,
  Monitor,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  UserX,
} from 'lucide-react'

import type {
  AdminAuditActionType,
  AdminAuditActor,
  AdminAuditEntry,
  AdminAuditFilters,
  AdminAuditRange,
  AdminAuditResult,
  AdminNotificationChannel,
  AdminNotificationSetting,
  AdminPermissionDescriptor,
  AdminSystemsTab,
  AdminTeamMember,
  AdminTeamMemberStatus,
  AdminTeamRole,
} from '@/contracts/admin-systems.draft'
import type { AdminNavItem, AdminNotification, AdminSearchResult } from '@/contracts/admin.draft'
import type { Permission, UserIdentity } from '@/contracts/identity'
import {
  Badge,
  Button,
  Checkbox,
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
  Switch,
  TextField,
  type BadgeVariant,
  type DataTableColumn,
} from '@/ui'

import { AdminShell } from './admin-shell'

const AUDIT_PAGE_SIZE = 12

const statusMeta: Record<AdminTeamMemberStatus, { readonly label: string; readonly variant: BadgeVariant }> = {
  active: { label: 'Active', variant: 'positive' },
  invited: { label: 'Invited', variant: 'warning' },
  suspended: { label: 'Suspended', variant: 'danger' },
}

const roleLabels: Record<AdminTeamRole, string> = {
  admin: 'Admin',
  support: 'Support',
}

const channelMeta: Record<AdminNotificationChannel, { readonly label: string; readonly Icon: typeof Mail }> = {
  'in-app': { label: 'In-app', Icon: Monitor },
  email: { label: 'Email', Icon: Mail },
  slack: { label: 'Slack', Icon: MessageSquare },
}

const TABS: readonly { readonly id: AdminSystemsTab; readonly label: string }[] = [
  { id: 'team', label: 'Team' },
  { id: 'audit', label: 'Audit log' },
  { id: 'notifications', label: 'Notifications' },
]

function ResultBadge({ result }: { readonly result: AdminAuditResult }) {
  const denied = result === 'denied'
  return (
    <span className={cn('inline-flex items-center rounded-pill border px-2 py-0.5 text-xs font-semibold', denied ? 'border-danger text-danger' : 'border-positive text-positive')}>
      {denied ? 'Denied' : 'Success'}
    </span>
  )
}

export type AdminSystemsViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly tab: AdminSystemsTab
  readonly onTabChange: (tab: AdminSystemsTab) => void
  readonly teamMembers: readonly AdminTeamMember[]
  readonly permissionCatalog: readonly AdminPermissionDescriptor[]
  readonly auditEntries: readonly AdminAuditEntry[]
  readonly auditActionTypes: readonly AdminAuditActionType[]
  readonly auditActors: readonly AdminAuditActor[]
  readonly auditRanges: readonly AdminAuditRange[]
  readonly auditFilters: AdminAuditFilters
  readonly onAuditFiltersChange: (next: Partial<AdminAuditFilters>) => void
  readonly onClearAuditFilters: () => void
  readonly auditPage: number
  readonly onAuditPageChange: (page: number) => void
  readonly notificationSettings: readonly AdminNotificationSetting[]
  readonly notificationFeed: readonly AdminNotification[]
  readonly isLoading?: boolean
  readonly errorMessage?: string
  readonly onRetry?: () => void
}

export function AdminSystemsView({
  user,
  navItems,
  notifications,
  searchResults,
  tab,
  onTabChange,
  teamMembers,
  permissionCatalog,
  auditEntries,
  auditActionTypes,
  auditActors,
  auditRanges,
  auditFilters,
  onAuditFiltersChange,
  onClearAuditFilters,
  auditPage,
  onAuditPageChange,
  notificationSettings,
  notificationFeed,
  isLoading = false,
  errorMessage,
  onRetry,
}: AdminSystemsViewProps) {
  // Nothing persists in this mock, so confirmed changes are held locally to show the resulting state.
  const [revokedIds, setRevokedIds] = useState<readonly string[]>([])
  const [pendingRevoke, setPendingRevoke] = useState<AdminTeamMember | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<AdminTeamRole>('support')
  const [invitePermissions, setInvitePermissions] = useState<readonly Permission[]>([])
  const [inviteTouched, setInviteTouched] = useState(false)
  const [channelOverrides, setChannelOverrides] = useState<Readonly<Record<string, Readonly<Record<AdminNotificationChannel, boolean>>>>>({})
  const [readOverrides, setReadOverrides] = useState<readonly string[]>([])
  const [expandedAuditId, setExpandedAuditId] = useState<string | null>(null)

  const canManageAdmins = user.permissions.includes('admin:users:manage')

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail.trim())
  const inviteEmailError = inviteTouched && !emailValid ? 'Enter a valid work email, for example alex@jobwhisper.org.' : undefined
  const invitePermissionError = inviteTouched && invitePermissions.length === 0 ? 'Pick at least one permission, an invite with none cannot sign in.' : undefined

  function channelsFor(setting: AdminNotificationSetting): Readonly<Record<AdminNotificationChannel, boolean>> {
    return channelOverrides[setting.id] ?? setting.channels
  }

  const silencedCount = notificationSettings.filter((setting) => {
    const channels = channelsFor(setting)
    return !channels['in-app'] && !channels.email && !channels.slack
  }).length

  const filteredAudit = useMemo(() => {
    const range = auditRanges.find((entry) => entry.id === auditFilters.range)
    const needle = auditFilters.query.trim().toLowerCase()
    return auditEntries.filter((entry) => {
      if (auditFilters.actorId !== 'all' && entry.actorId !== auditFilters.actorId) return false
      if (auditFilters.actionType !== 'all' && entry.actionType !== auditFilters.actionType) return false
      if (auditFilters.result !== 'all' && entry.result !== auditFilters.result) return false
      if (range?.maxDaysAgo !== null && range !== undefined && entry.daysAgo > range.maxDaysAgo) return false
      if (!needle) return true
      return `${entry.actorName} ${entry.action} ${entry.detail} ${entry.targetLabel}`.toLowerCase().includes(needle)
    })
  }, [auditEntries, auditFilters, auditRanges])

  const auditTotalPages = Math.max(1, Math.ceil(filteredAudit.length / AUDIT_PAGE_SIZE))
  const safeAuditPage = Math.min(Math.max(auditPage, 1), auditTotalPages)
  const visibleAudit = filteredAudit.slice((safeAuditPage - 1) * AUDIT_PAGE_SIZE, safeAuditPage * AUDIT_PAGE_SIZE)

  const permissionLabelById = new Map(permissionCatalog.map((entry) => [entry.id, entry.label]))

  function renderMemberAction(row: AdminTeamMember) {
    if (revokedIds.includes(row.id)) return <span className="text-xs text-ink-muted">Access revoked</span>
    if (row.id === user.id) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
          <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0" />
          You cannot revoke your own access
        </span>
      )
    }
    return (
      <button
        type="button"
        onClick={() => setPendingRevoke(row)}
        disabled={!canManageAdmins}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-danger hover:bg-danger-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-40"
      >
        <UserX aria-hidden="true" className="size-4" />
        Revoke
      </button>
    )
  }

  const teamColumns: readonly DataTableColumn<AdminTeamMember>[] = [
    {
      key: 'name',
      label: 'Member',
      sortable: true,
      sortValue: (row) => row.name,
      render: (row) => (
        <span className="block min-w-0">
          <span className="block truncate font-medium text-ink">{row.name}{row.id === user.id ? <span className="ms-1.5 text-xs font-normal text-ink-muted">(you)</span> : null}</span>
          <span className="block truncate text-xs text-ink-muted">{row.email}</span>
        </span>
      ),
    },
    { key: 'role', label: 'Role', sortable: true, sortValue: (row) => row.role, render: (row) => <Badge variant={row.role === 'admin' ? 'accent' : 'neutral'} size="sm">{roleLabels[row.role]}</Badge> },
    {
      key: 'permissions',
      label: 'Permissions',
      render: (row) => (
        <span className="flex flex-wrap gap-1">
          {row.permissions.filter((permission) => permission.startsWith('admin:')).map((permission) => (
            <Badge key={permission} variant="neutral" size="sm">{permissionLabelById.get(permission) ?? permission}</Badge>
          ))}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      sortValue: (row) => row.status,
      render: (row) => {
        const revoked = revokedIds.includes(row.id)
        const meta = revoked ? statusMeta.suspended : statusMeta[row.status]
        return <Badge variant={meta.variant} size="sm">{revoked ? 'Revoked' : meta.label}</Badge>
      },
    },
    { key: 'lastActive', label: 'Last active', render: (row) => <span className="whitespace-nowrap text-ink-muted">{row.lastActive}</span> },
    {
      key: 'added',
      label: 'Added',
      render: (row) => (
        <span className="block min-w-0">
          <span className="block whitespace-nowrap text-ink">{row.addedOn}</span>
          <span className="block truncate text-xs text-ink-muted">by {row.addedBy}</span>
        </span>
      ),
    },
    { key: 'actions', label: 'Actions', hideInMobileDetail: true, render: (row) => renderMemberAction(row) },
  ]

  function renderTeam() {
    return (
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">{teamMembers.length} people can sign in to this console.</p>
          <Button onClick={() => { setInviteTouched(false); setInviteEmail(''); setInvitePermissions([]); setInviteOpen(true) }} disabled={!canManageAdmins} leadingIcon={<UserPlus aria-hidden="true" />}>
            Invite admin
          </Button>
        </div>
        {!canManageAdmins ? (
          <p role="status" className="inline-flex items-center gap-2 bg-surface-subtle px-4 py-3 text-sm text-ink-muted">
            <Info aria-hidden="true" className="size-4 shrink-0" />
            You can view the team but not change it. Inviting or revoking an admin needs the “Manage users” permission.
          </p>
        ) : null}
        <DataTable
          rows={teamMembers}
          columns={teamColumns}
          itemLabel={(row) => `${row.name}, ${row.email}`}
          minTableWidthClassName="min-w-[64rem]"
          rowActions={(row) => renderMemberAction(row)}
        />
      </div>
    )
  }

  function renderAudit() {
    return (
      <div className="grid gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <SelectField
            id="audit-actor" label="Actor" className="w-44"
            value={auditFilters.actorId}
            onValueChange={(value) => onAuditFiltersChange({ actorId: value })}
            options={[{ value: 'all', label: 'Any admin' }, ...auditActors.map((actor) => ({ value: actor.id, label: actor.name }))]}
          />
          <SelectField
            id="audit-action" label="Action" className="w-48"
            value={auditFilters.actionType}
            onValueChange={(value) => onAuditFiltersChange({ actionType: value as AdminAuditFilters['actionType'] })}
            options={[{ value: 'all', label: 'Any action' }, ...auditActionTypes.map((entry) => ({ value: entry.id, label: entry.label }))]}
          />
          <SelectField
            id="audit-result" label="Result" className="w-40"
            value={auditFilters.result}
            onValueChange={(value) => onAuditFiltersChange({ result: value as AdminAuditFilters['result'] })}
            options={[{ value: 'all', label: 'Any result' }, { value: 'success', label: 'Success' }, { value: 'denied', label: 'Denied' }]}
          />
          <SelectField
            id="audit-range" label="Date range" className="w-44"
            value={auditFilters.range}
            onValueChange={(value) => onAuditFiltersChange({ range: value as AdminAuditFilters['range'] })}
            options={auditRanges.map((range) => ({ value: range.id, label: range.label }))}
          />
          <p className="ms-auto text-sm text-ink-muted">{filteredAudit.length} of {auditEntries.length} entries</p>
        </div>

        {filteredAudit.length === 0 ? (
          <EmptyState
            title="No audit entries match these filters"
            description="Widen the date range or clear the filters to see the full history."
            action={<Button onClick={onClearAuditFilters}>Clear filters</Button>}
          />
        ) : (
          <>
            <TextField
              id="audit-search"
              label="Search the audit log"
              placeholder="Search actor, action, or target"
              value={auditFilters.query}
              onChange={(event) => onAuditFiltersChange({ query: event.target.value })}
            />
            <ul className="overflow-hidden bg-surface shadow-panel">
              {visibleAudit.map((entry) => {
                const expanded = expandedAuditId === entry.id
                const detailRows = entry.changes ?? entry.affectedRecord
                return (
                  <li key={entry.id} className="border-b border-border last:border-b-0">
                    <div className="flex flex-wrap items-start gap-3 p-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-ink">{entry.action}</p>
                          <ResultBadge result={entry.result} />
                        </div>
                        <p className="mt-1 text-sm leading-6 text-ink-muted">{entry.detail}</p>
                        <p className="mt-1 text-xs text-ink-muted">
                          {entry.timestamp} · {entry.actorName} · {entry.ipAddress} ·{' '}
                          {entry.targetHref ? (
                            <a href={entry.targetHref} className="text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">{entry.targetLabel}</a>
                          ) : entry.targetLabel}
                        </p>
                        {entry.missingPermission ? (
                          <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-danger">
                            <ShieldAlert aria-hidden="true" className="size-3.5" />
                            Missing permission: {permissionLabelById.get(entry.missingPermission) ?? entry.missingPermission}
                          </p>
                        ) : null}
                      </div>
                      {detailRows && detailRows.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => setExpandedAuditId(expanded ? null : entry.id)}
                          aria-expanded={expanded}
                          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-input px-3 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                        >
                          {expanded ? 'Hide' : entry.changes ? 'What changed' : 'Record'}
                          <ChevronDown aria-hidden="true" className={cn('size-4 transition-transform duration-normal ease-default motion-reduce:transition-none', expanded && 'rotate-180')} />
                        </button>
                      ) : null}
                    </div>
                    {expanded && detailRows ? (
                      <div className="border-t border-border bg-surface-subtle p-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr>
                              <th scope="col" className="pb-2 text-start text-xs font-semibold uppercase tracking-wide text-ink-muted">Field</th>
                              <th scope="col" className="pb-2 text-start text-xs font-semibold uppercase tracking-wide text-ink-muted">{entry.changes ? 'Before' : 'Value'}</th>
                              {entry.changes ? <th scope="col" className="pb-2 text-start text-xs font-semibold uppercase tracking-wide text-ink-muted">After</th> : null}
                            </tr>
                          </thead>
                          <tbody>
                            {detailRows.map((change) => (
                              <tr key={change.field} className="border-t border-border">
                                <th scope="row" className="py-1.5 pe-4 text-start font-medium text-ink">{change.field}</th>
                                <td className="py-1.5 pe-4 text-ink-muted">{change.before}</td>
                                {entry.changes ? <td className="py-1.5 font-semibold text-ink">{change.after}</td> : null}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ul>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink">
              <p>Showing {(safeAuditPage - 1) * AUDIT_PAGE_SIZE + 1} – {Math.min(safeAuditPage * AUDIT_PAGE_SIZE, filteredAudit.length)} of {filteredAudit.length}</p>
              <div className="flex items-center gap-3">
                <Button variant="secondary" disabled={safeAuditPage <= 1} onClick={() => onAuditPageChange(safeAuditPage - 1)}>Previous</Button>
                <span aria-current="page">Page {safeAuditPage} of {auditTotalPages}</span>
                <Button variant="secondary" disabled={safeAuditPage >= auditTotalPages} onClick={() => onAuditPageChange(safeAuditPage + 1)}>Next</Button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  function renderNotifications() {
    const groups = Array.from(new Set(notificationSettings.map((setting) => setting.group)))
    const unread = notificationFeed.filter((item) => !readOverrides.includes(item.id) && item.unread)

    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="grid gap-4">
          {silencedCount > 0 ? (
            <p role="status" className="inline-flex items-start gap-2 bg-warning-surface px-4 py-3 text-sm font-semibold text-warning">
              <BellOff aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              {silencedCount} notification {silencedCount === 1 ? 'type is' : 'types are'} fully silenced, no one will be told when they happen.
            </p>
          ) : null}

          {groups.map((group) => {
            const settings = notificationSettings.filter((setting) => setting.group === group)
            return (
              <section key={group} className="bg-surface shadow-panel" aria-label={settings[0]?.groupLabel ?? group}>
                <h2 className="border-b border-border p-4 font-gowun text-lg font-bold text-ink sm:px-5">{settings[0]?.groupLabel ?? group}</h2>
                <ul>
                  {settings.map((setting) => {
                    const channels = channelsFor(setting)
                    return (
                      <li key={setting.id} className="border-b border-border p-4 last:border-b-0 sm:px-5">
                        <p className="text-sm font-semibold text-ink">{setting.label}</p>
                        <p className="mt-0.5 text-sm leading-6 text-ink-muted">{setting.description}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
                          {(Object.keys(channelMeta) as AdminNotificationChannel[]).map((channel) => {
                            const meta = channelMeta[channel]
                            return (
                              <label key={channel} className="inline-flex min-h-11 items-center gap-2 text-sm text-ink">
                                <Switch
                                  checked={channels[channel]}
                                  onCheckedChange={(next) => setChannelOverrides((prev) => ({ ...prev, [setting.id]: { ...channels, [channel]: next } }))}
                                  aria-label={`${meta.label} for ${setting.label}`}
                                />
                                <meta.Icon aria-hidden="true" className="size-4 text-ink-muted" />
                                {meta.label}
                              </label>
                            )
                          })}
                        </div>
                        {setting.threshold ? (
                          <p className="mt-3 text-sm text-ink-muted">
                            Triggers above <span className="font-semibold text-ink">{setting.threshold.value}</span> {setting.threshold.unit}.
                          </p>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
        </div>

        <section className="bg-surface shadow-panel" aria-label="Recent notifications">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-4 sm:px-5">
            <h2 className="font-gowun text-lg font-bold text-ink">Recent</h2>
            <button
              type="button"
              onClick={() => setReadOverrides(notificationFeed.map((item) => item.id))}
              disabled={unread.length === 0}
              className="min-h-9 rounded-soft px-2 text-sm font-semibold text-accent-text underline underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-40 disabled:no-underline"
            >
              Mark all read
            </button>
          </div>
          {notificationFeed.length === 0 ? (
            <div className="p-4 sm:p-5">
              <EmptyState title="Nothing yet" description="When a rule above fires, the notification lands here." />
            </div>
          ) : (
            <ul className="max-h-[32rem] overflow-y-auto">
              {notificationFeed.map((item) => {
                const isUnread = item.unread && !readOverrides.includes(item.id)
                return (
                  <li key={item.id} className="border-b border-border last:border-b-0">
                    <div className="flex items-start gap-2 p-4 sm:px-5">
                      <span aria-hidden="true" className={cn('mt-1.5 size-2 shrink-0 rounded-pill', isUnread ? 'bg-accent' : 'bg-transparent')} />
                      <div className="min-w-0 flex-1">
                        <a href={item.href} className="block text-sm font-semibold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                          {item.title}
                          {isUnread ? <span className="sr-only"> (unread)</span> : null}
                        </a>
                        <p className="mt-0.5 text-xs leading-5 text-ink-muted">{item.detail}</p>
                        <p className="mt-1 text-[11px] text-ink-muted">{item.timeAgo}</p>
                      </div>
                      {isUnread ? (
                        <button
                          type="button"
                          onClick={() => setReadOverrides((prev) => [...prev, item.id])}
                          className="min-h-9 shrink-0 rounded-soft px-2 text-xs font-semibold text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                        >
                          Mark read
                        </button>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    )
  }

  return (
    <AdminShell user={user} navItems={navItems} activeModule="systems" notifications={notifications} searchResults={searchResults}>
      <div className="grid gap-6 p-4 sm:p-6">
        <div>
          <h1 className="font-gowun text-3xl font-bold leading-tight text-ink">Systems</h1>
          <p className="mt-1 text-sm text-ink-muted">Who can use this console, everything they have done, and what the platform tells you about.</p>
        </div>

        <div className="border-b border-border">
          <div role="tablist" aria-label="Systems sections" className="flex flex-wrap gap-1">
            {TABS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                role="tab"
                aria-selected={entry.id === tab}
                onClick={() => onTabChange(entry.id)}
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

        {isLoading ? (
          <>
            <Skeleton className="h-12" />
            <Skeleton className="h-96" />
          </>
        ) : errorMessage ? (
          <div role="alert" className="bg-danger-surface p-6 text-center shadow-panel">
            <AlertTriangle aria-hidden="true" className="mx-auto size-6 text-danger" />
            <p className="mt-3 text-sm font-semibold text-ink">Could not load systems data</p>
            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-ink-muted">{errorMessage}</p>
            {onRetry ? <Button variant="secondary" leadingIcon={<RefreshCw aria-hidden="true" />} onClick={onRetry} className="mt-4">Try again</Button> : null}
          </div>
        ) : tab === 'team' ? renderTeam() : tab === 'audit' ? renderAudit() : renderNotifications()}
      </div>

      <Dialog open={pendingRevoke !== null} onOpenChange={(open) => { if (!open) setPendingRevoke(null) }}>
        <DialogPopup aria-label="Confirm revoking console access">
          <DialogTitle>Revoke {pendingRevoke?.name}&apos;s access?</DialogTitle>
          <DialogDescription>
            {pendingRevoke?.name} ({pendingRevoke?.email}) loses every admin permission immediately and is signed out of this console. Their past actions stay in the audit log.
          </DialogDescription>
          {pendingRevoke ? (
            <ul className="mt-4 flex flex-wrap gap-1">
              {pendingRevoke.permissions.filter((permission) => permission.startsWith('admin:')).map((permission) => (
                <li key={permission}><Badge variant="neutral" size="sm">{permissionLabelById.get(permission) ?? permission}</Badge></li>
              ))}
            </ul>
          ) : null}
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <DialogClose className="static inline-flex min-h-9 items-center rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              Cancel
            </DialogClose>
            <Button
              variant="danger"
              onClick={() => {
                if (pendingRevoke) setRevokedIds((prev) => [...prev, pendingRevoke.id])
                setPendingRevoke(null)
              }}
            >
              Revoke access
            </Button>
          </div>
        </DialogPopup>
      </Dialog>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogPopup aria-label="Invite an admin">
          <DialogTitle>Invite an admin</DialogTitle>
          <DialogDescription>They receive an email invite and pick their own password. Permissions can be changed later.</DialogDescription>
          <div className="mt-4 grid gap-4">
            <TextField
              id="invite-email"
              label="Work email"
              type="email"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
              error={inviteEmailError}
              placeholder="alex@jobwhisper.org"
            />
            <SelectField
              id="invite-role"
              label="Role"
              value={inviteRole}
              onValueChange={(value) => setInviteRole(value as AdminTeamRole)}
              options={[{ value: 'support', label: 'Support' }, { value: 'admin', label: 'Admin' }]}
            />
            <fieldset>
              <legend className="text-sm font-semibold text-ink">Permissions</legend>
              <p className="mt-0.5 text-xs text-ink-muted">Pick what this person can do. Sensitive permissions are marked.</p>
              <ul className="mt-2 grid gap-2">
                {permissionCatalog.filter((entry) => entry.group === 'console').map((entry) => {
                  const checked = invitePermissions.includes(entry.id)
                  return (
                    <li key={entry.id}>
                      <label className="flex min-h-11 items-start gap-2.5">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(next) => setInvitePermissions((prev) => (next ? [...prev, entry.id] : prev.filter((value) => value !== entry.id)))}
                          className="mt-0.5"
                        />
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-ink">
                            {entry.label}
                            {entry.sensitive ? <Badge variant="warning" size="sm">Sensitive</Badge> : null}
                          </span>
                          <span className="block text-xs leading-5 text-ink-muted">{entry.description}</span>
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
              <p aria-live="polite" className={cn('mt-1 text-xs', invitePermissionError ? 'text-danger' : 'text-ink-muted')}>
                {invitePermissionError ?? `${invitePermissions.length} selected.`}
              </p>
            </fieldset>
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <DialogClose className="static inline-flex min-h-9 items-center rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              Cancel
            </DialogClose>
            <Button
              onClick={() => {
                setInviteTouched(true)
                if (emailValid && invitePermissions.length > 0) setInviteOpen(false)
              }}
            >
              Send invite
            </Button>
          </div>
        </DialogPopup>
      </Dialog>
    </AdminShell>
  )
}
