import type {
  AdminAlert,
  AdminDateRange,
  AdminKpi,
  AdminNavItem,
  AdminNotification,
  AdminPlanMixRow,
  AdminProductMixRow,
  AdminSearchResult,
  AdminTrendPoint,
} from '@/contracts/admin.draft'
import type { Session } from '@/contracts/identity'

export const adminSession: Session = {
  status: 'authenticated',
  user: {
    id: 'user_priya_raghunathan',
    email: 'priya@jobwhisper.org',
    name: 'Priya Raghunathan',
    role: 'admin',
    permissions: ['app:view', 'billing:view', 'admin:view', 'admin:users:manage', 'admin:credits:manage', 'admin:services:manage'],
  },
}

export const adminNavItems: readonly AdminNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/admin', matchPrefix: '/admin' },
  { id: 'accounts', label: 'Accounts', href: '/admin/accounts', matchPrefix: '/admin/accounts' },
  { id: 'transactions', label: 'Transactions', href: '/admin/transactions', matchPrefix: '/admin/transactions', badgeCount: 7 },
  { id: 'products', label: 'Products', href: '/admin/products', matchPrefix: '/admin/products' },
  { id: 'configuration', label: 'Configuration', href: '/admin/configuration', matchPrefix: '/admin/configuration' },
  { id: 'systems', label: 'Systems', href: '/admin/systems', matchPrefix: '/admin/systems' },
]

export const adminDateRanges: readonly AdminDateRange[] = [
  { id: '7d', label: 'Last 7 days', rangeLabel: 'Aug 28 – Sep 3, 2026' },
  { id: '30d', label: 'Last 30 days', rangeLabel: 'Aug 5 – Sep 3, 2026' },
  { id: '90d', label: 'Last 90 days', rangeLabel: 'Jun 6 – Sep 3, 2026' },
  { id: '12m', label: 'Last 12 months', rangeLabel: 'Sep 2025 – Sep 2026' },
]

export const adminKpis: readonly AdminKpi[] = [
  {
    id: 'mrr',
    label: 'Monthly recurring revenue',
    value: 47_936_200,
    format: 'usd-cents',
    deltaPercent: 12.4,
    deltaDirection: 'up',
    higherIsBetter: true,
    caption: 'Ace Your Interview subscriptions only',
  },
  {
    id: 'active-subscribers',
    label: 'Active subscribers',
    value: 5_128,
    format: 'count',
    deltaPercent: 8.1,
    deltaDirection: 'up',
    higherIsBetter: true,
    caption: 'Starter, Pro, and Premium combined',
  },
  {
    id: 'new-signups',
    label: 'New signups',
    value: 1_734,
    format: 'count',
    deltaPercent: 5.6,
    deltaDirection: 'up',
    higherIsBetter: true,
    caption: 'Accounts created in range',
  },
  {
    id: 'churn-rate',
    label: 'Churn rate',
    value: 4.7,
    format: 'percent',
    deltaPercent: 0.9,
    deltaDirection: 'up',
    higherIsBetter: false,
    caption: 'Cancellations against active base',
  },
  {
    id: 'credits-consumed',
    label: 'Credits consumed',
    value: 812_940,
    format: 'count',
    deltaPercent: 15.2,
    deltaDirection: 'up',
    higherIsBetter: true,
    caption: '1 credit ≈ 1 minute of Copilot',
  },
  {
    id: 'live-sessions',
    label: 'Live sessions now',
    value: 63,
    format: 'count',
    deltaPercent: 21.0,
    deltaDirection: 'up',
    higherIsBetter: true,
    caption: 'Copilot and Prep sessions in progress',
    realtime: true,
  },
]

export const adminTrendPoints: readonly AdminTrendPoint[] = [
  { label: 'Aug 5', revenueCents: 3_384_000, creditsConsumed: 21_480 },
  { label: 'Aug 7', revenueCents: 3_612_000, creditsConsumed: 23_010 },
  { label: 'Aug 9', revenueCents: 3_298_000, creditsConsumed: 19_640 },
  { label: 'Aug 11', revenueCents: 3_874_000, creditsConsumed: 26_320 },
  { label: 'Aug 13', revenueCents: 4_106_000, creditsConsumed: 28_150 },
  { label: 'Aug 15', revenueCents: 3_792_000, creditsConsumed: 25_970 },
  { label: 'Aug 17', revenueCents: 3_640_000, creditsConsumed: 24_110 },
  { label: 'Aug 19', revenueCents: 4_318_000, creditsConsumed: 30_240 },
  { label: 'Aug 21', revenueCents: 4_530_000, creditsConsumed: 32_880 },
  { label: 'Aug 23', revenueCents: 4_192_000, creditsConsumed: 29_460 },
  { label: 'Aug 25', revenueCents: 3_984_000, creditsConsumed: 27_730 },
  { label: 'Aug 27', revenueCents: 4_726_000, creditsConsumed: 34_910 },
  { label: 'Aug 29', revenueCents: 4_918_000, creditsConsumed: 37_240 },
  { label: 'Aug 31', revenueCents: 4_472_000, creditsConsumed: 33_580 },
  { label: 'Sep 2', revenueCents: 5_140_000, creditsConsumed: 39_120 },
]

