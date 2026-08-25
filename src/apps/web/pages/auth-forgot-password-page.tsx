import { ForgotPasswordView } from '@/features/identity/forgot-password-view'

export function AuthForgotPasswordPage() {
  return <ForgotPasswordView emailValue="olivia@untitledui.com" signInHref="/v3/auth/sign-in" />
}
