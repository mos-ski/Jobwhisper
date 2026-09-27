import type { PlanTerms } from './plan-card'

/** Pay-as-you-go products and Done for you packages, shown on the public pricing page and in Billing. */
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
}

export type ManagedPackage = {
  readonly id: string
  readonly name: string
  readonly tagline: string
  readonly price: number
  readonly terms: PlanTerms
  readonly description: string
  readonly features: readonly string[]
}

export const CREDIT_PRODUCTS: readonly CreditProduct[] = [
  {
    id: 'interview',
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

export const MANAGED_PACKAGES: readonly ManagedPackage[] = [
  {
    id: 'ten-interviews',
    name: '5 interviews guaranteed',
    tagline: 'A managed search, start to offer',
    price: 497,
    terms: [['Interviews guaranteed', '5'], ['Payment', 'One time']],
    description: 'A dedicated success manager runs your search until you receive 5 interview invitations.',
    features: [
      'Job scouting and match review',
      'Resume tailoring for each role',
      'Applications submitted for you',
      'Full Jobwhisper access during fulfillment',
    ],
  },
  {
    id: 'twenty-interviews',
    name: '20 interviews guaranteed',
    tagline: 'The same service, run longer',
    price: 1997,
    terms: [['Interviews guaranteed', '20'], ['Payment', 'One time']],
    description: 'The same managed service for a longer search, continuing until 20 invitations are delivered.',
    features: [
      'Job scouting and match review',
      'Resume tailoring for each role',
      'Applications submitted for you',
      'Full Jobwhisper access during fulfillment',
      'Priority scheduling',
    ],
  },
]
