import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ExtensionPopupView } from './extension-popup-view'
import type { AutoApplyJob } from '@/contracts/auto-apply.draft'
import type { ExtensionJobBoard } from '@/contracts/extension.draft'

const boards: readonly ExtensionJobBoard[] = [{ id: 'indeed', name: 'Indeed', state: 'start' }]
const jobs: readonly AutoApplyJob[] = []

describe('ExtensionPopupView', () => {
  it('shows the Run tab by default with the credit balance', () => {
    render(<ExtensionPopupView boards={boards} jobs={jobs} creditBalance={10} onSignOut={() => {}} />)
    expect(screen.getByText('10 credits')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start AutoApply' })).toBeInTheDocument()
  })

  it('switches to the Jobs tab and shows its empty state', async () => {
    const user = userEvent.setup()
    render(<ExtensionPopupView boards={boards} jobs={jobs} creditBalance={10} onSignOut={() => {}} />)
    await user.click(screen.getByRole('tab', { name: 'Jobs' }))
    expect(screen.getByText('No matched jobs yet')).toBeInTheDocument()
  })

  it('calls onSignOut when Sign out is clicked', async () => {
    const onSignOut = vi.fn()
    const user = userEvent.setup()
    render(<ExtensionPopupView boards={boards} jobs={jobs} creditBalance={10} onSignOut={onSignOut} />)
    await user.click(screen.getByRole('button', { name: 'Sign out' }))
    expect(onSignOut).toHaveBeenCalledTimes(1)
  })

  it('flips a board from start to in-progress when Start AutoApply is clicked', async () => {
    const user = userEvent.setup()
    render(<ExtensionPopupView boards={boards} jobs={jobs} creditBalance={10} onSignOut={() => {}} />)
    await user.click(screen.getByRole('button', { name: 'Start AutoApply' }))
    expect(screen.getByText('Application in progress')).toBeInTheDocument()
  })
})
