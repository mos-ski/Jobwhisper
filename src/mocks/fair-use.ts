import type { FairUseSnapshot } from '@/contracts/fair-use.draft'

/**
 * Fair-use snapshots as a Pro subscriber sees them (PRICING.md §1.2): a 120-minute interview
 * stretch, 25 Resume Builder prompts, 50 applications a run. The unlock offers are priced at
 * the pay-as-you-go rates so buying past a cooldown costs the same as buying without a plan.
 */

const interviewPolicy = {
  feature: 'interview',
  unit: 'minutes',
  stretchLimit: 120,
  cooldownHours: 3,
  topUpUnlocks: true,
} as const

export const interviewFairUseRunning: FairUseSnapshot = {
  policy: interviewPolicy,
  used: 34,
  state: 'running',
}

export const interviewFairUseNearing: FairUseSnapshot = {
  policy: interviewPolicy,
  used: 104,
  state: 'nearing-limit',
}

export const interviewFairUseSpent: FairUseSnapshot = {
  policy: interviewPolicy,
  used: 120,
  state: 'cooling-down',
  cooldownRemainingLabel: '2h 47m',
  resumesAtLabel: '6:20 PM',
  unlockOffer: { priceCents: 1_000, unitsGranted: 100, label: '100 interview minutes' },
}

/** The same wall on a plan that does not sell a way past it — the clock is the only route. */
export const interviewFairUseSpentNoUnlock: FairUseSnapshot = {
  policy: { ...interviewPolicy, topUpUnlocks: false },
  used: 120,
  state: 'cooling-down',
  cooldownRemainingLabel: '2h 47m',
  resumesAtLabel: '6:20 PM',
}

export const resumeFairUseNearing: FairUseSnapshot = {
  policy: { feature: 'resume-builder', unit: 'prompts', stretchLimit: 25, cooldownHours: 3, topUpUnlocks: true },
  used: 22,
  state: 'nearing-limit',
}

export const resumeFairUseSpent: FairUseSnapshot = {
  policy: { feature: 'resume-builder', unit: 'prompts', stretchLimit: 25, cooldownHours: 3, topUpUnlocks: true },
  used: 25,
  state: 'cooling-down',
  cooldownRemainingLabel: '2h 12m',
  resumesAtLabel: '4:45 PM',
  unlockOffer: { priceCents: 500, unitsGranted: 50, label: '50 Resume Builder prompts' },
}

export const autoApplyFairUseRunning: FairUseSnapshot = {
  policy: { feature: 'auto-apply', unit: 'applications', stretchLimit: 50, cooldownHours: 5, topUpUnlocks: true },
  used: 18,
  state: 'running',
}

export const autoApplyFairUseSpent: FairUseSnapshot = {
  policy: { feature: 'auto-apply', unit: 'applications', stretchLimit: 50, cooldownHours: 5, topUpUnlocks: true },
  used: 50,
  state: 'cooling-down',
  cooldownRemainingLabel: '4h 31m',
  resumesAtLabel: '9:05 PM',
  unlockOffer: { priceCents: 1_000, unitsGranted: 10, label: '10 Auto Apply credits' },
}
