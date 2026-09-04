/**
 * Draft contract for the admin Transactions module. Money is always integer cents.
 * Dates are pre-formatted display strings so views never parse or localize a date.
 */

export type AdminTransactionsTab = 'all' | 'incoming' | 'outgoing' | 'disputes' | 'refunds'

/** Money in is a renewal, a top-up, a Done-For-You package or a marketplace item. Money out is a refund or a partner payout. */
export type AdminTransactionType =
  | 'subscription-renewal'
  | 'credit-top-up'
  | 'done-for-you'
  | 'marketplace'
  | 'refund'
  | 'payout'

export type AdminTransactionDirection = 'incoming' | 'outgoing'

export type AdminTransactionStatus = 'succeeded' | 'pending' | 'failed' | 'refunded' | 'disputed'

/** `'all'` is the unfiltered state, so the filter can round-trip through a single URL param. */
export type AdminTransactionStatusFilter = AdminTransactionStatus | 'all'

export type AdminPaymentMethod = {
  /** Card network or wallet name, e.g. "Visa", "Mastercard", "PayPal". */
  readonly brand: string
  /** Empty string for methods with no card number, e.g. PayPal or ACH. */
  readonly last4: string
  /** Display form the whole app shows, e.g. "Visa •••• 4242". */
  readonly label: string
  readonly expiryLabel?: string
}

export type AdminTransactionRow = {
  /** Stripe-style opaque id, also the detail route segment. */
  readonly id: string
  readonly customerName: string
  readonly customerEmail: string
  /** Plan, package or product the money was for, e.g. "Ace Your Interview — Pro". */
  readonly productLabel: string
  readonly type: AdminTransactionType
  readonly direction: AdminTransactionDirection
  /** Always positive. `direction` decides whether it reads as money in or money out. */
  readonly amountCents: number
  readonly method: AdminPaymentMethod
  readonly status: AdminTransactionStatus
  readonly dateLabel: string
  /** Present on `failed` rows — the decline reason a support agent can act on. */
  readonly failureReason?: string
  /** Number of dunning retries already attempted on a failed renewal. */
  readonly retryCount?: number
}

export type AdminDisputeReason = 'fraudulent' | 'product-not-received' | 'duplicate' | 'subscription-cancelled'

export type AdminDisputeStatus = 'needs-response' | 'under-review' | 'evidence-submitted' | 'accepted' | 'won' | 'lost'

export type AdminDisputeRow = {
  readonly id: string
  /** The `AdminTransactionRow.id` the dispute was raised against. */
  readonly transactionId: string
  readonly customerName: string
  readonly customerEmail: string
  readonly productLabel: string
  readonly amountCents: number
  readonly reason: AdminDisputeReason
  /** Free-text the card network passed through from the cardholder. */
  readonly reasonDetail: string
  readonly openedLabel: string
  readonly evidenceDueLabel: string
  /** Negative once the deadline has passed, so the view can escalate without parsing dates. */
  readonly daysUntilEvidenceDue: number
  readonly status: AdminDisputeStatus
}

export type AdminRefundReason =
  | 'duplicate-charge'
  | 'accidental-renewal'
  | 'service-not-used'
  | 'dissatisfied'
  | 'billing-error'

export type AdminRefundStatus = 'pending' | 'approved' | 'denied'

export type AdminRefundRequestRow = {
  readonly id: string
  readonly transactionId: string
  readonly requesterName: string
  readonly requesterEmail: string
  readonly productLabel: string
  /** Amount requested back, which may be a proration rather than the full original charge. */
  readonly amountCents: number
  /** Original charge, so a partial request is legible next to what was actually paid. */
  readonly originalAmountCents: number
  readonly reason: AdminRefundReason
  readonly note: string
  readonly requestedLabel: string
  readonly status: AdminRefundStatus
}

export type AdminTransactionsSummary = {
  readonly rangeLabel: string
  readonly grossVolumeCents: number
  readonly grossVolumeCount: number
  readonly netRevenueCents: number
  readonly netRevenueCount: number
  readonly refundedCents: number
  readonly refundedCount: number
  readonly disputedCents: number
  readonly disputedCount: number
  readonly failedRenewalCount: number
  readonly failedRenewalCents: number
}

export type AdminTransactionLineItem = {
  readonly id: string
  readonly description: string
  /** Second line under the description: billing window, credit count, package contents. */
  readonly detail: string
  readonly quantity: number
  readonly unitAmountCents: number
  readonly amountCents: number
}

export type AdminTransactionEventKind =
  | 'created'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'retried'
  | 'refunded'
  | 'disputed'
  | 'evidence-submitted'

export type AdminTransactionEvent = {
  readonly id: string
  readonly kind: AdminTransactionEventKind
  readonly label: string
  readonly detail: string
  readonly timestampLabel: string
  /** Admin or system that produced the event, e.g. "Dunning worker", "Daniel Okoye". */
  readonly actor: string
}

export type AdminTransactionCustomer = {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly planLabel: string
  readonly customerSinceLabel: string
  readonly accountHref: string
  readonly billingAddressLines: readonly string[]
}

export type AdminTransactionDetail = {
  readonly id: string
  readonly invoiceNumber: string
  readonly type: AdminTransactionType
  readonly direction: AdminTransactionDirection
  readonly status: AdminTransactionStatus
  readonly dateLabel: string
  /** What the customer sees on their card statement. */
  readonly statementDescriptor: string
  readonly customer: AdminTransactionCustomer
  readonly method: AdminPaymentMethod
  readonly lineItems: readonly AdminTransactionLineItem[]
  readonly subtotalCents: number
  readonly taxCents: number
  /** Names the jurisdiction and rate, or why no tax was collected. */
  readonly taxLabel: string
  readonly totalCents: number
  /** Amount already refunded against this transaction; 0 when nothing has been returned. */
  readonly refundedCents: number
  readonly events: readonly AdminTransactionEvent[]
  /** Present only when `status` is `'disputed'`. */
  readonly dispute?: AdminDisputeRow
  readonly failureReason?: string
  /** Filename the download-invoice affordance would produce. */
  readonly invoiceFileName: string
}
