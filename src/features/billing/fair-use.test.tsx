import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import {
  autoApplyFairUseSpent,
  interviewFairUseNearing,
  interviewFairUseRunning,
  interviewFairUseSpent,
  interviewFairUseSpentNoUnlock,
} from '@/mocks/fair-use'

import { FairUseLimitDialog, FairUseMeter, formatFairUseAmount } from './fair-use'

describe('formatFairUseAmount', () => {
  it('reads minutes as time and everything else as a count', () => {
    expect(formatFairUseAmount(120, 'minutes')).toBe('2h')
    expect(formatFairUseAmount(104, 'minutes')).toBe('1h 44m')
    expect(formatFairUseAmount(45, 'minutes')).toBe('45 min')
    expect(formatFairUseAmount(1, 'prompts')).toBe('1 prompt')
    expect(formatFairUseAmount(50, 'applications')).toBe('50 applications')
  })
})

describe('FairUseMeter', () => {
  it('explains the stretch while it is still running', () => {
    render(<FairUseMeter snapshot={interviewFairUseRunning} featureName="Interview Copilot" />)

    expect(screen.getByText('34 min of 2h in this stretch')).toBeInTheDocument()
    expect(screen.getByText(/Unlimited across your plan/)).toBeInTheDocument()
  })

  it('warns before the wall, not after it', () => {
    render(<FairUseMeter snapshot={interviewFairUseNearing} featureName="Interview Copilot" />)

    // The number that matters at this point is what is left, not what is spent.
    expect(screen.getByRole('status')).toHaveTextContent('16 min left before Interview Copilot rests for 3 hours.')
  })

  it('says when the feature reopens once the stretch is spent', () => {
    render(<FairUseMeter snapshot={interviewFairUseSpent} featureName="Interview Copilot" />)

    expect(screen.getByRole('status')).toHaveTextContent('opens again at 6:20 PM, in 2h 47m')
  })
})

describe('FairUseLimitDialog', () => {
  it('offers the wait and the way past it, and prices the way past', async () => {
    const user = userEvent.setup()
    const onUnlock = vi.fn()
    render(
      <FairUseLimitDialog
        open
        onOpenChange={() => {}}
        snapshot={interviewFairUseSpent}
        featureName="Interview Copilot"
        onUnlock={onUnlock}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Your 2h stretch is up' })).toBeInTheDocument()
    expect(screen.getByText(/100 interview minutes for \$10.00 starts a fresh stretch/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Wait until 6:20 PM' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add $10.00 and keep going' }))
    expect(onUnlock).toHaveBeenCalledTimes(1)
  })

  it('calls a run a run: no talk of calls or transcripts outside an interview', () => {
    render(
      <FairUseLimitDialog open onOpenChange={() => {}} snapshot={autoApplyFairUseSpent} featureName="Auto Apply" />,
    )

    expect(screen.getByRole('heading', { name: 'Your 50 applications run is up' })).toBeInTheDocument()
    expect(screen.getByText(/Every application already sent keeps its place/)).toBeInTheDocument()
    expect(screen.queryByText(/transcript/)).not.toBeInTheDocument()
  })

  it('sells nothing when the policy has no way past the cooldown', () => {
    render(
      <FairUseLimitDialog
        open
        onOpenChange={() => {}}
        snapshot={interviewFairUseSpentNoUnlock}
        featureName="Interview Copilot"
      />,
    )

    expect(screen.queryByRole('button', { name: /keep going/i })).not.toBeInTheDocument()
    expect(screen.getByText(/cannot be bought past/)).toBeInTheDocument()
  })
})
