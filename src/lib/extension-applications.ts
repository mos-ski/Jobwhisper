import type { AutoApplyJob } from '@/contracts/auto-apply.draft'
import type { ExtensionAppliedJob, ExtensionApplicationRow } from '@/contracts/extension.draft'

export function getAppliedJobs(jobs: readonly AutoApplyJob[]): readonly AutoApplyJob[] {
  return jobs.filter((job) => job.status === 'applied')
}

export function autoApplyJobToApplicationRow(job: AutoApplyJob): ExtensionApplicationRow {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    dateLabel: job.dateLabel,
    outcome: job.outcome ?? 'success',
  }
}

export function extensionAppliedJobToApplicationRow(job: ExtensionAppliedJob): ExtensionApplicationRow {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    dateLabel: 'Just now',
    outcome: job.outcome,
  }
}
