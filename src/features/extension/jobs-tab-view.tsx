import { Briefcase } from 'lucide-react'

import { Badge, EmptyState } from '@/ui'
import type { AutoApplyJob } from '@/contracts/auto-apply.draft'

export type ExtensionJobsTabViewProps = {
  readonly jobs: readonly AutoApplyJob[]
}

export function ExtensionJobsTabView({ jobs }: ExtensionJobsTabViewProps) {
  if (jobs.length === 0) {
    return <EmptyState icon={<Briefcase aria-hidden="true" />} title="No matched jobs yet" description="Start a run and the scout will fill this in." />
  }

  return (
    <ul role="list" className="grid gap-2">
      {jobs.map((job) => (
        <li key={job.id} className="rounded-lg border border-border bg-surface px-3 py-2.5">
          <p className="text-sm font-medium text-ink">{job.title}</p>
          <p className="text-xs text-ink-muted">
            {job.company} &middot; {job.location}
          </p>
          <Badge variant="accent" size="sm" className="mt-1.5">
            {job.matchPercent}% match
          </Badge>
        </li>
      ))}
    </ul>
  )
}
