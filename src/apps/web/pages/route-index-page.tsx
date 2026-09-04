const marketingRoutes = [
  {
    href: '/',
    label: 'Landing page',
    description: 'Marketing-only Interview Copilot landing page: hero, pain, cost, demo, FAQ, final CTA.',
  },
  {
    href: '/vsl',
    label: 'VSL sales page',
    description: 'Full sales/VSL page with before-after demo and a 4-step mock checkout: details, upsells, payment, success.',
  },
  {
    href: '/emails',
    label: 'Email templates',
    description: 'Browsable catalog of transactional email templates: receipts, sign-in, job alerts, reports, and more.',
  },
] as const

const authRoutes = [
  {
    href: '/v3/auth/sign-in',
    label: 'Sign in',
    description: 'Email, password, Google sign-in, and create-account entry.',
  },
  {
    href: '/v3/auth/create-account',
    label: 'Create account',
    description: 'Sign-up form for a new Jobwhisper account.',
  },
  {
    href: '/v3/auth/forgot-password',
    label: 'Forgot password',
    description: 'Request-reset form with a "check your email" confirmation state.',
  },
  {
    href: '/v3/auth/choose-plan',
    label: 'Choose a plan',
    description: 'Monthly or annual plan selection with Starter, Pro, and Premium options.',
  },
] as const

const onboardingRoutes = [
  {
    href: '/v3/onboarding/profile',
    label: 'Onboarding profile',
    description: 'Post-signup profile setup step.',
  },
  {
    href: '/v3/onboarding/interests',
    label: 'Onboarding interests',
    description: 'Post-signup interests/goals selection step.',
  },
] as const

