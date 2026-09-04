/**
 * Admin Products module draft contract.
 *
 * `AdminProductId` in `admin.draft.ts` is the revenue-reporting grain (six lines). The admin
 * Products module operates one level finer, because availability, tier gating and health are
 * per shipped surface: Interview Copilot alone is four separately togglable products (web,
 * desktop, coding, meeting) that fail for different reasons and unlock on different tiers.
 * `AdminProductSku` is that finer grain; `revenueParentId` maps each SKU back to the coarse id
 * so both screens keep reconciling against the dashboard's product mix.
 */
import type { AdminProductId } from './admin.draft'

export type AdminProductSku =
  | 'interview-prep'
  | 'interview-copilot-web'
  | 'interview-copilot-desktop'
  | 'coding-copilot'
  | 'meeting-copilot'
  | 'auto-apply'
  | 'resume-builder'
  | 'done-for-you'
  | 'marketplace'

export type AdminProductStatus = 'live' | 'beta' | 'degraded' | 'disabled'

/** `all` is the unfiltered view, so this doubles as the `status` URL param's value space. */
export type AdminProductStatusFilter = 'all' | AdminProductStatus

/** Which Ace Your Interview tier unlocks a product. `unsubscribed` is the free 50 min/mo base. */
export type AdminProductTierId = 'unsubscribed' | 'starter' | 'pro' | 'premium'

/** How the product is sold — subscription tiers only gate the first of these. */
export type AdminProductSaleModel = 'subscription' | 'prepaid-credits' | 'package' | 'one-time'

export type AdminProductHealthState = 'healthy' | 'watch' | 'critical'

export type AdminProductHealth = {
  readonly state: AdminProductHealthState
  /** Written out so health never reads from the color swatch alone. */
  readonly label: string
  readonly detail: string
  readonly errorRatePercent: number
}

export type AdminProductStatFormat = 'usd-cents' | 'count' | 'percent' | 'minutes'

export type AdminProductRow = {
  readonly id: AdminProductSku
  readonly revenueParentId: AdminProductId
  readonly name: string
  readonly summary: string
  readonly status: AdminProductStatus
  /** Required whenever status is `degraded` or `disabled` — the visible why. */
  readonly statusReason?: string
  readonly saleModel: AdminProductSaleModel
  readonly includedTiers: readonly AdminProductTierId[]
  /** Human phrasing of the gating rule, e.g. "Pro and Premium" or "Prepaid credits, $10 minimum". */
  readonly tierNote: string
  readonly activeUsers: number
  readonly sessionsInRange: number
  readonly creditsConsumed: number
  readonly revenueCents: number
  /** Share of the platform's distinct active accounts that touched this product in range. */
  readonly adoptionPercent: number
  readonly health: AdminProductHealth
  readonly detailHref: string
  /** Accounts that lose the product the moment availability is switched off. */
  readonly blastRadiusUsers: number
  /** Spelled-out blast radius for the confirmation dialog, e.g. "3,319 Pro and Premium subscribers". */
  readonly blastRadiusLabel: string
}

export type AdminProductSummaryId = 'active-users' | 'sessions' | 'credits' | 'revenue'

export type AdminProductSummaryStat = {
  readonly id: AdminProductSummaryId
  readonly label: string
  readonly value: number
  readonly format: AdminProductStatFormat
  readonly caption: string
  readonly deltaPercent: number
  readonly deltaDirection: 'up' | 'down'
  readonly higherIsBetter: boolean
}

export type AdminProductDetailStatId =
  | 'active-users'
  | 'sessions'
  | 'avg-duration'
  | 'credits'
  | 'completion-rate'
  | 'error-rate'
  | 'dfy-leads'
  | 'dfy-clients'
  | 'dfy-applications'
  | 'dfy-revenue'

export type AdminProductDetailStat = {
  readonly id: AdminProductDetailStatId
  readonly label: string
  readonly value: number
  readonly format: AdminProductStatFormat
  readonly caption: string
  readonly deltaPercent: number
  readonly deltaDirection: 'up' | 'down'
  readonly higherIsBetter: boolean
}

