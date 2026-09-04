import type {
  AdminAuditActionType,
  AdminAuditActionTypeId,
  AdminAuditActor,
  AdminAuditEntry,
  AdminAuditRange,
  AdminAuditTargetKind,
  AdminNotificationSetting,
  AdminPermissionDescriptor,
  AdminTeamMember,
} from '@/contracts/admin-systems.draft'
import type { AdminNotification } from '@/contracts/admin.draft'
import type { UserIdentity } from '@/contracts/identity'

export const adminPermissionCatalog: readonly AdminPermissionDescriptor[] = [
  {
    id: 'app:view',
    label: 'Sign in to Jobwhisper',
    description: 'Open the candidate-facing app. Every seat needs this.',
    group: 'product',
    groupLabel: 'Product access',
    sensitive: false,
  },
  {
    id: 'resume:read',
    label: 'Read resumes',
    description: 'Open a candidate resume to answer a support ticket.',
    group: 'product',
    groupLabel: 'Product access',
    sensitive: false,
  },
  {
    id: 'resume:write',
    label: 'Edit resumes',
    description: 'Change a candidate resume on their behalf, for Done For You work.',
    group: 'product',
    groupLabel: 'Product access',
    sensitive: false,
  },
  {
    id: 'interview:use',
    label: 'Run Interview Prep',
    description: 'Start prep sessions, normally to reproduce a reported bug.',
    group: 'product',
    groupLabel: 'Product access',
    sensitive: false,
  },
  {
    id: 'auto-apply:use',
    label: 'Run Auto Apply',
    description: 'Queue applications from a staff account for testing.',
    group: 'product',
    groupLabel: 'Product access',
    sensitive: false,
  },
  {
    id: 'copilot:use',
    label: 'Run Interview Copilot',
    description: 'Start live Copilot sessions from a staff account.',
    group: 'product',
    groupLabel: 'Product access',
    sensitive: false,
  },
  {
    id: 'billing:view',
    label: 'See billing',
    description: 'Read invoices, payment methods and subscription history.',
    group: 'product',
    groupLabel: 'Product access',
    sensitive: false,
  },
  {
    id: 'admin:view',
    label: 'Open the admin console',
    description: 'Read-only access to dashboards, accounts and the audit log.',
    group: 'console',
    groupLabel: 'Admin console',
    sensitive: false,
  },
  {
    id: 'admin:users:manage',
    label: 'Manage users and admins',
    description: 'Suspend accounts, reset access, invite admins and change their permissions.',
    group: 'console',
    groupLabel: 'Admin console',
    sensitive: true,
  },
  {
    id: 'admin:credits:manage',
    label: 'Move money and credits',
    description: 'Approve refunds, answer disputes and adjust credit balances.',
    group: 'console',
    groupLabel: 'Admin console',
    sensitive: true,
  },
  {
    id: 'admin:services:manage',
    label: 'Change products and pricing',
    description: 'Turn products on or off, edit plan prices, coupons and platform config.',
    group: 'console',
    groupLabel: 'Admin console',
    sensitive: true,
  },
]

