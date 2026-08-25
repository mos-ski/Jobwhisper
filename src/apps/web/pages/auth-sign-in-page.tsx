import { useNavigate } from 'react-router-dom'

import { SignInView } from '@/features/identity/sign-in-view'

export function AuthSignInPage() {
  const navigate = useNavigate()

  return (
    <SignInView
      emailValue="olivia@untitledui.com"
      passwordValue="password"
      createAccountHref="/v3/auth/create-account"
      forgotPasswordHref="/v3/auth/forgot-password"
      onGoogleSignIn={() => navigate('/v3/auth/choose-plan')}
      onSubmit={() => navigate('/v3/auth/choose-plan')}
    />
  )
}
