import { useSearchParams } from 'react-router-dom'

import { InterviewSessionView } from '@/features/interview/interview-prep-view'
import { interviewLiveSession } from '@/mocks/interview'

export function InterviewSessionPage() {
  const [params] = useSearchParams()

  return (
    <InterviewSessionView
      voiceHref="/v3/interview-prep/voice"
      completeHref="/v3/interview-prep/complete"
      session={interviewLiveSession}
      isLoading={params.get('state') === 'loading'}
    />
  )
}
