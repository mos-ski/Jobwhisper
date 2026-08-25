import { autoApplyApplication, autoApplyJobs } from '@/mocks/auto-apply'
import { resumeDocument } from '@/mocks/resume'
import { AutoApplyAppliedView } from '@/features/auto-apply/auto-apply-view'

export function AutoApplyAppliedPage() {
  return (
    <AutoApplyAppliedView
      homeHref="/v3/app"
      setupHref="/v3/auto-apply/contact"
      agentHref="/v3/auto-apply/agent"
      jobsHref="/v3/auto-apply/jobs"
      appliedHref="/v3/auto-apply/applied"
      resumeHistoryHref="/v3/resume/history"
      jobs={autoApplyJobs}
      application={autoApplyApplication}
      resumePreview={resumeDocument}
    />
  )
}
