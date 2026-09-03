import { ResumeHistoryView } from '@/features/resume/resume-builder-view'
import { resumeHistoryRows } from '@/mocks/resume'
import { CREDIT_WALLET } from '@/mocks/wallet'

export function ResumeHistoryPage() {
  return (
    <ResumeHistoryView
      homeHref="/v3/app"
      createHref="/v3/resume"
      editorHref="/v3/resume/editor?tab=chat"
      rows={resumeHistoryRows}
      creditUsage={{ remainingCents: CREDIT_WALLET.balanceCents, totalCents: CREDIT_WALLET.totalCents }}
    />
  )
}