export const adminTeamMembers: readonly AdminTeamMember[] = [
  {
    id: 'user_priya_raghunathan',
    name: 'Priya Raghunathan',
    email: 'priya@jobwhisper.org',
    role: 'admin',
    permissions: ['app:view', 'billing:view', 'admin:view', 'admin:users:manage', 'admin:credits:manage', 'admin:services:manage'],
    status: 'active',
    lastActive: 'Active now',
    addedOn: 'Jan 8, 2025',
    addedBy: 'Founding team',
  },
  {
    id: 'user_daniel_okoye',
    name: 'Daniel Okoye',
    email: 'daniel.okoye@jobwhisper.org',
    role: 'admin',
    permissions: ['app:view', 'billing:view', 'admin:view', 'admin:credits:manage'],
    status: 'active',
    lastActive: '12 minutes ago',
    addedOn: 'Mar 2, 2025',
    addedBy: 'Priya Raghunathan',
  },
  {
    id: 'user_tomas_herrera',
    name: 'Tomás Herrera',
    email: 'tomas.herrera@jobwhisper.org',
    role: 'support',
    permissions: ['app:view', 'resume:read', 'billing:view', 'admin:view'],
    status: 'active',
    lastActive: '1 hour ago',
    addedOn: 'Jun 17, 2025',
    addedBy: 'Priya Raghunathan',
  },
  {
    id: 'user_grace_whitfield',
    name: 'Grace Whitfield',
    email: 'grace.whitfield@jobwhisper.org',
    role: 'support',
    permissions: ['app:view', 'resume:read', 'resume:write', 'admin:view'],
    status: 'active',
    lastActive: 'Yesterday at 18:40',
    addedOn: 'Sep 30, 2025',
    addedBy: 'Daniel Okoye',
  },
  {
    id: 'user_adaeze_obi',
    name: 'Adaeze Obi',
    email: 'adaeze.obi@jobwhisper.org',
    role: 'support',
    permissions: ['app:view', 'resume:read', 'interview:use', 'copilot:use', 'admin:view'],
    status: 'active',
    lastActive: '3 hours ago',
    addedOn: 'Nov 11, 2025',
    addedBy: 'Priya Raghunathan',
  },
  {
    id: 'user_chidinma_okonkwo_abernathy',
    name: 'Chidinma Okonkwo-Abernathy',
    email: 'chidinma.okonkwo-abernathy@jobwhisper.org',
    role: 'support',
    permissions: ['app:view', 'resume:read', 'resume:write', 'auto-apply:use', 'billing:view', 'admin:view'],
    status: 'active',
    lastActive: '26 minutes ago',
    addedOn: 'Jan 20, 2026',
    addedBy: 'Daniel Okoye',
  },
  {
    id: 'user_rachel_adeyemi',
    name: 'Rachel Adeyemi',
    email: 'rachel.adeyemi@jobwhisper.org',
    role: 'admin',
    permissions: ['app:view', 'admin:view', 'admin:users:manage'],
    status: 'invited',
    lastActive: 'Has not signed in yet',
    addedOn: 'Sep 2, 2026',
    addedBy: 'Priya Raghunathan',
  },
  {
    id: 'user_kenji_nakamura',
    name: 'Kenji Nakamura',
    email: 'kenji.nakamura@jobwhisper.org',
    role: 'admin',
    permissions: ['app:view', 'admin:view', 'admin:services:manage'],
    status: 'suspended',
    lastActive: '18 days ago',
    addedOn: 'Apr 14, 2025',
    addedBy: 'Priya Raghunathan',
  },
  {
    id: 'user_yusuf_bello',
    name: 'Yusuf Bello',
    email: 'yusuf.bello@jobwhisper.org',
    role: 'support',
    permissions: ['app:view', 'admin:view'],
    status: 'active',
    lastActive: '4 days ago',
    addedOn: 'Feb 3, 2026',
    addedBy: 'Grace Whitfield',
  },
]

/** A support seat without `admin:users:manage`, used to render the permission-denied state of the Team tab. */
export const adminSystemsRestrictedUser: UserIdentity = {
  id: 'user_tomas_herrera',
  email: 'tomas.herrera@jobwhisper.org',
  name: 'Tomás Herrera',
  role: 'support',
  permissions: ['app:view', 'resume:read', 'billing:view', 'admin:view'],
}

export const adminAuditActionTypes: readonly AdminAuditActionType[] = [
  { id: 'accounts', label: 'Accounts' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'credits', label: 'Credits' },
  { id: 'products', label: 'Products' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'team', label: 'Team and access' },
]

export const adminAuditRanges: readonly AdminAuditRange[] = [
  { id: 'all', label: 'All time', maxDaysAgo: null },
  { id: 'today', label: 'Today', maxDaysAgo: 0 },
  { id: '7d', label: 'Last 7 days', maxDaysAgo: 7 },
  { id: '30d', label: 'Last 30 days', maxDaysAgo: 30 },
  { id: '90d', label: 'Last 90 days', maxDaysAgo: 90 },
]

export const adminAuditActors: readonly AdminAuditActor[] = adminTeamMembers.map((member) => ({
  id: member.id,
  name: member.name,
}))

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Fixed reference instant so the generated log is deterministic across renders and reloads.
const auditEpochMs = Date.UTC(2026, 8, 3, 16, 40)

function stamp(minutesAgo: number): string {
  const at = new Date(auditEpochMs - minutesAgo * 60_000)
  const hours = String(at.getUTCHours()).padStart(2, '0')
  const minutes = String(at.getUTCMinutes()).padStart(2, '0')
  return `${monthNames[at.getUTCMonth()]} ${at.getUTCDate()}, ${at.getUTCFullYear()} · ${hours}:${minutes}`
}

function daysAgoFrom(minutesAgo: number): number {
  return Math.floor(minutesAgo / 1_440)
}

type AuditSeed = Omit<AdminAuditEntry, 'id' | 'timestamp' | 'daysAgo'> & { readonly minutesAgo: number }

