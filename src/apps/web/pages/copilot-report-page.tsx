import { useSearchParams } from 'react-router-dom'

import type { CopilotMode } from '@/contracts/copilot.draft'
import { CopilotReportView } from '@/features/copilot/interview-copilot-view'
import { copilotCodingReport, copilotMeetingReport, copilotReport } from '@/mocks/copilot'

const VALID_MODES: readonly CopilotMode[] = ['interview', 'coding', 'meeting']

const REPORT_BY_MODE = {
  interview: copilotReport,
  coding: copilotCodingReport,
  meeting: copilotMeetingReport,
}

export function CopilotReportPage() {
  const [searchParams] = useSearchParams()
  const requestedMode = searchParams.get('mode')
  const mode = (VALID_MODES as readonly string[]).includes(requestedMode ?? '') ? (requestedMode as CopilotMode) : 'interview'

  return (
    <CopilotReportView
      homeHref="/v3/app"
      historyHref="/v3/interview-copilot/history"
      report={REPORT_BY_MODE[mode]}
      mode={mode}
    />
  )
}
