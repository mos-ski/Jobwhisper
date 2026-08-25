import { useState, type FormEvent } from 'react'
import { Mail } from 'lucide-react'

import { FormField } from '@/ui'

export type ForgotPasswordViewProps = {
  readonly emailValue: string
  readonly signInHref: string
}

export function ForgotPasswordView({ emailValue, signInHref }: ForgotPasswordViewProps) {
  const [email, setEmail] = useState(emailValue)
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
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
            {sent ? (
              <>
                <div className="grid size-14 place-items-center rounded-pill bg-accent-subtle text-accent-text">
                  <Mail aria-hidden="true" className="size-6" />
                </div>
                <h1 className="mt-6 text-center text-2xl font-semibold leading-tight text-brand-bar-text">Check your email</h1>
                <p className="mt-2 max-w-sm text-center text-base text-ink-muted">
                  We sent a password reset link to <span className="font-semibold text-ink">{email}</span>. Follow the link to choose a new password.
                </p>
                <a
                  href={signInHref}
                  className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  Back to sign in
                </a>
              </>
            ) : (
              <>
                <h1 className="text-center text-2xl font-semibold leading-tight text-brand-bar-text">Reset your password</h1>
                <p className="mt-2 max-w-sm text-center text-base text-ink-muted">
                  Enter the email associated with your account and we&apos;ll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 grid w-full gap-6 border border-border bg-surface p-8 shadow-panel">
                  <FormField id="v3-auth-forgot-email" label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                  <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    Send reset link
                  </button>
                </form>

                <p className="mt-7 flex flex-wrap items-center justify-center gap-1 text-base font-medium text-ink-muted">
                  <span>Remembered your password?</span>
                  <a className="font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" href={signInHref}>
                    Sign in
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
