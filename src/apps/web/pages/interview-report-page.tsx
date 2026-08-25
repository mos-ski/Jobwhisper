import { useSearchParams } from 'react-router-dom'

import { InterviewReportView } from '@/features/interview/interview-prep-view'
import { interviewReport } from '@/mocks/interview'

export function InterviewReportPage() {
  const [params] = useSearchParams()

  return (
    <InterviewReportView
      homeHref="/v3/app"
      scenariosHref="/v3/interview-prep/history"
      practiceHref="/v3/interview-prep/session"
      report={interviewReport}
      isLoading={params.get('state') === 'loading'}
    />
  )
}
