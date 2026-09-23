export type DownloadPlatform = 'mac-apple-silicon' | 'mac-intel' | 'windows' | 'extension' | 'linux' | 'ios' | 'android'

export type DownloadItem = {
  readonly id: DownloadPlatform
  readonly title: string
  readonly platform: string
  readonly extension: string
  /** Names the build, not the action — "macOS — Apple Silicon" rather than "Download" — so a row of cards reads as a list of targets to pick from. */
  readonly cta: string
  readonly support: string
  readonly imageSrc: string
  readonly href: string
  /** Not shipping yet: the card shows a disabled control in place of the download link. */
  readonly comingSoon?: boolean
}

export type BillingPlanCard = {
  readonly id: string
  readonly name: string
  readonly price: string
  readonly cadence: string
  /** The annual rate and its cadence. Absent on a weekly plan: annual billing does not
   *  apply to it, and its card says so rather than silently not moving. */
  readonly annualPrice?: string
  readonly annualCadence?: string
  /** What the plan includes. Plans are unlimited now, so this is no longer an amount. */
  readonly included: string
  readonly description: string
  readonly features: readonly string[]
  readonly note: string
  readonly popular?: boolean
  readonly current?: boolean
  /** Short label next to the plan name, e.g. "2x usage" on Premium. */
  readonly tag?: string
}

// Resume Builder and Auto Apply — standalone, pay-as-you-go products, no subscription
// required. Each has its own prepaid credit balance, bought via preset amounts + a custom
// "Other" input, with a hard-floor minimum. See PRICING.md §2.1.
export type BillingStandalonePurchase = {
  readonly id: string
  readonly name: string
  readonly rateLabel: string
  /** e.g. 10 for $0.10/credit, 100 for $1/credit. */
  readonly centsPerCredit: number
  readonly minimumDollars: number
  readonly presetDollars: readonly number[]
  readonly description: string
  readonly features: readonly string[]
  /** Plain informational note, e.g. Auto Apply's done-for-you packages — not a locked upsell. */
  readonly note?: string
}

export type TutorialItem = {
  readonly id: string
  readonly title: string
  readonly href: string
  readonly kind: 'external' | 'video'
  readonly imageSrc?: string
  readonly tone: 'accent' | 'positive' | 'accent-secondary' | 'danger'
}

export type CreditUsageRow = {
  readonly feature: string
  readonly trigger: string
  readonly deducted: string
  readonly free?: boolean
}

export type CreditSummary = {
  readonly remaining: number
  readonly total: number
  readonly resetDate: string
  readonly bonusHref: string
  readonly detailsHref: string
}

export type SettingsProfile = {
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly phone: string
  readonly country: string
  readonly city: string
  readonly postalCode: string
}

export type ReferralRow = {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly dateTime: string
  readonly status: string
}

export type CreditHistoryRow = {
  readonly id: string
  readonly feature: string
  readonly description: string
  readonly dateTime: string
  readonly amount: number
  readonly balanceAfter: number
}

export type AccountFaqEntry = {
  readonly category: string
  readonly question: string
  readonly answer: string
}

/**
 * Support requests raised from the app. Every one of these becomes a ticket in the admin
 * Support queue — `kind` is what tells the queue whether it is a bug to triage, a complaint
 * to escalate, or feedback to file, so it carries across both contracts.
 */
export type SupportRequestKind = 'question' | 'bug' | 'complaint' | 'feedback' | 'feature' | 'billing'

export type SupportRequestType = {
  readonly id: SupportRequestKind
  readonly label: string
  readonly description: string
  /** Shows the 1–5 star field — set on the kinds where a score is the point of the message. */
  readonly asksForRating?: boolean
}

export type SupportTicketStatus = 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed'

/** One of the user's own tickets, as they see it — the same ticket the admin queue works from. */
export type SupportTicketSummary = {
  readonly id: string
  /** Short human reference quoted in emails, e.g. "JW-4821". */
  readonly reference: string
  readonly kind: SupportRequestKind
  readonly subject: string
  readonly status: SupportTicketStatus
  readonly createdAtLabel: string
  readonly lastUpdateLabel: string
  readonly lastMessagePreview: string
  /** True when the last word was ours and the user still owes a reply. */
  readonly awaitingReply: boolean
}
