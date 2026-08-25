import { InterviewCompleteView } from '@/features/interview/interview-prep-view'
import { interviewSession } from '@/mocks/interview'

export function InterviewCompletePage() {
  return (
    <InterviewCompleteView
      homeHref="/v3/app"
      sessionHref="/v3/interview-prep/session"
      preparingReportHref="/v3/interview-prep/preparing-report"
      companyName={interviewSession.companyName}
    />
  )
}