function toEntry(seed: AuditSeed, index: number): AdminAuditEntry {
  const { minutesAgo, ...rest } = seed
  return {
    ...rest,
    id: `audit_${String(index + 1).padStart(4, '0')}`,
    timestamp: stamp(minutesAgo),
    daysAgo: daysAgoFrom(minutesAgo),
  }
}

const featuredAuditSeeds: readonly AuditSeed[] = [
  {
    minutesAgo: 11,
    actorId: 'user_priya_raghunathan',
    actorName: 'Priya Raghunathan',
    actionType: 'accounts',
    action: 'Suspended account',
    detail: 'Suspended Amara Nwosu after three chargebacks in one billing cycle. Auto Apply queue drained, 214 credits frozen.',
    targetKind: 'user',
    targetLabel: 'Amara Nwosu · amara.nwosu@example.com',
    targetHref: '/admin/accounts',
    ipAddress: '198.51.100.24',
    result: 'success',
    affectedRecord: [
      { field: 'Account', before: 'Amara Nwosu', after: 'Amara Nwosu' },
      { field: 'Status', before: 'Active', after: 'Suspended' },
      { field: 'Plan', before: 'Starter · $47/mo', after: 'Starter · $47/mo (billing paused)' },
      { field: 'Credits frozen', before: '0', after: '214' },
    ],
  },
  {
    minutesAgo: 34,
    actorId: 'user_tomas_herrera',
    actorName: 'Tomás Herrera',
    actionType: 'transactions',
    action: 'Approve refund',
    detail: 'Tried to approve a $99.00 refund on Marcus Bell’s Pro renewal. Blocked: the seat has no credits permission.',
    targetKind: 'transaction',
    targetLabel: 'txn_9F2K4M · $99.00',
    targetHref: '/admin/transactions',
    ipAddress: '203.0.113.42',
    result: 'denied',
    missingPermission: 'admin:credits:manage',
    affectedRecord: [
      { field: 'Transaction', before: 'txn_9F2K4M', after: 'txn_9F2K4M' },
      { field: 'Amount', before: '$99.00', after: '$99.00' },
      { field: 'Refund state', before: 'Requested', after: 'Requested (unchanged)' },
    ],
  },
  {
    minutesAgo: 128,
    actorId: 'user_daniel_okoye',
    actorName: 'Daniel Okoye',
    actionType: 'transactions',
    action: 'Approved refund',
    detail: 'Approved a full refund on Amara Nwosu’s Starter subscription. Reason given: charged after a cancellation request.',
    targetKind: 'transaction',
    targetLabel: 'txn_7C1B8Q · $47.00',
    targetHref: '/admin/transactions',
    ipAddress: '198.51.100.77',
    result: 'success',
    affectedRecord: [
      { field: 'Transaction', before: 'txn_7C1B8Q', after: 'txn_7C1B8Q' },
      { field: 'Refund state', before: 'Requested', after: 'Approved' },
      { field: 'Amount refunded', before: '$0.00', after: '$47.00' },
      { field: 'Account', before: 'Amara Nwosu', after: 'Amara Nwosu' },
    ],
  },
  {
    minutesAgo: 196,
    actorId: 'user_priya_raghunathan',
    actorName: 'Priya Raghunathan',
    actionType: 'transactions',
    action: 'Accepted dispute',
    detail: 'Accepted the dispute on Marcus Bell’s Pro renewal rather than submitting evidence. The session logs did not show a completed Copilot run.',
    targetKind: 'transaction',
    targetLabel: 'txn_9F2K4M · $99.00',
    targetHref: '/admin/transactions',
    ipAddress: '198.51.100.24',
    result: 'success',
    affectedRecord: [
      { field: 'Dispute', before: 'dsp_4410', after: 'dsp_4410' },
      { field: 'State', before: 'Needs response', after: 'Accepted' },
      { field: 'Liability', before: 'Undecided', after: 'Jobwhisper' },
    ],
  },
  {
    minutesAgo: 310,
    actorId: 'user_priya_raghunathan',
    actorName: 'Priya Raghunathan',
    actionType: 'configuration',
    action: 'Changed plan price',
    detail: 'Raised the Pro monthly price. Existing subscribers stay on their current price until they change plan.',
    targetKind: 'plan',
    targetLabel: 'pricing.pro.monthly_cents',
    targetHref: '/admin/configuration',
    ipAddress: '198.51.100.24',
    result: 'success',
    changes: [
      { field: 'pricing.pro.monthly_cents', before: '9900', after: '10900' },
      { field: 'pricing.pro.display_label', before: 'Pro · $99/mo', after: 'Pro · $109/mo' },
      { field: 'pricing.pro.grandfather_existing', before: 'false', after: 'true' },
    ],
  },
  {
    minutesAgo: 402,
    actorId: 'user_grace_whitfield',
    actorName: 'Grace Whitfield',
    actionType: 'accounts',
    action: 'Suspend account',
    detail: 'Tried to suspend Darnell Smith from a support ticket. Blocked: support seats can read accounts but not change their status.',
    targetKind: 'user',
    targetLabel: 'Darnell Smith · darnell.smith@example.com',
    targetHref: '/admin/accounts',
    ipAddress: '192.0.2.88',
    result: 'denied',
    missingPermission: 'admin:users:manage',
    affectedRecord: [
      { field: 'Account', before: 'Darnell Smith', after: 'Darnell Smith' },
      { field: 'Status', before: 'Active', after: 'Active (unchanged)' },
    ],
  },
  {
    minutesAgo: 1_465,
    actorId: 'user_priya_raghunathan',
    actorName: 'Priya Raghunathan',
    actionType: 'team',
    action: 'Invited admin',
    detail: 'Invited Rachel Adeyemi as an admin with user management. The invitation expires in seven days if it is not accepted.',
    targetKind: 'admin',
    targetLabel: 'Rachel Adeyemi · rachel.adeyemi@jobwhisper.org',
    targetHref: '/admin/systems',
    ipAddress: '198.51.100.24',
    result: 'success',
    changes: [
      { field: 'role', before: 'none', after: 'admin' },
      { field: 'admin:view', before: 'not granted', after: 'granted' },
      { field: 'admin:users:manage', before: 'not granted', after: 'granted' },
    ],
  },
  {
    minutesAgo: 1_612,
    actorId: 'user_kenji_nakamura',
    actorName: 'Kenji Nakamura',
    actionType: 'products',
    action: 'Disabled product',
    detail: 'Turned Done For You off for new purchases while the writing team cleared a four-week backlog. In-flight orders were left running.',
    targetKind: 'product',
    targetLabel: 'Done For You',
    targetHref: '/admin/products',
    ipAddress: '203.0.113.19',
    result: 'success',
    changes: [
      { field: 'products.done_for_you.enabled', before: 'true', after: 'false' },
      { field: 'products.done_for_you.storefront_visible', before: 'true', after: 'false' },
      { field: 'products.done_for_you.in_flight_orders', before: 'running', after: 'running' },
    ],
  },
  {
    minutesAgo: 2_930,
    actorId: 'user_daniel_okoye',
    actorName: 'Daniel Okoye',
    actionType: 'configuration',
    action: 'Deactivated coupon',
    detail: 'Deactivated LAUNCH40 once it hit its 500-redemption cap. Checkout now rejects the code instead of silently ignoring it.',
    targetKind: 'coupon',
    targetLabel: 'LAUNCH40',
    targetHref: '/admin/configuration',
    ipAddress: '198.51.100.77',
    result: 'success',
    changes: [
      { field: 'coupons.LAUNCH40.active', before: 'true', after: 'false' },
      { field: 'coupons.LAUNCH40.redemptions', before: '498 of 500', after: '500 of 500' },
      { field: 'coupons.LAUNCH40.checkout_message', before: 'Code applied', after: 'This code is no longer available' },
    ],
  },
  {
    minutesAgo: 3_240,
    actorId: 'user_priya_raghunathan',
    actorName: 'Priya Raghunathan',
    actionType: 'credits',
    action: 'Granted credits',
    detail: 'Granted 250 credits to Leila Haddad after a Copilot session dropped twice inside a live interview and could not be resumed.',
    targetKind: 'user',
    targetLabel: 'Leila Haddad · leila.haddad@example.com',
    targetHref: '/admin/accounts',
    ipAddress: '198.51.100.24',
    result: 'success',
    affectedRecord: [
      { field: 'Account', before: 'Leila Haddad', after: 'Leila Haddad' },
      { field: 'Credit balance', before: '38', after: '288' },
      { field: 'Reason', before: '—', after: 'Session dropped mid-interview' },
    ],
  },
  {
    minutesAgo: 4_680,
    actorId: 'user_priya_raghunathan',
    actorName: 'Priya Raghunathan',
    actionType: 'team',
    action: 'Suspended admin',
    detail: 'Suspended Kenji Nakamura’s seat for the length of his sabbatical. Permissions were kept so the seat can be restored unchanged.',
    targetKind: 'admin',
    targetLabel: 'Kenji Nakamura · kenji.nakamura@jobwhisper.org',
    targetHref: '/admin/systems',
    ipAddress: '198.51.100.24',
    result: 'success',
    changes: [
      { field: 'status', before: 'active', after: 'suspended' },
      { field: 'admin:services:manage', before: 'granted', after: 'granted (inactive)' },
    ],
  },
  {
    minutesAgo: 5_120,
    actorId: 'user_daniel_okoye',
    actorName: 'Daniel Okoye',
    actionType: 'configuration',
    action: 'Changed dunning schedule',
    detail: 'Added a fourth retry on day nine after the finance review found a third of declined cards recover in the second week.',
    targetKind: 'config',
    targetLabel: 'dunning.retry_schedule',
    targetHref: '/admin/configuration',
    ipAddress: '198.51.100.77',
    result: 'success',
    changes: [
      { field: 'dunning.retry_schedule', before: 'day 1, day 3, day 6', after: 'day 1, day 3, day 6, day 9' },
      { field: 'dunning.final_notice_email', before: 'day 7', after: 'day 10' },
    ],
  },
  {
    minutesAgo: 7_400,
    actorId: 'user_yusuf_bello',
    actorName: 'Yusuf Bello',
    actionType: 'credits',
    action: 'Adjust credits',
    detail: 'Tried to add 100 credits to Rajesh Menon after a failed Auto Apply run. Blocked: the seat can read the account but not move credits.',
    targetKind: 'user',
    targetLabel: 'Rajesh Menon · rajesh.menon@example.com',
    targetHref: '/admin/accounts',
    ipAddress: '192.0.2.140',
    result: 'denied',
    missingPermission: 'admin:credits:manage',
    affectedRecord: [
      { field: 'Account', before: 'Rajesh Menon', after: 'Rajesh Menon' },
      { field: 'Credit balance', before: '12', after: '12 (unchanged)' },
    ],
  },
  {
    minutesAgo: 9_180,
    actorId: 'user_priya_raghunathan',
    actorName: 'Priya Raghunathan',
    actionType: 'configuration',
    action: 'Changed credit rate',
    detail: 'Cut the Copilot burn rate from 1.25 credits a minute to 1.00 after the transcription bill came in under forecast for two months.',
    targetKind: 'config',
    targetLabel: 'credits.copilot.per_minute',
    targetHref: '/admin/configuration',
    ipAddress: '198.51.100.24',
    result: 'success',
    changes: [
      { field: 'credits.copilot.per_minute', before: '1.25', after: '1.00' },
      { field: 'credits.copilot.rounding', before: 'up to nearest minute', after: 'up to nearest minute' },
    ],
  },
]

