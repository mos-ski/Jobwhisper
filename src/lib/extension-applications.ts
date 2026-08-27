import type { AutoApplyJob } from '@/contracts/auto-apply.draft'

export function getAppliedJobs(jobs: readonly AutoApplyJob[]): readonly AutoApplyJob[] {
  return jobs.filter((job) => job.status === 'applied')
}
