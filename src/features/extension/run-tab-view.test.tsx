import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ExtensionRunTabView } from './run-tab-view'
import type { ExtensionAppliedJob, ExtensionJobBoard, ExtensionRunStats } from '@/contracts/extension.draft'

const boards: readonly ExtensionJobBoard[] = [
  { id: 'indeed', name: 'Indeed', state: 'start' },
  { id: 'workable', name: 'Workable', state: 'connect' },
  { id: 'linkedin', name: 'LinkedIn', state: 'in-progress' },
]

const runStats: ExtensionRunStats = { applied: 0, skipped: 0, status: 'Fetching jobs…' }

function renderRunTab(overrides: Partial<Parameters<typeof ExtensionRunTabView>[0]> = {}) {
  return render(
    <ExtensionRunTabView
      boards={boards}
      onBoardAction={() => {}}
      activeBoardId={null}
      appliedJobs={[]}
      stats={runStats}
      feedExpanded={false}
      onToggleFeedExpanded={() => {}}
      onViewJobHistory={() => {}}
      {...overrides}
    />,
  )
}

describe('ExtensionRunTabView', () => {
  it('renders the correct control for each board state', () => {
    renderRunTab()
    expect(screen.getByRole('button', { name: 'Start AutoApply' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Connect to Jobwhisper' })).toBeInTheDocument()
    expect(screen.getByText('Application in progress')).toBeInTheDocument()
  })

  it('calls onBoardAction with the board id when Start AutoApply is clicked', async () => {
    const onBoardAction = vi.fn()
    const user = userEvent.setup()
    renderRunTab({ onBoardAction })
    await user.click(screen.getByRole('button', { name: 'Start AutoApply' }))
    expect(onBoardAction).toHaveBeenCalledWith('indeed')
  })

  it('does not show the live feed bar or job history link when no run is active', () => {
    renderRunTab()
    expect(screen.queryByText(/Job history/)).not.toBeInTheDocument()
    expect(screen.queryByText(/AutoApply$/, { selector: 'button *' })).not.toBeInTheDocument()
  })

  it('shows the live feed bar, job history link, and applied jobs grouped by board when a run is active', async () => {
    const appliedJobs: readonly ExtensionAppliedJob[] = [
      { id: 'j1', boardId: 'indeed', title: 'Data Analyst', company: 'Coinbase', listingUrl: 'https://indeed.com/x', outcome: 'success' },
      {
        id: 'j2',
        boardId: 'indeed',
        title: 'Backend Engineer',
        company: 'Stripe',
        listingUrl: 'https://indeed.com/y',
        outcome: 'failed',
        failureReason: 'Turn off your VPN and try again.',
      },
    ]
    const user = userEvent.setup()
    const onToggleFeedExpanded = vi.fn()
    renderRunTab({ activeBoardId: 'indeed', appliedJobs, onToggleFeedExpanded })

    expect(screen.getByRole('button', { name: /Job history/ })).toBeInTheDocument()
    const feedToggle = screen.getByRole('button', { name: /Indeed AutoApply/ })
    expect(feedToggle).toBeInTheDocument()

    await user.click(feedToggle)
    expect(onToggleFeedExpanded).toHaveBeenCalledTimes(1)
  })

  it('shows applied job cards and failure reasons when the feed is expanded', () => {
    const appliedJobs: readonly ExtensionAppliedJob[] = [
      {
        id: 'j2',
        boardId: 'indeed',
        title: 'Backend Engineer',
        company: 'Stripe',
        listingUrl: 'https://indeed.com/y',
        outcome: 'failed',
        failureReason: 'Turn off your VPN and try again.',
      },
    ]
    renderRunTab({ activeBoardId: 'indeed', appliedJobs, feedExpanded: true })
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument()
    expect(screen.getByText('Turn off your VPN and try again.')).toBeInTheDocument()
    expect(screen.getByText('Failed')).toBeInTheDocument()
  })
})
