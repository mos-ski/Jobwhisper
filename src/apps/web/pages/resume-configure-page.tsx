import { useSearchParams } from 'react-router-dom'

import { ResumeConfigureView } from '@/features/resume/resume-builder-view'
import { autoApplyJobs } from '@/mocks/auto-apply'
import { resumeBuilderSession } from '@/mocks/resume'

export function ResumeConfigurePage() {
  const [searchParams] = useSearchParams()
  const fromJobId = searchParams.get('fromJob')
  const fromJob = fromJobId ? autoApplyJobs.find((job) => job.id === fromJobId) : undefined

  return (
    <ResumeConfigureView
      homeHref="/v3/app"
      uploadHref="/v3/resume"
      editorHref="/v3/resume/editor?tab=chat&state=empty"
      session={resumeBuilderSession}
      fromJob={fromJob}
    />
  )
}
