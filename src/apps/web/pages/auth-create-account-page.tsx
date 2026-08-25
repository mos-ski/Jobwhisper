import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SignUpView } from '@/features/identity/sign-up-view'

export function AuthCreateAccountPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('jordan.blake@gmail.com')
  const [password, setPassword] = useState('password')
  const [confirmPassword, setConfirmPassword] = useState('password')
  const [referralCode, setReferralCode] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  return (
    <SignUpView
      emailValue={email}
      passwordValue={password}
      confirmPasswordValue={confirmPassword}
      referralCodeValue={referralCode}
      acceptedTerms={acceptedTerms}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onReferralCodeChange={setReferralCode}
      onAcceptedTermsChange={setAcceptedTerms}
      signInHref="/v3/auth/sign-in"
      onGoogleSignUp={() => navigate('/v3/auth/choose-plan')}
      onSubmit={() => navigate('/v3/auth/choose-plan')}
    />
  )
}
