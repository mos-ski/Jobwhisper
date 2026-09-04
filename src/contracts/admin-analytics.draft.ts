/**
 * Draft contracts for the admin Analytics module: survey distribution, demographics,
 * interview score distribution, acquisition/conversion funnels, and referral stats.
 *
 * Age is not included in demographics because `AutoApplySetup.dob` is sparsely populated
 * (empty string in the default fixture) and `SettingsProfile` does not collect it at all.
 * The module notes this gap rather than fabricating a field.
 */

/* ---------- Survey distribution ---------- */

export type AdminSurveyDistributionBucket = {
  readonly optionId: string
  readonly label: string
  readonly count: number
  readonly percent: number
}

export type AdminSurveyDistribution = {
  readonly questionId: string
  readonly prompt: string
  readonly type: 'single-select' | 'multi-select' | 'free-text'
  readonly totalResponses: number
  /** Empty for `free-text` questions. */
  readonly buckets: readonly AdminSurveyDistributionBucket[]
}

/* ---------- Demographics ---------- */

export type AdminDemographicBucket = {
  readonly label: string
  readonly count: number
  readonly percent: number
}

export type AdminDemographicDistribution = {
  readonly dimension: string
  readonly total: number
  readonly buckets: readonly AdminDemographicBucket[]
}

/* ---------- Interview scores ---------- */

export type AdminScoreBucket = {
  readonly range: string
  readonly count: number
}

export type AdminScoreDistribution = {
  readonly buckets: readonly AdminScoreBucket[]
  readonly totalSessions: number
  readonly averageScore: number
}

export type AdminScoreTrendPoint = {
  readonly label: string
  readonly averageScore: number
  readonly sessionCount: number
}

export type AdminScoreTrend = {
  readonly points: readonly AdminScoreTrendPoint[]
  readonly totalSessions: number
  readonly averageScore: number
}

/* ---------- Acquisition & conversion funnels ---------- */

export type AdminFunnelStage = {
  readonly id: string
  readonly label: string
  readonly count: number
  readonly percentOfTop: number
  readonly dropOffPercent: number
}

export type AdminFunnel = {
  readonly stages: readonly AdminFunnelStage[]
  readonly totalTopOfFunnel: number
}

export type AdminTimeToConvertBucket = {
  readonly range: string
  readonly count: number
}

export type AdminTimeToConvert = {
  readonly buckets: readonly AdminTimeToConvertBucket[]
  readonly medianDays: number
  readonly averageDays: number
}

/* ---------- Referral stats ---------- */

export type AdminReferralStats = {
  readonly invitesSent: number
  readonly signupsAttributed: number
  readonly conversionToPaidRate: number
  readonly creditsPaidOut: number
  readonly totalReferralRevenue: number
}

/* ---------- Top-level bundle ---------- */

export type AdminAnalyticsSurveyDistributions = {
  readonly dateRangeLabel: string
  readonly distributions: readonly AdminSurveyDistribution[]
}

export type AdminAnalyticsDemographics = {
  readonly dateRangeLabel: string
  readonly distributions: readonly AdminDemographicDistribution[]
}

export type AdminAnalyticsScores = {
  readonly dateRangeLabel: string
  readonly scoreDistribution: AdminScoreDistribution
  readonly scoreTrend: AdminScoreTrend
}

export type AdminAnalyticsFunnels = {
  readonly dateRangeLabel: string
  readonly funnel: AdminFunnel
  readonly timeToConvert: AdminTimeToConvert
}

export type AdminAnalyticsReferrals = {
  readonly dateRangeLabel: string
  readonly stats: AdminReferralStats
}
