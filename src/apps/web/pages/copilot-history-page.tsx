import { CopilotHistoryView } from '@/features/copilot/interview-copilot-view'
import { copilotHistoryRows } from '@/mocks/copilot'
import { CREDIT_WALLET } from '@/mocks/wallet'

export function CopilotHistoryPage() {
  return (
    <CopilotHistoryView
      homeHref="/v3/app"
      createHref="/v3/interview-copilot"
      reportHref="/v3/interview-copilot/report"
      rows={copilotHistoryRows}
      creditUsage={{ remainingCents: CREDIT_WALLET.balanceCents, totalCents: CREDIT_WALLET.totalCents }}
    />
  )
}
