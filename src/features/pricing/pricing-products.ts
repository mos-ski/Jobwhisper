import type { PlanTerms } from './plan-card'

/** Pay-as-you-go products, shown on the public pricing page and in Billing. */
export type CreditProduct = {
  readonly id: string
  readonly name: string
  readonly tagline: string
  /** Split from the rate so the figure can carry the card's 32px price style. */
  readonly amount: string
  readonly unit: string
  readonly terms: PlanTerms
  readonly description: string
  readonly features: readonly string[]
  /** Which plan-card colour wash the card wears. */
  readonly wash: 'starter' | 'pro' | 'premium'
  /** Dollars per unit, and how the unit reads after the rate. */
  readonly rate: number
  readonly rateUnit: string
  readonly unitNoun: { readonly one: string; readonly many: string }
  /** The packs the card offers, in dollars, smallest first. */
  readonly packs: readonly number[]
}

export const CREDIT_PRODUCTS: readonly CreditProduct[] = [
  {
    id: 'interview',
    rate: 0.1,
    rateUnit: 'per interview minute',
    unitNoun: { one: 'interview minute', many: 'interview minutes' },
    packs: [10, 25, 50, 100],
    wash: 'starter',
    name: 'Interview',
    tagline: 'Pay for the minutes you use',
    amount: '$0.10',
    unit: 'per interview minute',
    terms: [['Minimum purchase', '$10'], ['Credits valid for', '30 days']],
    description: 'Live support while the interview runs, and realistic practice before it.',
    features: [
      'One credit per minute of a session',
      'Works for Interview Prep and Interview Copilot',
      'Web and desktop',
      'No subscription required',
    ],
  },
  {
    id: 'resume',
    rate: 0.1,
    rateUnit: 'per AI prompt',
    unitNoun: { one: 'AI prompt', many: 'AI prompts' },
    packs: [5, 10, 25, 50],
    wash: 'pro',
    name: 'Resume Builder',
    tagline: 'Pay for the prompts you use',
    amount: '$0.10',
    unit: 'per AI prompt',
    terms: [['Minimum purchase', '$5'], ['Credits valid for', '30 days']],
    description: 'Tailor a resume to a role, refine individual sections, and download the finished version.',
    features: ['One credit per AI prompt', 'ATS scoring is free', 'Unlimited downloads', 'No subscription required'],
  },
  {
    id: 'auto-apply',
    rate: 1,
    rateUnit: 'per successful application',
    unitNoun: { one: 'application', many: 'applications' },
    packs: [10, 25, 50, 100],
    wash: 'premium',
    name: 'Auto Apply',
    tagline: 'Pay only when one lands',
    amount: '$1',
    unit: 'per successful application',
    terms: [['Minimum purchase', '$10'], ['Credits valid for', '30 days']],
    description: 'Choose suitable jobs and let Jobwhisper prepare and submit each application for you.',
    features: [
      'Charged only after an application succeeds',
      'Includes job matching and resume tailoring',
      'Track every application status',
      'No subscription required',
    ],
  },
]
