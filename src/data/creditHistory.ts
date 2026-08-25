export type CreditFeature = 'resume-builder' | 'interview-prep' | 'interview-copilot' | 'auto-apply'

export const CREDIT_RULES: Record<CreditFeature, { label: string; trigger: string; cost: number }> = {
  'resume-builder': { label: 'Resume Builder', trigger: 'One prompt (or group of prompts) sent to AI', cost: 1 },
  'interview-prep': { label: 'Interview Prep', trigger: 'One practice session started', cost: 1 },
  'interview-copilot': { label: 'Interview Copilot', trigger: 'One live session started', cost: 1 },
  'auto-apply': { label: 'Auto-Apply', trigger: 'One successful job application', cost: 1 },
}

export type CreditTransaction = {
  id: string
  kind: 'used' | 'earned'
  feature?: CreditFeature
  label: string
  sublabel: string
  /** What exactly the credit was spent on — shown in the feed so users know what they used it for. */
  detail?: string
  amount: number
  timestamp: string
}

const FEATURE_COLOR: Record<CreditFeature, string> = {
  'resume-builder': '#2563eb',
  'interview-prep': '#8b5cf6',
  'interview-copilot': '#f59e0b',
  'auto-apply': '#10b981',
}

export function featureColor(feature?: CreditFeature) {
  return feature ? FEATURE_COLOR[feature] : '#94a3b8'
}

export const CREDIT_TRANSACTIONS: CreditTransaction[] = [
  { id: 't1', kind: 'used', feature: 'resume-builder', label: 'Resume Builder', sublabel: 'Used', detail: 'Tailored "Adedamola’s CV" for Senior Product Manager @ Stripe', amount: -1, timestamp: '2026-06-23T14:30:00' },
  { id: 't2', kind: 'used', feature: 'interview-prep', label: 'Interview Prep', sublabel: 'Used', detail: 'Practice session — Behavioral interview', amount: -1, timestamp: '2026-06-23T11:00:00' },
  { id: 't3', kind: 'earned', label: 'Daily Drip', sublabel: 'Bonus', amount: 1, timestamp: '2026-06-23T00:00:00' },
  { id: 't4', kind: 'used', feature: 'auto-apply', label: 'Auto-Apply', sublabel: 'Used', detail: 'Applied — Senior Product Manager @ Stripe', amount: -1, timestamp: '2026-06-22T16:15:00' },
  { id: 't5', kind: 'earned', label: 'Daily Drip', sublabel: 'Bonus', amount: 1, timestamp: '2026-06-22T00:00:00' },
  { id: 't6', kind: 'used', feature: 'resume-builder', label: 'Resume Builder', sublabel: 'Used', detail: 'Rewrote professional summary on "Adedamola’s CV"', amount: -1, timestamp: '2026-06-21T09:40:00' },
  { id: 't7', kind: 'used', feature: 'interview-copilot', label: 'Interview Copilot', sublabel: 'Used', detail: 'Live session — Interview with Notion', amount: -1, timestamp: '2026-06-20T13:05:00' },
  { id: 't8', kind: 'used', feature: 'interview-copilot', label: 'Interview Copilot', sublabel: 'Used', detail: 'Live session — Interview with Notion (mock round 2)', amount: -1, timestamp: '2026-06-20T10:22:00' },
  { id: 't9', kind: 'earned', label: 'Daily Drip', sublabel: 'Bonus', amount: 1, timestamp: '2026-06-20T00:00:00' },
  { id: 't10', kind: 'used', feature: 'resume-builder', label: 'Resume Builder', sublabel: 'Used', detail: 'Tailored "Adedamola’s CV" for Group PM @ Notion', amount: -1, timestamp: '2026-06-18T15:50:00' },
  { id: 't11', kind: 'used', feature: 'auto-apply', label: 'Auto-Apply', sublabel: 'Used', detail: 'Applied — Group Product Manager @ Notion', amount: -1, timestamp: '2026-06-16T12:10:00' },
  { id: 't12', kind: 'used', feature: 'auto-apply', label: 'Auto-Apply', sublabel: 'Used', detail: 'Applied — Product Manager, Search @ Google', amount: -1, timestamp: '2026-06-16T09:00:00' },
  { id: 't13', kind: 'used', feature: 'interview-prep', label: 'Interview Prep', sublabel: 'Used', detail: 'Practice session — System design walkthrough', amount: -1, timestamp: '2026-06-14T17:30:00' },
  { id: 't14', kind: 'used', feature: 'resume-builder', label: 'Resume Builder', sublabel: 'Used', detail: 'Added stronger metrics to experience bullets', amount: -1, timestamp: '2026-06-12T08:45:00' },
  { id: 't15', kind: 'used', feature: 'resume-builder', label: 'Resume Builder', sublabel: 'Used', detail: 'Shortened experience bullets on "Adedamola’s CV"', amount: -1, timestamp: '2026-06-12T08:20:00' },
  { id: 't16', kind: 'earned', label: 'Milestone Bonus', sublabel: '30 credits used', amount: 3, timestamp: '2026-06-09T00:00:00' },
  { id: 't17', kind: 'used', feature: 'auto-apply', label: 'Auto-Apply', sublabel: 'Used', detail: 'Applied — Product Manager @ Airbnb', amount: -1, timestamp: '2026-06-09T14:00:00' },
  { id: 't18', kind: 'used', feature: 'interview-copilot', label: 'Interview Copilot', sublabel: 'Used', detail: 'Live session — Interview with Airbnb', amount: -1, timestamp: '2026-06-08T11:35:00' },
  { id: 't19', kind: 'used', feature: 'resume-builder', label: 'Resume Builder', sublabel: 'Used', detail: 'Tailored "Adedamola’s CV" for Product Manager @ Airbnb', amount: -1, timestamp: '2026-06-06T19:10:00' },
  { id: 't20', kind: 'used', feature: 'interview-prep', label: 'Interview Prep', sublabel: 'Used', detail: 'Practice session — Product Manager mock interview', amount: -1, timestamp: '2026-06-04T10:00:00' },
  { id: 't21', kind: 'used', feature: 'auto-apply', label: 'Auto-Apply', sublabel: 'Used', detail: 'Applied — Senior PM, Growth @ Pinterest', amount: -1, timestamp: '2026-06-02T13:25:00' },
  { id: 't22', kind: 'used', feature: 'resume-builder', label: 'Resume Builder', sublabel: 'Used', detail: 'Made summary sound more formal', amount: -1, timestamp: '2026-05-26T16:40:00' },
  { id: 't23', kind: 'used', feature: 'interview-prep', label: 'Interview Prep', sublabel: 'Used', detail: 'Practice session — Behavioral interview', amount: -1, timestamp: '2026-05-25T09:15:00' },
  { id: 't24', kind: 'earned', label: 'Plan Activated', sublabel: 'PRO Plan', amount: 50, timestamp: '2026-05-24T00:00:00' },
]
