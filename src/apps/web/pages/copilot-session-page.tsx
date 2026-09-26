import { useSearchParams } from 'react-router-dom'

import type { CopilotMode } from '@/contracts/copilot.draft'
import { CopilotLiveView } from '@/features/copilot/interview-copilot-view'
import { billingPlans } from '@/mocks/account'
import {
  interviewFairUseNearing,
  interviewFairUseRunning,
  interviewFairUseSpent,
  interviewFairUseSpentNoUnlock,
} from '@/mocks/fair-use'
import { copilotCodingBank, copilotInterviewTranscript, copilotLiveSession, copilotMeetingTranscript, copilotSetup } from '@/mocks/copilot'

// Interview Copilot credit top-ups require an active Ace Your Interview plan. See PRICING.md §1, §4.
const hasActivePlan = billingPlans.some((plan) => plan.current)

const SESSION_TITLE: Record<CopilotMode, string> = {
  interview: 'Interview for UI/UX Designer',
  coding: 'Coding Exercise, Stripe',
  meeting: 'Launch Timeline Review',
}

// Fair use is what "unlimited" means in a live session (PRICING.md §1.2). The state variants
// are the ones worth reviewing: the wall coming, the wall hit, and the wall with nothing to buy.
const FAIR_USE_STATES = {
  'fair-use': interviewFairUseRunning,
  'fair-use-nearing': interviewFairUseNearing,
  'fair-use-spent': interviewFairUseSpent,
  'fair-use-spent-locked': interviewFairUseSpentNoUnlock,
} as const

export function CopilotSessionPage() {
  const [params] = useSearchParams()
  const mode = params.get('mode')
  const modeOverride: CopilotMode | null = mode === 'coding' || mode === 'meeting' ? mode : null
  const session = modeOverride ? { ...copilotLiveSession, mode: modeOverride, title: SESSION_TITLE[modeOverride] } : copilotLiveSession
  const state = params.get('state')
  const fairUse = state !== null && state in FAIR_USE_STATES ? FAIR_USE_STATES[state as keyof typeof FAIR_USE_STATES] : undefined

  return (
    <CopilotLiveView
      completeHref="/v3/interview-copilot/complete"
      session={session}
      isLoading={state === 'loading'}
      transcriptBank={session.mode === 'meeting' ? copilotMeetingTranscript : copilotInterviewTranscript}
      codingBank={copilotCodingBank}
      hasActivePlan={hasActivePlan}
      initialAutoAnswer={copilotSetup.autoAnswer}
      fairUse={fairUse}
    />
  )
}
