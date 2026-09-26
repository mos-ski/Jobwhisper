/**
 * Draft contracts for fair use: the ceiling that sits underneath "unlimited". A plan does not
 * meter how much someone uses across a cycle, but it does bound one uninterrupted stretch.
 * A stretch runs to its cap, the feature then cools down for a set number of hours, and the
 * person either waits it out or buys their way past the cooldown now.
 *
 * Durations are whole numbers in the unit named on the policy. Anything a person reads is a
 * pre-formatted display string, so nothing here parses or compares a date.
 */

/** The three features sold as unlimited, and so the three that need a stretch cap. */
export type FairUseFeature = 'interview' | 'resume-builder' | 'auto-apply'

/** What a stretch is counted in. Fixed per feature: the cap is typed in this unit. */
export type FairUseUnit = 'minutes' | 'prompts' | 'applications'

export type FairUsePolicy = {
  readonly feature: FairUseFeature
  readonly unit: FairUseUnit
  /** How far one uninterrupted stretch runs before the cooldown starts. */
  readonly stretchLimit: number
  /** Hours the feature stays shut afterwards, unless the cooldown is bought out. */
  readonly cooldownHours: number
  /**
   * Whether buying credits ends the cooldown immediately. Off means the clock is the only
   * way through, which is the honest setting for a feature we cannot serve at that rate.
   */
  readonly topUpUnlocks: boolean
}

/**
 * `nearing-limit` exists so the warning is a designed state rather than a threshold every
 * view re-derives: someone in a live interview needs to see the wall coming, not hit it.
 */
export type FairUseState = 'running' | 'nearing-limit' | 'cooling-down'

/** What ends a cooldown early, priced once here so no view prices it again. */
export type FairUseUnlockOffer = {
  readonly priceCents: number
  readonly unitsGranted: number
  /** Spelled out for the button, e.g. "100 interview minutes". */
  readonly label: string
}

export type FairUseSnapshot = {
  readonly policy: FairUsePolicy
  /** Spent so far in the current stretch, in the policy's unit. */
  readonly used: number
  readonly state: FairUseState
  /** Set while cooling down: the countdown as it should read, e.g. "4h 37m". */
  readonly cooldownRemainingLabel?: string
  /** Set while cooling down: when the feature reopens, e.g. "9:20 PM". */
  readonly resumesAtLabel?: string
  /** Absent when the policy does not sell a way past the cooldown. */
  readonly unlockOffer?: FairUseUnlockOffer
}
