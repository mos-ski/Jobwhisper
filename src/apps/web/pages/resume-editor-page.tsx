import { useLocation } from 'react-router-dom'

import type { ResumeBuilderTab, ResumeChatState } from '@/contracts/resume.draft'
import { ResumeEditorView } from '@/features/resume/resume-builder-view'
import { resumeFairUseNearing, resumeFairUseSpent } from '@/mocks/fair-use'
import { resumeBuilderSession, resumeDocument, resumeTemplates } from '@/mocks/resume'

const tabs: readonly ResumeBuilderTab[] = ['chat', 'create', 'template']
const chatStates: readonly ResumeChatState[] = ['empty', 'suggestions']

function readTab(value: string | null): ResumeBuilderTab {
  if (value && tabs.includes(value as ResumeBuilderTab)) {
    return value as ResumeBuilderTab
  }

  return 'chat'
}

function readChatState(value: string | null): ResumeChatState {
  if (value && chatStates.includes(value as ResumeChatState)) {
    return value as ResumeChatState
  }

  return 'empty'
}

// Fair use is what "unlimited" means in the builder (PRICING.md §1.2): a sitting runs to 25
// prompts, then rests. `?fair-use=` picks which side of that wall to review.
const FAIR_USE_STATES = { nearing: resumeFairUseNearing, spent: resumeFairUseSpent } as const

export function ResumeEditorPage() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const tab = readTab(params.get('tab'))
  const chatState = tab === 'chat' ? readChatState(params.get('state')) : 'empty'
  const jd = params.get('jd') ?? undefined
  const fairUseKey = params.get('fair-use')
  const fairUse = fairUseKey !== null && fairUseKey in FAIR_USE_STATES ? FAIR_USE_STATES[fairUseKey as keyof typeof FAIR_USE_STATES] : undefined

  return (
    <ResumeEditorView
      homeHref="/v3/app"
      historyHref="/v3/resume/history"
      document={resumeDocument}
      session={resumeBuilderSession}
      templates={resumeTemplates}
      tab={tab}
      chatState={chatState}
      jd={jd}
      fairUse={fairUse}
    />
  )
}
