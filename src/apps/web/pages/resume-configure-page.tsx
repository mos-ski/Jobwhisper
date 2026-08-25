import { ResumeConfigureView } from '@/features/resume/resume-builder-view'
import { resumeBuilderSession } from '@/mocks/resume'

export function ResumeConfigurePage() {
  return (
    <ResumeConfigureView
      homeHref="/v3/app"
      uploadHref="/v3/resume"
      editorHref="/v3/resume/editor?tab=chat&state=empty"
      session={resumeBuilderSession}
    />
  )
}
