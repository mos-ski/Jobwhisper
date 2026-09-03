import { InterviewHistoryView } from '@/features/interview/interview-prep-view'
import { interviewHistoryRows } from '@/mocks/interview'
import { CREDIT_WALLET } from '@/mocks/wallet'

export function InterviewHistoryPage() {
  return (
    <InterviewHistoryView
      homeHref="/v3/app"
      createHref="/v3/interview-prep"
      reportHref="/v3/interview-prep/report"
      rows={interviewHistoryRows}
      creditUsage={{ remainingCents: CREDIT_WALLET.balanceCents, totalCents: CREDIT_WALLET.totalCents }}
    />
  )
}
