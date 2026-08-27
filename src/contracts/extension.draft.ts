export type ExtensionBoardState = 'start' | 'connect' | 'in-progress'

export type ExtensionJobBoard = {
  readonly id: string
  readonly name: string
  readonly state: ExtensionBoardState
}

export type ExtensionApplyOutcome = 'success' | 'failed'

// One row in a board's live AutoApply feed — revealed progressively while a run is active.
export type ExtensionAppliedJob = {
  readonly id: string
  readonly boardId: string
  readonly title: string
  readonly company: string
  readonly listingUrl: string
  readonly outcome: ExtensionApplyOutcome
  readonly failureReason?: string
}

export type ExtensionRunStats = {
  readonly applied: number
  readonly skipped: number
  readonly status: string
}

// Shared display shape for the Applications tab — covers jobs applied to from the main
// app (AutoApplyJob) and jobs applied to live from the extension's Run tab (ExtensionAppliedJob),
// so the tab doesn't need to know which origin a row came from.
export type ExtensionApplicationRow = {
  readonly id: string
  readonly title: string
  readonly company: string
  readonly dateLabel: string
  readonly outcome: 'success' | 'needs-review' | 'failed' | 'closed'
}
