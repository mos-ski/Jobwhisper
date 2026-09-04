import { EMAIL_CATALOG, type EmailCatalogEntry } from '@/emails/catalog'

const CATEGORY_ORDER: EmailCatalogEntry['category'][] = ['Account', 'Billing', 'Jobs', 'Reports', 'Meetings']

export function EmailsIndexPage() {
  return (
    <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">email review surface</p>
        <h1 className="font-gowun mt-3 text-4xl font-semibold tracking-normal">Transactional email templates</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-ink-muted">
          Real, inline-styled, table-based HTML, browsable here and directly usable by developers wiring up sending.
          Each preview renders the template in an isolated frame with a timezone switcher.
        </p>

        {CATEGORY_ORDER.map((category) => {
          const entries = EMAIL_CATALOG.filter((entry) => entry.category === category)
          if (entries.length === 0) return null
          return (
            <section key={category} className="mt-10">
              <h2 className="text-2xl font-semibold">{category}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {entries.map((entry) => (
                  <a
                    key={entry.slug}
                    href={`/emails/${entry.slug}`}
                    aria-label={entry.label}
                    className="rounded-panel border border-border bg-surface p-5 shadow-panel transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    <span className="text-lg font-semibold text-ink">{entry.label}</span>
                    <span className="mt-2 block text-sm leading-6 text-ink-muted">{entry.description}</span>
                  </a>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
