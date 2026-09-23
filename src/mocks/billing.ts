import type { BillingSnapshot, Plan } from '@/contracts/billing'

export type BillingPlanFixture = {
  readonly id: Plan
  readonly name: string
  /** Per cadence — per week on the weekly plan, per month on the others. */
  readonly priceMonthly: number
  /** Starter bills weekly; a weekly plan has no annual rate to switch to. */
  readonly cadence: 'week' | 'month'
  /** What the plan includes, now that it is not an amount. */
  readonly included: string
  readonly description: string
  readonly features: readonly string[]
  readonly note: string
  readonly popular?: boolean
}

// A free-tier user — just signed up, no subscription yet. Gets 80 Copilot credits,
// 10 Auto Apply credits, and 10 Resume Builder credits per month.
export const billingSnapshot: BillingSnapshot = {
  status: 'ready',
  plan: 'starter',
  wallet: {
    balance: 80,
    currency: 'credits',
    reserved: 0,
  },
  access: {
    resume: { feature: 'resume', entitled: false, creditCost: 1 },
    'interview-prep': { feature: 'interview-prep', entitled: false, creditCost: 1 },
    'auto-apply': { feature: 'auto-apply', entitled: false, creditCost: 1 },
    copilot: { feature: 'copilot', entitled: true, creditCost: 1 },
  },
}

export const authPlanFixtures: readonly BillingPlanFixture[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 19,
    cadence: 'week',
    included: 'Unlimited use',
    description: 'Unlimited Interview Copilot on web and desktop, for the week you are interviewing.',
    features: [
      'Interview Copilot on web and desktop',
      'Unlimited live interview sessions',
      'Knowledge Base with 3 documents',
    ],
    note: 'Ideal for the week an interview loop actually lands',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 99,
    cadence: 'month',
    included: 'Unlimited use',
    description: 'Every Jobwhisper tool, unlimited, for the length of your search.',
    features: [
      'Everything in Starter',
      'Interview Prep',
      'Coding Copilot & Meeting Copilot',
      'Auto Apply & Resume Builder',
      'Knowledge Base with 5 documents',
    ],
    note: 'Best for a search that runs longer than a week',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 497,
    cadence: 'month',
    included: 'Unlimited use',
    description: 'Pro, plus a recording of every session and priority support.',
    features: [
      'Everything in Pro',
      'Call recording for every session',
      'Priority support',
      'Knowledge Base with 10 documents',
    ],
    note: 'Best for candidates who want every session on the record',
  },
]