const generatedActors: readonly AdminAuditActor[] = [
  { id: 'user_priya_raghunathan', name: 'Priya Raghunathan' },
  { id: 'user_daniel_okoye', name: 'Daniel Okoye' },
  { id: 'user_tomas_herrera', name: 'Tomás Herrera' },
  { id: 'user_grace_whitfield', name: 'Grace Whitfield' },
  { id: 'user_adaeze_obi', name: 'Adaeze Obi' },
  { id: 'user_chidinma_okonkwo_abernathy', name: 'Chidinma Okonkwo-Abernathy' },
  { id: 'user_kenji_nakamura', name: 'Kenji Nakamura' },
  { id: 'user_yusuf_bello', name: 'Yusuf Bello' },
]

const candidateNames: readonly string[] = [
  'Darnell Smith',
  'Amara Nwosu',
  'Marcus Bell',
  'Leila Haddad',
  'Sofia Marchetti',
  'Tunde Balogun',
  'Hannah Kirby',
  'Rajesh Menon',
  'Nadia Petrov',
  'Owen Fitzgerald',
  'Mei-Ling Chan',
  'Gabriel Santos',
]

const transactionIds: readonly string[] = [
  'txn_9F2K4M',
  'txn_7C1B8Q',
  'txn_2H6R9T',
  'txn_5J3W1P',
  'txn_8L4X7D',
  'txn_1N0V5S',
]

