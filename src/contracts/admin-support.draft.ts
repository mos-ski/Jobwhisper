/**
 * Draft contract for the admin Support module — customer ticket queue.
 * Dates are pre-formatted display strings so views never parse or localize a date.
 */

import type { SupportRequestKind } from './account.draft'

export type AdminTicketStatus = 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed'

export type AdminTicketStatusFilter = AdminTicketStatus | 'all'

export type AdminTicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export type AdminTicketPriorityFilter = AdminTicketPriority | 'all'

export type AdminTicketAssigneeFilter = string | 'all' | 'unassigned'

export type AdminTicketRow = {
  readonly id: string
  readonly subject: string
  /**
   * What the user picked when they raised it in the app — see `SupportRequestKind` in
   * `account.draft.ts`. Tells the queue whether this is a bug to triage, a complaint to
   * escalate, or feedback to file. Unset on tickets that arrived by email.
   */
  readonly kind?: SupportRequestKind
  /** 1–5, only on the kinds that ask for a score. */
  readonly rating?: number
  readonly status: AdminTicketStatus
  readonly priority: AdminTicketPriority
  readonly accountName: string
  readonly accountEmail: string
  /** References an account id from `src/mocks/admin-accounts.ts`. */
  readonly accountId: string
  readonly assignedToName: string | null
  readonly assignedToAvatar: string | null
  readonly lastMessagePreview: string
  readonly lastMessageAtLabel: string
  readonly createdAtLabel: string
  readonly unreadCount: number
  readonly messageCount: number
}

export type AdminTicketMessageAuthorKind = 'user' | 'admin' | 'system'

export type AdminTicketMessage = {
  readonly id: string
  readonly authorKind: AdminTicketMessageAuthorKind
  readonly authorName: string
  readonly authorAvatar: string | null
  readonly body: string
  readonly timestampLabel: string
}

export type AdminTicketDetail = {
  readonly id: string
  readonly subject: string
  readonly status: AdminTicketStatus
  readonly priority: AdminTicketPriority
  readonly createdAtLabel: string
  readonly account: {
    readonly id: string
    readonly name: string
    readonly email: string
    readonly planLabel: string
    readonly accountHref: string
  }
  readonly assignedToName: string | null
  readonly assignedToAvatar: string | null
  readonly messages: readonly AdminTicketMessage[]
  readonly labels: readonly string[]
}

export type AdminSupportSummary = {
  readonly totalOpen: number
  readonly openCount: number
  readonly inProgressCount: number
  readonly waitingCount: number
  readonly resolvedToday: number
  readonly avgFirstResponseMinutes: number
  readonly slaCompliancePercent: number
}
