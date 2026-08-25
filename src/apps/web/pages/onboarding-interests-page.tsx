import { useNavigate } from 'react-router-dom'

import { OnboardingInterestsView } from '@/features/identity/onboarding-view'

export function OnboardingInterestsPage() {
  const navigate = useNavigate()

  return (
    <OnboardingInterestsView
      homeHref="/v3/app"
      backHref="/v3/onboarding/profile"
      onComplete={() => navigate('/v3/app')}
    />
  )
}
