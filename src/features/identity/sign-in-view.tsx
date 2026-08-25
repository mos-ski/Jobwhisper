import type { FormEvent } from 'react'

import { FormDividerLabel, FormField, GoogleAuthButton } from '@/ui'

export type SignInViewProps = {
  readonly emailValue: string
  readonly passwordValue: string
  readonly onSubmit: () => void
  readonly onGoogleSignIn: () => void
  readonly createAccountHref: string
  readonly forgotPasswordHref: string
}

export function SignInView({ emailValue, passwordValue, onSubmit, onGoogleSignIn, createAccountHref, forgotPasswordHref }: SignInViewProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
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
            <h1 className="text-center text-2xl font-semibold leading-tight text-brand-bar-text">Log in to your Lightforth account</h1>

            <form onSubmit={handleSubmit} className="mt-10 grid w-full gap-6 border border-border bg-surface p-8 shadow-panel">
              <GoogleAuthButton onClick={onGoogleSignIn} />

              <FormDividerLabel>OR</FormDividerLabel>

              <FormField id="v3-auth-email" label="Email" type="email" value={emailValue} readOnly />
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="v3-auth-password" className="text-sm font-medium leading-5 text-ink">
                    Password
                  </label>
                  <a href={forgotPasswordHref} className="text-sm font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="v3-auth-password"
                  type="password"
                  value={passwordValue}
                  readOnly
                  className="min-h-11 rounded-lg border border-input bg-surface px-3 py-2.5 text-sm leading-6 text-ink shadow-control outline-none placeholder:text-ink-muted transition-colors duration-normal ease-default focus:border-focus focus:ring-2 focus:ring-focus"
                />
              </div>
              <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                Sign In
              </button>
            </form>

            <p className="mt-7 flex flex-wrap items-center justify-center gap-1 text-base font-medium text-ink-muted">
              <span>Don&apos;t have an account?</span>
              <a className="font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" href={createAccountHref}>
                Create new
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
