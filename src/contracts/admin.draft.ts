export type AdminModuleId = 'dashboard' | 'activity' | 'accounts' | 'transactions' | 'products' | 'configuration' | 'systems' | 'analytics' | 'content' | 'support' | 'kpis'

export type AdminNavItem = {
  readonly id: AdminModuleId
  readonly label: string
  readonly href: string
  /** Pathname prefix that marks this item active, so any sub-route of a module still highlights its parent. */
  readonly matchPrefix: string
  /** Count shown as a pill on the nav item — open disputes, pending refunds, unread alerts. */
  readonly badgeCount?: number
}

export type AdminDateRangeId = '7d' | '30d' | '90d' | '12m'

export type AdminDateRange = {
  readonly id: AdminDateRangeId
  readonly label: string
  /** Human-readable span the range currently resolves to, e.g. "Aug 5 – Sep 3, 2026". */
  readonly rangeLabel: string
}

export type AdminKpiId =
  | 'mrr'
  | 'active-subscribers'
  | 'new-signups'
  | 'churn-rate'
  | 'credits-consumed'
  | 'live-sessions'

export type AdminKpiFormat = 'usd-cents' | 'count' | 'percent'

export type AdminKpi = {
  readonly id: AdminKpiId
  readonly label: string
  readonly value: number
  readonly format: AdminKpiFormat
  readonly deltaPercent: number
  readonly deltaDirection: 'up' | 'down'
  /** Churn rising is bad, MRR rising is good — decides whether the delta reads positive or negative, since color alone must never carry the meaning. */
  readonly higherIsBetter: boolean
  readonly caption: string
  /** Set for a metric that is a live instantaneous reading rather than a total over the selected range. */
  readonly realtime?: boolean
}

export type AdminTrendPoint = {
  readonly label: string
  readonly revenueCents: number
  readonly creditsConsumed: number
}

export type AdminTrendMetric = 'revenue' | 'credits'

export type AdminProductId =
  | 'interview-copilot'
  | 'interview-prep'
  | 'auto-apply'
  | 'resume-builder'
  | 'done-for-you'
  | 'marketplace'

export type AdminProductMixRow = {
  readonly id: AdminProductId
  readonly label: string
  readonly revenueCents: number
  readonly activeUsers: number
  readonly sharePercent: number
}

export type AdminPlanId = 'starter' | 'pro' | 'premium' | 'unsubscribed'

export type AdminPlanMixRow = {
  readonly id: AdminPlanId
  readonly label: string
  readonly subscribers: number
  readonly mrrCents: number
  readonly sharePercent: number
}

export type AdminAlertSeverity = 'critical' | 'warning' | 'info'

/** A surfaced anomaly on the dashboard that deep-links into the module which can resolve it. */
export type AdminAlert = {
  readonly id: string
  readonly severity: AdminAlertSeverity
  readonly title: string
  readonly detail: string
  readonly href: string
  readonly actionLabel: string
}

export type AdminNotification = {
  readonly id: string
  readonly title: string
  readonly detail: string
  readonly timeAgo: string
  readonly unread: boolean
  readonly href: string
}

export type AdminSearchResultKind = 'user' | 'transaction' | 'invoice'

export type AdminSearchResult = {
  readonly id: string
  readonly kind: AdminSearchResultKind
  readonly label: string
  readonly detail: string
  readonly href: string
}
