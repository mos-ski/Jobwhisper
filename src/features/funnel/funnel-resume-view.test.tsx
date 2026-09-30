import { act, fireEvent, render, screen } from '@testing-library/react'
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
    onAnalyze: vi.fn(),
    onAnalyzingComplete: vi.fn(),
    onJobDescriptionChange: vi.fn(),
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
  it('explains the free ATS check and keeps analysis disabled before upload', () => {
    renderView()
    expect(screen.getByText(/get a free ATS check/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Let’s analyze your resume')
    expect(screen.getByRole('region', { name: 'Trusted by 3,478 job seekers' })).toBeInTheDocument()
    expect(screen.getByText('More interviews')).toBeInTheDocument()
    expect(screen.getByText('ATS score')).toBeInTheDocument()
    expect(screen.getByText('Time to offer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Analyze for free' })).toBeDisabled()
  })

  it('shows the latest ATS activity in the fixed live feed', () => {
    renderView({ liveActivity: { id: 'jason-bake', name: 'Jason Bake', countryFlag: '🇺🇸', score: 57, timeLabel: 'Just now', avatar: '/figma-landing/social-proof-2.jpg' } })
    const activity = screen.getByRole('complementary', { name: 'Recent ATS activity' })
    expect(activity).toHaveTextContent('Jason Bake')
    expect(activity).toHaveTextContent('Scored 57 in ATS')
    expect(activity).toHaveTextContent('Just now')
    expect(activity.querySelector('img')).toHaveAttribute('src', '/figma-landing/social-proof-2.jpg')
    expect(activity).not.toHaveTextContent('JB')
  })

  it('falls back to initials when an activity carries no portrait', () => {
    renderView({ liveActivity: { id: 'jason-bake', name: 'Jason Bake', countryFlag: '🇺🇸', score: 57, timeLabel: 'Just now' } })
    expect(screen.getByRole('complementary', { name: 'Recent ATS activity' })).toHaveTextContent('JB')
  })

  it('hands the chosen file over and states why a file was refused', () => {
    const props = renderView({ uploadError: 'That file is over 5 MB. Save it as a smaller PDF and try again.' })
    const file = new File(['resume'], 'darnell-smith-resume.pdf', { type: 'application/pdf' })
    fireEvent.change(screen.getByLabelText(/Your resume/), { target: { files: [file] } })
    expect(props.onFile).toHaveBeenCalledWith(file)
    expect(screen.getByRole('alert')).toHaveTextContent('over 5 MB')
  })

  it('starts analysis from the redesigned button after a resume is imported', () => {
    const props = renderView({ fileName: 'darnell-smith-resume.pdf' })
    expect(screen.getByText('darnell-smith-resume.pdf')).toBeInTheDocument()
    const analyze = screen.getByRole('button', { name: 'Analyze for free' })
    expect(analyze).toBeEnabled()
    fireEvent.click(analyze)
    expect(props.onAnalyze).toHaveBeenCalledOnce()
  })

  it('runs the analyzing page with the file name, then hands over to the score', async () => {
    vi.useFakeTimers()
    try {
      const props = renderView({ step: 'analyzing', fileName: 'darnell-smith-resume.pdf' })
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Analyzing your resume')
      expect(screen.getByRole('list')).toHaveTextContent('opening darnell-smith-resume.pdf…')
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
      expect(props.onAnalyzingComplete).not.toHaveBeenCalled()

      await act(async () => {
        await vi.advanceTimersByTimeAsync(800)
      })
      expect(screen.getAllByRole('listitem')).toHaveLength(2)
      expect(screen.getByText('(done)')).toBeInTheDocument()

      await act(async () => {
        await vi.advanceTimersByTimeAsync(11800)
      })
      expect(screen.getAllByRole('listitem')).toHaveLength(11)

      await act(async () => {
        await vi.advanceTimersByTimeAsync(600)
      })
      expect(props.onAnalyzingComplete).toHaveBeenCalledOnce()
    } finally {
      vi.useRealTimers()
    }
  })

  it('shows the score in words as well as a number, with every issue and its impact', () => {
    renderView({ step: 'score' })
    expect(screen.getByText('54')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Likely filtered out before a person reads it')
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