const ipAddresses: readonly string[] = [
  '198.51.100.24',
  '198.51.100.77',
  '203.0.113.42',
  '203.0.113.19',
  '192.0.2.88',
  '192.0.2.140',
  '198.51.100.203',
  '203.0.113.161',
]

type GeneratedTemplate = {
  readonly actionType: AdminAuditActionTypeId
  readonly action: string
  readonly targetKind: AdminAuditTargetKind
  readonly detail: (subject: string) => string
  readonly target: (subject: string) => string
  readonly href: string
  readonly changes?: readonly [string, string, string][]
}

const generatedTemplates: readonly GeneratedTemplate[] = [
  {
    actionType: 'accounts',
    action: 'Reactivated account',
    targetKind: 'user',
    detail: (subject) => `Lifted the suspension on ${subject} after the chargeback was reversed by the issuing bank.`,
    target: (subject) => subject,
    href: '/admin/accounts',
    changes: [['status', 'suspended', 'active']],
  },
  {
    actionType: 'accounts',
    action: 'Reset sign-in',
    targetKind: 'user',
    detail: (subject) => `Sent ${subject} a fresh sign-in link after their Google account was disconnected by their employer.`,
    target: (subject) => subject,
    href: '/admin/accounts',
  },
  {
    actionType: 'accounts',
    action: 'Merged duplicate account',
    targetKind: 'user',
    detail: (subject) => `Merged a duplicate signup into ${subject}. Resume history and remaining credits moved to the older account.`,
    target: (subject) => subject,
    href: '/admin/accounts',
  },
  {
    actionType: 'transactions',
    action: 'Refunded charge',
    targetKind: 'transaction',
    detail: (subject) => `Refunded ${subject} in full. The candidate cancelled inside the seven-day window and never started a session.`,
    target: (subject) => subject,
    href: '/admin/transactions',
  },
  {
    actionType: 'transactions',
    action: 'Submitted dispute evidence',
    targetKind: 'transaction',
    detail: (subject) => `Uploaded session logs and the signed terms for ${subject} before the card network deadline.`,
    target: (subject) => subject,
    href: '/admin/transactions',
  },
  {
    actionType: 'transactions',
    action: 'Retried failed renewal',
    targetKind: 'transaction',
    detail: (subject) => `Forced an early retry on ${subject} after the candidate confirmed the new card had cleared their bank.`,
    target: (subject) => subject,
    href: '/admin/transactions',
  },
  {
    actionType: 'credits',
    action: 'Granted credits',
    targetKind: 'user',
    detail: (subject) => `Granted 60 goodwill credits to ${subject} after an Auto Apply run stalled on a broken careers portal.`,
    target: (subject) => subject,
    href: '/admin/accounts',
  },
  {
    actionType: 'credits',
    action: 'Reclaimed credits',
    targetKind: 'user',
    detail: (subject) => `Reclaimed 120 credits from ${subject} that had been double-granted by the refund job on the same ticket.`,
    target: (subject) => subject,
    href: '/admin/accounts',
  },
  {
    actionType: 'products',
    action: 'Updated product copy',
    targetKind: 'product',
    detail: (subject) => `Rewrote the ${subject} storefront description so the credit cost is stated before checkout rather than after.`,
    target: (subject) => subject,
    href: '/admin/products',
  },
  {
    actionType: 'products',
    action: 'Enabled product',
    targetKind: 'product',
    detail: (subject) => `Turned ${subject} back on for new purchases after the backlog cleared.`,
    target: (subject) => subject,
    href: '/admin/products',
    changes: [['enabled', 'false', 'true']],
  },
  {
    actionType: 'configuration',
    action: 'Changed config value',
    targetKind: 'config',
    detail: (subject) => `Updated ${subject} following the weekly pricing review. The change applies to new sessions only.`,
    target: (subject) => subject,
    href: '/admin/configuration',
    changes: [['value', '30', '45']],
  },
  {
    actionType: 'configuration',
    action: 'Edited coupon',
    targetKind: 'coupon',
    detail: (subject) => `Extended the ${subject} expiry by two weeks so the partner newsletter that goes out on Monday still converts.`,
    target: (subject) => subject,
    href: '/admin/configuration',
    changes: [['expires_on', 'Sep 14, 2026', 'Sep 28, 2026']],
  },
  {
    actionType: 'team',
    action: 'Changed permissions',
    targetKind: 'admin',
    detail: (subject) => `Added billing visibility to ${subject} so they can answer invoice questions without escalating every ticket.`,
    target: (subject) => subject,
    href: '/admin/systems',
    changes: [['billing:view', 'not granted', 'granted']],
  },
  {
    actionType: 'team',
    action: 'Signed in',
    targetKind: 'admin',
    detail: (subject) => `${subject} signed in to the admin console from a recognised device.`,
    target: (subject) => subject,
    href: '/admin/systems',
  },
]

