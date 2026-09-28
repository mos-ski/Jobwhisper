import { JobwhisperMark } from '@/ui'

export type DesktopSignInViewProps = {
  readonly onSignIn: () => void
}

export function DesktopSignInView({ onSignIn }: DesktopSignInViewProps) {
  return (
    <div className="flex h-full min-h-[480px] flex-col items-center justify-center gap-8 px-8 pb-16 text-center">
      <JobwhisperMark className="h-8 w-auto text-ink" />
      <h1 className="max-w-md font-gowun text-4xl leading-tight text-ink">Ease into your interview like it&rsquo;s nothing.</h1>
      <button
        type="button"
        onClick={onSignIn}
        className="inline-flex min-h-11 w-full max-w-80 items-center justify-center rounded-lg bg-accent px-4 text-base font-semibold text-on-accent hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        Sign in to Jobwhisper
      </button>
      <p className="text-sm text-ink-muted">Opens in your browser, then brings you back here.</p>
    </div>
  )
}
