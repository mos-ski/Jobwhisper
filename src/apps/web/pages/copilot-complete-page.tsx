import { useSearchParams } from 'react-router-dom'

import type { CopilotMode } from '@/contracts/copilot.draft'
import { CopilotCompleteView } from '@/features/copilot/interview-copilot-view'
import { copilotSetup } from '@/mocks/copilot'

const VALID_MODES: readonly CopilotMode[] = ['interview', 'coding', 'meeting']

export function CopilotCompletePage() {
  const [searchParams] = useSearchParams()
  const requestedMode = searchParams.get('mode')
  const mode = (VALID_MODES as readonly string[]).includes(requestedMode ?? '') ? (requestedMode as CopilotMode) : 'interview'

  return (
    <CopilotCompleteView
      homeHref="/v3/app"
      sessionHref="/v3/interview-copilot/session"
      historyHref="/v3/interview-copilot/history"
      reportHref={`/v3/interview-copilot/report?mode=${mode}`}
      mode={mode}
      companyName={mode !== 'meeting' ? copilotSetup.companyName : undefined}
    />
  )
}
