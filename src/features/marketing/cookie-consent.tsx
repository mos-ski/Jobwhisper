import { useId, useState } from 'react'

import type { ConsentPreferences } from '@/contracts/consent.draft'
import { Button, Switch } from '@/ui'

export type CookieConsentProps = {
  /** Current choice, used to preset the toggles. Read once; remount (change `key`) to reset. */
  readonly preferences: ConsentPreferences
  /** Open straight on the toggles, e.g. from the footer's "Cookie settings". Defaults to false. */
  readonly startWithChoices?: boolean
  readonly privacyHref: string
  readonly onAcceptAll: () => void
  readonly onRejectAll: () => void
  readonly onSave: (preferences: ConsentPreferences) => void
}

const CATEGORIES = [
  { key: 'analytics', title: 'Analytics', body: 'Counts visits and the steps people take, so we can see which pages help.' },
  { key: 'marketing', title: 'Marketing', body: 'Tells us which ads brought you here, so we spend less on the ones that do not.' },
] as const

export function CookieConsent({ preferences, startWithChoices = false, privacyHref, onAcceptAll, onRejectAll, onSave }: CookieConsentProps) {
  const titleId = useId()
  const [choosing, setChoosing] = useState(startWithChoices)
  const [draft, setDraft] = useState<ConsentPreferences>(preferences)

  return (
    // Light only, like the marketing pages it sits on; the tokens re-scope to light under this attribute.
    <section
      data-slot="cookie-consent"
      data-theme="light"
      aria-labelledby={titleId}
      className="fixed inset-x-3 bottom-3 z-toast max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-2xl border border-border bg-surface p-5 text-ink shadow-panel sm:inset-x-auto sm:bottom-6 sm:start-6 sm:w-full sm:max-w-md sm:p-6"
    >
      <h2 id={titleId} className="font-gowun text-xl font-bold text-ink">Cookies on Jobwhisper</h2>
      <p className="mt-2 text-sm leading-6 text-ink-muted">
        Essential cookies keep the site working. With your OK we also use analytics and marketing cookies. You can change this any time from Cookie settings in the footer.{' '}
        <a href={privacyHref} className="font-medium text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Privacy Policy</a>
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
          <div className="grid gap-2 sm:grid-cols-2">
            <Button size="lg" onClick={() => onSave(draft)}>Save choices</Button>
            <Button size="lg" variant="secondary" onClick={onAcceptAll}>Accept all</Button>
          </div>
        </div>
      ) : (
        // Accept and reject sit side by side at the same size: refusing has to be as easy as agreeing.
        <div className="mt-5 grid gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Button size="lg" onClick={onAcceptAll}>Accept all</Button>
            <Button size="lg" onClick={onRejectAll}>Reject all</Button>
          </div>
          <Button size="lg" variant="ghost" onClick={() => setChoosing(true)}>Choose which cookies</Button>
        </div>
      )}
    </section>
  )
}
