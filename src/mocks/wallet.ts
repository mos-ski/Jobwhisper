// All amounts are in cents — the backend system of record stays real currency. The product
// only ever shows credits (1 credit = 40 cents, see src/lib/credits.ts); these cents figures
// are illustrative pending real per-feature cost sign-off from the product owner.
export const CREDIT_WALLET = {
  balanceCents: 1840,
  totalCents: 2200,
  resetDateLabel: 'Sep 9, 2026',
} as const

// Non-subscribers get 5 free credits every month by default.
export const TRIAL_BALANCE_CENTS = 120
export const TRIAL_TOTAL_CENTS = 200

export const FEATURE_RATES = {
  resumeMessageCents: 40,
  autoApplyApplicationCents: 120,
  interviewPrepPerMinuteCents: 80,
  copilotPerMinuteCents: 80,
} as const