const deniedTemplates: readonly GeneratedTemplate[] = [
  {
    actionType: 'configuration',
    action: 'Change plan price',
    targetKind: 'plan',
    detail: (subject) => `Tried to edit ${subject}. Blocked: changing pricing needs the products and pricing permission.`,
    target: (subject) => subject,
    href: '/admin/configuration',
  },
  {
    actionType: 'team',
    action: 'Invite admin',
    targetKind: 'admin',
    detail: (subject) => `Tried to invite ${subject} to the console. Blocked: inviting a seat needs user management.`,
    target: (subject) => subject,
    href: '/admin/systems',
  },
]

const productNames: readonly string[] = [
  'Interview Copilot',
  'Auto Apply',
  'Done For You',
  'Resume Builder',
  'Interview Prep',
  'Marketplace',
]

const configKeys: readonly string[] = [
  'credits.auto_apply.per_application',
  'features.auto_apply.daily_cap',
  'email.refund_approved.enabled',
  'sessions.copilot.max_minutes',
  'signup.email_verification_required',
]

const couponCodes: readonly string[] = ['LAUNCH40', 'CAREERPIVOT25', 'ALUMNI15', 'WINTERSPRINT30']

const planKeys: readonly string[] = ['pricing.starter.monthly_cents', 'pricing.premium.monthly_cents', 'pricing.pro.annual_cents']

