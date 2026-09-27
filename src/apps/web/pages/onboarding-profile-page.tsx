import { OnboardingProfileView } from '@/features/identity/onboarding-view'

export function OnboardingProfilePage() {
  return (
    <OnboardingProfileView
      homeHref="/v3/app"
      backHref="/v3/auth/create-account"
      nextHref="/v3/onboarding/interests"
      emailValue="olivia@untitledui.com"
    />
  )
}
