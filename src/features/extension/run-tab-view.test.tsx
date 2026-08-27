import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ExtensionRunTabView } from './run-tab-view'
import type { ExtensionJobBoard } from '@/contracts/extension.draft'

const boards: readonly ExtensionJobBoard[] = [
  { id: 'indeed', name: 'Indeed', state: 'start' },
  { id: 'workable', name: 'Workable', state: 'connect' },
  { id: 'linkedin', name: 'LinkedIn', state: 'in-progress' },
]

describe('ExtensionRunTabView', () => {
  it('renders the correct control for each board state', () => {
    render(<ExtensionRunTabView boards={boards} onBoardAction={() => {}} />)
    expect(screen.getByRole('button', { name: 'Start AutoApply' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Connect to Jobwhisper' })).toBeInTheDocument()
    expect(screen.getByText('Application in progress')).toBeInTheDocument()
  })

  it('calls onBoardAction with the board id when Start AutoApply is clicked', async () => {
    const onBoardAction = vi.fn()
    render(<ExtensionRunTabView boards={boards} onBoardAction={onBoardAction} />)
    await userEvent.click(screen.getByRole('button', { name: 'Start AutoApply' }))
    expect(onBoardAction).toHaveBeenCalledWith('indeed')
  })
})
