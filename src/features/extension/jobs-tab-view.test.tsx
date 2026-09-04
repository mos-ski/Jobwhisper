import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { ExtensionJobsTabView } from './jobs-tab-view'
import type { AutoApplyJob } from '@/contracts/auto-apply.draft'

function makeJob(overrides: Partial<AutoApplyJob>): AutoApplyJob {
  return {
    id: 'job-1',
    title: 'Product Manager',
    company: 'Acme',
    location: 'Remote',
    type: 'Full-Time',
    experienceLevelLabel: 'Mid Level',
    salaryLabel: 'Competitive',
    applicantsLabel: '10 applicants',
    perks: [],
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

describe('ExtensionJobsTabView', () => {
  it('shows the empty state when there are no jobs', () => {
    render(<ExtensionJobsTabView jobs={[]} />)
    expect(screen.getByText('No matched jobs yet')).toBeInTheDocument()
    expect(screen.getByText('Start a run and the scout will fill this in.')).toBeInTheDocument()
  })

  it('lists each job with its match percentage when jobs are present', () => {
    render(<ExtensionJobsTabView jobs={[makeJob({ id: '1', title: 'Senior PM', matchPercent: 87 })]} />)
    expect(screen.getByText('Senior PM')).toBeInTheDocument()
    expect(screen.getByText('87% match')).toBeInTheDocument()
  })
})
