import type { ResumeDocument } from './resume.draft'

export type FunnelChoice = {
  readonly label: string
  readonly hint?: string
}

type FunnelQuestionBase = {
  readonly id: string
  /** Short name for the step, shown in the funnel header. */
  readonly tab: string
  readonly ask: string
  /** A lede under the heading, above the controls. */
  readonly note?: string
  /** A helper banner under the controls; always paired with an icon, never colour alone. */
  readonly banner?: string
  /** Label for this question's continue/finish button, when it should differ from the default. */
  readonly cta?: string
}

export type FunnelQuestion =
  | (FunnelQuestionBase & { readonly kind: 'options'; readonly options: readonly FunnelChoice[] })
  | (FunnelQuestionBase & { readonly kind: 'pills'; readonly choices: readonly string[] })
  | (FunnelQuestionBase & {
      readonly kind: 'multi'
      readonly choices: readonly string[]
      readonly maxSelections: number
      /** Show only the first N choices until the visitor asks for more. */
      readonly collapsedCount?: number
    })
  | (FunnelQuestionBase & {
      readonly kind: 'text'
      readonly placeholder: string
      /** Offered in a dropdown as the visitor types; the first few also show as one-click chips. */
      readonly suggestions?: readonly string[]
      /** Checkbox rows under the input, stored as `"<id>.checks"` (pipe-joined labels). */
      readonly checks?: readonly string[]
      /** Whether each check starts selected while the answer is empty. */
      readonly checksDefault?: boolean
    })
  | (FunnelQuestionBase & {
      readonly kind: 'range'
      /** Whole US dollars. The top of the scale reads as "and up". */
      readonly min: number
      readonly max: number
      readonly step: number
      readonly defaultRange: readonly [number, number]
      /** Two-unit segmented toggle (e.g. Annually / Hourly), stored as `"<id>.unit"`; defaults to the first entry. */
      readonly unitToggle?: readonly [string, string]
      /** A link under the slider that clears the answer and moves on. */
      readonly skipLabel?: string
    })

/** Keyed by `FunnelQuestion.id`. A range answer is stored as `"<low>-<high>"` in whole dollars, e.g. `"80000-130000"`. */
export type FunnelAnswers = Readonly<Record<string, string>>

export type FunnelTrialOffer = {
  readonly planName: string
  readonly trialDays: number
  /** What the plan unlocks, one short line each, e.g. "Unlimited Interview Copilot and practice". */
  readonly includes: readonly string[]
  readonly monthlyUsd: number
  /** What the first week costs, charged today (e.g. 4.57). */
  readonly introUsd: number
  readonly reminderDaysBefore: number
  /** ISO date (YYYY-MM-DD) of the first charge if the trial is not cancelled. */
  readonly firstChargeOn: string
}

export type FunnelCardStatus = 'idle' | 'declined'

export type AtsIssueSeverity = 'high' | 'medium' | 'low'

export type AtsIssue = {
  readonly id: string
  /** The problem, stated plainly, e.g. "No results in 4 of 6 bullets". */
  readonly label: string
  /** What Jobwhisper changes to fix it. */
  readonly fix: string
  readonly severity: AtsIssueSeverity
}

export type AtsReport = {
  /** 0 to 100. */
  readonly score: number
  /** Words for the score, so it never rests on colour alone, e.g. "Likely filtered out". */
  readonly verdict: string
  readonly issues: readonly AtsIssue[]
}

export type ResumeRewrite = {
  /** One resume; the template shows `summary`, `roles` and `skills` as uploaded and the `improved*` fields as rewritten. */
  readonly document: ResumeDocument
  readonly scoreBefore: number
  readonly scoreAfter: number
}