function subjectFor(template: GeneratedTemplate, index: number): string {
  if (template.targetKind === 'user') return candidateNames[index % candidateNames.length]
  if (template.targetKind === 'transaction') return `${transactionIds[index % transactionIds.length]} · $${[47, 99, 197][index % 3]}.00`
  if (template.targetKind === 'product') return productNames[index % productNames.length]
  if (template.targetKind === 'coupon') return couponCodes[index % couponCodes.length]
  if (template.targetKind === 'plan') return planKeys[index % planKeys.length]
  if (template.targetKind === 'admin') return generatedActors[(index + 3) % generatedActors.length].name
  return configKeys[index % configKeys.length]
}

const generatedCount = 208

const generatedAuditSeeds: readonly AuditSeed[] = Array.from({ length: generatedCount }, (_, index): AuditSeed => {
  const isDenied = index % 17 === 5
  const template = isDenied
    ? deniedTemplates[index % deniedTemplates.length]
    : generatedTemplates[index % generatedTemplates.length]
  const actor = generatedActors[(index * 3 + 1) % generatedActors.length]
  const subject = subjectFor(template, index)
  const minutesAgo = 640 + index * 598 + (index % 5) * 137

  return {
    minutesAgo,
    actorId: actor.id,
    actorName: actor.name,
    actionType: template.actionType,
    action: isDenied ? template.action : template.action,
    detail: template.detail(subject),
    targetKind: template.targetKind,
    targetLabel: template.target(subject),
    targetHref: template.href,
    ipAddress: ipAddresses[(index * 5 + 2) % ipAddresses.length],
    result: isDenied ? 'denied' : 'success',
    missingPermission: isDenied
      ? template.actionType === 'team'
        ? 'admin:users:manage'
        : 'admin:services:manage'
      : undefined,
    changes: template.changes
      ? template.changes.map(([field, before, after]) => ({ field, before, after }))
      : undefined,
    affectedRecord: template.changes
      ? undefined
      : [
          { field: 'Record', before: subject, after: subject },
          { field: 'Module', before: template.actionType, after: template.actionType },
        ],
  }
})

export const adminAuditEntries: readonly AdminAuditEntry[] = [...featuredAuditSeeds, ...generatedAuditSeeds]
  .slice()
  .sort((a, b) => a.minutesAgo - b.minutesAgo)
  .map(toEntry)

