export type AdminActivityEventKind = 'signup' | 'login' | 'payment' | 'refund' | 'payout'

export type AdminActivityEvent = {
  readonly id: string
  readonly kind: AdminActivityEventKind
  readonly actorName: string
  readonly actorEmail: string
  readonly detail: string
  /** Only set for payment/refund/payout events — the money-in or money-out amount. */
  readonly amountCents?: number
  readonly timeAgo: string
  readonly href: string
}

export type AdminActivityFeed = {
  readonly events: readonly AdminActivityEvent[]
  readonly signupsToday: number
  readonly loginsToday: number
  readonly incomeTodayCents: number
}
