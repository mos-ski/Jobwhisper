import type { Permission, Role } from './identity'

export type AdminSystemsTab = 'team' | 'audit' | 'notifications'

/* -------------------------------------------------------------------------- */
/* Team and admin management                                                  */
/* -------------------------------------------------------------------------- */

/** Only staff roles can hold a seat in the admin console; `candidate` is an end user, never a team member. */
export type AdminTeamRole = Extract<Role, 'admin' | 'support'>

export type AdminTeamMemberStatus = 'active' | 'invited' | 'suspended'

export type AdminPermissionGroupId = 'product' | 'console'

/**
 * Human-readable presentation for one `Permission`. The raw ids are jargon, so every surface that
 * shows a permission reads its label and description from here rather than printing the id.
 */
export type AdminPermissionDescriptor = {
  readonly id: Permission
  readonly label: string
  readonly description: string
  readonly group: AdminPermissionGroupId
  readonly groupLabel: string
  /** True for permissions that grant privileged admin capability, so granting or removing one must be confirmed. */
  readonly sensitive: boolean
}

export type AdminTeamMember = {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly role: AdminTeamRole
  readonly permissions: readonly Permission[]
  readonly status: AdminTeamMemberStatus
  /** Display string, e.g. "12 minutes ago" or "Has not signed in yet". */
  readonly lastActive: string
  /** Display string, e.g. "Feb 2, 2026". */
  readonly addedOn: string
  readonly addedBy: string
}

/* -------------------------------------------------------------------------- */
/* Platform-wide audit log                                                    */
/* -------------------------------------------------------------------------- */

export type AdminAuditResult = 'success' | 'denied'

export type AdminAuditActionTypeId =
  | 'accounts'
  | 'transactions'
  | 'credits'
  | 'products'
  | 'configuration'
  | 'team'

export type AdminAuditActionType = {
  readonly id: AdminAuditActionTypeId
  readonly label: string
}

export type AdminAuditTargetKind = 'user' | 'transaction' | 'config' | 'product' | 'coupon' | 'plan' | 'admin'

/** One before → after pair inside a configuration change. Both sides are already formatted for display. */
export type AdminAuditFieldChange = {
  readonly field: string
  readonly before: string
  readonly after: string
}

export type AdminAuditEntry = {
  readonly id: string
  /** Display string, e.g. "Sep 3, 2026 · 14:22". Never an ISO string or a Date. */
  readonly timestamp: string
  /**
   * Whole days between the entry and "now", so a date-range filter can run without parsing
   * `timestamp`. The backend will compute this alongside the display string.
   */
  readonly daysAgo: number
  readonly actorId: string
  readonly actorName: string
  readonly actionType: AdminAuditActionTypeId
  /** Short verb phrase, e.g. "Suspended account". */
  readonly action: string
  /** Full sentence describing what happened, long enough to need truncation in the row. */
  readonly detail: string
  readonly targetKind: AdminAuditTargetKind
  readonly targetLabel: string
  /** Deep link into the module that owns the target, when one exists. */
  readonly targetHref?: string
  readonly ipAddress: string
  readonly result: AdminAuditResult
  /** Set when `result` is `denied`: the permission the actor was missing. */
  readonly missingPermission?: Permission
  /** Set for configuration and pricing changes. */
  readonly changes?: readonly AdminAuditFieldChange[]
  /** Set for actions against a single record: the fields identifying it. */
  readonly affectedRecord?: readonly AdminAuditFieldChange[]
}

/** `all` is the "no filter" sentinel so each value round-trips through a URL query param. */
export type AdminAuditRangeId = 'all' | 'today' | '7d' | '30d' | '90d'

export type AdminAuditRange = {
  readonly id: AdminAuditRangeId
  readonly label: string
  /** Inclusive upper bound on `AdminAuditEntry.daysAgo`. Null for `all`. */
  readonly maxDaysAgo: number | null
}

export type AdminAuditActor = {
  readonly id: string
  readonly name: string
}

export type AdminAuditFilters = {
  /** An actor id, or `all`. */
  readonly actorId: string
  readonly actionType: AdminAuditActionTypeId | 'all'
  readonly result: AdminAuditResult | 'all'
  readonly range: AdminAuditRangeId
  readonly query: string
}

/* -------------------------------------------------------------------------- */
/* Notification settings                                                      */
/* -------------------------------------------------------------------------- */

export type AdminNotificationChannel = 'in-app' | 'email' | 'slack'

export type AdminNotificationTypeId =
  | 'dispute-opened'
  | 'refund-requested'
  | 'refund-approved'
  | 'signup-spike'
  | 'failed-renewals'
  | 'admin-invited'
  | 'coupon-cap-reached'

/** A numeric trigger point for a type that only fires past some volume or amount. */
export type AdminNotificationThreshold = {
  readonly label: string
  readonly value: number
  /** Rendered after the input, e.g. "signups per hour". */
  readonly unit: string
  readonly min: number
  readonly max: number
  readonly step: number
}

export type AdminNotificationGroupId = 'revenue' | 'growth' | 'security'

export type AdminNotificationSetting = {
  readonly id: AdminNotificationTypeId
  readonly label: string
  readonly description: string
  readonly group: AdminNotificationGroupId
  readonly groupLabel: string
  readonly channels: Readonly<Record<AdminNotificationChannel, boolean>>
  readonly threshold?: AdminNotificationThreshold
}
