import { CopilotHistoryView } from '@/features/copilot/interview-copilot-view'
import { copilotHistoryRows } from '@/mocks/copilot'

export function CopilotHistoryPage() {
  return (
    <CopilotHistoryView
      homeHref="/v3/app"
      createHref="/v3/interview-copilot"
      reportHref="/v3/interview-copilot/report"
      rows={copilotHistoryRows}
    />
  )
}
