// src/pages/DesktopCopilotPreview.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { RegularSetupScreen, PreferenceModal, ScreenshotCanvas, LiveCanvas, CompleteScreen } from './DesktopCopilotPreview'
import { setAccount } from './desktopCopilot/mockAccounts'

describe('RegularSetupScreen', () => {
  it('defaults to the Interview tab and swaps fields when Coding or Meeting is clicked', () => {
    render(<RegularSetupScreen onBack={() => {}} onContinue={() => {}} unlockedUseCases={['interview', 'coding', 'meeting']} />)
    expect(screen.getByText('Position')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Coding' }))
    expect(screen.getByText(/select language/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search language...')).toBeInTheDocument()
    expect(screen.queryByText('Select Audio')).not.toBeInTheDocument()
    expect(screen.queryByText('Position')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Meeting' }))
    expect(screen.getByText('Meeting title')).toBeInTheDocument()
    expect(screen.queryByText(/select language/i)).not.toBeInTheDocument()
  })

  it('requires a label for Interview, Coding, and Meeting before continuing', () => {
    render(<RegularSetupScreen onBack={() => {}} onContinue={() => {}} unlockedUseCases={['interview', 'coding', 'meeting']} />)
    expect(screen.getByText('Continue')).toHaveStyle({ opacity: 0.45 })

    fireEvent.click(screen.getByRole('button', { name: 'Coding' }))
    expect(screen.getByText('Continue')).toHaveStyle({ opacity: 0.45 })
    fireEvent.change(screen.getByPlaceholderText('Search language...'), { target: { value: 'Python' } })
    expect(screen.getByText('Continue')).not.toHaveStyle({ opacity: 0.45 })
  })

  it('lets Coding users search and select from the language dropdown', () => {
    render(<RegularSetupScreen onBack={() => {}} onContinue={() => {}} unlockedUseCases={['interview', 'coding', 'meeting']} />)
    fireEvent.click(screen.getByRole('button', { name: 'Coding' }))
    fireEvent.change(screen.getByPlaceholderText('Search language...'), { target: { value: 'rust' } })
    fireEvent.click(screen.getByRole('button', { name: 'Rust' }))
    expect(screen.getByDisplayValue('Rust')).toBeInTheDocument()
  })

  it('calls onContinue with the active tab id and label after confirming preference', () => {
    const onContinue = vi.fn()
    render(<RegularSetupScreen onBack={() => {}} onContinue={onContinue} unlockedUseCases={['interview', 'coding', 'meeting']} />)
    fireEvent.change(screen.getByPlaceholderText('e.g. Product Manager'), { target: { value: 'Staff Engineer' } })
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('Confirm'))
    expect(onContinue).toHaveBeenCalledWith('interview', 'Staff Engineer')
  })

  it('hides the Meeting tab for plans that have not unlocked it (Pro)', () => {
    render(<RegularSetupScreen onBack={() => {}} onContinue={() => {}} unlockedUseCases={['interview', 'coding']} />)
    expect(screen.getByRole('button', { name: 'Interview' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Coding' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Meeting' })).not.toBeInTheDocument()
  })

  it('renders a Context picker on the Interview tab, sourced from the personal Context library', () => {
    render(<RegularSetupScreen onBack={() => {}} onContinue={() => {}} unlockedUseCases={['interview', 'coding', 'meeting']} />)
    expect(screen.getByText(/Add context from your documents/)).toBeInTheDocument()
  })

  it('replaces the old free-text Context textarea on the Meeting tab with a picker', () => {
    render(<RegularSetupScreen onBack={() => {}} onContinue={() => {}} unlockedUseCases={['interview', 'coding', 'meeting']} />)
    fireEvent.click(screen.getByRole('button', { name: 'Meeting' }))
    expect(screen.queryByPlaceholderText(/Paste any background info/)).not.toBeInTheDocument()
    expect(screen.getByText(/Add context from your documents/)).toBeInTheDocument()
  })
})

describe('PreferenceModal', () => {
  it('shows Answer Length when hasAnswerLength is true', () => {
    render(<PreferenceModal hasAnswerLength={true} onClose={() => {}} onNext={() => {}} />)
    expect(screen.getByText('Answer Length')).toBeInTheDocument()
    expect(screen.getByText('Short')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Long')).toBeInTheDocument()
  })

  it('hides Answer Length when hasAnswerLength is false', () => {
    render(<PreferenceModal hasAnswerLength={false} onClose={() => {}} onNext={() => {}} />)
    expect(screen.queryByText('Answer Length')).not.toBeInTheDocument()
  })
})

describe('ScreenshotCanvas', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('watches the screen automatically by default (Auto Respond is on)', () => {
    render(<ScreenshotCanvas useCaseId="coding" primaryLabel="" onEnd={() => {}} onBack={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    expect(screen.getByText(/Watching your screen/)).toBeInTheDocument()
  })

  it('captures, analyzes, and shows an answer on consecutive Space presses', () => {
    render(<ScreenshotCanvas useCaseId="coding" primaryLabel="" onEnd={() => {}} onBack={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    fireEvent.keyDown(window, { code: 'Space' })
    act(() => { vi.advanceTimersByTime(600) })
    expect(screen.getByText('Analyzing...')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(900) })
    expect(screen.getByText('Answer ready')).toBeInTheDocument()
  })

  it('Ctrl+Enter also forces an immediate capture', () => {
    render(<ScreenshotCanvas useCaseId="coding" primaryLabel="" onEnd={() => {}} onBack={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    fireEvent.keyDown(window, { code: 'Enter', ctrlKey: true })
    expect(screen.getByText('Capturing screen...')).toBeInTheDocument()
  })

  it('renders the answer as a code block with a Copy button', () => {
    render(<ScreenshotCanvas useCaseId="coding" primaryLabel="" onEnd={() => {}} onBack={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    fireEvent.keyDown(window, { code: 'Space' })
    act(() => { vi.advanceTimersByTime(600) }) // capturing
    act(() => { vi.advanceTimersByTime(900) }) // analyzing to answered
    expect(screen.getByRole('button', { name: /Copy/ })).toBeInTheDocument()
  })

  it('auto-advances through capturing/analyzing without any key press', () => {
    render(<ScreenshotCanvas useCaseId="coding" primaryLabel="" onEnd={() => {}} onBack={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    act(() => { vi.advanceTimersByTime(2000) }) // idle -> capturing, automatically
    expect(screen.getByText('Capturing screen...')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(600) })
    expect(screen.getByText('Analyzing...')).toBeInTheDocument()
  })

  it('can be switched to manual-only capture via Settings', () => {
    render(<ScreenshotCanvas useCaseId="coding" primaryLabel="" onEnd={() => {}} onBack={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    fireEvent.click(screen.getByTestId('open-settings'))
    const autoRespondToggle = screen.getByText('Auto Respond').closest('div')!.parentElement!.querySelector('button')!
    fireEvent.click(autoRespondToggle)
    const settingsDialog = screen.getByText('Settings').closest('div')!.parentElement!
    const closeBtn = settingsDialog.querySelector('button:last-child')!
    fireEvent.click(closeBtn)

    expect(screen.getByText(/Press Space or Ctrl\+Enter to capture your screen/)).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(5000) })
    expect(screen.getByText(/Press Space or Ctrl\+Enter to capture your screen/)).toBeInTheDocument()
  })
})

describe('LiveCanvas', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('labels the first interviewer "Interviewer 1" and titles the bar "Interview for {label}"', () => {
    render(<LiveCanvas useCaseId="interview" primaryLabel="Product Manager" onEnd={() => {}} onBack={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    expect(screen.getByText('Interview for Product Manager')).toBeInTheDocument()
    fireEvent.keyDown(window, { code: 'Space' })
    expect(screen.getAllByText('Interviewer 1').length).toBeGreaterThan(0)
  })

  it('labels speakers "Speaker 1" etc. and titles the bar "Meeting: {label}"', () => {
    render(<LiveCanvas useCaseId="meeting" primaryLabel="Q3 Roadmap Review" onEnd={() => {}} onBack={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    expect(screen.getByText('Meeting: Q3 Roadmap Review')).toBeInTheDocument()
    fireEvent.keyDown(window, { code: 'Space' })
    expect(screen.getAllByText('Speaker 1').length).toBeGreaterThan(0)
  })

  it('auto-advances through listening/processing/answering when Auto Respond is on', () => {
    render(<LiveCanvas useCaseId="interview" primaryLabel="Product Manager" onEnd={() => {}} onBack={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    fireEvent.click(screen.getByTestId('open-settings'))
    fireEvent.click(screen.getByText('Auto Respond').closest('div')!.parentElement!.querySelector('button')!)
    act(() => { vi.advanceTimersByTime(1800) })
    expect(screen.getByText('Processing...')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1200) })
    expect(screen.getByText('Answering...')).toBeInTheDocument()
  })
})

describe('CompleteScreen', () => {
  it('shows the Interview-specific heading', () => {
    render(<CompleteScreen useCaseId="interview" onBack={() => {}} onGoHome={() => {}} />)
    expect(screen.getByText('👏 Your Interview is complete!')).toBeInTheDocument()
  })

  it('shows the Meeting-specific heading', () => {
    render(<CompleteScreen useCaseId="meeting" onBack={() => {}} onGoHome={() => {}} />)
    expect(screen.getByText('📝 Your Meeting is complete!')).toBeInTheDocument()
  })
})

import DesktopCopilotPreview from './DesktopCopilotPreview'

describe('DesktopCopilotPreview end to end', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })
  afterEach(() => vi.useRealTimers())

  function renderApp() {
    return render(
      <MemoryRouter>
        <DesktopCopilotPreview />
      </MemoryRouter>,
    )
  }

  it('walks from splash through sign-in to a returning Premium account straight to the tabbed setup (no picker), then into the Interview canvas', async () => {
    setAccount('me@example.com', { accountType: 'regular', planId: 'premium' })
    renderApp()
    await act(async () => { vi.advanceTimersByTime(2300) })
    expect(screen.getByText('Welcome to Lightforth Co-Pilot')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Continue'))
    expect(screen.getByText('Welcome to Lightforth Copilot')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Sign in'))
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'me@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))

    // Straight onto the tabbed setup — no "What are you using Copilot for?" picker anymore
    expect(screen.queryByText('What are you using Copilot for?')).not.toBeInTheDocument()
    expect(screen.getByText('👋 Hola, Welcome to Interview Co-Pilot')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Coding' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Meeting' })).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('e.g. Product Manager'), { target: { value: 'Staff Engineer' } })
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('Confirm'))
    expect(screen.getByText('Interview for Staff Engineer')).toBeInTheDocument()
  })

  it('a returning Pro account lands on the tabbed setup with Meeting hidden, and switching to the Coding tab routes into the screenshot canvas', async () => {
    setAccount('me2@example.com', { accountType: 'regular', planId: 'pro' })
    renderApp()
    await act(async () => { vi.advanceTimersByTime(2300) })
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('Sign in'))
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'me2@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))

    expect(screen.queryByRole('button', { name: 'Meeting' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Coding' }))
    expect(screen.getByText(/select language/i)).toBeInTheDocument()
    expect(screen.queryByText('Position')).not.toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('Search language...'), { target: { value: 'JavaScript' } })
    fireEvent.click(screen.getByText('Continue'))
    expect(screen.getAllByText(/Watching your screen/).length).toBeGreaterThan(0)
  })

  it('signing in with an email that has no account on record still succeeds (validation removed) and lands on the default Pro tabbed setup', async () => {
    renderApp()
    await act(async () => { vi.advanceTimersByTime(2300) })
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('Sign in'))
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'nobody@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))
    expect(screen.getByText('👋 Hola, Welcome to Interview Co-Pilot')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Coding' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Meeting' })).not.toBeInTheDocument()
  })
})
