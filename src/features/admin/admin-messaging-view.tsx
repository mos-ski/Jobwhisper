import { useState } from 'react'
import { AlertTriangle, Eye, MousePointerClick, Paperclip, Pencil, Plus, RefreshCw, Send, Trash2 } from 'lucide-react'

import type { AdminBroadcast, AdminMessagingTab } from '@/contracts/admin-messaging.draft'
import { audienceSegmentLabels } from '@/contracts/admin-messaging.draft'
import type { AdminModuleId, AdminNavItem, AdminNotification, AdminSearchResult } from '@/contracts/admin.draft'
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
  Skeleton,
  StatCard,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type DataTableColumn,
  type BadgeVariant,
} from '@/ui'

import { AdminShell } from './admin-shell'
import { AdminMessagingCompose } from './admin-messaging-compose'
import { BroadcastPreview } from './broadcast-preview'

export type AdminMessagingViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly tab: AdminMessagingTab
  readonly onTabChange: (tab: AdminMessagingTab) => void
  readonly broadcasts: readonly AdminBroadcast[]
  readonly metrics: {
    readonly totalSent: number
    readonly deliveryRate: number
    readonly seenRate: number
    readonly clickRate: number
  }
  readonly isLoading?: boolean
  readonly errorMessage?: string
  readonly onRetry?: () => void
}

const statusBadge: Record<AdminBroadcast['status'], BadgeVariant> = {
  draft: 'neutral',
  scheduled: 'info',
  sending: 'warning',
  sent: 'positive',
  failed: 'danger',
}

const channelIcons: Record<string, React.ReactNode> = {
  email: <Send aria-hidden="true" className="size-3" />,
  'in-app': <Eye aria-hidden="true" className="size-3" />,
  both: <Paperclip aria-hidden="true" className="size-3" />,
}