const appRoutes = [
  {
    href: '/v3/app',
    label: 'Dashboard',
    description: 'Signed-in web app shell with sidebar navigation, action cards, and install prompts.',
  },
  {
    href: '/v3/app?state=loading',
    label: 'Dashboard loading',
    description: 'Dashboard skeleton with header, sidebar, and action-card placeholders.',
  },
  {
    href: '/v3/app?dropdown=help',
    label: 'Dashboard help dropdown',
    description: 'Top-nav support dropdown with updates, browser support, help center, feedback, tutorial, and email actions.',
  },
  {
    href: '/v3/app?dropdown=credits',
    label: 'Dashboard credits dropdown',
    description: 'Credit popover with upgrade action, remaining/allocated rows, progress, used count, and free-credits CTA.',
  },
  {
    href: '/v3/app?credit=empty',
    label: 'Dashboard empty credits',
    description: 'Centered red credit notification banner for zero remaining credits.',
  },
  {
    href: '/v3/app?credit=low',
    label: 'Dashboard low credits',
    description: 'Centered blue credit notification banner for low remaining credits.',
  },
  {
    href: '/v3/documents',
    label: 'Documents',
    description: 'Add-context document table with search, add-document action, type badges, row actions, and pagination.',
  },
  {
    href: '/v3/documents/add',
    label: 'Add documents',
    description: 'Document source picker with upload, URL scrape, and manual input paths.',
  },
  {
    href: '/v3/documents/manual',
    label: 'Manual context',
    description: 'Manual context form for adding notes, role details, and company research.',
  },
  {
    href: '/v3/downloads',
    label: 'Download apps',
    description: 'Modal-derived Copilot download picker for Mac Apple Silicon, Mac Intel, and Windows desktop app.',
  },
  {
    href: '/v3/billing',
    label: 'Billing',
    description: 'Current plan, credit balance, plan upgrade cards, and credit usage table.',
  },
  {
    href: '/v3/billing/usage',
    label: 'Credit usage history',
    description: 'Full credit usage / spend history table.',
  },
  {
    href: '/v3/tutorials',
    label: 'Tutorials',
    description: 'Product walkthrough and tutorial video library.',
  },
  {
    href: '/v3/extension',
    label: 'Browser extension',
    description: 'Extension panel: board list and a live run feed pinned to the bottom.',
  },
  {
    href: '/v3/settings',
    label: 'Settings profile',
    description: 'Profile settings tab with account fields and photo upload action.',
  },
  {
    href: '/v3/settings?tab=security',
    label: 'Settings security',
    description: 'Password, two-step verification, and delete-account controls.',
  },
  {
    href: '/v3/settings?tab=referral',
    label: 'Settings referral',
    description: 'Referral credits card and previous referrals table.',
  },
  {
    href: '/v3/resume',
    label: 'Resume upload',
    description: 'Build-a-resume entry with upload and Jobwhisper resume choices.',
  },
  {
    href: '/v3/resume/configure',
    label: 'Resume configure',
    description: 'Uploaded file chip, resume metadata, job description, and AI suggestion entry.',
  },
  {
    href: '/v3/resume/editor?tab=chat&state=empty',
    label: 'Resume editor chat',
    description: 'Resume preview with chat panel, prompt chips, composer, and first-message tooltip.',
  },
  {
    href: '/v3/resume/editor?tab=chat&state=suggestions',
    label: 'Resume editor suggestions',
    description: 'AI message result with accept/reject controls and highlighted resume changes.',
  },
  {
    href: '/v3/resume/editor?tab=create',
    label: 'Resume editor create',
    description: 'Section editor accordion with Light AI generated summary card.',
  },
  {
    href: '/v3/resume/editor?tab=template',
    label: 'Resume templates',
    description: 'Template gallery with Compact Executive selected and preview applied.',
  },
  {
    href: '/v3/resume/history',
    label: 'Resume history',
    description: 'Past resumes table with search, create-new action, ATS score, and pagination.',
  },
  {
    href: '/v3/interview-prep',
    label: 'Interview upload',
    description: 'Interview prep entry with resume upload and Jobwhisper resume choices.',
  },
  {
    href: '/v3/interview-prep/configure',
    label: 'Interview configure',
    description: 'Uploaded resume chip, interview type, difficulty, role, company, documents, and context.',
  },
  {
    href: '/v3/interview-prep/voice',
    label: 'Interviewer voice',
    description: 'Six interviewer personas with portrait cards and selected voice state.',
  },
  {
    href: '/v3/interview-prep/session',
    label: 'Live interview session',
    description: 'Dark live simulator with participant video cards, signal status, timer, and chat.',
  },
  {
    href: '/v3/interview-prep/session?state=loading',
    label: 'Live interview loading',
    description: 'Skeleton state for the live simulator, chat panel, media cards, and controls.',
  },
  {
    href: '/v3/interview-prep/complete',
    label: 'Interview complete',
    description: 'Completion confirmation and report handoff.',
  },
  {
    href: '/v3/interview-prep/preparing-report',
    label: 'Report preparing',
    description: 'Report generation progress checklist and skeleton report blocks.',
  },
  {
    href: '/v3/interview-prep/history',
    label: 'Interview history',
    description: 'Past interview table with search, create-new action, score, duration, and pagination.',
  },
  {
    href: '/v3/interview-prep/report',
    label: 'Interview report',
    description: 'Coaching report with summary score, scorecard, recording strip, transcript, and retry actions.',
  },
  {
    href: '/v3/interview-prep/report?state=loading',
    label: 'Interview report loading',
    description: 'Report document skeleton with hero, summary, scorecard, recording, and transcript placeholders.',
  },
  {
    href: '/v3/interview-copilot',
    label: 'Copilot upload',
    description: 'Interview Copilot entry with resume upload and Jobwhisper resume choices.',
  },
  {
    href: '/v3/interview-copilot/configure',
    label: 'Copilot configure',
    description: 'Step 1 setup with interview type, difficulty, role, company, documents, and context.',
  },
  {
    href: '/v3/interview-copilot/preferences',
    label: 'Copilot preferences',
    description: 'Step 2 response mode and response length preferences.',
  },
  {
    href: '/v3/interview-copilot/share-screen',
    label: 'Copilot screen share',
    description: 'Step 3 permission checklist before screen and microphone access is complete.',
  },
  {
    href: '/v3/interview-copilot/ready',
    label: 'Copilot ready',
    description: 'Completed screen and microphone permissions with preview and start action.',
  },
  {
    href: '/v3/interview-copilot/session',
    label: 'Copilot live session',
    description: 'Dark live-response surface with screen preview, AI prompts, and composer.',
  },
  {
    href: '/v3/interview-copilot/session?state=loading',
    label: 'Copilot live loading',
    description: 'Skeleton state for the live response panel, screen preview, AI prompts, and composer.',
  },
  {
    href: '/v3/interview-copilot/complete',
    label: 'Copilot complete',
    description: 'Completion card with recorded-response copy and report handoff.',
  },
  {
    href: '/v3/interview-copilot/history',
    label: 'Copilot history',
    description: 'Past Copilot sessions table with search, create-new action, location, and pagination.',
  },
  {
    href: '/v3/auto-apply',
    label: 'Auto Apply upload',
    description: 'Auto Apply entry with resume upload and Jobwhisper resume choices.',
  },
  {
    href: '/v3/auto-apply/contact',
    label: 'Auto Apply contact',
    description: 'Step 1 contact-information form with uploaded resume chip.',
  },
  {
    href: '/v3/auto-apply/preferences',
    label: 'Auto Apply preferences',
    description: 'Step 2 job preferences with target roles, salary, job type, and work mode.',
  },
  {
    href: '/v3/auto-apply/additional',
    label: 'Auto Apply additional info',
    description: 'Step 3 authorization, start timeline, and notes.',
  },
  {
    href: '/v3/auto-apply/review',
    label: 'Auto Apply review',
    description: 'Step 4 review of resume, contact, preferences, and additional information.',
  },
  {
    href: '/v3/auto-apply/agent',
    label: 'Auto Apply agent',
    description: 'Agent dashboard with metrics, worker status cards, and live activity stream.',
  },
  {
    href: '/v3/auto-apply/jobs',
    label: 'Auto Apply jobs',
    description: 'Jobs tab with search, filters, excellent-match rows, and pagination.',
  },
  {
    href: '/v3/auto-apply/jobs/coinbase',
    label: 'Auto Apply selected job',
    description: 'Jobs tab with Coinbase job detail panel, match score, credits, and apply action.',
  },
  {
    href: '/v3/auto-apply/applied',
    label: 'Auto Apply applied',
    description: 'Applied tab with application detail, timeline, activity log, and replay action.',
  },
] as const

