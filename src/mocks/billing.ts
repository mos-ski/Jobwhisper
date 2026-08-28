import type { AddOnId, BillingSnapshot, Plan } from '@/contracts/billing'

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

// Offered as an order-bump the moment a plan card is subscribed to (see PlanSelectionView).
// Nested unlocks (Full-Auto mode, AI Suggestions/Premium Templates) aren't offered here — they
// surface later, inside the Auto Apply / Resume Builder product surfaces themselves.
export type CheckoutAddOnOffer = {
  readonly id: AddOnId
  readonly name: string
  readonly priceMonthly: number
  readonly description: string
}

export const checkoutAddOnFixtures: readonly CheckoutAddOnOffer[] = [
  {
    id: 'auto-apply',
    name: 'Auto Apply',
    priceMonthly: 40,
    description: 'Let Jobwhisper apply to jobs for you, you pick the roles, the agents handle the applications.',
  },
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    priceMonthly: 15,
    description: 'AI-tailored resumes for every role, with unlimited downloads.',
  },
]

// A Pro subscriber who hasn't purchased either add-on — the default demo account.
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
  addOns: {
    'resume-builder': { addOn: 'resume-builder', entitled: false, priceMonthly: 15 },
    'resume-ai-suggestions': { addOn: 'resume-ai-suggestions', entitled: false, priceMonthly: 0 },
    'auto-apply': { addOn: 'auto-apply', entitled: false, priceMonthly: 40 },
    'auto-apply-full-auto': { addOn: 'auto-apply-full-auto', entitled: false, priceMonthly: 10 },
  },
}

export const authPlanFixtures: readonly BillingPlanFixture[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 20,
    includedUsageCents: 800,
    description: 'You get 20 credits per month, metered by what each feature actually costs to run.',
    features: [
      'Interview Prep & Interview Copilot',
      'Web only',
      '20 credits per month',
    ],
    note: 'Ideal for light or occasional interview prep',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 100,
    includedUsageCents: 4000,
    description: 'More usage included, plus the desktop app and Coding Copilot for technical rounds.',
    features: [
      'Everything in Starter',
      'Web + Desktop app',
      'Coding Copilot',
      '100 credits per month',
    ],
    note: 'Best for candidates interviewing across technical and non-technical roles',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 200,
    includedUsageCents: 8000,
    description: 'Everything Pro has, plus Meeting Copilot for live client and stakeholder calls.',
    features: [
      'Everything in Pro',
      'Meeting Copilot',
      '200 credits per month',
    ],
    note: 'Best for power users who live in interviews and meetings',
  },
]
