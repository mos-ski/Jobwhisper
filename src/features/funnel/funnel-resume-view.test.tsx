import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { resumeFunnelReport, resumeFunnelRewrite } from '@/mocks/funnel'
import { FunnelResumeView, type FunnelResumeViewProps } from './funnel-resume-view'

function renderView(overrides: Partial<FunnelResumeViewProps> = {}) {
  const props: FunnelResumeViewProps = {
    step: 'upload',
    jobDescription: '',
    online: true,
    report: resumeFunnelReport,
    rewrite: resumeFunnelRewrite,
    onFile: vi.fn(),
    onJobDescriptionChange: vi.fn(),
    onScore: vi.fn(),
    onBack: vi.fn(),
    onClose: vi.fn(),
    onShowRewrite: vi.fn(),
    onDownload: vi.fn(),
    onCreateAccount: vi.fn(),
    onGoogleSignUp: vi.fn(),
    onOpenEditor: vi.fn(),
    ...overrides,
  }
  render(<FunnelResumeView {...props} />)
  return props
}

describe('FunnelResumeView', () => {
  it('says what is free before anything is uploaded, and waits for a file', () => {
    renderView()
    expect(screen.getByText(/Free to score\. Create an account to download\./)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Score my resume' })).toBeDisabled()
  })

  it('hands the chosen file over and states why a file was refused', () => {
    const props = renderView({ uploadError: 'That file is over 5 MB. Save it as a smaller PDF and try again.' })
    const file = new File(['resume'], 'darnell-smith-resume.pdf', { type: 'application/pdf' })
    fireEvent.change(screen.getByLabelText(/Your resume/), { target: { files: [file] } })
    expect(props.onFile).toHaveBeenCalledWith(file)
    expect(screen.getByRole('alert')).toHaveTextContent('over 5 MB')
  })

  it('scores once a file is in', async () => {
    const user = userEvent.setup()
    const props = renderView({ fileName: 'darnell-smith-resume.pdf' })
    await user.click(screen.getByRole('button', { name: 'Score my resume' }))
    expect(props.onScore).toHaveBeenCalled()
  })

  it('shows the score in words as well as a number, with every issue and its impact', () => {
    renderView({ step: 'score' })
    expect(screen.getByText('54')).toBeInTheDocument()
    expect(screen.getByText('Likely filtered out before a person reads it')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(resumeFunnelReport.issues.length)
    expect(screen.getAllByText('High impact')).toHaveLength(2)
  })

  it('moves the score with the before and after slider', () => {
    renderView({ step: 'compare' })
    const slider = screen.getByRole('slider', { name: 'Show the Jobwhisper version' })
    fireEvent.change(slider, { target: { value: '100' } })
    expect(slider).toHaveAttribute('aria-valuetext', 'Jobwhisper version fully shown, ATS score 91')
    fireEvent.change(slider, { target: { value: '0' } })
    expect(slider).toHaveAttribute('aria-valuetext', 'Your original fully shown, ATS score 54')
  })

  it('asks for an account at download, and says the resume is saved', () => {
    renderView({ step: 'gate' })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Create a free account to download it')
    expect(screen.getByText(/Your tailored resume is saved/)).toBeInTheDocument()
  })

  it('opens the editor after the download', async () => {
    const user = userEvent.setup()
    const props = renderView({ step: 'done' })
    await user.click(screen.getByRole('button', { name: 'Keep editing in Resume Builder' }))
    expect(props.onOpenEditor).toHaveBeenCalled()
  })
})
