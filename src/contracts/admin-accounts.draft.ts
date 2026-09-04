import type { AdminPlanId, AdminProductId } from './admin.draft'

export type AdminAccountStatus = 'active' | 'suspended' | 'pending'

/** `all` is the "no filter" sentinel so the value round-trips through a URL query param without needing an absent case. */
export type AdminAccountStatusFilter = AdminAccountStatus | 'all'
export type AdminAccountPlanFilter = AdminPlanId | 'all'

export type AdminAccountRow = {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly plan: AdminPlanId
  /** Plan wording as sold, e.g. "Pro · $99/mo" — kept out of the view so pricing copy stays in one place. */
  readonly planLabel: string
  readonly status: AdminAccountStatus
  readonly creditsRemaining: number
  /** Credits the plan grants each cycle, so a remaining count can be read as a fraction of the allowance. */
  readonly creditsAllowance: number
  /** Display string, e.g. "Mar 14, 2026". Never an ISO string or a Date. */
  readonly signedUp: string
  /** Display string, e.g. "2 hours ago" or "Never". */
  readonly lastActive: string
}

export type AdminAccountsSummary = {
  readonly totalAccounts: number
  readonly activeSubscribers: number
  readonly suspended: number
  readonly newThisWeek: number
}

export type AdminAccountSubscription = {
  readonly planLabel: string
  readonly priceCents: number
  /** e.g. "per month" or "no charge" for an unsubscribed account. */
  readonly billingPeriodLabel: string
  readonly startedOn: string
  /** Display string, or null when there is nothing to renew. */
  readonly renewsOn: string | null
  readonly paymentMethodLabel: string
  readonly paymentMethodExpiry: string
  readonly lifetimeValueCents: number
  readonly invoiceCount: number
}

export type AdminCreditEntryKind = 'grant' | 'spend' | 'refund' | 'top-up'

export type AdminCreditEntry = {
  readonly id: string
  readonly kind: AdminCreditEntryKind
  readonly description: string
  /** Null for wallet-level movements such as the monthly grant, which no single product caused. */
  readonly product: AdminProductId | null
  readonly productLabel: string
  /** Signed: negative for a spend, positive for a grant, refund or top-up. */
  readonly amountCredits: number
  readonly balanceAfter: number
  readonly occurredAt: string
  /** "System" for automatic movements, otherwise the admin's name. */
  readonly actor: string
}

export type AdminActivityOutcome = 'completed' | 'in-progress' | 'failed' | 'cancelled'

export type AdminActivityEvent = {
  readonly id: string
  readonly product: AdminProductId
  readonly productLabel: string
  readonly title: string
  readonly detail: string
  readonly occurredAt: string
  readonly outcome: AdminActivityOutcome
  readonly outcomeLabel: string
}

export type AdminProductUsageRow = {
  readonly id: AdminProductId
  readonly label: string
  readonly metricLabel: string
  readonly value: number
  readonly unit: string
  /** The cap or comparison the value should be read against, e.g. "of 1,000 min this cycle". */
  readonly detail: string
}

export type AdminAccountAuditEntry = {
  readonly id: string
  readonly adminName: string
  /** Reads as a sentence after the admin name, e.g. "granted 250 credits". */
  readonly action: string
  readonly detail: string
  readonly occurredAt: string
}

export type AdminAccountDetail = {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly plan: AdminPlanId
  readonly planLabel: string
  readonly status: AdminAccountStatus
  readonly joinedOn: string
  readonly lastActive: string
  readonly location: string
  readonly targetRole: string
  readonly creditsRemaining: number
  readonly creditsAllowance: number
  readonly creditsResetsOn: string
  /** Present only while `status` is `suspended`. */
  readonly suspendedOn?: string
  readonly suspensionReason?: string
  readonly subscription: AdminAccountSubscription
  readonly creditHistory: readonly AdminCreditEntry[]
  readonly activity: readonly AdminActivityEvent[]
  readonly usage: readonly AdminProductUsageRow[]
  /** Scoped to this account only. The platform-wide log lives in the Systems module. */
  readonly auditLog: readonly AdminAccountAuditEntry[]
}

export type AdminAccountDetailTab = 'credits' | 'activity' | 'audit'
