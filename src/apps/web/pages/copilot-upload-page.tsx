import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import type { CopilotMode } from '@/contracts/copilot.draft'
import { CopilotUploadView } from '@/features/copilot/interview-copilot-view'
import { getDefaultResumePreference } from '@/lib/resume-preference'
import { copilotSetup } from '@/mocks/copilot'
import { resumeHistoryRows } from '@/mocks/resume'

const VALID_MODES: readonly CopilotMode[] = ['interview', 'coding', 'meeting']

export function CopilotUploadPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedMode = searchParams.get('mode')
  const mode = (VALID_MODES as readonly string[]).includes(requestedMode ?? '') ? (requestedMode as CopilotMode) : 'interview'
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (mode === 'coding' || mode === 'meeting') {
      window.location.href = `/v3/interview-copilot/configure?mode=${mode}`
      return
    }
    if (getDefaultResumePreference()) {
      navigate('/v3/interview-copilot/configure', { replace: true })
      return
    }
    setReady(true)
  }, [mode, navigate])

  if (!ready) return null

  return (
    <CopilotUploadView
      homeHref="/v3/app"
      configureHref="/v3/interview-copilot/configure"
      historyHref="/v3/interview-copilot/history"
      mode={mode}
      uploadedFileName={copilotSetup.uploadedFileName}
      savedResumes={resumeHistoryRows}
    />
  )
}
