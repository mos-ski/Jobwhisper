import { Inbox } from 'lucide-react'

import { Badge, EmptyState } from '@/ui'
import type { ExtensionApplicationRow } from '@/contracts/extension.draft'

export type ExtensionApplicationsTabViewProps = {
  readonly applications: readonly ExtensionApplicationRow[]
}

const OUTCOME_LABEL: Record<ExtensionApplicationRow['outcome'], string> = {
  success: 'Submitted',
  'needs-review': 'Needs review',
  failed: 'Did not work',
  closed: 'Closed',
}

export function ExtensionApplicationsTabView({ applications }: ExtensionApplicationsTabViewProps) {
  if (applications.length === 0) {
    return (
      <EmptyState
        icon={<Inbox aria-hidden="true" />}
        title="Nothing applied for yet"
        description="Every attempt shows up here, including the ones that did not work."
      />
    )
  }

  return (
    <ul role="list" className="grid gap-2">
      {applications.map((job) => (
        <li key={job.id} className="rounded-lg border border-border bg-surface px-3 py-2.5">
          <p className="text-sm font-medium text-ink">{job.title}</p>
          <p className="text-xs text-ink-muted">
            {job.company} &middot; {job.dateLabel}
          </p>
          <Badge variant={job.outcome === 'failed' ? 'danger' : 'neutral'} size="sm" className="mt-1.5">
            {OUTCOME_LABEL[job.outcome]}
          </Badge>
        </li>
      ))}
    </ul>
  )
}
