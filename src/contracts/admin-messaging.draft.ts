export type BroadcastStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'

export type BroadcastChannel = 'email' | 'in-app' | 'both'

export type AudienceSegment = 'all' | 'new-users' | 'unused-credits' | 'used-not-subscribed' | 'renewed-30d' | 'custom'

export type AudienceSegmentLabel = Record<AudienceSegment, string>

export const audienceSegmentLabels: AudienceSegmentLabel = {
  'all': 'All Users',
  'new-users': 'New Users (0–7 days)',
  'unused-credits': 'Unused Credits',
  'used-not-subscribed': 'Used Credit, Not Subscribed',
  'renewed-30d': 'Renewed in Last 30 Days',
  'custom': 'Custom Contacts',
}

export type AdminBroadcastMetrics = {
  readonly delivered: number
  readonly seen: number
  readonly clicked: number
}

export type AdminBroadcast = {
  readonly id: string
  readonly title: string
  readonly body: string
  readonly coverImageUrl?: string
  readonly audience: AudienceSegment
  readonly channel: BroadcastChannel
  readonly status: BroadcastStatus
  readonly sentAt?: string
  readonly scheduledAt?: string
  readonly metrics: AdminBroadcastMetrics
}

export type AdminMessagingTab = 'all' | 'sent' | 'draft' | 'scheduled' | 'failed'
