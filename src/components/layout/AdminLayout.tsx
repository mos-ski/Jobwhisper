import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import {
  LayoutDashboard, DollarSign, Users, UserPlus, Building2,
  BarChart2, FileText, Megaphone, Tag, ScrollText, LifeBuoy, Bell, Settings,
  Zap, MessageSquare, BookOpen, FileCheck, Folder,
  CreditCard, Video, Search, Code2, Menu, X,
  CircleDollarSign, Ticket, ClipboardList, Send, Palette, UserCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  USERS, TRANSACTIONS, TICKETS, ACTIVITY_LOGS, COUPONS,
  BROADCASTS, TEMPLATES, NG_USERS,
} from '@/lib/adminMockData'

type NavItem = {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  end?: boolean
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Core',
    items: [
      { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
      { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
    ],
  },
  {
    label: 'Revenue',
    items: [
      { to: '/admin/revenue', icon: DollarSign, label: 'Revenue' },
      { to: '/admin/promotions', icon: Tag, label: 'Promotions' },
    ],
  },
  {
    label: 'Users',
    items: [
      { to: '/admin/users', icon: Users, label: 'All Users' },
      { to: '/admin/users/partners', icon: UserPlus, label: 'Partners & Affiliates' },
      { to: '/admin/users/enterprises', icon: Building2, label: 'Enterprises' },
    ],
  },
  {
    label: 'Products',
    items: [
      { to: '/admin/auto-apply', icon: Zap, label: 'Auto-Apply' },
      { to: '/admin/interview-copilot', icon: MessageSquare, label: 'Interview Copilot' },
      { to: '/admin/coding-copilot', icon: Code2, label: 'Coding Copilot' },
      { to: '/admin/interview-prep', icon: BookOpen, label: 'Interview Prep' },
      { to: '/admin/meeting', icon: Video, label: 'Meeting' },
      { to: '/admin/resume-builder', icon: FileText, label: 'Resume Builder' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { to: '/admin/funnels', icon: Folder, label: 'Funnels' },
      { to: '/admin/broadcast', icon: Megaphone, label: 'Broadcast' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/activity-logs', icon: ScrollText, label: 'Activity Logs' },
      { to: '/admin/support', icon: LifeBuoy, label: 'Support' },
      { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
      { to: '/admin/pricing', icon: CreditCard, label: 'Pricing Config' },
      { to: '/admin/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

type SearchResult = {
  id: string
  label: string
  sublabel: string
  group: string
  to: string
  icon: React.ComponentType<{ className?: string }>
}

function buildSearchIndex(): SearchResult[] {
  const navResults: SearchResult[] = NAV_GROUPS.flatMap(g =>
    g.items.map(item => ({
      id: `nav-${item.to}`,
      label: item.label,
      sublabel: g.label,
      group: 'Pages',
      to: item.to,
      icon: item.icon,
    })),
  )

  const userResults: SearchResult[] = USERS.map(u => ({
    id: `user-${u.id}`,
    label: u.name,
    sublabel: `${u.email} · ${u.plan}`,
    group: 'Users',
    to: `/admin/users/${u.id}`,
    icon: UserCircle,
  }))

  const ngUserResults: SearchResult[] = NG_USERS.map(u => ({
    id: `ng-${u.id}`,
    label: u.name,
    sublabel: `${u.email} · ${u.plan} · ${u.city}`,
    group: 'NG Users',
    to: `/admin/users/${u.id}`,
    icon: UserCircle,
  }))

  const txResults: SearchResult[] = TRANSACTIONS.map(t => ({
    id: `tx-${t.id}`,
    label: t.userName,
    sublabel: `${t.type === 'refund' ? '-' : ''}$${Math.abs(t.amount)} · ${t.status} · ${new Date(t.date).toLocaleDateString()}`,
    group: 'Transactions',
    to: '/admin/revenue',
    icon: CircleDollarSign,
  }))

  const ticketResults: SearchResult[] = TICKETS.map(t => ({
    id: `ticket-${t.id}`,
    label: t.subject,
    sublabel: `${t.userName} · ${t.status} · ${t.priority}`,
    group: 'Support',
    to: '/admin/support',
    icon: Ticket,
  }))

  const logResults: SearchResult[] = ACTIVITY_LOGS.map(l => ({
    id: `log-${l.id}`,
    label: `${l.action} — ${l.userName}`,
    sublabel: `${l.resource} · ${l.status} · ${new Date(l.timestamp).toLocaleString()}`,
    group: 'Activity Logs',
    to: '/admin/activity-logs',
    icon: ClipboardList,
  }))

  const couponResults: SearchResult[] = COUPONS.map(c => ({
    id: `coupon-${c.id}`,
    label: c.name,
    sublabel: `${c.code} · ${c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}`} · ${c.status}`,
    group: 'Promotions',
    to: '/admin/promotions',
    icon: Tag,
  }))

  const broadcastResults: SearchResult[] = BROADCASTS.map(b => ({
    id: `bc-${b.id}`,
    label: b.subject,
    sublabel: `${b.audience} · ${b.recipients.toLocaleString()} recipients · ${b.status}`,
    group: 'Broadcasts',
    to: '/admin/broadcast',
    icon: Send,
  }))

  const templateResults: SearchResult[] = TEMPLATES.map(t => ({
    id: `tpl-${t.id}`,
    label: t.name,
    sublabel: `${t.category} · ATS ${t.atsScore} · ${t.usageCount.toLocaleString()} uses`,
    group: 'Templates',
    to: '/admin/resume-builder',
    icon: Palette,
  }))

  return [
    ...navResults,
    ...userResults,
    ...ngUserResults,
    ...txResults,
    ...ticketResults,
    ...logResults,
    ...couponResults,
    ...broadcastResults,
    ...templateResults,
  ]
}

const SEARCH_INDEX = buildSearchIndex()
const GROUP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Pages: LayoutDashboard,
  Users: UserCircle,
  'NG Users': UserCircle,
  Transactions: CircleDollarSign,
  Support: Ticket,
  'Activity Logs': ClipboardList,
  Promotions: Tag,
  Broadcasts: Send,
  Templates: Palette,
}

export default function AdminLayout() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const matched = SEARCH_INDEX.filter(item =>
      `${item.label} ${item.sublabel} ${item.group}`.toLowerCase().includes(q)
    )
    // Group by type, max 3 per group, max 12 total
    const grouped: Record<string, SearchResult[]> = {}
    for (const item of matched) {
      if (!grouped[item.group]) grouped[item.group] = []
      if (grouped[item.group].length < 3) grouped[item.group].push(item)
    }
    const flat: SearchResult[] = []
    for (const group of Object.keys(grouped)) {
      flat.push(...grouped[group])
      if (flat.length >= 12) break
    }
    return flat.slice(0, 12)
  }, [query])

  const showDropdown = focused && (query.trim().length > 0)

  const navigate = useCallback((idx: number) => {
    if (idx >= 0 && idx < results.length) {
      inputRef.current?.blur()
      setFocused(false)
      setQuery('')
      setActiveIdx(-1)
    }
  }, [results])

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      navigate(activeIdx)
    } else if (e.key === 'Escape') {
      setFocused(false)
      inputRef.current?.blur()
    }
  }, [showDropdown, results.length, activeIdx, navigate])

  // Reset active index when results change
  useEffect(() => { setActiveIdx(-1) }, [results])

  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-search]')) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Scroll active item into view
  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const el = listRef.current.children[activeIdx] as HTMLElement
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIdx])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 -translate-x-full flex-col border-r border-border bg-card overflow-y-auto transition-transform duration-200 ease-in-out',
          'lg:static lg:z-auto lg:w-56 lg:translate-x-0',
          sidebarOpen && 'translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border px-5">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="" className="h-6 w-6" />
            <span className="text-sm font-semibold text-foreground">Lightforth</span>
          </div>
          <span className="ml-auto rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            Admin
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-2 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col px-3 py-4 gap-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map(({ to, icon: Icon, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden bg-white">
        {/* Fixed top: mobile bar + search */}
        <div className="shrink-0 px-4 pt-4 sm:px-6 sm:pt-6 pb-2">
          {/* Mobile top bar */}
          <div className="mb-4 flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <img src="/favicon.svg" alt="" className="h-6 w-6" />
              <span className="text-sm font-semibold text-foreground">Lightforth</span>
            </div>
            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              Admin
            </span>
          </div>

          {/* Search */}
          <div className="relative" data-search>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onKeyDown={onKeyDown}
              placeholder="Search everything: users, tickets, transactions, coupons, broadcasts..."
              className="lf-input h-11 w-full max-w-2xl pl-10"
            />
            {query.trim() && !results.length && (
              <div className="absolute left-0 top-full z-30 mt-2 w-full max-w-2xl rounded-lg border border-border bg-white p-4 text-sm text-muted-foreground shadow-xl">
                No results for "{query.trim()}"
              </div>
            )}
            {showDropdown && results.length > 0 && (
              <div ref={listRef} className="absolute left-0 top-full z-30 mt-2 w-full max-w-2xl max-h-[420px] overflow-y-auto rounded-lg border border-border bg-white shadow-xl">
                {(() => {
                  let lastGroup = ''
                  return results.map((item, idx) => {
                    const showGroupHeader = item.group !== lastGroup
                    lastGroup = item.group
                    const GroupIcon = GROUP_ICONS[item.group] || LayoutDashboard
                    return (
                      <div key={item.id}>
                        {showGroupHeader && (
                          <div className="flex items-center gap-2 px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                            <GroupIcon className="h-3 w-3" />
                            {item.group}
                          </div>
                        )}
                        <Link
                          to={item.to}
                          onClick={() => { setQuery(''); setFocused(false) }}
                          className={cn(
                            'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors last:border-0',
                            idx === activeIdx ? 'bg-primary/5 text-primary' : 'hover:bg-muted/50',
                          )}
                        >
                          <GroupIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-foreground truncate">{item.label}</div>
                            <div className="text-xs text-muted-foreground truncate">{item.sublabel}</div>
                          </div>
                        </Link>
                      </div>
                    )
                  })
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable page content */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-6 pb-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
