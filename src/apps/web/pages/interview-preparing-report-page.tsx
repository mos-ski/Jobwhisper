import { useNavigate } from 'react-router-dom'

import { InterviewPreparingReportView } from '@/features/interview/interview-prep-view'
import { reportSteps } from '@/mocks/interview'

export function InterviewPreparingReportPage() {
  const navigate = useNavigate()

  return (
    <InterviewPreparingReportView
      homeHref="/v3/app"
      steps={reportSteps}
      onComplete={() => navigate('/v3/interview-prep/report')}
    />
  )
}
