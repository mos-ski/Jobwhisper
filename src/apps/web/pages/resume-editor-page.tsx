import { useLocation } from 'react-router-dom'

import type { ResumeBuilderTab, ResumeChatState } from '@/contracts/resume.draft'
import { ResumeEditorView } from '@/features/resume/resume-builder-view'
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

export function ResumeEditorPage() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const tab = readTab(params.get('tab'))
  const chatState = tab === 'chat' ? readChatState(params.get('state')) : 'empty'
  const jd = params.get('jd') ?? undefined

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
    />
  )
}
