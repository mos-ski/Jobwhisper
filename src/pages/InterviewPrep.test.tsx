import { act } from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import InterviewPrep from './InterviewPrep'

function renderInterviewPrep() {
  render(
    <MemoryRouter>
      <InterviewPrep />
    </MemoryRouter>,
  )
}

describe('Interview Prep Revamp', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders scenario presets and filters them by interview type', () => {
    renderInterviewPrep()

    expect(screen.getByText('Interview Prep')).toBeInTheDocument()
    expect(screen.getByText('Recruiter Screen - Product Designer')).toBeInTheDocument()
    expect(screen.getByText('Technical Deep Dive - Frontend Engineer')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Technical' }))

    expect(screen.getByText('Technical Deep Dive - Frontend Engineer')).toBeInTheDocument()
    expect(screen.queryByText('Recruiter Screen - Product Designer')).not.toBeInTheDocument()
  })

  it('updates the custom scenario preview as form fields change', () => {
    renderInterviewPrep()

    fireEvent.click(screen.getByRole('button', { name: /Create Scenario/ }))
    fireEvent.change(screen.getByLabelText('Target role'), { target: { value: 'Senior Product Manager' } })
    fireEvent.change(screen.getByLabelText('Company'), { target: { value: 'Stripe' } })
    fireEvent.change(screen.getByLabelText('Interviewer persona'), { target: { value: 'Director of Product' } })

    const preview = screen.getByTestId('scenario-preview')
    expect(within(preview).getByText('Custom Scenario')).toBeInTheDocument()
    expect(within(preview).getByText('Senior Product Manager')).toBeInTheDocument()
    expect(within(preview).getByText('Director of Product - Stripe')).toBeInTheDocument()
  })

  it('selects a stronger interviewer avatar and voice card', () => {
    renderInterviewPrep()

    fireEvent.click(screen.getByRole('button', { name: /Create Scenario/ }))
    fireEvent.click(screen.getByRole('button', { name: /Select Marcus/ }))

    expect(screen.getByText('Marcus')).toBeInTheDocument()
    expect(screen.getByText('Selected voice: Marcus')).toBeInTheDocument()
    expect(screen.getByText('Technical systems thinker')).toBeInTheDocument()
  })

  it('moves through preparing, studio, processing, and report states', () => {
    renderInterviewPrep()

    fireEvent.click(screen.getAllByRole('button', { name: /Configure & Start/ })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Start Interview' }))

    expect(screen.getByText('Preparing interview...')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(900)
    })

    expect(screen.getByText('Live interview studio')).toBeInTheDocument()
    expect(screen.getByText(/Interviewer/)).toBeInTheDocument()
    expect(screen.getByText(/You/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'End interview' }))

    expect(screen.getByText('Preparing your coaching report...')).toBeInTheDocument()
    expect(screen.getByText('Processing call recording')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(3200)
    })

    expect(screen.getByText('Post-Interview Scorecard')).toBeInTheDocument()
  })

  it('renders score, coaching details, rubric, transcript, and mock recording', () => {
    renderInterviewPrep()

    fireEvent.click(screen.getAllByRole('button', { name: /Configure & Start/ })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Start Interview' }))
    act(() => {
      vi.advanceTimersByTime(900)
    })
    fireEvent.click(screen.getByRole('button', { name: 'End interview' }))
    act(() => {
      vi.advanceTimersByTime(3200)
    })

    expect(screen.getByText('82')).toBeInTheDocument()
    expect(screen.getByText('Overall Summary')).toBeInTheDocument()
    expect(screen.getByText('What Went Well')).toBeInTheDocument()
    expect(screen.getByText('What Needs Work')).toBeInTheDocument()
    expect(screen.getByText('Knowledge Gaps')).toBeInTheDocument()
    expect(screen.getByText('Suggested Questions for Future Interviews')).toBeInTheDocument()
    expect(screen.getByText('Interview Rubric Breakdown')).toBeInTheDocument()
    expect(screen.getByText('Talk Time Ratio')).toBeInTheDocument()
    expect(screen.getByText('Call Recording')).toBeInTheDocument()
    expect(screen.getByText('Transcript')).toBeInTheDocument()
  })

  it('shows a meet-style call studio with live captions', () => {
    renderInterviewPrep()

    fireEvent.click(screen.getAllByRole('button', { name: /Configure & Start/ })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Start Interview' }))
    act(() => {
      vi.advanceTimersByTime(900)
    })

    expect(screen.getByText('Live')).toBeInTheDocument()
    expect(screen.getByText(/Tell me about yourself/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'End interview' })).toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/Answer naturally/)).not.toBeInTheDocument()
    expect(screen.queryByText('Live transcript')).not.toBeInTheDocument()
  })

  it('can retry the same scenario or return to the scenario gallery', () => {
    renderInterviewPrep()

    fireEvent.click(screen.getAllByRole('button', { name: /Configure & Start/ })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Start Interview' }))
    act(() => {
      vi.advanceTimersByTime(900)
    })
    fireEvent.click(screen.getByRole('button', { name: 'End interview' }))
    act(() => {
      vi.advanceTimersByTime(3200)
    })

    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))
    expect(screen.getByText('Configure your interview')).toBeInTheDocument()
    expect(screen.getByText('Recruiter Screen - Product Designer')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Back to Scenarios' }))
    expect(screen.getByText('Interview Prep')).toBeInTheDocument()
  })
})
