/**
 * Draft contracts for admin-issued invites: bringing someone into Jobwhisper by email or by
 * a shareable link, optionally with a plan or a credit balance already attached to the
 * account they land in. Dates shown to an admin are pre-formatted display strings; the only
 * machine-comparable date is the `YYYY-MM-DD` calendar string a date input produces.
 */

import type { AdminConfigPlanId } from './admin-configuration.draft'

/** Emailed to one person, or a link the admin hands out however they like. */
export type AdminInviteDelivery = 'email' | 'link'

/** The pay-as-you-go balances an invite can seed. Mirrors the pricing page's three. */
export type AdminInviteCreditProduct = 'interview' | 'auto-apply' | 'resume-builder'

/**
 * What is already in the account when the invite is accepted. A plan covers a number of
 * cycles and then renews at the plan price like any other subscription; credits sit in the
 * pay-as-you-go balance and run out. Either way the person starts paying once it is spent,
 * which is the point of attaching it rather than discounting the plan itself.
 */
export type AdminInviteGrant =
  | { readonly kind: 'none' }
  | { readonly kind: 'plan'; readonly planId: AdminConfigPlanId; readonly cycles: number }
  | { readonly kind: 'credits'; readonly product: AdminInviteCreditProduct; readonly amount: number }

/** How many accounts one invite can create. A link can be a campaign; an email is one person. */
export type AdminInviteUses =
  | { readonly kind: 'limited'; readonly max: number }
  | { readonly kind: 'unlimited' }

export type AdminInviteStatus = 'pending' | 'accepted' | 'expired' | 'revoked'

export type AdminInvite = {
  readonly id: string
  readonly delivery: AdminInviteDelivery
  /** Set when delivery is 'email'. A link invite has no one address. */
  readonly email?: string
  /** Every invite has a URL; an email invite is that URL, sent. */
  readonly url: string
  readonly grant: AdminInviteGrant
  /** What the grant is worth, spelled out once so no view has to price it again. */
  readonly grantLabel: string
  readonly uses: AdminInviteUses
  readonly acceptedCount: number
  readonly status: AdminInviteStatus
  /** Display strings. `expiresLabel` is empty when the invite does not expire. */
  readonly createdLabel: string
  readonly expiresLabel: string
  readonly createdBy: string
  /** Free text an admin can use to remember what a campaign link was for. */
  readonly note?: string
}

export type AdminInviteDraft = {
  readonly delivery: AdminInviteDelivery
  readonly email: string
  readonly grant: AdminInviteGrant
  readonly uses: AdminInviteUses
  /** `YYYY-MM-DD`, or empty for an invite that does not expire. */
  readonly expiresOn: string
  readonly note: string
}

export type AdminInvitesSummary = {
  readonly pending: number
  readonly acceptedThisMonth: number
  /** What the outstanding grants would cost if every pending invite were accepted, in cents. */
  readonly committedValueCents: number
}
