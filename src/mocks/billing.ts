import type { BillingSnapshot, Plan } from '@/contracts/billing'

export type BillingPlanFixture = {
  readonly id: Plan
  readonly name: string
  /** Per cadence — per week on the weekly plan, per month on the others. */
  readonly priceMonthly: number
  /** Starter bills weekly, the other two monthly. There is no annual rate. */
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
    priceMonthly: 47,
    cadence: 'week',
    included: 'Unlimited interviews',
    description: 'Unlimited Interview Prep and Interview Copilot, on every platform, for the week you are interviewing.',
    features: [
      'Interview Prep and Interview Copilot',
      'Unlimited interview sessions',
      'Web, desktop and mobile',
      'Call recording for every session',
      'Knowledge Base with 3 documents',
    ],
    note: 'Ideal for the week an interview loop actually lands',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 99,
    cadence: 'month',
    included: '500 Auto Apply jobs',
    description: 'Every interview tool unlimited, plus Resume Builder and 500 jobs applied for you each month.',
    features: [
      'Everything in Starter',
      'Meeting Copilot & Coding Copilot',
      'Resume Builder',
      'Auto Apply — 500 jobs a month',
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
    included: 'Unlimited Auto Apply',
    description: 'Everything in Pro, with the job cap taken off Auto Apply.',
    features: [
      'Everything in Pro',
      'Unlimited Auto Apply',
      'Priority support',
      'Knowledge Base with 10 documents',
    ],
    note: 'Best for applying at volume, every month',
  },
]


