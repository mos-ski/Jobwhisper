import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import {
  interviewFairUseNearing,
  interviewFairUseRunning,
  interviewFairUseSpent,
  resumeFairUseNearing,
  resumeFairUseSpent,
} from '@/mocks/fair-use'

import { FairUseMeter, FairUseNotice, formatFairUseAmount } from './fair-use'

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

    expect(screen.getByText(/34 min of 2h\s+in this stretch/)).toBeInTheDocument()
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

describe('FairUseNotice', () => {
  it('is the same reading as the meter, shaped for a thumb', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(<FairUseNotice snapshot={resumeFairUseNearing} featureName="Resume Builder" onAction={onAction} />)

    expect(screen.getByRole('status')).toHaveTextContent('Approaching your limit')
    expect(screen.getByRole('status')).toHaveTextContent('3 prompts left in this sitting.')
    // No progress bar: on a phone the sentence and the button are the whole of it.
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Keep going now' }))
    expect(onAction).toHaveBeenCalledTimes(1)
  })

  it('says when the feature comes back once the stretch is spent', () => {
    render(<FairUseNotice snapshot={resumeFairUseSpent} featureName="Resume Builder" />)

    expect(screen.getByRole('status')).toHaveTextContent('Resume Builder is resting')
    expect(screen.getByRole('status')).toHaveTextContent('Back at 4:45 PM, in 2h 12m.')
  })
})
