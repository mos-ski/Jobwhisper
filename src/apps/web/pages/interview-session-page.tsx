import { useSearchParams } from 'react-router-dom'

import { InterviewSessionView } from '@/features/interview/interview-prep-view'
import { billingPlans } from '@/mocks/account'
import { interviewLiveSession } from '@/mocks/interview'

// Interview Prep credit top-ups require an active Ace Your Interview plan. See PRICING.md §1, §4.
const hasActivePlan = billingPlans.some((plan) => plan.current)

export function InterviewSessionPage() {
  const [params] = useSearchParams()

  return (
    <InterviewSessionView
      voiceHref="/v3/interview-prep/voice"
      completeHref="/v3/interview-prep/complete"
      session={interviewLiveSession}
      isLoading={params.get('state') === 'loading'}
      hasActivePlan={hasActivePlan}
    />
  )
}