// Total revenue across the range (~$1.2M), not just subscription MRR — Copilot/Prep exceed
// subscription MRR by the mid-cycle top-ups those two products also sell (PRICING.md §1).
export const adminProductMix: readonly AdminProductMixRow[] = [
  { id: 'interview-copilot', label: 'Interview Copilot', revenueCents: 40_800_000, activeUsers: 3_942, sharePercent: 34 },
  { id: 'auto-apply', label: 'Auto Apply', revenueCents: 32_400_000, activeUsers: 2_186, sharePercent: 27 },
  { id: 'done-for-you', label: 'Done For You', revenueCents: 18_000_000, activeUsers: 214, sharePercent: 15 },
  { id: 'interview-prep', label: 'Interview Prep', revenueCents: 13_200_000, activeUsers: 2_874, sharePercent: 11 },
  { id: 'resume-builder', label: 'Resume Builder', revenueCents: 10_800_000, activeUsers: 1_615, sharePercent: 9 },
  { id: 'marketplace', label: 'Marketplace', revenueCents: 4_800_000, activeUsers: 2_480, sharePercent: 4 },
]

export const adminPlanMix: readonly AdminPlanMixRow[] = [
  { id: 'pro', label: 'Pro · $99/mo', subscribers: 2_648, mrrCents: 26_215_200, sharePercent: 52 },
  { id: 'starter', label: 'Starter · $47/mo', subscribers: 1_809, mrrCents: 8_502_300, sharePercent: 35 },
  { id: 'premium', label: 'Premium · $197/mo', subscribers: 671, mrrCents: 13_218_700, sharePercent: 13 },
  { id: 'unsubscribed', label: 'Unsubscribed · free 50 min/mo', subscribers: 18_402, mrrCents: 0, sharePercent: 0 },
]

export const adminAlerts: readonly AdminAlert[] = [
  {
    id: 'alert-disputes',
    severity: 'critical',
    title: '7 disputes need review',
    detail: 'Oldest opened 9 days ago — 3 pass their evidence deadline this week.',
    href: '/admin/transactions',
    actionLabel: 'Review disputes',
  },
  {
    id: 'alert-refunds',
    severity: 'warning',
    title: '12 refund requests pending',
    detail: '$1,284.00 in total, all filed against Ace Your Interview subscriptions.',
    href: '/admin/transactions',
    actionLabel: 'Open refund queue',
  },
  {
    id: 'alert-failed-payments',
    severity: 'warning',
    title: '34 failed subscription renewals',
    detail: 'Cards declined in the last 48 hours. Dunning has retried twice.',
    href: '/admin/transactions',
    actionLabel: 'See failed payments',
  },
  {
    id: 'alert-churn',
    severity: 'info',
    title: 'Churn up 0.9 points month over month',
    detail: 'Concentrated in Starter accounts inside their first billing cycle.',
    href: '/admin/accounts',
    actionLabel: 'Inspect accounts',
  },
]

export const adminNotifications: readonly AdminNotification[] = [
  {
    id: 'notif-dispute',
    title: 'New dispute opened',
    detail: 'Marcus Bell · $99.00 · Pro subscription',
    timeAgo: '11 minutes ago',
    unread: true,
    href: '/admin/transactions',
  },
  {
    id: 'notif-refund',
    title: 'Refund approved by Daniel Okoye',
    detail: 'Amara Nwosu · $47.00 · Starter subscription',
    timeAgo: '2 hours ago',
    unread: true,
    href: '/admin/transactions',
  },
  {
    id: 'notif-signup-spike',
    title: 'Signup spike detected',
    detail: '312 accounts created in the last hour, 4x the daily average.',
    timeAgo: '5 hours ago',
    unread: true,
    href: '/admin/accounts',
  },
  {
    id: 'notif-admin-added',
    title: 'New admin invited',
    detail: 'Rachel Adeyemi was granted admin:users:manage.',
    timeAgo: 'Yesterday',
    unread: false,
    href: '/admin/systems',
  },
  {
    id: 'notif-coupon',
    title: 'Coupon LAUNCH40 hit its usage cap',
    detail: '500 of 500 redemptions used. The code is now inactive.',
    timeAgo: '2 days ago',
    unread: false,
    href: '/admin/configuration',
  },
]

export const adminSearchResults: readonly AdminSearchResult[] = [
  { id: 'sr-user-1', kind: 'user', label: 'Darnell Smith', detail: 'darnell.smith@example.com · Pro · Active', href: '/admin/accounts' },
  { id: 'sr-user-2', kind: 'user', label: 'Amara Nwosu', detail: 'amara.nwosu@example.com · Starter · Suspended', href: '/admin/accounts' },
  { id: 'sr-txn-1', kind: 'transaction', label: 'txn_9F2K4M', detail: '$99.00 · Pro renewal · Sep 2, 2026', href: '/admin/transactions' },
  { id: 'sr-inv-1', kind: 'invoice', label: 'INV-2026-04821', detail: '$197.00 · Premium · Paid', href: '/admin/transactions' },
]
