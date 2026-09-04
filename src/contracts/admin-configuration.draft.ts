/**
 * Draft contracts for the admin Configuration module: subscription pricing, coupons, trials,
 * and the onboarding survey. Money is integer cents. Dates that are shown to an admin are
 * pre-formatted display strings; the only machine-comparable dates are the `YYYY-MM-DD`
 * calendar strings a date input produces, which are compared lexicographically, never parsed.
 */

export type AdminConfigPlanId = 'starter' | 'pro' | 'premium'

/** The capability rows of the plan feature matrix (PRICING.md §1.1). */
export type AdminConfigFeatureId =
  | 'interview-prep'
  | 'interview-copilot-web'
  | 'interview-copilot-desktop'
  | 'coding-copilot'
  | 'meeting-copilot'

export type AdminConfigFeatureDefinition = {
  readonly id: AdminConfigFeatureId
  readonly label: string
  /** One line explaining what turning the row off actually takes away from a subscriber. */
  readonly detail: string
}

/** First-time offer attached to a plan: a discounted first month that renews at the plan price. */
export type AdminIntroOfferConfig = {
  readonly enabled: boolean
  readonly firstMonthPriceCents: number
  readonly label: string
}

export type AdminPlanConfig = {
  readonly id: AdminConfigPlanId
  readonly name: string
  /** What the tier is sold on, in the admin's words, not marketing copy. */
  readonly positioning: string
  readonly monthlyPriceCents: number
  readonly annualPriceCents: number
  /** Monthly credit allowance, 1 credit = 1 minute of Copilot. */
  readonly monthlyCredits: number
  readonly knowledgeBaseDocumentLimit: number
  readonly features: Readonly<Record<AdminConfigFeatureId, boolean>>
  /** Present only on the tier that carries a first-time offer. */
  readonly introOffer?: AdminIntroOfferConfig
  /** Live subscribers on this tier — the blast radius of any edit on this card. */
  readonly subscriberCount: number
}

export type AdminCreditEconomicsConfig = {
  /** What one credit-minute of Copilot is worth, in cents. */
  readonly copilotRateCents: number
  /** What a credit costs when bought as a mid-cycle top-up, in cents. */
  readonly topUpPriceCents: number
  /** Hard floor on a top-up purchase, in cents. */
  readonly topUpMinimumCents: number
}

export type AdminDoneForYouPackageId = 'dfy-small' | 'dfy-large'

export type AdminDoneForYouPackageConfig = {
  readonly id: AdminDoneForYouPackageId
  readonly name: string
  /** One-time price — this is not a recurring subscription. */
  readonly priceCents: number
  /** Number of interviews the package guarantees, not a job-application count. */
  readonly interviewsGuaranteed: number
  /** Whether the package is offered as a line item in the VSL checkout cart. */
  readonly inCheckoutCart: boolean
}

export type AdminMarketplacePricingConfig = {
  readonly minPriceCents: number
  readonly maxPriceCents: number
  readonly itemCount: number
}

export type AdminAllowanceResetAnchor = 'rolling-30-day' | 'calendar-month'

/**
 * The default state of an account with no subscription. Deliberately not a plan:
 * it is never rendered as a fourth pricing card (PRICING.md §1).
 */
export type AdminUnsubscribedAllowanceConfig = {
  readonly freeMinutes: number
  readonly resetAnchor: AdminAllowanceResetAnchor
  readonly resetPeriodDays: number
}

export type AdminCouponType = 'percent-off' | 'fixed-amount-off' | 'trial-extension'

export type AdminCouponStatus = 'active' | 'scheduled' | 'expired' | 'capped' | 'deactivated'

export type AdminCouponScopeKind = 'everything' | 'plan' | 'product'

export type AdminCouponScopeOption = {
  readonly id: string
  readonly kind: AdminCouponScopeKind
  readonly label: string
}

export type AdminCoupon = {
  readonly id: string
  readonly code: string
  readonly type: AdminCouponType
  /**
   * Whole percent for `percent-off`, integer cents for `fixed-amount-off`,
   * whole days for `trial-extension`.
   */
  readonly value: number
  readonly scopeId: string
  /** Pre-resolved scope label, e.g. "Pro plan" or "Done For You, 10 interviews guaranteed". */
  readonly scopeLabel: string
  readonly redemptions: number
  readonly redemptionCap: number
  /** Display string, e.g. "Jul 1, 2026". */
  readonly startsOn: string
  /** Display string, or "No end date". */
  readonly expiresOn: string
  readonly status: AdminCouponStatus
  readonly createdBy: string
  readonly note: string
}

/** Raw create-coupon form values. Dates are `YYYY-MM-DD` calendar strings from a date input. */
export type AdminCouponDraft = {
  readonly code: string
  readonly type: AdminCouponType
  readonly value: string
  readonly scopeId: string
  readonly redemptionCap: string
  readonly startsOn: string
  readonly expiresOn: string
  readonly note: string
}

export type AdminTrialConfig = {
  readonly enabled: boolean
  readonly lengthDays: number
  /** Which tier's entitlements the trial mirrors. */
  readonly mirrorsPlanId: AdminConfigPlanId
  readonly includedCredits: number
  readonly knowledgeBaseDocumentLimit: number
  readonly requiresPaymentMethod: boolean
  readonly features: Readonly<Record<AdminConfigFeatureId, boolean>>
}

export type AdminSurveyQuestionType = 'single-select' | 'multi-select' | 'free-text'

export type AdminSurveyOption = {
  readonly id: string
  readonly label: string
}

export type AdminSurveyQuestion = {
  readonly id: string
  readonly prompt: string
  readonly helpText: string
  readonly type: AdminSurveyQuestionType
  readonly required: boolean
  /** Empty for `free-text`. */
  readonly options: readonly AdminSurveyOption[]
}

export type AdminOnboardingSurveyConfig = {
  readonly title: string
  readonly introduction: string
  readonly questions: readonly AdminSurveyQuestion[]
}

export type AdminReferralProgramConfig = {
  /** Credits awarded to the referrer when their invitee subscribes. */
  readonly rewardCreditsPerReferral: number
  /** Hard ceiling on how many successful referrals one account can earn rewards for. */
  readonly maxReferralsPerAccount: number
  /** How many days a pending referral reward stays valid before expiring. */
  readonly rewardExpiryDays: number
}

/** One line of the "Review changes" confirmation, rendered as old to new. */
export type AdminConfigChange = {
  readonly id: string
  readonly section: string
  readonly field: string
  readonly before: string
  readonly after: string
}
