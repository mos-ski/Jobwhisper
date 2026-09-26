import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

import { WebRoutes } from './routes'

describe('v3 web auth flow', () => {
  it('shows the v3 review index with auth flow links', () => {
    render(
      <MemoryRouter initialEntries={['/v3']}>
        <WebRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Jobwhisper UI Studio' })).toBeInTheDocument()
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

    expect(screen.getByRole('heading', { name: 'Log in to your Jobwhisper account' })).toBeInTheDocument()
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
    // Starter bills weekly, so the switch leaves it alone and its card says why.
    expect(screen.getByText('Annual billing does not apply to weekly plans')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Starter' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pro' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Premium' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Subscribe to Pro' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: "I'll do this later" })).toHaveAttribute('href', '/v3')

    await user.click(screen.getByRole('button', { name: 'Subscribe to Pro' }))

    expect(screen.getByRole('heading', { name: 'Complete Your Profile' })).toBeInTheDocument()
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
    expect(screen.getByText('Live AI assistance for coding interviews, real-time hints as you work through the problem.')).toBeInTheDocument()
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
      { route: '/v3/app?dropdown=credits', name: 'Credit balances' },
      { route: '/v3/app?credit=empty', name: '0% remaining this cycle' },
      { route: '/v3/app?credit=low', name: '0% left this cycle' },
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

    expect(screen.getByRole('heading', { name: 'Knowledge Base' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add Document' })).toBeInTheDocument()
    expect(screen.getAllByText('Darnell_Smith_Resume.pdf')).toHaveLength(2)
  })

  it('renders the job directory route with its persistent navigation entry', () => {
    render(
      <MemoryRouter initialEntries={['/v3/job-directory']}>
        <WebRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Find your next job board' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Job Directory' })).toHaveAttribute('href', '/v3/job-directory')
    expect(screen.getByRole('button', { name: 'Explore LinkedIn Jobs' })).toBeInTheDocument()
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
      expect(screen.getAllByText(item.text).length).toBeGreaterThan(0)
      unmount()
    }
  })

  it('renders the resume builder upload, configure, editor, and history states', () => {
    const cases = [
      {
        route: '/v3/resume',
        heading: 'Upload a resume',
        text: 'Upload a Resume',
      },
      {
        route: '/v3/resume/configure',
        heading: 'Configure your Resume',
        text: 'Enter Job Description',
      },
      {
        route: '/v3/resume/editor?tab=chat&state=empty',
        heading: 'ADEDAMOLA ADEWALE',
        text: 'Send a message to adjust your resume',
      },
      {
        route: '/v3/resume/editor?tab=chat&state=suggestions',
        heading: 'ADEDAMOLA ADEWALE',
        text: 'Accept All',
      },
      {
        route: '/v3/resume/editor?tab=create',
        heading: 'ADEDAMOLA ADEWALE',
        text: 'AI Suggestion',
      },
      {
        route: '/v3/resume/editor?tab=template',
        heading: 'ADEDAMOLA ADEWALE',
        text: 'Compact Executive',
      },
      {
        route: '/v3/resume/history',
        heading: 'Past Resumes',
        text: 'Staff Software Engineer, Payments Infrastructure',
      },
    ] as const

    for (const item of cases) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[item.route]}>
          <WebRoutes />
        </MemoryRouter>,
      )

      expect(screen.getByRole('heading', { name: item.heading })).toBeInTheDocument()
      expect(screen.getAllByText(item.text).length).toBeGreaterThan(0)
      unmount()
    }
  })

  it('renders the interview prep upload, configuration, live session, report, and history states', () => {
    const cases = [
      {
        route: '/v3/interview-prep',
        heading: 'Upload a resume',
        text: 'Upload a Resume',
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
        heading: 'Past Interview Practice',
        text: 'Growth Product Lead',
      },
      {
        route: '/v3/interview-prep/report',
        heading: 'Recruiter Screen - Product Designer',
        text: 'What Went Well',
      },
    ] as const

    for (const item of cases) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[item.route]}>
          <WebRoutes />
        </MemoryRouter>,
      )

      expect(screen.getByRole('heading', { name: item.heading })).toBeInTheDocument()
      expect(screen.getAllByText(item.text).length).toBeGreaterThan(0)
      unmount()
    }
  })

  it('renders the interview copilot setup, live session, completion, and history states', () => {
    const cases = [
      {
        route: '/v3/interview-copilot',
        heading: 'Upload a resume',
        text: 'Upload a Resume',
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
        heading: "You're all set",
        text: 'Start Interview',
      },
      {
        route: '/v3/interview-copilot/session',
        heading: 'Interview for UI/UX Designer',
        text: 'Live Response',
      },
      {
        route: '/v3/interview-copilot/complete',
        heading: 'Your interview is complete!',
        text: 'See Report',
      },
      {
        route: '/v3/interview-copilot/history',
        heading: 'Past Copilot Sessions',
        text: 'Backend Engineer, Payments',
      },
    ] as const

    for (const item of cases) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[item.route]}>
          <WebRoutes />
        </MemoryRouter>,
      )

      expect(screen.getByRole('heading', { name: item.heading })).toBeInTheDocument()
      expect(screen.getAllByText(item.text).length).toBeGreaterThan(0)
      unmount()
    }
  })

  it('renders the auto apply setup wizard, agent workspace, jobs, and applied states', () => {
    const cases = [
      {
        route: '/v3/auto-apply',
        heading: 'Upload a resume',
        text: 'Upload a Resume',
      },
      {
        route: '/v3/auto-apply/contact',
        heading: 'Contact Information',
        text: 'Profile Details',
      },
      {
        route: '/v3/auto-apply/preferences',
        heading: 'Job Preferences',
        text: 'Salary Range',
      },
      {
        route: '/v3/auto-apply/additional',
        heading: 'Additional Information',
        text: 'Work Authorization',
      },
      {
        route: '/v3/auto-apply/review',
        heading: 'Review Job Preference',
        text: 'Save & Continue',
      },
      {
        route: '/v3/auto-apply/agent',
        heading: 'Agents',
        text: 'Scanning LinkedIn, Greenhouse, Lever',
      },
      {
        route: '/v3/auto-apply/jobs',
        heading: 'Jobs',
        text: 'Group Product Manager, Financial Engineering',
      },
      {
        route: '/v3/auto-apply/jobs/coinbase-financial-engineering',
        heading: 'Jobs',
        text: '1 Credit',
      },
      {
        route: '/v3/auto-apply/applied',
        heading: 'Applied',
        text: 'Senior Product Manager - Delinea Desktop Client',
      },
    ] as const

    for (const item of cases) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[item.route]}>
          <WebRoutes />
        </MemoryRouter>,
      )

      expect(screen.getByRole('heading', { name: item.heading })).toBeInTheDocument()
      expect(screen.getAllByText(item.text).length).toBeGreaterThan(0)
      unmount()
    }
  })

  it('opens the uploaded-resume review after the upload source is selected', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/v3/resume']}>
        <WebRoutes />
      </MemoryRouter>,
    )

    const uploadTarget = screen.getByRole('button', { name: /Upload a Resume/ })
    expect(screen.getByRole('button', { name: /Use Jobwhisper Resume/ })).toBeInTheDocument()

    await user.click(uploadTarget)

    expect(screen.getByRole('dialog', { name: 'Resume uploaded' })).toBeInTheDocument()
    expect(screen.getByText('Continue')).toHaveAttribute('aria-disabled', 'true')
  })

  it('shows every existing submitted application on the applied page', () => {
    render(
      <MemoryRouter initialEntries={['/v3/auto-apply/applied']}>
        <WebRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByText('Senior Product Manager - Delinea Desktop Client')).toBeInTheDocument()
    expect(screen.getByText('Staff Product Manager, CX Automation')).toBeInTheDocument()
    expect(screen.getByText('Group Product Manager, Payments Core')).toBeInTheDocument()
    expect(screen.getByText('Staff Product Manager, Payments')).toBeInTheDocument()
    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument()
    expect(screen.getByText('Product Manager, Integrity')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Senior Product Manager - Delinea Desktop Client.*Success/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Staff Product Manager, CX Automation.*Applied/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Group Product Manager, Payments Core.*Needs Review/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Staff Product Manager, Payments.*Failed/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Senior Frontend Engineer.*Closed/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Product Manager, Integrity.*Success/ })).toBeInTheDocument()
  })

  it('keeps the jobs page actionable and queues a new job from its primary action', async () => {
    const user = userEvent.setup()

    render(
      <>
        <MemoryRouter initialEntries={['/v3/auto-apply/jobs']}>
          <WebRoutes />
        </MemoryRouter>
        <Toaster />
      </>,
    )

    expect(screen.queryByText('Staff Product Manager, CX Automation')).not.toBeInTheDocument()
    expect(screen.queryByText('Group Product Manager')).not.toBeInTheDocument()

    const applyButton = screen.getByRole('button', { name: 'Apply to Group Product Manager, Compliance Automation at Coinbase' })
    expect(applyButton).toHaveTextContent('Apply')

    await user.click(applyButton)

    expect(await screen.findByText('Whisper AI has started the application.')).toBeInTheDocument()
    const queuedJob = screen.getByRole('button', { name: /Group Product Manager, Compliance Automation.*Queued/ })
    expect(queuedJob).toBeInTheDocument()

    await user.click(queuedJob)

    expect(screen.queryByRole('button', { name: 'Apply Now' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View Listing' })).toBeInTheDocument()
  })

  it('shows 10 jobs on each auto apply first page', () => {
    const jobsPage = render(
      <MemoryRouter initialEntries={['/v3/auto-apply/jobs']}>
        <WebRoutes />
      </MemoryRouter>,
    )

    expect(screen.getAllByRole('button', { name: /^View .* at .*, (New|Queued|Applying)$/ })).toHaveLength(10)
    jobsPage.unmount()

    render(
      <MemoryRouter initialEntries={['/v3/auto-apply/applied']}>
        <WebRoutes />
      </MemoryRouter>,
    )

    expect(screen.getAllByRole('button', { name: /^View .* at .*, (Applied|Success|Needs Review|Failed|Closed)$/ })).toHaveLength(10)
  })

  it('shows and dismisses the Done For You jobs promotion', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/v3/auto-apply/jobs']}>
        <WebRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole('region', { name: 'Done For You' })).toBeInTheDocument()
    expect(screen.getByTestId('done-for-you-campaign-background')).toHaveAttribute('src', '/v3-assets/figma/dfy-widget-background.svg')
    expect(screen.getByTestId('done-for-you-guarantee')).toHaveClass('text-[2.53rem]', 'tracking-[-0.2rem]')
    expect(screen.getByTestId('done-for-you-description')).toHaveClass('text-[1.12rem]', 'leading-[1.4rem]')
    expect(screen.getByRole('link', { name: 'Sign Up Now' })).toHaveAttribute('href', '/v3/billing/done-for-you')

    await user.click(screen.getByRole('button', { name: 'Maybe Later.' }))

    expect(screen.queryByRole('region', { name: 'Done For You' })).not.toBeInTheDocument()
  })

  it('explains each billing model and lets users reopen the pricing guide', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/v3/billing']}>
        <WebRoutes />
      </MemoryRouter>,
    )

    const interviewGuide = screen.getByRole('dialog', { name: 'Ace Your Interview Plan' })
    expect(interviewGuide).toHaveClass('rounded-[2px]', 'p-6', 'sm:w-[352px]')
    expect(interviewGuide.querySelector('h2')).toHaveClass('text-sm', 'leading-5')
    expect(interviewGuide.querySelector('p')).toHaveClass('text-sm', 'leading-[22.75px]')
    expect(screen.getByText(/recurring subscription/i)).toBeInTheDocument()
    expect(screen.getByText(/one credit gives you one minute/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toHaveClass('min-h-9', 'w-[92px]', 'rounded-[7.2px]')

    await user.click(screen.getByRole('button', { name: 'Next' }))

    const usageGuide = screen.getByRole('dialog', { name: 'Auto Apply and Resume Builder' })
    expect(usageGuide).toHaveTextContent(/prepaid credits with no subscription/i)
    expect(usageGuide).toHaveTextContent(/successful application/i)
    expect(usageGuide).toHaveTextContent(/each AI prompt/i)

    await user.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.getByRole('dialog', { name: 'Done For You' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Learn More' })).toHaveAttribute('href', '/v3/billing/done-for-you')

    await user.click(screen.getByRole('button', { name: 'Done' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'How it works' }))

    expect(screen.getByRole('dialog', { name: 'Ace Your Interview Plan' })).toBeInTheDocument()
  })
})