export type AdminProductTrendMetric = 'sessions' | 'credits'

export type AdminProductTrendPoint = {
  readonly label: string
  readonly sessions: number
  readonly creditsConsumed: number
}

export type AdminProductSessionOutcome = 'completed' | 'abandoned' | 'failed'

/**
 * One pipeline, four stages, from signup through fulfillment: `new` (paid, not yet
 * contacted), `call` (onboarding call scheduled or done, work underway), `completed`,
 * `declined` (client or success manager didn't proceed).
 */
export type AdminDoneForYouStage = 'new' | 'call' | 'completed' | 'declined'

/** One job the success manager applied to on the client's behalf, logged with a link as evidence — via the platform or manually/offline. */
export type AdminDoneForYouApplicationLogEntry = {
  readonly id: string
  readonly jobTitle: string
  readonly companyName: string
  /** URL to the job posting or the submitted application, so the record is verifiable. */
  readonly link: string
  readonly appliedLabel: string
  readonly loggedBy: string
}

export type AdminDoneForYouLead = {
  readonly id: string
  /** The candidate's real account, for linking back to their profile — this is always an existing subscriber. */
  readonly accountId: string
  readonly userName: string
  readonly userEmail: string
  readonly userPhone: string
  readonly packageId: 'dfy-small' | 'dfy-large'
  readonly amountPaidCents: number
  readonly signedUpLabel: string
  readonly stage: AdminDoneForYouStage
  /** Reused from the candidate's Auto-Apply profile rather than re-collected at DFY signup. */
  readonly targetRoles: readonly string[]
  readonly experienceLevel: string
  readonly locations: readonly string[]
  readonly resumeFileName: string
  /** Answers collected during the DFY signup agreement step. */
  readonly excludedCompanies: string
  readonly shareSalaryExpectations: boolean
  readonly contactPreference: 'email' | 'phone' | 'either'
  readonly contactNote: string
  readonly agreedToTermsLabel: string
  /** Set once a success manager is assigned — from `call` onward. */
  readonly assignedSuccessManager?: string
  /** Every job applied to on this client's behalf. The applications-submitted count is this array's length, not a separately tracked number. */
  readonly applicationLog: readonly AdminDoneForYouApplicationLogEntry[]
  /** Set when the interview guarantee has been delivered — Jobwhisper product access pauses once fulfilled, since it was only granted "until fulfillment." Unset while still in progress. */
  readonly fulfilledAt?: string
}

export type AdminProductSessionRow = {
  readonly id: string
  readonly userName: string
  readonly userEmail: string
  readonly plan: AdminProductTierId
  /** Role the candidate was interviewing or applying for — the log's most useful context column. */
  readonly targetRole: string
  readonly targetCompany: string
  /** Display string, already localized. Views never parse dates. */
  readonly startedLabel: string
  readonly durationLabel: string
  readonly durationMinutes: number
  readonly creditsUsed: number
  readonly outcome: AdminProductSessionOutcome
  /** Set only when `outcome` is `failed`. */
  readonly failureReason?: string
}

export type AdminProductErrorGroup = {
  readonly id: string
  readonly reason: string
  readonly count: number
  readonly sharePercent: number
  readonly lastSeenLabel: string
  readonly severity: 'critical' | 'warning' | 'info'
}

export type AdminProductDetail = {
  readonly id: AdminProductSku
  readonly name: string
  readonly summary: string
  readonly status: AdminProductStatus
  readonly statusReason?: string
  readonly tierNote: string
  readonly rangeLabel: string
  readonly stats: readonly AdminProductDetailStat[]
  readonly trend: readonly AdminProductTrendPoint[]
  readonly sessions: readonly AdminProductSessionRow[]
  readonly doneForYouLeads?: readonly AdminDoneForYouLead[]
  readonly errorGroups: readonly AdminProductErrorGroup[]
  readonly blastRadiusUsers: number
  readonly blastRadiusLabel: string
}
