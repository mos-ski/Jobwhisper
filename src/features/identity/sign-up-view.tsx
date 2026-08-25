import type { FormEvent } from 'react'

import { Checkbox, FormDividerLabel, FormField, GoogleAuthButton } from '@/ui'

export type SignUpViewProps = {
  readonly emailValue: string
  readonly passwordValue: string
  readonly confirmPasswordValue: string
  readonly referralCodeValue: string
  readonly acceptedTerms: boolean
  readonly onEmailChange: (value: string) => void
  readonly onPasswordChange: (value: string) => void
  readonly onConfirmPasswordChange: (value: string) => void
  readonly onReferralCodeChange: (value: string) => void
  readonly onAcceptedTermsChange: (accepted: boolean) => void
  readonly onSubmit: () => void
  readonly onGoogleSignUp: () => void
  readonly signInHref: string
  readonly termsHref?: string
  readonly privacyHref?: string
}

export function SignUpView({
  emailValue,
  passwordValue,
  confirmPasswordValue,
  referralCodeValue,
  acceptedTerms,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onReferralCodeChange,
  onAcceptedTermsChange,
  onSubmit,
  onGoogleSignUp,
  signInHref,
  termsHref = '/terms-condition',
  privacyHref = '/privacy-policy',
}: SignUpViewProps) {
  const passwordsMismatch = confirmPasswordValue.length > 0 && confirmPasswordValue !== passwordValue
  const canSubmit = acceptedTerms && !passwordsMismatch && passwordValue.length > 0 && confirmPasswordValue.length > 0

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (canSubmit) onSubmit()
  }

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-80 bg-brand-bar" />
        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-9">
          <a href="/v3" aria-label="Lightforth UI Studio home" className="inline-flex w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <img src="/v3-assets/lightforth-logo.svg" alt="Lightforth" className="h-10 w-auto" />
          </a>

          <div className="mx-auto mt-12 flex w-full max-w-md flex-1 flex-col items-center">
            <h1 className="text-center text-2xl font-semibold leading-tight text-brand-bar-text">Create your Lightforth account</h1>

            <form onSubmit={handleSubmit} className="mt-10 grid w-full gap-6 border border-border bg-surface p-8 shadow-panel">
              <GoogleAuthButton onClick={onGoogleSignUp}>Sign up with Google</GoogleAuthButton>

              <FormDividerLabel>OR</FormDividerLabel>

              <FormField id="v3-auth-signup-email" label="Email" type="email" value={emailValue} onChange={(event) => onEmailChange(event.target.value)} />
              <FormField id="v3-auth-signup-password" label="Password" type="password" value={passwordValue} onChange={(event) => onPasswordChange(event.target.value)} />
              <FormField
                id="v3-auth-signup-confirm-password"
                label="Confirm Password"
                type="password"
                value={confirmPasswordValue}
                onChange={(event) => onConfirmPasswordChange(event.target.value)}
                error={passwordsMismatch ? 'Passwords do not match' : undefined}
              />
              <FormField
                id="v3-auth-signup-referral"
                label="Referral Code"
                value={referralCodeValue}
                onChange={(event) => onReferralCodeChange(event.target.value)}
                placeholder="Optional"
              />

              <label className="flex items-start gap-2.5">
                <Checkbox checked={acceptedTerms} onCheckedChange={onAcceptedTermsChange} className="mt-0.5" />
                <span className="text-sm leading-5 text-ink-muted">
                  I agree to Lightforth's{' '}
                  <a href={termsHref} target="_blank" rel="noreferrer" className="font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href={privacyHref} target="_blank" rel="noreferrer" className="font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    Privacy Policy
                  </a>
                </span>
              </label>

              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50"
              >
                Create Account
              </button>
            </form>

            <p className="mt-7 flex flex-wrap items-center justify-center gap-1 text-base font-medium text-ink-muted">
              <span>Already have an account?</span>
              <a className="font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" href={signInHref}>
                Sign in
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
