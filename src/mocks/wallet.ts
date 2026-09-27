// All amounts are in cents — the backend system of record stays real currency. The product
// only ever shows credits (1 credit = 40 cents, see src/lib/credits.ts); these cents figures
// are illustrative pending real per-feature cost sign-off from the product owner.
// Free tier: 80 Copilot credits per month (80 * 40 = 3200 cents)
export const CREDIT_WALLET = {
  balanceCents: 3200,
  totalCents: 3200,
  resetDateLabel: 'Oct 10, 2026',
} as const

// Auto Apply credits bought pay-as-you-go ($1/credit), part spent
export const AUTO_APPLY_WALLET = {
  balanceCredits: 64,
  totalCredits: 100,
} as const

// Resume Builder credits bought pay-as-you-go ($0.10/credit), part spent
export const RESUME_BUILDER_WALLET = {
  balanceCredits: 38,
  totalCredits: 50,
} as const

export const FEATURE_RATES = {
  resumeMessageCents: 40,
  autoApplyApplicationCents: 120,
  interviewPrepPerMinuteCents: 80,
  copilotPerMinuteCents: 80,
} as const
