import { useSearchParams } from 'react-router-dom'

import type { CopilotMode } from '@/contracts/copilot.draft'
import { CopilotPermissionView } from '@/features/copilot/interview-copilot-view'
import { copilotShareSteps } from '@/mocks/copilot'

const VALID_MODES: readonly CopilotMode[] = ['interview', 'coding', 'meeting']

export function CopilotShareScreenPage() {
  const [searchParams] = useSearchParams()
  const requestedMode = searchParams.get('mode')
  const mode = (VALID_MODES as readonly string[]).includes(requestedMode ?? '') ? (requestedMode as CopilotMode) : 'interview'

  return (
    <CopilotPermissionView
      homeHref="/v3/app"
      backHref="/v3/interview-copilot/preferences"
      nextHref="/v3/interview-copilot/ready"
      steps={copilotShareSteps}
      actionLabel="Continue"
      mode={mode}
    />
  )
}
