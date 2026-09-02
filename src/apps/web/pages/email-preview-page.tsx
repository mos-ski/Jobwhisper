import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { getEmailCatalogEntry } from '@/emails/catalog'
import { COMMON_TIMEZONES } from '@/emails/format'
import { SelectField } from '@/ui'

function detectLocalTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'UTC'
  }
}

export function EmailPreviewPage() {
  const { slug } = useParams<{ slug: string }>()
  const entry = slug ? getEmailCatalogEntry(slug) : undefined
  const [timeZone, setTimeZone] = useState(detectLocalTimeZone)

  const timeZoneOptions = useMemo(() => {
    const hasLocal = COMMON_TIMEZONES.some((tz) => tz.value === timeZone)
    const base = COMMON_TIMEZONES.map((tz) => ({ label: tz.label, value: tz.value }))
    return hasLocal ? base : [{ label: `${timeZone} (your device)`, value: timeZone }, ...base]
  }, [timeZone])

  const result = useMemo(() => entry?.build(timeZone), [entry, timeZone])

  if (!entry || !result) {
    return (
      <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
        <div className="mx-auto max-w-3xl">
          <a href="/emails" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-text">
            <ArrowLeft className="size-4" />
            Back to all emails
          </a>
          <p className="mt-6 text-base text-ink-muted">No email template found for "{slug}".</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
      <div className="mx-auto max-w-3xl">
        <a href="/emails" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-text">
          <ArrowLeft className="size-4" />
          Back to all emails
        </a>

        <h1 className="mt-4 text-3xl font-semibold tracking-normal">{entry.label}</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">{entry.description}</p>

        <div className="mt-6 grid gap-4 rounded-panel border border-border bg-surface p-5 shadow-panel sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Subject</p>
            <p className="mt-1 text-sm font-medium text-ink">{result.subject}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Preview text</p>
            <p className="mt-1 text-sm font-medium text-ink">{result.previewText}</p>
          </div>
        </div>

        <div className="mt-6 max-w-xs">
          <SelectField
            id="email-preview-timezone"
            label="Preview times in"
            options={timeZoneOptions}
            value={timeZone}
            onValueChange={setTimeZone}
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-panel border border-border shadow-panel">
          <iframe
            key={`${entry.slug}-${timeZone}`}
            title={`${entry.label} preview`}
            srcDoc={result.html}
            className="h-[720px] w-full bg-white"
          />
        </div>
      </div>
    </main>
  )
}
