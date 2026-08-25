import { useSearchParams } from 'react-router-dom'

import type { CopilotMode } from '@/contracts/copilot.draft'
import { CopilotPreferencesView } from '@/features/copilot/interview-copilot-view'
import { copilotSetup } from '@/mocks/copilot'

const VALID_MODES: readonly CopilotMode[] = ['interview', 'coding', 'meeting']

export function CopilotPreferencesPage() {
  const [searchParams] = useSearchParams()
  const requestedMode = searchParams.get('mode')
  const mode = (VALID_MODES as readonly string[]).includes(requestedMode ?? '') ? (requestedMode as CopilotMode) : 'interview'

  return (
    <CopilotPreferencesView
      homeHref="/v3/app"
      configureHref="/v3/interview-copilot/configure"
      shareHref="/v3/interview-copilot/share-screen"
      setup={{ ...copilotSetup, mode }}
    />
  )
}
