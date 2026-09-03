export type DownloadPlatform = 'mac-apple-silicon' | 'mac-intel' | 'windows'

export type DownloadItem = {
  readonly id: DownloadPlatform
  readonly title: string
  readonly platform: string
  readonly extension: string
  readonly cta: string
  readonly support: string
  readonly imageSrc: string
  readonly href: string
}

export type BillingPlanCard = {
  readonly id: string
  readonly name: string
  readonly price: string
  readonly cadence: string
  readonly annualPrice: string
  readonly annualCadence: string
  readonly credits: string
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