export function AdminMessagingView({
  user,
  navItems,
  notifications,
  searchResults,
  tab,
  onTabChange,
  broadcasts,
  metrics,
  isLoading,
  errorMessage,
  onRetry,
}: AdminMessagingViewProps) {
  const [composeOpen, setComposeOpen] = useState(false)
  const [detailBroadcast, setDetailBroadcast] = useState<AdminBroadcast | null>(null)

  const filtered = tab === 'all' ? broadcasts : broadcasts.filter((b) => b.status === tab)

  function handleSave(broadcast: AdminBroadcast) {
    // In a real app this would update state / refetch
    void broadcast
  }

  const columns: readonly DataTableColumn<AdminBroadcast>[] = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      sortValue: (r) => r.title,
      render: (r) => <span className="font-medium text-ink">{r.title}</span>,
    },
    {
      key: 'audience',
      label: 'Audience',
      sortable: true,
      sortValue: (r) => audienceSegmentLabels[r.audience],
      render: (r) => <span className="text-sm text-ink-muted">{audienceSegmentLabels[r.audience]}</span>,
    },
    {
      key: 'channel',
      label: 'Channel',
      sortable: true,
      sortValue: (r) => r.channel,
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 text-sm capitalize text-ink-muted">
          {channelIcons[r.channel]}
          {r.channel}
        </span>
      ),
    },
    {
      key: 'sentAt',
      label: 'Sent',
      sortable: true,
      sortValue: (r) => r.sentAt ?? r.scheduledAt ?? '',
      render: (r) => <span className="text-sm text-ink-muted">{r.sentAt ?? r.scheduledAt ?? '—'}</span>,
    },
    {
      key: 'delivered',
      label: 'Delivered',
      sortable: true,
      sortValue: (r) => r.metrics.delivered,
      render: (r) => <span className="text-sm tabular-nums text-ink">{r.metrics.delivered.toLocaleString()}</span>,
    },
    {
      key: 'seen',
      label: 'Seen',
      sortable: true,
      sortValue: (r) => r.metrics.seen,
      render: (r) => <span className="text-sm tabular-nums text-ink">{r.metrics.seen.toLocaleString()}</span>,
    },
    {
      key: 'clicked',
      label: 'Clicked',
      sortable: true,
      sortValue: (r) => r.metrics.clicked,
      render: (r) => <span className="text-sm tabular-nums text-ink">{r.metrics.clicked.toLocaleString()}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => <Badge variant={statusBadge[r.status]} size="sm">{r.status}</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      hideInMobileDetail: true,
      render: (r) => (
        <span className="flex gap-1">
          <button type="button" onClick={() => setDetailBroadcast(r)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <Pencil aria-hidden="true" className="size-3.5" />View
          </button>
        </span>
      ),
    },
  ]

  return (
    <AdminShell user={user} navItems={navItems} activeModule={'messaging' as unknown as AdminModuleId} notifications={notifications} searchResults={searchResults}>
      <div className="grid gap-6 p-4 sm:p-6">
        <div>
          <h1 className="font-gowun text-3xl font-bold leading-tight text-ink">Messaging</h1>
          <p className="mt-1 text-sm text-ink-muted">Send broadcast messages to users via email and in-app notifications.</p>
        </div>

        {isLoading ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
            <Skeleton className="h-96" />
          </>
        ) : errorMessage ? (
          <div role="alert" className="bg-danger-surface p-6 text-center shadow-panel">
            <AlertTriangle aria-hidden="true" className="mx-auto size-6 text-danger" />
            <p className="mt-3 text-sm font-semibold text-ink">Could not load messaging data</p>
            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-ink-muted">{errorMessage}</p>
            {onRetry ? <Button variant="secondary" leadingIcon={<RefreshCw aria-hidden="true" />} onClick={onRetry} className="mt-4">Try again</Button> : null}
          </div>
        ) : (
          <>
            {/* Metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total Sent" value={metrics.totalSent} icon={<Send aria-hidden="true" />} />
              <StatCard label="Delivery Rate" value={`${metrics.deliveryRate}%`} icon={<Send aria-hidden="true" />} delta={{ value: 2.1, direction: 'up' }} />
              <StatCard label="Seen Rate" value={`${metrics.seenRate}%`} icon={<Eye aria-hidden="true" />} delta={{ value: 4.3, direction: 'up' }} />
              <StatCard label="Click Rate" value={`${metrics.clickRate}%`} icon={<MousePointerClick aria-hidden="true" />} delta={{ value: 1.2, direction: 'up' }} />
            </div>

            {/* Tabs + table */}
            <Tabs value={tab} onValueChange={(v) => onTabChange(v as AdminMessagingTab)}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <TabsList>
                  {(['all', 'sent', 'draft', 'scheduled', 'failed'] as const).map((t) => (
                    <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>
                  ))}
                </TabsList>
                <Button onClick={() => setComposeOpen(true)} leadingIcon={<Plus aria-hidden="true" />}>Send New Broadcast</Button>
              </div>
              <TabsContent value={tab}>
                <DataTable
                  rows={filtered}
                  columns={columns}
                  itemLabel={(r) => r.title}
                  onRowClick={(r) => setDetailBroadcast(r)}
                  minTableWidthClassName="min-w-[64rem]"
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Compose dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogPopup aria-label="Create broadcast" className="sm:max-w-4xl">
          <DialogTitle>Create Broadcast</DialogTitle>
          <DialogDescription>Send a message to users via email, in-app notification, or both.</DialogDescription>
          <div className="mt-4">
            <AdminMessagingCompose open={composeOpen} onOpenChange={setComposeOpen} onSave={handleSave} />
          </div>
        </DialogPopup>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={detailBroadcast !== null} onOpenChange={(v) => { if (!v) setDetailBroadcast(null) }}>
        <DialogPopup aria-label="Broadcast details" className="sm:max-w-3xl">
          {detailBroadcast && (
            <>
              <DialogTitle>{detailBroadcast.title}</DialogTitle>
              <DialogDescription>
                <span className="flex items-center gap-2">
                  <Badge variant={statusBadge[detailBroadcast.status]} size="sm">{detailBroadcast.status}</Badge>
                  <span className="capitalize">{detailBroadcast.channel}</span>
                  <span>·</span>
                  <span>{audienceSegmentLabels[detailBroadcast.audience]}</span>
                </span>
              </DialogDescription>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-surface-subtle p-3 text-center">
                  <p className="text-xs text-ink-muted">Delivered</p>
                  <p className="mt-1 font-gowun text-xl font-bold text-ink">{detailBroadcast.metrics.delivered.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border border-border bg-surface-subtle p-3 text-center">
                  <p className="text-xs text-ink-muted">Seen</p>
                  <p className="mt-1 font-gowun text-xl font-bold text-ink">{detailBroadcast.metrics.seen.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border border-border bg-surface-subtle p-3 text-center">
                  <p className="text-xs text-ink-muted">Clicked</p>
                  <p className="mt-1 font-gowun text-xl font-bold text-ink">{detailBroadcast.metrics.clicked.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Preview</p>
                <BroadcastPreview
                  title={detailBroadcast.title}
                  body={detailBroadcast.body}
                  showEmail={detailBroadcast.channel === 'email' || detailBroadcast.channel === 'both'}
                  showInApp={detailBroadcast.channel === 'in-app' || detailBroadcast.channel === 'both'}
                />
              </div>
              <div className="mt-5 flex justify-end">
                <DialogClose className="static inline-flex min-h-9 items-center rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Close</DialogClose>
              </div>
            </>
          )}
        </DialogPopup>
      </Dialog>
    </AdminShell>
  )
}
