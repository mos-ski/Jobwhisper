import { useMemo } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { EMAIL_CATALOG, getEmailCatalogEntry, type EmailCatalogEntry } from '@/emails/catalog'
import { SelectField } from '@/ui'

const CATEGORY_ORDER: EmailCatalogEntry['category'][] = ['Account', 'Billing', 'Jobs', 'Reports', 'Meetings']

const TEMPLATE_OPTIONS = EMAIL_CATALOG.map((entry) => ({
  label: `${entry.category} · ${entry.label}`,
  value: entry.slug,
}))

function detectLocalTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'UTC'
  }
}

export function EmailPreviewPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const entry = slug ? getEmailCatalogEntry(slug) : undefined
  const result = useMemo(() => entry?.build(detectLocalTimeZone()), [entry])

  if (!entry || !result) {
    return <Navigate to="/emails/login-link" replace />
  }

  return (
    <main className="min-h-screen bg-canvas text-ink lg:flex lg:h-screen lg:overflow-hidden">
      <aside className="hidden h-screen w-72 shrink-0 flex-col border-e border-border bg-surface lg:flex">
        <div className="border-b border-border px-5 py-5">
          <Link
            to="/emails/login-link"
            className="font-gowun text-2xl font-semibold tracking-normal text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            Email previews
          </Link>
          <p className="mt-1 text-sm leading-5 text-ink-muted">Choose a template to review.</p>
        </div>

        <nav aria-label="Email templates" className="flex-1 overflow-y-auto px-3 py-4">
          {CATEGORY_ORDER.map((category) => {
            const categoryEntries = EMAIL_CATALOG.filter((candidate) => candidate.category === category)
            if (categoryEntries.length === 0) return null

            return (
              <section key={category} className="mb-5 last:mb-0">
                <h2 className="px-3 text-xs font-semibold text-ink-muted">{category}</h2>
                <div className="mt-1 space-y-1">
                  {categoryEntries.map((candidate) => {
                    const isCurrent = candidate.slug === entry.slug
                    return (
                      <Link
                        key={candidate.slug}
                        to={`/emails/${candidate.slug}`}
                        aria-current={isCurrent ? 'page' : undefined}
                        className={[
                          'flex min-h-11 items-center rounded-soft px-3 py-2 text-sm font-medium transition-colors duration-normal ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                          isCurrent
                            ? 'bg-accent-subtle text-accent-text'
                            : 'text-ink hover:bg-surface-subtle',
                        ].join(' ')}
                      >
                        {candidate.label}
                      </Link>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </nav>
      </aside>

      <section className="flex min-h-screen min-w-0 flex-1 flex-col lg:h-screen lg:min-h-0">
        <header className="shrink-0 border-b border-border bg-surface px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-accent-text">{entry.category}</p>
              <h1 className="font-gowun mt-1 text-3xl font-semibold tracking-normal text-ink">{entry.label}</h1>
              <p className="mt-1 max-w-2xl text-sm leading-5 text-ink-muted">{entry.description}</p>
            </div>

            <div className="shrink-0 lg:hidden sm:w-72">
              <SelectField
                id="email-preview-template"
                label="Template"
                options={TEMPLATE_OPTIONS}
                value={entry.slug}
                onValueChange={(value) => navigate(`/emails/${value}`)}
              />
            </div>
          </div>

          <dl className="mt-4 grid gap-3 border-t border-border pt-4 md:grid-cols-2">
            <div className="min-w-0">
              <dt className="text-xs font-medium text-ink-muted">Subject</dt>
              <dd className="mt-1 truncate text-sm font-medium text-ink" title={result.subject}>{result.subject}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs font-medium text-ink-muted">Inbox preview</dt>
              <dd className="mt-1 truncate text-sm text-ink" title={result.previewText}>{result.previewText}</dd>
            </div>
          </dl>
        </header>

        <div className="min-h-0 flex-1 bg-surface-subtle p-3 sm:p-5">
          <div className="mx-auto h-full max-w-5xl overflow-hidden rounded-panel border border-border bg-surface shadow-panel">
            <iframe
              key={entry.slug}
              title={`${entry.label} preview`}
              srcDoc={result.html}
              className="h-[78rem] w-full bg-surface lg:h-full"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
