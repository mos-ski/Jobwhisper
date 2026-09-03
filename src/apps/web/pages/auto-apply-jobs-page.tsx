import { autoApplyJobs } from '@/mocks/auto-apply'
import { resumeDocument } from '@/mocks/resume'
import { AutoApplyJobsView } from '@/features/auto-apply/auto-apply-view'
import { CREDIT_WALLET } from '@/mocks/wallet'

export function AutoApplyJobsPage({ selectedJobId }: { readonly selectedJobId?: string }) {
  const selectedJob = autoApplyJobs.find((job) => job.id === selectedJobId)

  return (
    <AutoApplyJobsView
      homeHref="/v3/app"
      setupHref="/v3/auto-apply/contact"
      agentHref="/v3/auto-apply/agent"
      jobsHref="/v3/auto-apply/jobs"
      appliedHref="/v3/auto-apply/applied"
      resumeHistoryHref="/v3/resume/history"
      jobs={autoApplyJobs}
      selectedJob={selectedJob}
      isPremiumUser={false}
      resumePreview={resumeDocument}
      creditUsage={{ remainingCents: CREDIT_WALLET.balanceCents, totalCents: CREDIT_WALLET.totalCents }}
    />
  )
}
