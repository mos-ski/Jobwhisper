/** A person on the Done-For-You team who tailors, scouts and applies for one client until the guarantee is met. */
export type SuccessManager = {
  readonly id: string
  /** First name and last initial, as shown to clients. */
  readonly name: string
  /** Portrait URL; initials show when absent. */
  readonly photoUrl?: string
  readonly title: string
  readonly yearsExperience: number
  /** Average client rating out of 5. */
  readonly rating: number
  /** Clients this manager has taken through to their guaranteed interviews. */
  readonly clientsPlaced: number
  /** Companies the manager's clients have interviewed at. */
  readonly companies: readonly string[]
  readonly specialties: readonly string[]
  readonly bio: string
  /** What this manager charges, in USD, paid once. */
  readonly price: number
  /** Interviews this manager guarantees for that price. */
  readonly interviewsGuaranteed: number
  readonly review?: {
    readonly quote: string
    readonly author: string
    /** ISO date, e.g. `2026-08-14`. */
    readonly date: string
  }
  /** ISO date the manager next takes a client; absent when they have room now. */
  readonly nextOpening?: string
}

export type SuccessManagerDirectory =
  | { readonly status: 'loading' }
  | { readonly status: 'error' }
  | { readonly status: 'ready'; readonly managers: readonly SuccessManager[] }

export type DfyApplicationStatus = 'sent' | 'viewed' | 'interview' | 'rejected'

/** One application the success manager submitted for the client. */
export type DfyApplication = {
  readonly id: string
  readonly company: string
  readonly role: string
  readonly location: string
  /** ISO date the application went out. */
  readonly sentOn: string
  readonly status: DfyApplicationStatus
}

/** A client's active Done-For-You package. */
export type DoneForYouEngagement = {
  readonly managerId: string
  readonly packageId: 'dfy-small' | 'dfy-large'
  readonly interviewsGuaranteed: number
  readonly interviewsLanded: number
  readonly applicationsSent: number
  readonly replies: number
  /** ISO dates. */
  readonly startedOn: string
  readonly nextUpdateOn: string
  readonly latestUpdate: { readonly date: string; readonly note: string }
  readonly applications: readonly DfyApplication[]
}
