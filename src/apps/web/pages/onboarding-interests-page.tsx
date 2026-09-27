import { useNavigate } from 'react-router-dom'

import { OnboardingInterestsView } from '@/features/identity/onboarding-view'

export function OnboardingInterestsPage() {
  const navigate = useNavigate()

  return (
    <OnboardingInterestsView
      homeHref="/v3/app"
      backHref="/v3/onboarding/profile"
      // A new account lands on the dashboard with the first-month offer open.
      onComplete={() => navigate('/v3/app?welcome=1')}
    />
  )
}
