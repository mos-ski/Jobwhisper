export type FunnelChoice = {
  readonly label: string
  readonly hint?: string
}

type FunnelQuestionBase = {
  readonly id: string
  /** Short name for the step, shown in the funnel header. */
  readonly tab: string
  readonly ask: string
}

export type FunnelQuestion =
  | (FunnelQuestionBase & { readonly kind: 'options'; readonly options: readonly FunnelChoice[] })
  | (FunnelQuestionBase & { readonly kind: 'pills'; readonly choices: readonly string[] })
  | (FunnelQuestionBase & { readonly kind: 'text'; readonly placeholder: string })

/** Keyed by `FunnelQuestion.id`. */
export type FunnelAnswers = Readonly<Record<string, string>>

export type FunnelTrialOffer = {
  readonly planName: string
  readonly trialDays: number
  /** What the plan unlocks, one short line each, e.g. "Unlimited Interview Copilot and practice". */
  readonly includes: readonly string[]
  readonly monthlyUsd: number
  readonly reminderDaysBefore: number
  /** ISO date (YYYY-MM-DD) of the first charge if the trial is not cancelled. */
  readonly firstChargeOn: string
}

export type FunnelCardStatus = 'idle' | 'processing' | 'declined'
