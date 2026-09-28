import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import type { CopilotMode, CopilotTranscriptTurn } from '@/contracts/copilot.draft'
import type { DesktopAnswerRun, DesktopChatMessage, DesktopResponseLength, DesktopTranscriptEntry } from '@/contracts/desktop.draft'
import { FairUseNotice } from '@/features/billing/fair-use'
import { DesktopSessionView } from '@/features/desktop/desktop-session-view'
import { NoticeCard } from '@/ui'
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

// Figures in an answer (45%, 12 live apps, $2,000) are what the eye should land on, so they read in blue.
function toRuns(answer: string): readonly DesktopAnswerRun[] {
  return answer.split(/(\$?\d[\d,.]*(?:%|k|m|\+)?)/i).filter(Boolean).map((text) => ({ text, emphasis: /^\$?\d/.test(text) }))
}

function toEntries(turns: readonly CopilotTranscriptTurn[], meeting: boolean): readonly DesktopTranscriptEntry[] {
  return turns.flatMap((turn, index) => [
    { kind: 'interviewer' as const, id: `q-${index}`, text: turn.question, speaker: meeting ? turn.speaker : undefined },
    ...(turn.interjection ? [{ kind: 'interviewer' as const, id: `i-${index}`, text: turn.interjection.text, speaker: meeting ? turn.interjection.speaker : undefined }] : []),
    { kind: 'answer' as const, id: `a-${index}`, question: turn.question, runs: toRuns(turn.answer) },
  ])
}

function clock(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}

export function CopilotSessionPage() {
  const [params] = useSearchParams()
  const mode = params.get('mode')
  const modeOverride: CopilotMode | null = mode === 'coding' || mode === 'meeting' ? mode : null
  const session = modeOverride ? { ...copilotLiveSession, mode: modeOverride, title: SESSION_TITLE[modeOverride] } : copilotLiveSession
  const state = params.get('state')
  const fairUse = state !== null && state in FAIR_USE_STATES ? FAIR_USE_STATES[state as keyof typeof FAIR_USE_STATES] : undefined
  // The balance drains in real time, so the notices it raises are otherwise a 40-second wait.
  const balanceState = state === 'low-balance' ? 'low' : state === 'out-of-balance' ? 'empty' : undefined

  const navigate = useNavigate()
  const [seconds, setSeconds] = useState(0)
  const [length, setLength] = useState<DesktopResponseLength>('medium')
  const [micOn, setMicOn] = useState(true)
  const [chat, setChat] = useState<readonly DesktopChatMessage[]>([])
  useEffect(() => {
    if (state === 'loading' || balanceState === 'empty' || fairUse?.state === 'cooling-down') return
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [state, balanceState, fairUse])

  // Coding keeps its own editor-shaped view; interview and meeting use the shared live layout.
  if (session.mode === 'coding') {
    return (
      <CopilotLiveView
        completeHref="/v3/interview-copilot/complete"
        session={session}
        isLoading={state === 'loading'}
        transcriptBank={copilotInterviewTranscript}
        codingBank={copilotCodingBank}
        hasActivePlan={hasActivePlan}
        initialAutoAnswer={copilotSetup.autoAnswer}
        fairUse={fairUse}
        balanceState={balanceState}
      />
    )
  }

  const meeting = session.mode === 'meeting'
  const topUp = () => navigate('/v3/billing/credits')
  const notice = fairUse && fairUse.state !== 'running'
    ? <FairUseNotice snapshot={fairUse} featureName={meeting ? 'Meeting Copilot' : 'Interview Copilot'} onAction={fairUse.policy.topUpUnlocks ? topUp : undefined} />
    : balanceState === 'low'
      ? <NoticeCard tone="warning" title="Credits running low" description="About 8 minutes left at this rate. Top up so the session doesn't stop mid-answer." action={{ label: 'Top up', onClick: topUp }} />
      : balanceState === 'empty'
        ? <NoticeCard tone="danger" title="Out of credits" description="Copilot has paused. Top up to pick up where you left off." action={{ label: 'Top up', onClick: topUp }} />
        : undefined

  return (
    <main className="h-dvh bg-canvas text-ink">
      <h1 className="sr-only">{session.title}</h1>
      <DesktopSessionView
        title={session.title}
        connection="connected"
        activity={state === 'loading' ? 'listening' : balanceState === 'empty' || fairUse?.state === 'cooling-down' ? 'listening' : 'answering'}
        elapsedLabel={clock(seconds)}
        length={length}
        onLengthChange={setLength}
        transcript={toEntries(meeting ? copilotMeetingTranscript : copilotInterviewTranscript, meeting)}
        loading={state === 'loading'}
        chat={chat}
        onAsk={(text) => setChat((current) => [
          ...current,
          { id: `you-${current.length}`, author: 'you', text },
          { id: `cp-${current.length}`, author: 'copilot', text: meeting ? 'So far: the launch moves to the 14th, design owns the onboarding copy, and QA needs two more days on payments. Ask who signs off on the new date.' : 'Lead with the outcome, then how you got there in one line, then what it means for this team. Keep it under a minute.' },
        ])}
        micOn={micOn}
        onToggleMic={() => setMicOn((value) => !value)}
        onCapture={() => undefined}
        onBack={() => navigate('/v3/interview-copilot/history')}
        notice={notice}
        screenPreview={{ src: session.screenPreviewSrc, label: meeting ? 'Your Meeting' : 'Your Interview' }}
        onOpenSettings={() => navigate('/v3/interview-copilot/preferences')}
        onEnd={() => navigate('/v3/interview-copilot/complete')}
        modelLabel="OpenAI"
        creditsUsed={balanceState === 'empty' ? 1 : balanceState === 'low' ? 0.9 : 0.12}
        minutesLeftLabel={balanceState === 'empty' ? 'No minutes left' : balanceState === 'low' ? 'About 8 min left at this rate' : 'About 506 min left at this rate'}
      />
    </main>
  )
}
