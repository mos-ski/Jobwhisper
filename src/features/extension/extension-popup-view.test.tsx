import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ExtensionPopupView } from './extension-popup-view'
import type { AutoApplyJob } from '@/contracts/auto-apply.draft'
import type { ExtensionApplicationRow, ExtensionJobBoard, ExtensionRunStats } from '@/contracts/extension.draft'

const boards: readonly ExtensionJobBoard[] = [{ id: 'indeed', name: 'Indeed', state: 'start' }]
const jobs: readonly AutoApplyJob[] = []
const applications: readonly ExtensionApplicationRow[] = []
const runStats: ExtensionRunStats = { applied: 0, skipped: 0, status: 'Fetching jobs…' }

function renderPopup(overrides: Partial<Parameters<typeof ExtensionPopupView>[0]> = {}) {
  return render(
    <ExtensionPopupView
      boards={boards}
      jobs={jobs}
      creditBalance={10}
      applications={applications}
      onBoardAction={() => {}}
      onSignOut={() => {}}
      activeRunBoardId={null}
      runAppliedJobs={[]}
      runStats={runStats}
      {...overrides}
    />,
  )
}

describe('ExtensionPopupView', () => {
  it('shows the Run tab by default with the credit balance', () => {
    renderPopup()
    expect(screen.getByText('10 credits')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start AutoApply' })).toBeInTheDocument()
  })

  it('switches to the Jobs tab and shows its empty state', async () => {
    const user = userEvent.setup()
    renderPopup()
    await user.click(screen.getByRole('tab', { name: 'Jobs' }))
    expect(screen.getByText('No matched jobs yet')).toBeInTheDocument()
  })

  it('calls onSignOut when Sign out is clicked', async () => {
    const onSignOut = vi.fn()
    const user = userEvent.setup()
    renderPopup({ onSignOut })
    await user.click(screen.getByRole('button', { name: 'Sign out' }))
    expect(onSignOut).toHaveBeenCalledTimes(1)
  })

  it('calls onBoardAction with the board id when Start AutoApply is clicked', async () => {
    const onBoardAction = vi.fn()
    const user = userEvent.setup()
    renderPopup({ onBoardAction })
    await user.click(screen.getByRole('button', { name: 'Start AutoApply' }))
    expect(onBoardAction).toHaveBeenCalledWith('indeed')
  })

  it('shows the live feed bar and switches to Applications via Job history when a run is active', async () => {
    const user = userEvent.setup()
    renderPopup({ activeRunBoardId: 'indeed' })
    expect(screen.getByRole('button', { name: /Indeed AutoApply/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Job history/ }))
    expect(screen.getByText('Nothing applied for yet')).toBeInTheDocument()
  })
})
