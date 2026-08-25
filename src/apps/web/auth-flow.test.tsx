import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import { WebRoutes } from './routes'

describe('v3 web auth flow', () => {
  it('shows the v3 review index with auth flow links', () => {
    render(
      <MemoryRouter initialEntries={['/v3']}>
        <WebRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Lightforth UI Studio' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/v3/auth/sign-in')
    expect(screen.getByRole('link', { name: 'Choose a plan' })).toHaveAttribute('href', '/v3/auth/choose-plan')
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/v3/app')
    expect(screen.getByRole('link', { name: 'Documents' })).toHaveAttribute('href', '/v3/documents')
  })

  it('renders the sign-in screen with accessible auth controls', () => {
    render(
      <MemoryRouter initialEntries={['/v3/auth/sign-in']}>
        <WebRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Log in to your Lightforth account' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in with Google' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveDisplayValue('olivia@untitledui.com')
    expect(screen.getByLabelText('Password')).toHaveDisplayValue('password')
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Create new' })).toHaveAttribute('href', '/v3/auth/create-account')
  })

  it('routes from the plan subscribe action to the dashboard', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/v3/auth/choose-plan']}>
        <WebRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Choose a plan' })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'Toggle annual billing' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Starter' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pro' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Premium' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Subscribe to Pro' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: "I'll do this later" })).toHaveAttribute('href', '/v3')

    await user.click(screen.getByRole('button', { name: 'Subscribe to Pro' }))

    expect(screen.getByRole('heading', { name: 'Welcome, what would you like to do today?' })).toBeInTheDocument()
  })

  it('renders the dashboard with navigation, action cards, and install prompts', () => {
    render(
      <MemoryRouter initialEntries={['/v3/app']}>
        <WebRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Welcome, what would you like to do today?' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Dashboard/ })).toHaveAttribute('href', '/v3/app')
    expect(screen.getByRole('link', { name: /Tailor my Resume/ })).toHaveAttribute('href', '/v3/resume')
    expect(screen.getByRole('link', { name: /Tailor my Resume/ })).toHaveAttribute('data-variant', 'rest')
    expect(screen.getByRole('link', { name: /Practice For Interview/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Start Interview Copilot/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Apply for Jobs/ })).toBeInTheDocument()
    expect(screen.getByText('BETA')).toBeInTheDocument()
    expect(screen.getByText('For coding interview and stealth version.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Install Desktop' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Install Mobile' })).toBeInTheDocument()
  })

  it('renders reviewable loading states for core live surfaces', () => {
    const loadingRoutes = [
      { route: '/v3/app?state=loading', name: 'Loading dashboard' },
      { route: '/v3/interview-prep/session?state=loading', name: 'Loading live interview session' },
      { route: '/v3/interview-copilot/session?state=loading', name: 'Loading copilot session' },
      { route: '/v3/interview-prep/report?state=loading', name: 'Loading interview report' },
    ] as const

    for (const item of loadingRoutes) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[item.route]}>
          <WebRoutes />
        </MemoryRouter>,
      )

      expect(screen.getByRole('status', { name: item.name })).toBeInTheDocument()
      unmount()
    }
  })

  it('renders dashboard nav dropdown and credit notification states from URL params', () => {
    const cases = [
      { route: '/v3/app?dropdown=help', name: 'Whats new?' },
      { route: '/v3/app?dropdown=credits', name: 'Remaining Credits' },
      { route: '/v3/app?credit=empty', name: '0 credits remaining today' },
      { route: '/v3/app?credit=low', name: '5 More credits left!' },
    ] as const

    for (const item of cases) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[item.route]}>
          <WebRoutes />
        </MemoryRouter>,
      )

      expect(screen.getByText(item.name)).toBeInTheDocument()
      unmount()
    }
  })

  it('renders the documents context table route', () => {
    render(
      <MemoryRouter initialEntries={['/v3/documents']}>
        <WebRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Add Context' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Add Document' })).toHaveAttribute('href', '/v3/documents/add')
    expect(screen.getAllByText('Darnell_Smith_Resume.pdf')).toHaveLength(6)
  })

  it('renders the document add and manual context form routes', () => {
    const cases = [
      {
        route: '/v3/documents/add',
        heading: 'Add Documents',
        text: 'Input Manually',
      },
      {
        route: '/v3/documents/manual',
        heading: 'Input Context Manually',
        text: 'Paste context',
      },
    ] as const

    for (const item of cases) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[item.route]}>
          <WebRoutes />
        </MemoryRouter>,
      )

      expect(screen.getByRole('heading', { name: item.heading })).toBeInTheDocument()
      expect(screen.getByText(item.text)).toBeInTheDocument()
      unmount()
    }
  })

  it('renders the resume builder upload, configure, editor, and history states', () => {
    const cases = [
      {
        route: '/v3/resume',
        heading: 'Upload a resume',
        text: 'Click to upload',
      },
      {
        route: '/v3/resume/configure',
        heading: 'Configure your Resume',
        text: 'Enter Job Description',
      },
      {
        route: '/v3/resume/editor?tab=chat&state=empty',
        heading: 'ADEDAMOLA ADEWALE',
        text: 'Send your First Message',
      },
      {
        route: '/v3/resume/editor?tab=chat&state=suggestions',
        heading: 'ADEDAMOLA ADEWALE',
        text: 'Accept or Decline Changes',
      },
      {
        route: '/v3/resume/editor?tab=create',
        heading: 'ADEDAMOLA ADEWALE',
        text: 'Light AI',
      },
      {
        route: '/v3/resume/editor?tab=template',
        heading: 'ADEDAMOLA ADEWALE',
        text: 'Compact Executive',
      },
      {
        route: '/v3/resume/history',
        heading: 'Past Resumes',
        text: 'Showing items 1 - 10 of 146',
      },
    ] as const

    for (const item of cases) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[item.route]}>
          <WebRoutes />
        </MemoryRouter>,
      )

      expect(screen.getByRole('heading', { name: item.heading })).toBeInTheDocument()
      expect(screen.getByText(item.text)).toBeInTheDocument()
      unmount()
    }
  })

  it('renders the interview prep upload, configuration, live session, report, and history states', () => {
    const cases = [
      {
        route: '/v3/interview-prep',
        heading: 'Upload a resume',
        text: 'Click to upload',
      },
      {
        route: '/v3/interview-prep/configure',
        heading: 'Configure your interview',
        text: 'Additional context',
      },
      {
        route: '/v3/interview-prep/voice',
        heading: 'Choose interviewer voice',
        text: 'Nikolas Gibbons',
      },
      {
        route: '/v3/interview-prep/session',
        heading: 'Live Simulator',
        text: 'End Session',
      },
      {
        route: '/v3/interview-prep/complete',
        heading: 'Your Interview is complete!',
        text: 'See Report',
      },
      {
        route: '/v3/interview-prep/preparing-report',
        heading: 'Preparing your coaching report...',
        text: 'Generating coaching feedback',
      },
      {
        route: '/v3/interview-prep/history',
        heading: 'Past Resumes',
        text: 'Showing items 1 - 10 of 146',
      },
      {
        route: '/v3/interview-prep/report',
        heading: 'Recruiter Screen - Product Designer',
        text: 'Post-Interview Scorecard',
      },
    ] as const

    for (const item of cases) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[item.route]}>
          <WebRoutes />
        </MemoryRouter>,
      )

      expect(screen.getByRole('heading', { name: item.heading })).toBeInTheDocument()
      expect(screen.getByText(item.text)).toBeInTheDocument()
      unmount()
    }
  })

  it('renders the interview copilot setup, live session, completion, and history states', () => {
    const cases = [
      {
        route: '/v3/interview-copilot',
        heading: 'Upload a resume',
        text: 'Click to upload',
      },
      {
        route: '/v3/interview-copilot/configure',
        heading: 'Configure your interview',
        text: 'Additional context',
      },
      {
        route: '/v3/interview-copilot/preferences',
        heading: 'Set Preference',
        text: 'Best for candidates who want a direct, no-frills answer',
      },
      {
        route: '/v3/interview-copilot/share-screen',
        heading: 'Share your screen',
        text: 'Turn on Microphone',
      },
      {
        route: '/v3/interview-copilot/ready',
        heading: 'Share your screen',
        text: 'Start Interview',
      },
      {
        route: '/v3/interview-copilot/session',
        heading: 'Interview for UI/UX Designer',
        text: 'Live Response',
      },
      {
        route: '/v3/interview-copilot/complete',
        heading: 'Your Interview is complete!',
        text: 'See Report',
      },
      {
        route: '/v3/interview-copilot/history',
        heading: 'Past Copilot Sessions',
        text: 'Showing items 1 - 10 of 146',
      },
    ] as const

    for (const item of cases) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[item.route]}>
          <WebRoutes />
        </MemoryRouter>,
      )

      expect(screen.getByRole('heading', { name: item.heading })).toBeInTheDocument()
      expect(screen.getByText(item.text)).toBeInTheDocument()
      unmount()
    }
  })

  it('renders the auto apply setup wizard, agent workspace, jobs, and applied states', () => {
    const cases = [
      {
        route: '/v3/auto-apply',
        heading: 'Upload a resume',
        text: 'Click to upload',
      },
      {
        route: '/v3/auto-apply/contact',
        heading: 'Contact Information',
        text: 'LinkedIn profile',
      },
      {
        route: '/v3/auto-apply/preferences',
        heading: 'Job Preferences',
        text: 'Salary range',
      },
      {
        route: '/v3/auto-apply/additional',
        heading: 'Additional Information',
        text: 'Work authorization',
      },
      {
        route: '/v3/auto-apply/review',
        heading: 'Review Job Preference',
        text: 'Save & Continue',
      },
      {
        route: '/v3/auto-apply/agent',
        heading: 'Agents',
        text: 'Scanning Greenhouse, Workday',
      },
      {
        route: '/v3/auto-apply/jobs',
        heading: 'Jobs',
        text: 'Staff Product Manager, CX Automation',
      },
      {
        route: '/v3/auto-apply/jobs/coinbase',
        heading: 'Jobs',
        text: '46/128 Credit Left',
      },
      {
        route: '/v3/auto-apply/applied',
        heading: 'Applied',
        text: 'See Replay',
      },
    ] as const

    for (const item of cases) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[item.route]}>
          <WebRoutes />
        </MemoryRouter>,
      )

      expect(screen.getByRole('heading', { name: item.heading })).toBeInTheDocument()
      expect(screen.getByText(item.text)).toBeInTheDocument()
      unmount()
    }
  })

  it('opens upload source choices only after the upload target is clicked', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/v3/resume']}>
        <WebRoutes />
      </MemoryRouter>,
    )

    const uploadTarget = screen.getByRole('button', { name: /Click to upload/ })

    expect(screen.queryByRole('link', { name: 'Upload a Resume' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Use Lightforth Resume' })).not.toBeInTheDocument()

    await user.click(uploadTarget)

    expect(screen.getByRole('link', { name: 'Upload a Resume' })).toHaveAttribute('href', '/v3/resume/configure')
    expect(screen.getByRole('link', { name: 'Use Lightforth Resume' })).toHaveAttribute('href', '/v3/resume/configure')
  })
})