export const adminNotificationSettings: readonly AdminNotificationSetting[] = [
  {
    id: 'dispute-opened',
    label: 'New dispute opened',
    description: 'A card network opened a dispute against a charge. Evidence deadlines start the same day.',
    group: 'revenue',
    groupLabel: 'Money',
    channels: { 'in-app': true, email: true, slack: true },
  },
  {
    id: 'refund-requested',
    label: 'Refund requested',
    description: 'A candidate asked for their money back from the billing page.',
    group: 'revenue',
    groupLabel: 'Money',
    channels: { 'in-app': true, email: true, slack: false },
    threshold: { label: 'Only notify above', value: 100, unit: 'US dollars', min: 0, max: 1_000, step: 5 },
  },
  {
    id: 'refund-approved',
    label: 'Refund approved',
    description: 'An admin approved a refund. Sent to everyone else with the credits permission.',
    group: 'revenue',
    groupLabel: 'Money',
    channels: { 'in-app': true, email: false, slack: true },
  },
  {
    id: 'failed-renewals',
    label: 'Failed subscription renewals',
    description: 'Cards declined on renewal after dunning has already retried.',
    group: 'revenue',
    groupLabel: 'Money',
    channels: { 'in-app': true, email: true, slack: true },
    threshold: { label: 'Only notify above', value: 25, unit: 'failures in 24 hours', min: 1, max: 500, step: 1 },
  },
  {
    id: 'signup-spike',
    label: 'Signup spike detected',
    description: 'Account creation running well above the daily average, which usually means a promotion landed or a bot found the form.',
    group: 'growth',
    groupLabel: 'Growth',
    channels: { 'in-app': true, email: false, slack: true },
    threshold: { label: 'Only notify above', value: 200, unit: 'signups per hour', min: 10, max: 2_000, step: 10 },
  },
  {
    id: 'coupon-cap-reached',
    label: 'Coupon hit its usage cap',
    description: 'A discount code reached the redemption limit and stopped working at checkout.',
    group: 'growth',
    groupLabel: 'Growth',
    channels: { 'in-app': true, email: true, slack: false },
    threshold: { label: 'Warn at', value: 90, unit: 'percent of the cap', min: 50, max: 100, step: 5 },
  },
  {
    id: 'admin-invited',
    label: 'New admin invited',
    description: 'Someone was given a seat in this console. Sent to every admin, and it cannot be turned off in-app.',
    group: 'security',
    groupLabel: 'Security',
    channels: { 'in-app': true, email: true, slack: true },
  },
]

/** A long feed for the dense state — the same events the bell shows, plus the rest of the week. */
export const adminSystemsDenseNotificationFeed: readonly AdminNotification[] = [
  {
    id: 'notif-dispute',
    title: 'New dispute opened',
    detail: 'Marcus Bell · $99.00 · Pro subscription',
    timeAgo: '11 minutes ago',
    unread: true,
    href: '/admin/transactions',
  },
  {
    id: 'notif-refund',
    title: 'Refund approved by Daniel Okoye',
    detail: 'Amara Nwosu · $47.00 · Starter subscription',
    timeAgo: '2 hours ago',
    unread: true,
    href: '/admin/transactions',
  },
  {
    id: 'notif-signup-spike',
    title: 'Signup spike detected',
    detail: '312 accounts created in the last hour, 4x the daily average.',
    timeAgo: '5 hours ago',
    unread: true,
    href: '/admin/accounts',
  },
  {
    id: 'notif-admin-added',
    title: 'New admin invited',
    detail: 'Rachel Adeyemi was granted admin:users:manage.',
    timeAgo: 'Yesterday',
    unread: false,
    href: '/admin/systems',
  },
  {
    id: 'notif-coupon',
    title: 'Coupon LAUNCH40 hit its usage cap',
    detail: '500 of 500 redemptions used. The code is now inactive.',
    timeAgo: '2 days ago',
    unread: false,
    href: '/admin/configuration',
  },
  {
    id: 'notif-failed-renewals',
    title: '34 failed subscription renewals',
    detail: 'Cards declined in the last 48 hours. Dunning has retried twice.',
    timeAgo: '2 days ago',
    unread: true,
    href: '/admin/transactions',
  },
  {
    id: 'notif-refund-requested',
    title: 'Refund requested',
    detail: 'Sofia Marchetti · $197.00 · Premium subscription',
    timeAgo: '3 days ago',
    unread: false,
    href: '/admin/transactions',
  },
  {
    id: 'notif-dispute-deadline',
    title: 'Dispute evidence due in 48 hours',
    detail: 'dsp_4318 · Tunde Balogun · $99.00',
    timeAgo: '3 days ago',
    unread: true,
    href: '/admin/transactions',
  },
  {
    id: 'notif-product-disabled',
    title: 'Done For You disabled for new purchases',
    detail: 'Kenji Nakamura paused the storefront while the backlog clears.',
    timeAgo: '4 days ago',
    unread: false,
    href: '/admin/products',
  },
  {
    id: 'notif-price-change',
    title: 'Pro monthly price changed',
    detail: '$99.00 to $109.00. Existing subscribers keep their price.',
    timeAgo: '4 days ago',
    unread: false,
    href: '/admin/configuration',
  },
  {
    id: 'notif-signup-spike-2',
    title: 'Signup spike detected',
    detail: '268 accounts created in the last hour, 3x the daily average.',
    timeAgo: '5 days ago',
    unread: false,
    href: '/admin/accounts',
  },
  {
    id: 'notif-admin-suspended',
    title: 'Admin seat suspended',
    detail: 'Kenji Nakamura was suspended for the length of his sabbatical.',
    timeAgo: '6 days ago',
    unread: false,
    href: '/admin/systems',
  },
]
