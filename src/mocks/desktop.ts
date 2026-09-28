import type {
  DesktopChatMessage,
  DesktopCredits,
  DesktopReleaseNote,
  DesktopSessionSummary,
  DesktopTranscriptEntry,
} from '@/contracts/desktop.draft'

export const desktopUser = { firstName: 'Adedamola', fullName: 'Adedamola Adewale (Moski)', email: 'adedamolamoses@gmail.com', avatarSrc: '/v3-assets/dashboard-avatar.png' }

export const desktopRecentSessions: readonly DesktopSessionSummary[] = [
  { id: 'ds-1', title: 'Discovery call', kind: 'meeting', startedAt: '2026-09-25T16:35:00', durationMinutes: 50 },
  { id: 'ds-2', title: 'Discovery call', kind: 'meeting', startedAt: '2026-09-25T15:51:00', durationMinutes: 22 },
  { id: 'ds-3', title: 'Product Manager', kind: 'interview', company: 'Relics', startedAt: '2026-09-25T13:03:00', durationMinutes: 4 },
  { id: 'ds-4', title: 'Project review <> Cosella', kind: 'meeting', startedAt: '2026-09-24T17:59:00', durationMinutes: 37 },
]

export const desktopCredits: DesktopCredits = { balance: 1017, usedThisPeriod: 1140, periodAllowance: 2000, spentAllTime: 1213 }

export const desktopKnowledgeBase: readonly string[] = [
  '04-customer-case-studies.pdf',
  '03-competitive-battlecards.pdf',
  '02-pricing-packaging-guide.pdf',
  '01-product-overview.pdf',
]

export const desktopRoles: readonly string[] = ['Product Manager', 'Senior Product Manager', 'Product Designer', 'Software Engineer', 'Data Analyst']

export const desktopSuggestedContext =
  'Help me prepare concise, outcome-focused answers for the Guwe Product Manager interview, drawing on my leadership of five AI and crypto products, three MVP launches in five months, and independent development of 12 live apps. Emphasize my Bloomvest KYC and savings-goal work that increased weekly active users by 45%, plus Rebble’s WhatsApp crypto trading experience. Support me most with articulating product strategy, prioritization trade-offs, and measurable impact.'

export const desktopTranscript: readonly DesktopTranscriptEntry[] = [
  { kind: 'interviewer', id: 't-1', text: 'What are your biggest strengths?' },
  {
    kind: 'answer',
    id: 't-2',
    question: 'What are your biggest strengths?',
    runs: [
      { text: 'I’m strongest at turning ambiguous user problems into focused products, then driving execution across design, engineering, and data. At ' },
      { text: 'Syarpa', emphasis: true },
      { text: ', I designed Bloomvest’s ' },
      { text: 'KYC tiering and savings-goal flows', emphasis: true },
      { text: ', using adoption data to improve weekly active users by ' },
      { text: '45%', emphasis: true },
      { text: '. I’m also hands-on enough to prototype and validate quickly, which helped me launch three MVPs in five months at Lightforth.' },
    ],
  },
  { kind: 'interviewer', id: 't-3', text: 'And how do you think our company would benefit from that?' },
  {
    kind: 'answer',
    id: 't-4',
    question: 'How would Guwe benefit from your strengths?',
    runs: [
      { text: 'Guwe would benefit from a product leader who can connect customer needs, business goals, and fast execution. I’ve independently built ' },
      { text: '12 live apps', emphasis: true },
      { text: ' and led AI and crypto products end to end, so I can contribute from strategy and prioritization through hands-on prototyping, delivery, and measuring whether a launch is actually creating value.' },
    ],
  },
  { kind: 'interviewer', id: 't-5', text: 'Okay. Interesting.' },
  { kind: 'interviewer', id: 't-6', text: 'What have you identified as your greatest development area, and what have you done to improve it?' },
  {
    kind: 'answer',
    id: 't-7',
    question: 'What’s your greatest development area, and what have you done to improve it?',
    runs: [
      { text: 'I’ve been working on not getting too deep into solution details before validating the highest-value problem. At ' },
      { text: 'Cwito', emphasis: true },
      { text: ', I narrowed the OTC crypto MVP to the core buy, sell, KYC, and wallet flows, then used drop-off data to guide the next UI changes. That helped reduce onboarding time by ' },
      { text: '40%', emphasis: true },
      { text: ' and user drop-off by ' },
      { text: '30%', emphasis: true },
      { text: '.' },
    ],
  },
  { kind: 'interviewer', id: 't-8', text: 'Where do you see yourself in the next', partial: true },
]

export const desktopChat: readonly DesktopChatMessage[] = [
  { id: 'c-1', author: 'you', text: 'Give me a concise strengths answer for Guwe.' },
  {
    id: 'c-2',
    author: 'copilot',
    text: 'My biggest strength is turning ambiguous customer and business problems into focused products and measurable outcomes. For example, at Syarpa I designed KYC tiering and savings-goal flows for Bloomvest, which increased weekly active users by 45%. Across my recent work, I’ve led five AI and crypto products and launched three MVPs in five months.',
  },
]

export const desktopReleaseNote: DesktopReleaseNote = {
  version: '1.0.13',
  date: '2026-09-16',
  items: [
    { title: 'Meeting playbooks', detail: 'Pick a playbook when you set up a meeting. Sales discovery, standup, investor pitch and more. It fills the agenda, briefs the copilot, and adds its own hot buttons to the live session. You can build your own too.' },
    { title: 'Google Calendar', detail: 'Connect Google Calendar in Settings and the app shows your next meetings, nudges you before each one, and starts the copilot with the title filled in.' },
    { title: 'A fuller dashboard', detail: 'The home screen now shows your recent sessions and remaining credits beside the launch cards.' },
  ],
}
