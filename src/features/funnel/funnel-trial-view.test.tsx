import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import type { FunnelQuestion, FunnelTrialOffer } from '@/contracts/funnel.draft'
import { FunnelTrialView, type FunnelTrialViewProps } from './funnel-trial-view'

const questions: readonly FunnelQuestion[] = [
  { id: 'goal', tab: 'Goal', ask: 'What do you want to do with this resume?', kind: 'options', options: [{ label: 'Tailor it to this job' }, { label: 'Practise for the interview' }] },
  { id: 'title', tab: 'Title', ask: 'What job title are you going for?', kind: 'text', placeholder: 'e.g. Senior Product Designer' },
]

const offer: FunnelTrialOffer = {
  planName: 'Pro',
  trialDays: 7,
  includes: ['Unlimited Interview Copilot and practice', 'Resume Builder, unlimited'],
  monthlyUsd: 99,
  reminderDaysBefore: 2,
  firstChargeOn: '2026-10-02',
}

function renderView(overrides: Partial<FunnelTrialViewProps> = {}) {
  const props: FunnelTrialViewProps = {
    step: 'quiz',
    questions,
    questionIndex: 0,
    answers: {},
    offer,
    session: { status: 'anonymous' },
    online: true,
    cardStatus: 'idle',
    onAnswer: vi.fn(),
    onBack: vi.fn(),
    onContinue: vi.fn(),
    onClose: vi.fn(),
    onClaim: vi.fn(),
    onCreateAccount: vi.fn(),
    onGoogleSignUp: vi.fn(),
    onSubmitCard: vi.fn(),
    onStart: vi.fn(),
    ...overrides,
  }
  render(<FunnelTrialView {...props} />)
  return props
}

describe('FunnelTrialView', () => {
  it('holds Continue until the question is answered', async () => {
    const user = userEvent.setup()
    const props = renderView()

    expect(screen.getByText('1 of 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'Practise for the interview' }))
    expect(props.onAnswer).toHaveBeenCalledWith('goal', 'Practise for the interview')
  })

  it('calls the last question Finish once it is answered', () => {
    renderView({ questionIndex: 1, answers: { goal: 'Tailor it to this job', title: 'Product Designer' } })
    expect(screen.getByRole('button', { name: 'Finish' })).toBeEnabled()
  })

  it('says what still works while offline and holds Continue', () => {
    renderView({ online: false, answers: { goal: 'Tailor it to this job' } })
    expect(screen.getByRole('status')).toHaveTextContent('You are offline')
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })

  it('reveals the free week with the terms before any card is asked for', async () => {
    const user = userEvent.setup()
    const props = renderView({ step: 'reward', answers: { goal: 'Tailor it to this job', title: 'Product Designer' }, resumeName: 'darnell-smith-resume.pdf' })

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('You’ve unlocked a free week of Pro')
    expect(screen.getByText('Product Designer')).toBeInTheDocument()
    expect(screen.getByText('darnell-smith-resume.pdf')).toBeInTheDocument()
    expect(screen.getByText('Resume Builder, unlimited')).toBeInTheDocument()
    expect(screen.getByText(/\$0 today.*\$99 a month after 7 days/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Claim my free week' }))
    expect(props.onClaim).toHaveBeenCalled()
  })

  it('asks for a real email before creating the account', async () => {
    const user = userEvent.setup()
    const props = renderView({ step: 'account' })

    await user.type(screen.getByLabelText('Email'), 'darnell')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('alert')).toHaveTextContent('name@example.com')
    expect(props.onCreateAccount).not.toHaveBeenCalled()

    await user.type(screen.getByLabelText('Email'), '@example.com')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(props.onCreateAccount).toHaveBeenCalledWith('darnell@example.com')
  })

  it('states every term on the card step and holds submit until the card is complete', async () => {
    const user = userEvent.setup()
    const props = renderView({ step: 'card', session: { status: 'authenticated', user: { id: 'u1', email: 'd@example.com', name: 'Darnell Smith', role: 'candidate', permissions: [] } } })

    expect(screen.getByText('$0 today')).toBeInTheDocument()
    expect(screen.getByText(/Free for 7 days, until 2 October 2026/)).toBeInTheDocument()
    expect(screen.getByText(/Pro at \$99 a month, until you cancel/)).toBeInTheDocument()
    expect(screen.getByText(/email you 2 days before/)).toBeInTheDocument()

    const submit = screen.getByRole('button', { name: 'Start my free week' })
    expect(submit).toBeDisabled()

    await user.type(screen.getByLabelText('Name on card'), 'Darnell Smith')
    await user.type(screen.getByLabelText('Card number'), '4242 4242 4242 4242')
    await user.type(screen.getByLabelText('Expiry (MM/YY)'), '12/29')
    await user.type(screen.getByLabelText('Security code'), '123')
    await user.click(submit)
    expect(props.onSubmitCard).toHaveBeenCalled()
  })

  it('explains a declined card', () => {
    renderView({ step: 'card', cardStatus: 'declined', cardError: 'Your bank declined this card. Try another card, or ask your bank to allow the payment.' })
    expect(screen.getByRole('alert')).toHaveTextContent('Your bank declined this card')
  })

  it('confirms the week has started and when it ends', async () => {
    const user = userEvent.setup()
    const props = renderView({ step: 'done' })

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your free week of Pro has started')
    expect(screen.getByText('Free until 2 October 2026')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Start with your setup' }))
    expect(props.onStart).toHaveBeenCalled()
  })
})
