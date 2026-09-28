/** The three kinds of live session the desktop app runs. */
export type DesktopSessionKind = 'interview' | 'coding' | 'meeting'

/** A finished session, as listed on the home screen and under Settings, Usage. */
export type DesktopSessionSummary = {
  readonly id: string
  readonly title: string
  readonly kind: DesktopSessionKind
  readonly company?: string
  /** ISO date-time the session started. */
  readonly startedAt: string
  readonly durationMinutes: number
}

/** The one credit pool every feature spends from. */
export type DesktopCredits = {
  readonly balance: number
  readonly usedThisPeriod: number
  readonly periodAllowance: number
  readonly spentAllTime: number
}

/** A run of text in a Copilot answer; `emphasis` marks the facts drawn from the resume. */
export type DesktopAnswerRun = { readonly text: string; readonly emphasis?: boolean }

export type DesktopTranscriptEntry =
  | { readonly kind: 'interviewer'; readonly id: string; readonly text: string; readonly partial?: boolean }
  | {
      readonly kind: 'answer'
      readonly id: string
      /** The question as Copilot understood it. */
      readonly question: string
      readonly runs: readonly DesktopAnswerRun[]
    }

export type DesktopChatMessage = { readonly id: string; readonly author: 'you' | 'copilot'; readonly text: string }

export type DesktopResponseType = 'default' | 'headlines' | 'coaching'
export type DesktopResponseLength = 'short' | 'medium' | 'long'
export type DesktopConnection = 'connected' | 'fair' | 'unstable'
/** What the live session is doing right now, shown under the toolbar. */
export type DesktopActivity = 'listening' | 'thinking' | 'answering'

/** A finished-setup snapshot of what the person chose before starting. */
export type DesktopSessionConfig = {
  readonly kind: DesktopSessionKind
  readonly role: string
  readonly company: string
  readonly resumeName?: string
  readonly documentNames: readonly string[]
  readonly context: string
  readonly responseType: DesktopResponseType
  readonly model: string
  readonly language: string
  readonly answerOnlyWhenAsked: boolean
  readonly saveTranscript: boolean
}

export type DesktopReleaseNote = {
  readonly version: string
  /** ISO date. */
  readonly date: string
  readonly items: readonly { readonly title: string; readonly detail: string }[]
}
