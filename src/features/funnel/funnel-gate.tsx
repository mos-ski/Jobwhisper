import { useState, type FormEvent, type ReactNode } from 'react'

import { Button, FormDividerLabel, FormField, GoogleAuthButton } from '@/ui'
import { FunnelTitle } from './funnel-shell'

export type FunnelGateProps = {
  readonly title: string
  /** Says what is waiting behind the gate and what happens next. */
  readonly body: string
  /** What is waiting, shown above the form so the visitor sees what they are signing up for. */
  readonly preview?: ReactNode
  readonly online: boolean
  /** Unique per funnel so the field's label and error stay tied to it. */
  readonly emailFieldId: string
  readonly onCreateAccount: (email: string) => void
  readonly onGoogleSignUp: () => void
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function FunnelGate({ title, body, preview, online, emailFieldId, onCreateAccount, onGoogleSignUp }: FunnelGateProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | undefined>()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    if (!EMAIL_PATTERN.test(value)) {
      setError('Enter an email address in the form name@example.com.')
      return
    }
    setError(undefined)
    onCreateAccount(value)
  }

  return (
    <div data-slot="funnel-gate" className="grid gap-8">
      <div className="grid gap-4">
        <FunnelTitle>{title}</FunnelTitle>
        <p className="text-center text-base leading-7 text-pretty text-ink-muted">{body}</p>
      </div>
      {preview}
      <form noValidate onSubmit={submit} className="mx-auto grid w-full max-w-md gap-5">
        <GoogleAuthButton onClick={onGoogleSignUp} disabled={!online} className="min-h-12 rounded-full">Continue with Google</GoogleAuthButton>
        <FormDividerLabel>or</FormDividerLabel>
        <FormField id={emailFieldId} label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} error={error} />
        <Button type="submit" size="lg" className="min-h-12 rounded-full" disabled={!online}>Continue</Button>
        <p className="text-center text-xs leading-5 text-ink-muted">
          By continuing you agree to the <a href="/terms" className="underline underline-offset-4 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Terms</a> and <a href="/privacy" className="underline underline-offset-4 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Privacy Policy</a>.
        </p>
      </form>
    </div>
  )
}
