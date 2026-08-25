import { useSearchParams } from 'react-router-dom'

import type { CopilotMode } from '@/contracts/copilot.draft'
import { CopilotPermissionView } from '@/features/copilot/interview-copilot-view'
import { copilotReadySteps } from '@/mocks/copilot'

const VALID_MODES: readonly CopilotMode[] = ['interview', 'coding', 'meeting']

const START_LABEL: Record<CopilotMode, string> = {
  interview: 'Start Interview',
  coding: 'Start Coding Session',
  meeting: 'Join Meeting',
}

export function CopilotReadyPage() {
  const [searchParams] = useSearchParams()
  const requestedMode = searchParams.get('mode')
  const mode = (VALID_MODES as readonly string[]).includes(requestedMode ?? '') ? (requestedMode as CopilotMode) : 'interview'

  return (
    <CopilotPermissionView
      homeHref="/v3/app"
      backHref="/v3/interview-copilot/share-screen"
      nextHref="/v3/interview-copilot/session"
      steps={copilotReadySteps}
      previewSrc="/v3-assets/copilot-screen-preview.png"
      actionLabel={START_LABEL[mode]}
      mode={mode}
    />
  )
}
