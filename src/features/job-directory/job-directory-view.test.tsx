import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import type { JobBoard } from '@/contracts/job-directory.draft'
import { JobDirectoryView } from './job-directory-view'

const boards = [
  {
    id: 'wellfound',
    name: 'Wellfound',
    shortName: 'WF',
    description: 'Startup roles with salary and equity details.',
    websiteUrl: 'https://wellfound.com/jobs',
    focus: 'Startups' as const,
    regions: ['Worldwide'],
    workStyles: ['Remote', 'Hybrid'],
    jobs: [
      {
        id: 'product-designer',
        title: 'Senior Product Designer',
        company: 'Northstar Labs',
        location: 'Remote, Europe or Africa',
        workStyle: 'Remote' as const,
        employmentType: 'Full-time' as const,
        salaryLabel: '$120k–$155k + equity',
        postedLabel: 'Posted 3 hours ago',
        summary: 'Lead product design for a distributed workflow platform.',
        responsibilities: ['Own discovery through delivery', 'Partner with product and engineering'],
        skills: ['Product design', 'Figma', 'Research'],
        applyUrl: 'https://wellfound.com/jobs/3000000-senior-product-designer',
      },
      {
        id: 'growth-lead',
        title: 'Growth Lead',
        company: 'Copperline',
        location: 'New York, NY',
        workStyle: 'Hybrid' as const,
        employmentType: 'Full-time' as const,
        salaryLabel: '$145k–$175k',
        postedLabel: 'Posted yesterday',
        summary: 'Build a repeatable growth engine for a Series A company.',
        responsibilities: ['Own acquisition strategy'],
        skills: ['Growth strategy', 'Analytics'],
        applyUrl: 'https://wellfound.com/jobs/3000001-growth-lead',
      },
    ],
  },
  {
    id: 'remote-ok',
    name: 'Remote OK',
    shortName: 'RO',
    description: 'Remote technology roles from distributed companies.',
    websiteUrl: 'https://remoteok.com',
    focus: 'Remote' as const,
    regions: ['Worldwide'],
    workStyles: ['Remote'],
    jobs: [],
  },
] as const satisfies readonly JobBoard[]

describe('JobDirectoryView', () => {
  it('opens a board preview and hands the selected job off to the source in a new tab', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <JobDirectoryView homeHref="/v3/app" status="ready" boards={boards} onRetry={() => undefined} />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Explore Wellfound' }))

    expect(screen.getByRole('dialog', { name: 'Explore jobs on Wellfound' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Senior Product Designer' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Growth Lead/ }))

    expect(screen.getByRole('heading', { name: 'Growth Lead' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Apply on Wellfound' }))
      .toHaveAttribute('href', 'https://wellfound.com/jobs/3000001-growth-lead')
    expect(screen.getByRole('link', { name: 'Apply on Wellfound' })).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: 'Apply on Wellfound' })).toHaveAttribute('rel', 'noreferrer')
  })

  it('filters boards and clears a zero-results search', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <JobDirectoryView homeHref="/v3/app" status="ready" boards={boards} onRetry={() => undefined} />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Search job boards'), 'accounting')

    expect(screen.getByRole('heading', { name: 'No job boards match your search' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Explore Wellfound' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear search and filters' }))

    expect(screen.getByRole('button', { name: 'Explore Wellfound' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Explore Remote OK' })).toBeInTheDocument()
  })

  it('renders layout-matched loading rows', () => {
    render(
      <MemoryRouter>
        <JobDirectoryView homeHref="/v3/app" status="loading" boards={[]} onRetry={() => undefined} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('status', { name: 'Loading job boards' })).toBeInTheDocument()
    expect(screen.getAllByTestId('job-board-skeleton')).toHaveLength(4)
  })

  it('offers retry when the directory fails to load', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(
      <MemoryRouter>
        <JobDirectoryView homeHref="/v3/app" status="error" boards={[]} onRetry={onRetry} />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('keeps cached boards browsable offline and disables external application handoff', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <JobDirectoryView homeHref="/v3/app" status="offline" boards={boards} onRetry={() => undefined} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('status', { name: 'Offline directory' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Explore Wellfound' }))

    expect(screen.getByRole('button', { name: 'Apply unavailable offline' })).toBeDisabled()
    expect(screen.queryByRole('link', { name: 'Apply on Wellfound' })).not.toBeInTheDocument()
  })
})
