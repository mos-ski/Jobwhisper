import type { AdminBroadcast, AdminMessagingTab } from '@/contracts/admin-messaging.draft'

export const adminMessagingTabs: readonly { readonly id: AdminMessagingTab; readonly label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'sent', label: 'Sent' },
  { id: 'draft', label: 'Drafts' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'failed', label: 'Failed' },
]

export const adminBroadcasts: readonly AdminBroadcast[] = [
  {
    id: 'bc-001',
    title: 'Welcome to Jobwhisper — Start Your First Interview',
    body: '<p>Hi there!</p><p>Welcome to Jobwhisper. Your AI interview copilot is ready to help you land your next role.</p><p>Start by uploading your resume and we will match you with interview-ready opportunities.</p>',
    audience: 'new-users',
    channel: 'both',
    status: 'sent',
    sentAt: 'Sep 15, 2026',
    metrics: { delivered: 1247, seen: 892, clicked: 413 },
  },
  {
    id: 'bc-002',
    title: 'You Have Unused Credits — Auto Apply is Waiting',
    body: '<p>Hey!</p><p>You have <strong>credits sitting idle</strong> that could be landing you interviews right now.</p><p>Auto Apply finds roles, tailors your resume, and submits applications — all on autopilot.</p><p><a href="#">Activate Auto Apply</a></p>',
    audience: 'unused-credits',
    channel: 'email',
    status: 'sent',
    sentAt: 'Sep 10, 2026',
    metrics: { delivered: 3412, seen: 1876, clicked: 924 },
  },
  {
    id: 'bc-003',
    title: 'Pro Plan — 60% Off Your First Month',
    body: '<p>For a limited time, get <strong>60% off</strong> your first month of Pro.</p><ul><li>Unlimited resume tailoring</li><li>Priority interview prep</li><li>10 Auto Apply submissions per day</li></ul><p>Offer ends Oct 1, 2026.</p>',
    audience: 'used-not-subscribed',
    channel: 'both',
    status: 'sent',
    sentAt: 'Sep 5, 2026',
    metrics: { delivered: 2156, seen: 1543, clicked: 789 },
  },
  {
    id: 'bc-004',
    title: 'What\'s New — Interview Copilot Now Supports Voice',
    body: '<h2>Voice Mode is Here</h2><p>Practice interviews with your AI copilot using real voice conversations. No more typing — just speak naturally.</p><p>Try it now in your next session.</p>',
    audience: 'all',
    channel: 'in-app',
    status: 'sent',
    sentAt: 'Aug 28, 2026',
    metrics: { delivered: 8934, seen: 5621, clicked: 2340 },
  },
  {
    id: 'bc-005',
    title: 'Holiday Sale — Everything 40% Off',
    body: '<h1>Holiday Sale</h1><p>Get <strong>40% off</strong> all plans and marketplace items. Use code <code>HOLIDAY40</code> at checkout.</p>',
    audience: 'all',
    channel: 'both',
    status: 'scheduled',
    scheduledAt: 'Dec 20, 2026',
    metrics: { delivered: 0, seen: 0, clicked: 0 },
  },
  {
    id: 'bc-006',
    title: 'Re-engagement — We Miss You',
    body: '<p>It has been a while since your last session.</p><p>Your credits are still waiting. Come back and let us help you land that next role.</p>',
    audience: 'custom',
    channel: 'email',
    status: 'draft',
    metrics: { delivered: 0, seen: 0, clicked: 0 },
  },
]

export const adminMessagingMetrics = {
  totalSent: adminBroadcasts.filter((b) => b.status === 'sent').length,
  deliveryRate: 97.2,
  seenRate: 62.4,
  clickRate: 31.8,
}
