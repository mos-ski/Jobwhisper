import type { BillingSnapshot, Plan } from '@/contracts/billing'

export type BillingPlanFixture = {
  readonly id: Plan
  readonly name: string
  readonly priceMonthly: number
  // Back-computed as credits * 40 so the shared formatCredits() helper (still hardcoded to the
  // old $0.40/credit constant, see src/lib/credits.ts) displays the right whole-credit number.
  // Not a real cents amount anymore — PRICING.md §3 dropped the fixed $/credit rate, but
  // rewriting that shared helper for a per-feature rate is out of scope here.
  readonly includedUsageCents: number
  readonly description: string
  readonly features: readonly string[]
  readonly note: string
  readonly popular?: boolean
}

// A Pro subscriber — the default demo account. Auto Apply and Resume Builder are no longer
// subscription add-ons (see PRICING.md §2) — they're standalone, pay-as-you-go purchases with
// their own prepaid credit balance per feature, not modeled in BillingSnapshot yet.
export const billingSnapshot: BillingSnapshot = {
  status: 'ready',
  plan: 'pro',
  wallet: {
    balance: 80,
    currency: 'credits',
    reserved: 0,
  },
  access: {
    resume: { feature: 'resume', entitled: false, creditCost: 1 },
    'interview-prep': { feature: 'interview-prep', entitled: true, creditCost: 1 },
    'auto-apply': { feature: 'auto-apply', entitled: false, creditCost: 1 },
    copilot: { feature: 'copilot', entitled: true, creditCost: 1 },
  },
}

export const authPlanFixtures: readonly BillingPlanFixture[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 47,
    includedUsageCents: 500 * 40,
    description: 'Interview Prep and Interview Copilot, on the web.',
    features: [
      'Interview Prep & Interview Copilot',
      'Web only',
      '≈500 credits per month',
    ],
    note: 'Ideal for light or occasional interview prep',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 99,
    includedUsageCents: 1000 * 40,
    description: 'More usage included, plus the desktop app, Coding Copilot, and Meeting Copilot.',
    features: [
      'Everything in Starter',
      'Web + Desktop app',
      'Coding Copilot & Meeting Copilot',
      '≈1,000 credits per month',
    ],
    note: 'Best for candidates interviewing across technical and non-technical roles',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 197,
    includedUsageCents: 4000 * 40,
    description: 'Everything Pro has, at 2x the size — for power users who live in interviews.',
    features: [
      'Everything in Pro',
      '2x size: ≈4,000 credits per month',
    ],
    note: 'Best for power users who live in interviews and meetings',
  },
]