const desktopRoutes = [
  {
    href: '/desktop',
    label: 'Desktop sign in',
    description: 'Movable/resizable macOS-style window shell with sign-in.',
  },
  {
    href: '/desktop/permissions',
    label: 'Desktop permissions',
    description: 'Screen and microphone permission steps.',
  },
  {
    href: '/desktop/configure',
    label: 'Desktop configure',
    description: 'Interview configure step inside the desktop shell.',
  },
  {
    href: '/desktop/session',
    label: 'Desktop live session',
    description: 'Live session with the real spacebar-driven interview simulation.',
  },
  {
    href: '/desktop/complete',
    label: 'Desktop complete',
    description: 'Desktop session completion screen.',
  },
] as const

const adminRoutes = [
  {
    href: '/admin',
    label: 'Admin dashboard',
    description: 'KPI tiles, revenue/credits trend, needs-attention alerts, revenue by product, subscribers by plan.',
  },
  {
    href: '/admin?state=loading',
    label: 'Admin dashboard (loading)',
    description: 'Skeleton state for the admin dashboard while metrics load.',
  },
  {
    href: '/admin/accounts',
    label: 'Admin accounts',
    description: 'User table with summary tiles, status/plan filters, search, pagination, and row actions.',
  },
  {
    href: '/admin/accounts?state=empty',
    label: 'Admin accounts (empty)',
    description: 'No-results state with a clear-filters action.',
  },
  {
    href: '/admin/accounts/acc_darnell_smith',
    label: 'Admin account detail',
    description: 'Subscription, credit balance and history, usage by product, activity, and per-account audit log.',
  },
  {
    href: '/admin/accounts/acc_darnell_smith?state=suspended',
    label: 'Admin account (suspended)',
    description: 'Suspended treatment with the action swapped to Reinstate.',
  },
  {
    href: '/admin/accounts/acc_darnell_smith?impersonating=true',
    label: 'Admin account (impersonating)',
    description: 'Mocked read-only "log in as user" state with the sticky impersonation banner.',
  },
  {
    href: '/admin/configuration',
    label: 'Admin configuration: pricing',
    description: 'Editable plan cards, credit economics, DFY packages, and the unsubscribed allowance, behind a review-changes gate.',
  },
  {
    href: '/admin/configuration?tab=coupons',
    label: 'Admin configuration: coupons',
    description: 'Promo code table with create dialog, validation, and deactivate confirmation.',
  },
  {
    href: '/admin/configuration?tab=trials',
    label: 'Admin configuration: trials',
    description: 'Trial settings plus the onboarding survey editor with keyboard-operable reordering.',
  },
] as const

