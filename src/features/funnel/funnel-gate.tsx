import { useState, type FormEvent } from 'react'

import { Button, FormDividerLabel, FormField, GoogleAuthButton } from '@/ui'
import { FunnelTitle } from './funnel-shell'

export type FunnelGateProps = {
  readonly title: string
  /** Says what is waiting behind the gate and what happens next. */
  readonly body: string
  readonly online: boolean
  /** Unique per funnel so the field's label and error stay tied to it. */
  readonly emailFieldId: string
  readonly onCreateAccount: (email: string) => void
  readonly onGoogleSignUp: () => void
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function FunnelGate({ title, body, online, emailFieldId, onCreateAccount, onGoogleSignUp }: FunnelGateProps) {
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
      <div className="grid gap-3">
        <FunnelTitle>{title}</FunnelTitle>
        <p className="text-base leading-7 text-ink-muted">{body}</p>
      </div>
      <form noValidate onSubmit={submit} className="grid gap-5 rounded-panel border border-border bg-surface p-6 shadow-panel">
        <GoogleAuthButton onClick={onGoogleSignUp} disabled={!online}>Continue with Google</GoogleAuthButton>
        <FormDividerLabel>or</FormDividerLabel>
        <FormField id={emailFieldId} label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} error={error} />
        <Button type="submit" size="lg" disabled={!online}>Continue</Button>
      </form>
    </div>
  )
}
