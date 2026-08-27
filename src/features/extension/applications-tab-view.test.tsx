import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { ExtensionApplicationsTabView } from './applications-tab-view'
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
    status: 'applied',
    listingUrl: 'https://example.com',
    resumeFileName: 'resume.pdf',
    description: 'Great role',
    tags: [],
    creditsRemaining: 10,
    creditsTotal: 10,
    ...overrides,
  }
}

describe('ExtensionApplicationsTabView', () => {
  it('shows the empty state when there are no applications', () => {
    render(<ExtensionApplicationsTabView applications={[]} />)
    expect(screen.getByText('Nothing applied for yet')).toBeInTheDocument()
    expect(screen.getByText('Every attempt shows up here, including the ones that did not work.')).toBeInTheDocument()
  })

  it('lists each application with its outcome', () => {
    render(<ExtensionApplicationsTabView applications={[makeJob({ id: '1', title: 'Backend Engineer', outcome: 'failed' })]} />)
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument()
    expect(screen.getByText('Did not work')).toBeInTheDocument()
  })
})