export function RouteIndexPage() {
  return (
    <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">v3 review surface</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal">Jobwhisper UI Studio</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-ink-muted">
          Portable React screens grouped by production target. Each flow is built as app wiring plus pure feature views.
        </p>

        <a
          href="/v3/library"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-on-accent shadow-control transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          Open Component Library
          <span className="text-ink-muted/80">/v3/library</span>
        </a>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Marketing</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {marketingRoutes.map((route) => (
              <a
                key={route.href}
                href={route.href}
                aria-label={route.label}
                className="rounded-panel border border-border bg-surface p-5 shadow-panel transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <span className="text-lg font-semibold text-ink">{route.label}</span>
                <span className="mt-2 block text-sm leading-6 text-ink-muted">{route.description}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Web app: Auth</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {authRoutes.map((route) => (
              <a
                key={route.href}
                href={route.href}
                aria-label={route.label}
                className="rounded-panel border border-border bg-surface p-5 shadow-panel transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <span className="text-lg font-semibold text-ink">{route.label}</span>
                <span className="mt-2 block text-sm leading-6 text-ink-muted">{route.description}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Web app: Onboarding</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {onboardingRoutes.map((route) => (
              <a
                key={route.href}
                href={route.href}
                aria-label={route.label}
                className="rounded-panel border border-border bg-surface p-5 shadow-panel transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <span className="text-lg font-semibold text-ink">{route.label}</span>
                <span className="mt-2 block text-sm leading-6 text-ink-muted">{route.description}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Web app: Dashboard</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {appRoutes.map((route) => (
              <a
                key={route.href}
                href={route.href}
                aria-label={route.label}
                className="rounded-panel border border-border bg-surface p-5 shadow-panel transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <span className="text-lg font-semibold text-ink">{route.label}</span>
                <span className="mt-2 block text-sm leading-6 text-ink-muted">{route.description}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Admin app</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {adminRoutes.map((route) => (
              <a
                key={route.href}
                href={route.href}
                aria-label={route.label}
                className="rounded-panel border border-border bg-surface p-5 shadow-panel transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <span className="text-lg font-semibold text-ink">{route.label}</span>
                <span className="mt-2 block text-sm leading-6 text-ink-muted">{route.description}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Desktop app prototype</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {desktopRoutes.map((route) => (
              <a
                key={route.href}
                href={route.href}
                aria-label={route.label}
                className="rounded-panel border border-border bg-surface p-5 shadow-panel transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <span className="text-lg font-semibold text-ink">{route.label}</span>
                <span className="mt-2 block text-sm leading-6 text-ink-muted">{route.description}</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
