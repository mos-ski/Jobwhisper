import { useState } from 'react'
import { X } from 'lucide-react'

import type { ConsentPreferences } from '@/contracts/consent.draft'
import { Button, cn, Switch } from '@/ui'

export type CookieConsentProps = {
  /** Current choice, used to preset the toggles. Read once; remount (change `key`) to reset. */
  readonly preferences: ConsentPreferences
  /** Open straight on the toggles, e.g. from the footer's "Cookie settings". Defaults to false. */
  readonly startWithChoices?: boolean
  readonly privacyHref: string
  readonly termsHref: string
  readonly onAcceptAll: () => void
  readonly onRejectAll: () => void
  readonly onSave: (preferences: ConsentPreferences) => void
}

// Black, like the landing page's own buttons, rather than the app's blue accent.
const black = 'bg-surface-inverse text-surface hover:bg-ink-muted'
const pill = 'rounded-pill'

const CATEGORIES = [
  { key: 'analytics', title: 'Analytics', body: 'Counts visits and the steps people take, so we can see which pages help.' },
  { key: 'marketing', title: 'Marketing', body: 'Tells us which ads brought you here, so we spend less on the ones that do not.' },
] as const

/**
 * One paragraph, the policies beside it, and the three things you can do. No heading: the
 * banner is the only thing on screen asking anything, so titling it "Cookies on Jobwhisper"
 * spent the widest line in the card telling the reader what they could already see. The
 * accessible name carries it instead.
 */
export function CookieConsent({ preferences, startWithChoices = false, privacyHref, termsHref, onAcceptAll, onRejectAll, onSave }: CookieConsentProps) {
  const [choosing, setChoosing] = useState(startWithChoices)
  const [draft, setDraft] = useState<ConsentPreferences>(preferences)

  return (
    // Light only, like the marketing pages it sits on; the tokens re-scope to light under this attribute.
    <section
      data-slot="cookie-consent"
      data-theme="light"
      aria-label="Cookies on Jobwhisper"
      className="fixed inset-x-3 bottom-3 z-toast max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-2xl border border-border bg-surface p-5 text-ink shadow-panel sm:inset-x-auto sm:bottom-6 sm:start-6 sm:w-full sm:max-w-md sm:p-6"
    >
      <div className="flex items-start gap-3">
        <p className="min-w-0 flex-1 text-sm leading-6 text-ink-muted">
          Essential cookies keep Jobwhisper running. With your permission, analytics and marketing cookies help us
          measure what works and improve the product.
        </p>
        {/* Closing grants nothing, so it is the same decision as Reject rather than a way out of deciding. */}
        <button
          type="button"
          aria-label="Close, without accepting analytics or marketing cookies"
          onClick={onRejectAll}
          className="-me-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-pill text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>

      <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <a href={privacyHref} className="font-medium text-ink underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          Privacy Policy
        </a>
        <span aria-hidden="true" className="text-ink-muted">·</span>
        <a href={termsHref} className="font-medium text-ink underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          Terms of Service
        </a>
      </p>

      {choosing ? (
        <div className="mt-5 grid gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="grid gap-0.5">
              <span className="text-sm font-semibold text-ink">Essential</span>
              <span className="text-sm leading-6 text-ink-muted">Sign-in, security and remembering this choice. Always on.</span>
            </div>
            <span className="shrink-0 rounded-full bg-surface-subtle px-3 py-1 text-xs font-semibold text-ink">Always on</span>
          </div>
          {CATEGORIES.map((category) => (
            <div key={category.key} className="flex items-start justify-between gap-4">
              <div className="grid gap-0.5">
                <span className="text-sm font-semibold text-ink">{category.title}</span>
                <span className="text-sm leading-6 text-ink-muted">{category.body}</span>
              </div>
              <Switch
                aria-label={`${category.title} cookies`}
                checked={draft[category.key]}
                onCheckedChange={(checked) => setDraft((current) => ({ ...current, [category.key]: checked }))}
                className="mt-1"
              />
            </div>
          ))}
          <div className="grid gap-2">
            <Button size="lg" className={cn(pill, black)} onClick={() => onSave(draft)}>Save choices</Button>
            <Button size="lg" variant="secondary" className={pill} onClick={onAcceptAll}>Accept all</Button>
          </div>
        </div>
      ) : (
        // Settings takes its own row so the two decisions sit together, and Reject is the same
        // size as Accept: refusing stays as easy as agreeing.
        <div className="mt-4 grid gap-2">
          <Button size="lg" variant="ghost" className={cn(pill, 'border border-input text-ink hover:bg-surface-subtle')} onClick={() => setChoosing(true)}>
            Cookie settings
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button size="lg" variant="secondary" className={pill} onClick={onRejectAll}>Reject all</Button>
            <Button size="lg" className={cn(pill, black)} onClick={onAcceptAll}>Accept all</Button>
          </div>
        </div>
      )}
    </section>
  )
}
