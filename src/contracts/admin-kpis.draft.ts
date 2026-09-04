/** One line in the "path to target" breakdown — a plan's assumed volume and the revenue it produces. */
export type AdminKpiPlanLine = {
  readonly id: string
  readonly label: string
  readonly volumeLabel: string
  readonly revenueCents: number
}

export type AdminKpiPackageRow = {
  readonly label: string
  readonly priceCents: number
  readonly sales: number
  readonly revenueCents: number
}

export type AdminKpiTierRow = {
  readonly label: string
  readonly priceCents: number
  readonly mixPercent: number
  readonly subscribers: number
  readonly revenueCents: number
}

export type AdminKpiSourceRow = {
  readonly label: string
  readonly volumeLabel: string
  readonly revenueCents: number
}

export type AdminKpiUpsellRow = {
  readonly label: string
  readonly where: string
  readonly offer: string
}

export type AdminKpiPlanSummary = {
  readonly label: string
  readonly howItWorks: string
  readonly priceLabel: string
}

export type AdminKpiNote = {
  readonly title: string
  readonly body: string
}

export type AdminKpiVslForecast = {
  readonly monthlySignups: number
  readonly firstMonthPriceCents: number
  readonly renewalPriceCents: number
  readonly renewalRatePercent: number
}

export type AdminRevenueKpis = {
  /** The self-sustaining monthly revenue target — the one editable number on this page. */
  readonly targetCents: number
  readonly plans: readonly AdminKpiPlanSummary[]
  readonly pathToTarget: readonly AdminKpiPlanLine[]
  readonly pathToTargetNote: string
  readonly doneForYouPackages: readonly AdminKpiPackageRow[]
  readonly doneForYouNote: string
  readonly aceYourInterviewTiers: readonly AdminKpiTierRow[]
  readonly aceYourInterviewNote: string
  readonly findYourJobSources: readonly AdminKpiSourceRow[]
  readonly findYourJobNote: string
  readonly pricingNote: string
  readonly upsells: readonly AdminKpiUpsellRow[]
  readonly acquisitionNotes: readonly AdminKpiNote[]
  readonly vslForecast: AdminKpiVslForecast
}
