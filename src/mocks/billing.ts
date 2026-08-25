import type { BillingSnapshot, Plan } from '@/contracts/billing'

export type BillingPlanFixture = {
  readonly id: Plan
  readonly name: string
  readonly priceMonthly: number
  readonly includedUsageCents: number
  readonly description: string
  readonly features: readonly string[]
  readonly note: string
  readonly popular?: boolean
}

export const billingSnapshot: BillingSnapshot = {
  status: 'ready',
  plan: 'pro',
  wallet: {
    balance: 32,
    currency: 'credits',
    reserved: 0,
  },
  access: {
    resume: { feature: 'resume', entitled: true, creditCost: 1 },
    'interview-prep': { feature: 'interview-prep', entitled: true, creditCost: 1 },
    'auto-apply': { feature: 'auto-apply', entitled: true, creditCost: 1 },
    copilot: { feature: 'copilot', entitled: true, creditCost: 1 },
  },
}

export const authPlanFixtures: readonly BillingPlanFixture[] = [
  {
    id: 'free',
    name: 'Starter',
    priceMonthly: 27,
    includedUsageCents: 800,
    description: 'You get 20 credits per month, metered by what each feature actually costs to run.',
    features: [
      'Resume builder',
      'Resume downloads',
      'AI suggestions',
    ],
    note: 'Ideal for light or occasional job applications',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 49,
    includedUsageCents: 2200,
    description: 'More usage included, and every feature is unlocked, so you have room to job-hunt aggressively.',
    features: [
      'Everything in Starter',
      'Auto-Apply (Scout, Filter, Tailor & Driver agents)',
      'AI interview prep',
      'Interview & Coding Copilot',
    ],
    note: 'Best for users who want AI and autopilot help consistently',
    popular: true,
  },
  {
    id: 'business',
    name: 'Premium',
    priceMonthly: 79,
    includedUsageCents: 4000,
    description: 'Built for power users who apply daily or want maximum automation.',
    features: [
      'Everything in Pro',
      'Meeting Copilot',
      'Automate job applications with a daily quota',
      'Priority support',
    ],
    note: 'Best value for serious job hunters',
  },
]
