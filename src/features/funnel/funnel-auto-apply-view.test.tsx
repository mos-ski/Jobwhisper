import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { autoApplyFunnelMatches, autoApplyFunnelQuestions } from '@/mocks/funnel'
import { FunnelAutoApplyView, type FunnelAutoApplyViewProps } from './funnel-auto-apply-view'

function renderView(overrides: Partial<FunnelAutoApplyViewProps> = {}) {
  const props: FunnelAutoApplyViewProps = {
    step: 'upload',
    questions: autoApplyFunnelQuestions,
    questionIndex: 0,
    answers: {},
    online: true,
    matches: autoApplyFunnelMatches,
    onFile: vi.fn(),
    onAnswer: vi.fn(),
    onBack: vi.fn(),
    onContinue: vi.fn(),
    onClose: vi.fn(),
    onSelectJob: vi.fn(),
    onApply: vi.fn(),
    onEditAnswer: vi.fn(),
    onCreateAccount: vi.fn(),
    onGoogleSignUp: vi.fn(),
    ...overrides,
  }
  render(<FunnelAutoApplyView {...props} />)
  return props
}

describe('FunnelAutoApplyView', () => {
  it('counts the resume as the first of ten questions and says what is free', () => {
    renderView()
    expect(screen.getByText('1 of 10')).toBeInTheDocument()
    expect(screen.getByText(/Free to match\. Sign up to apply\./)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })

  it('asks the matching questions one per page', () => {
    renderView({ step: 'quiz', questionIndex: 1 })
    expect(screen.getByText('3 of 10')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('How much experience do you have in it?')
  })

  it('lists every match with its score in words', async () => {
    const user = userEvent.setup()
    const props = renderView({ step: 'matches', answers: { role: 'Customer Success Manager' } })

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('8 jobs we’d apply to for you')
    const list = screen.getByRole('list', { name: 'Matched jobs' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(8)
    expect(screen.getByText('94% match')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Apply to all 8' }))
    expect(props.onApply).toHaveBeenCalledWith('all')
  })

  it('opens a job with why it matched, and applies to that one', async () => {
    const user = userEvent.setup()
    const props = renderView({ step: 'matches', selectedJobId: 'lattice-csm' })

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Customer Success Manager, Mid-Market')
    expect(screen.getByText('Your churn reduction pilot matches their retention goal')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Apply to this job' }))
    expect(props.onApply).toHaveBeenCalledWith('lattice-csm')
    await user.click(screen.getByRole('button', { name: 'All matches' }))
    expect(props.onSelectJob).toHaveBeenCalledWith(null)
  })

  it('suggests which answers to widen when nothing matches', async () => {
    const user = userEvent.setup()
    const props = renderView({ step: 'matches', matches: [] })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('No roles match every answer yet')
    await user.click(screen.getByRole('button', { name: 'Widen the location' }))
    expect(props.onEditAnswer).toHaveBeenCalledWith('location')
  })

  it('names the jobs waiting behind the sign-up gate', () => {
    renderView({ step: 'gate', applyTarget: 'all' })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sign up and your agent applies for you')
    expect(screen.getByText(/all 8 matches/)).toBeInTheDocument()
  })
})
