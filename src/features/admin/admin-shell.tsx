import { useState, type ReactNode } from 'react'
import {
  Activity,
  BarChart3,
  Bell,
  Boxes,
  CreditCard,
  FileText,
  HeadphonesIcon,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Server,
  SlidersHorizontal,
  Users,
} from 'lucide-react'

import type { AdminModuleId, AdminNavItem, AdminNotification, AdminSearchResult } from '@/contracts/admin.draft'
import type { UserIdentity } from '@/contracts/identity'
import {
  AppShell,
  Avatar,
  cn,
  Dialog,
  DialogClose,
  DialogPopup,
  DialogTrigger,
  JobwhisperMark,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SideMenu,
  type SideMenuItem,
} from '@/ui'

const moduleIcons: Record<AdminModuleId, ReactNode> = {
  dashboard: <LayoutDashboard />,
  activity: <Activity />,
  accounts: <Users />,
  transactions: <CreditCard />,
  products: <Boxes />,
  configuration: <SlidersHorizontal />,
  systems: <Server />,
  analytics: <BarChart3 />,
  content: <FileText />,
  support: <HeadphonesIcon />,
}

export type AdminShellProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly activeModule: AdminModuleId
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly children: ReactNode
}

function toSideMenuItems(navItems: readonly AdminNavItem[], activeModule: AdminModuleId): readonly SideMenuItem[] {
  return navItems.map((item) => ({
    label: item.label,
    href: item.href,
    icon: moduleIcons[item.id],
    active: item.id === activeModule,
    dividerBefore: item.id === 'activity',
    badgeCount: item.badgeCount,
  }))
}

function AdminSearch({ results }: { readonly results: readonly AdminSearchResult[] }) {
  const [query, setQuery] = useState('')
  const trimmed = query.trim().toLowerCase()
  const matches = trimmed
    ? results.filter((result) => `${result.label} ${result.detail}`.toLowerCase().includes(trimmed))
    : []

  return (
    <div className="relative min-w-0 flex-1 sm:max-w-md">
      <Search aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-ink-muted" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="Search users, transactions, and invoices"
        placeholder="Search users, transactions, invoices…"
        className="h-9 w-full rounded-lg border border-input bg-canvas ps-9 pe-3 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      />
      {trimmed ? (
        <div className="absolute inset-x-0 top-full z-shell mt-2 overflow-hidden rounded-md border border-border bg-surface shadow-popover">
          {matches.length === 0 ? (
            <p className="px-4 py-3 text-sm text-ink-muted">No matches for “{query.trim()}”.</p>
          ) : (
            <ul>
              {matches.map((result) => (
                <li key={result.id} className="border-b border-border last:border-b-0">
                  <a
                    href={result.href}
                    className="block px-4 py-2.5 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-sm font-semibold text-ink">{result.label}</span>
                      <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-ink-muted">{result.kind}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-ink-muted">{result.detail}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}

function AdminNotificationBell({ notifications }: { readonly notifications: readonly AdminNotification[] }) {
  const unreadCount = notifications.filter((notification) => notification.unread).length

  return (
    <Popover>
      <PopoverTrigger
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        className="relative grid size-11 place-items-center rounded-soft text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <Bell aria-hidden="true" className="size-5" />
        {unreadCount > 0 ? (
          <span className="absolute end-1.5 top-1.5 grid min-w-4 place-items-center rounded-pill bg-danger px-1 text-[10px] font-bold leading-4 text-on-danger">
            {unreadCount}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="flex items-baseline justify-between gap-3 border-b border-border px-4 py-3">
          <h2 className="font-gowun text-base font-bold text-ink">Notifications</h2>
          <a href="/admin/activity" className="text-xs text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            View all
          </a>
        </div>
        <ul className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <li key={notification.id} className="border-b border-border last:border-b-0">
              <a href={notification.href} className="block px-4 py-3 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <span className="flex items-start gap-2">
                  <span
                    aria-hidden="true"
                    className={cn('mt-1.5 size-2 shrink-0 rounded-pill', notification.unread ? 'bg-accent' : 'bg-transparent')}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">
                      {notification.title}
                      {notification.unread ? <span className="sr-only"> (unread)</span> : null}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-ink-muted">{notification.detail}</span>
                    <span className="mt-1 block text-[11px] text-ink-muted">{notification.timeAgo}</span>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

function AdminTopStrip({
  user,
  navItems,
  activeModule,
  notifications,
  searchResults,
  collapsed,
  onToggleCollapsed,
}: {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly activeModule: AdminModuleId
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly collapsed: boolean
  readonly onToggleCollapsed: () => void
}) {
  return (
    <header className="sticky top-0 z-shell flex min-h-14 items-center gap-3 border-b border-border bg-surface px-4">
      <Dialog>
        <DialogTrigger
          aria-label="Open navigation menu"
          className="grid size-11 shrink-0 place-items-center rounded-soft text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus lg:hidden"
        >
          <Menu aria-hidden="true" className="size-6" />
        </DialogTrigger>
        <DialogPopup placement="start" aria-label="Admin navigation" className="p-0">
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <JobwhisperMark className="h-6 w-auto text-brand-mark" />
            <DialogClose aria-label="Close navigation menu" className="static" />
          </div>
          <SideMenu items={toSideMenuItems(navItems, activeModule)} className="block h-[calc(100%-3.5rem)] w-full" />
        </DialogPopup>
      </Dialog>

      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-pressed={collapsed}
        aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        className="hidden size-11 shrink-0 place-items-center rounded-soft text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus lg:grid"
      >
        {collapsed ? <PanelLeftOpen aria-hidden="true" className="size-5" /> : <PanelLeftClose aria-hidden="true" className="size-5" />}
      </button>

      <a
        href="/admin"
        className="flex shrink-0 items-center gap-2 rounded-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <JobwhisperMark className="h-6 w-auto text-brand-mark" />
        <span className="hidden text-xs font-bold uppercase tracking-wide text-ink-muted sm:inline">Admin</span>
      </a>

      <AdminSearch results={searchResults} />

      <div className="ms-auto flex shrink-0 items-center gap-1">
        <AdminNotificationBell notifications={notifications} />
        <span className="flex items-center gap-2 ps-1">
          <Avatar name={user.name} size="sm" />
          <span className="hidden min-w-0 leading-tight md:block">
            <span className="block truncate text-sm font-semibold text-ink">{user.name}</span>
            <span className="block truncate text-xs text-ink-muted">{user.email}</span>
          </span>
        </span>
      </div>
    </header>
  )
}

export function AdminShell({ user, navItems, activeModule, notifications, searchResults, children }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <AppShell
      className="font-rethink"
      header={
        <AdminTopStrip
          user={user}
          navItems={navItems}
          activeModule={activeModule}
          notifications={notifications}
          searchResults={searchResults}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((prev) => !prev)}
        />
      }
      sidebar={<SideMenu items={toSideMenuItems(navItems, activeModule)} collapsed={collapsed} className="border-e border-border" />}
    >
      {children}
    </AppShell>
  )
}
