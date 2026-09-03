import { describe, it, expect } from 'vitest'
import { getAppliedJobs } from './extension-applications'
import type { AutoApplyJob } from '@/contracts/auto-apply.draft'

function makeJob(overrides: Partial<AutoApplyJob>): AutoApplyJob {
  return {
    id: 'job-1',
    title: 'Product Manager',
    company: 'Acme',
    location: 'Remote',
    type: 'Full-Time',
    matchPercent: 90,
    source: 'LinkedIn',
    dateLabel: 'Aug 1',
    postedDateLabel: 'Jul 30',
    status: 'new',
    listingUrl: 'https://example.com',
    resumeFileName: 'resume.pdf',
    description: 'Great role',
    tags: [],
    matchBreakdown: [],
    creditsRemaining: 10,
    creditsTotal: 10,
    ...overrides,
  }
}

describe('getAppliedJobs', () => {
  it('returns only jobs with status "applied"', () => {
    const jobs = [makeJob({ id: '1', status: 'applied' }), makeJob({ id: '2', status: 'new' }), makeJob({ id: '3', status: 'applied' })]
    expect(getAppliedJobs(jobs).map((job) => job.id)).toEqual(['1', '3'])
  })

  it('returns an empty array when no jobs are applied', () => {
    expect(getAppliedJobs([makeJob({ id: '1', status: 'new' })])).toEqual([])
  })
})
