// All amounts are in cents — the backend system of record stays real currency. The product
// only ever shows credits (1 credit = 40 cents, see src/lib/credits.ts); these cents figures
// are illustrative pending real per-feature cost sign-off from the product owner.
export const CREDIT_WALLET = {
  balanceCents: 3200,
  totalCents: 4000,
  resetDateLabel: 'Sep 9, 2026',
} as const

// Non-subscribers get 5 free credits every month by default.
export const TRIAL_BALANCE_CENTS = 120
export const TRIAL_TOTAL_CENTS = 200

// Auto Apply and Resume Builder are standalone, pay-as-you-go balances (PRICING.md §2.1) —
// priced at $1/credit and $0.10/credit respectively, so the credit count is already the
// natural unit (no cents scaling like CREDIT_WALLET). Both start at 0/0 since neither is
// purchased into by default; totalCredits of 0 reads as "100% left" (nothing spent yet).
export const AUTO_APPLY_WALLET = {
  balanceCredits: 0,
  totalCredits: 0,
} as const

export const RESUME_BUILDER_WALLET = {
  balanceCredits: 0,
  totalCredits: 0,
} as const

export const FEATURE_RATES = {
  resumeMessageCents: 40,
  autoApplyApplicationCents: 120,
  interviewPrepPerMinuteCents: 80,
  copilotPerMinuteCents: 80,
} as const
