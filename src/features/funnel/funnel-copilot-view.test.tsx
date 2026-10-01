import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { FunnelCopilotView, type FunnelCopilotViewProps } from './funnel-copilot-view'

function renderView(overrides: Partial<FunnelCopilotViewProps> = {}) {
  const props: FunnelCopilotViewProps = {
    step: 'landing',
    titles: [],
    dates: [{ value: '2026-09-30', weekday: 'Wed', month: 'Sep', day: '30' }],
    selectedDate: '2026-09-30',
    onDateChange: vi.fn(),
    onLandingContinue: vi.fn(),
    onTitlesChange: vi.fn(),
    onRoleContinue: vi.fn(),
    onFile: vi.fn(),
    onUploadContinue: vi.fn(),
    onStageSelect: vi.fn(),
    onStartTrial: vi.fn(),
    ...overrides,
  }
  render(<FunnelCopilotView {...props} />)
  return props
}

describe('FunnelCopilotView', () => {
  it('explains the live interview outcome before setup', () => {
    renderView()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Pass Your Next Interview\.\s*Land the Job\. Or Don’t Pay!/)
    expect(screen.getByText(/drafts a tailored answer in real time using your resume and the job description/)).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Job seeker results' })).not.toBeInTheDocument()
  })

  it('uses a subtle selected state for the interview date', () => {
    renderView()

    const selectedDate = screen.getByRole('button', { name: 'Wed30Sep' })
    expect(selectedDate).toHaveAttribute('aria-pressed', 'true')
    expect(selectedDate).toHaveClass('aria-pressed:bg-accent-subtle', 'aria-pressed:text-accent-text')
    expect(selectedDate).not.toHaveClass('aria-pressed:bg-accent')
  })

  it('uses the large Figma CTA treatment for the interview action', () => {
    renderView()

    expect(screen.getByRole('button', { name: 'Ace my Interview' })).toHaveClass('min-h-[72px]', 'px-8', 'text-[26px]')
  })

  // The role step is controlled by the page; this harness mirrors that wiring so the
  // picker's add/remove/cap behavior is observable inside the unit test.
  function renderRoleStep(initialTitles: readonly string[] = []) {
    const onRoleContinue = vi.fn()
    function Harness() {
      const [titles, setTitles] = useState<readonly string[]>(initialTitles)
      return (
        <FunnelCopilotView
          step="role"
          titles={titles}
          dates={[{ value: '2026-09-30', weekday: 'Wed', month: 'Sep', day: '30' }]}
          selectedDate="2026-09-30"
          onDateChange={vi.fn()}
          onLandingContinue={vi.fn()}
          onTitlesChange={setTitles}
          onRoleContinue={onRoleContinue}
          onFile={vi.fn()}
          onUploadContinue={vi.fn()}
          onStageSelect={vi.fn()}
          onStartTrial={vi.fn()}
        />
      )
    }
    render(<Harness />)
    return { onRoleContinue }
  }

  it('presents the multi-title prompt from the design', () => {
    renderRoleStep()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tell us what job title(s) you have in mind.')
    expect(screen.getByLabelText('Job titles')).toHaveAttribute('placeholder', 'Add up to 5 job titles')
    expect(screen.getByText('Select more job titles to get more results.')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Selected job titles' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })

  it('adds titles from suggestions and typed input, dedupes, and removes via the chip', async () => {
    const user = userEvent.setup()
    const { onRoleContinue } = renderRoleStep()

    await user.click(screen.getByRole('button', { name: 'Product Manager' }))
    expect(screen.getByRole('button', { name: 'Remove Product Manager' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Product Manager' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled()

    const input = screen.getByLabelText('Job titles')
    await user.type(input, 'Senior PM{Enter}')
    expect(screen.getByRole('button', { name: 'Remove Senior PM' })).toBeInTheDocument()
    expect(onRoleContinue).not.toHaveBeenCalled()

    await user.type(input, 'senior pm{Enter}')
    const list = screen.getByRole('list', { name: 'Selected job titles' })
    expect(list).toHaveTextContent('Senior PM')
    expect(list).not.toHaveTextContent('senior pm')

    await user.type(input, 'Data Engineer,')
    expect(screen.getByRole('button', { name: 'Remove Data Engineer' })).toBeInTheDocument()
    expect(input).toHaveValue('')

    await user.click(screen.getByRole('button', { name: 'Remove Senior PM' }))
    expect(screen.queryByRole('button', { name: 'Remove Senior PM' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(onRoleContinue).toHaveBeenCalledTimes(1)
  })

  it('holds the five-title cap by disabling the input and fresh suggestions', () => {
    renderRoleStep(['Role One', 'Role Two', 'Role Three', 'Role Four', 'Role Five'])

    expect(screen.getByLabelText('Job titles')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Software Engineer' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Remove Role One' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled()
  })

  it('presents the bare dropzone before a resume is imported', () => {
    renderView({ step: 'upload' })

    expect(screen.getByText('Drop a resume here, or browse files')).toBeInTheDocument()
    expect(screen.getByText('PDF, DOC, DOCX or TXT · up to 5 MB')).toBeInTheDocument()
    expect(screen.getByText('Import resume')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Use sample resume' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
    expect(screen.queryByText('Import a resume to start')).not.toBeInTheDocument()
  })

  it('shows the uploaded file state and enables Continue', () => {
    renderView({ step: 'upload', fileName: 'resume.pdf' })

    expect(screen.getByText('resume.pdf')).toBeInTheDocument()
    expect(screen.getByText('Resume uploaded')).toBeInTheDocument()
    expect(screen.getByText('Change resume')).toBeInTheDocument()
    expect(screen.queryByText('Import resume')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled()
  })

  it('announces a refused file with the fix and keeps Continue disabled', () => {
    renderView({ step: 'upload', uploadError: 'That file is over 5 MB. Save it as a smaller PDF and try again.' })

    expect(screen.getByRole('alert')).toHaveTextContent('That file is over 5 MB. Save it as a smaller PDF and try again.')
    expect(screen.getByLabelText('Your resume')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })
})
