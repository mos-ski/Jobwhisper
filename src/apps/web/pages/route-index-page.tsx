const marketingRoutes = [
  {
    href: '/',
    label: 'Landing page',
    description: 'Marketing-only Interview Copilot landing page: hero, pain, cost, demo, FAQ, final CTA.',
  },
  {
    href: '/pricing',
    label: 'Pricing page',
    description: 'Tabbed pricing page with three product tiers: Interview Copilot, Auto Apply & Resume, Done For You.',
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

const tryFunnelRoutes = [
  {
    href: '/v3/try/pro',
    label: 'Pro week funnel',
    description: 'Seven questions, then a free week of Pro unlocked and started with a card: $0 today, $99 a month after.',
  },
  {
    href: '/v3/try/pro?step=reward&session=signed-in',
    label: 'Pro week funnel: signed in',
    description: 'Reward reveal for an existing account; Claim goes straight to the card step.',
  },
  {
    href: '/v3/try/pro?offline=1',
    label: 'Pro week funnel: offline',
    description: 'Offline notice; answers are kept and Continue waits for the connection.',
  },
  {
    href: '/v3/try/pro?step=card&session=signed-in&card=declined',
    label: 'Pro week funnel: card declined',
    description: 'Card step with the bank decline explained and the form ready for another card.',
  },
  {
    href: '/v3/try/pro?step=done&session=signed-in',
    label: 'Pro week funnel: started',
    description: 'Confirmation of what Pro includes, the free-until date, and how to cancel.',
  },
  {
    href: '/v3/try/resume',
    label: 'Resume funnel',
    description: 'Upload a resume, get an ATS score with named issues, drag a before and after, then sign up to download.',
  },
  {
    href: '/v3/try/resume?step=score',
    label: 'Resume funnel: ATS score',
    description: 'Score out of 100 in words and numbers, with five issues ranked by impact.',
  },
  {
    href: '/v3/try/resume?step=compare',
    label: 'Resume funnel: before and after',
    description: 'Drag or arrow-key slider revealing the Jobwhisper version while the score climbs from 54 to 91.',
  },
  {
    href: '/v3/try/resume?step=gate',
    label: 'Resume funnel: download gate',
    description: 'Sign-up gate that says the tailored resume is saved and waiting.',
  },
  {
    href: '/v3/try/resume?upload=error',
    label: 'Resume funnel: upload refused',
    description: 'Unsupported file with the fix stated and scoring held.',
  },
  {
    href: '/v3/try/auto-apply',
    label: 'Auto Apply funnel',
    description: 'Resume plus nine matching questions, one per page, then matched jobs you can only apply to after signing up.',
  },
  {
    href: '/v3/try/auto-apply?step=matches',
    label: 'Auto Apply funnel: matches',
    description: 'Eight matched jobs with match scores, a detail view with reasons, and Apply to all.',
  },
  {
    href: '/v3/try/auto-apply?step=matches&job=lattice-csm',
    label: 'Auto Apply funnel: job detail',
    description: 'One matched job with why it matched and Apply to this job.',
  },
  {
    href: '/v3/try/auto-apply?step=gate&apply=all',
    label: 'Auto Apply funnel: apply gate',
    description: 'Sign-up gate naming the matches the agent will apply to.',
  },
  {
    href: '/v3/try/auto-apply?step=matches&matches=none',
    label: 'Auto Apply funnel: no matches',
    description: 'Empty result with the answers to widen.',
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
    href: '/v3/job-directory',
    label: 'Job Directory',
    description: 'Trusted job-board directory with search, focus filters, curated in-app job previews, and external application handoff.',
  },
  {
    href: '/v3/job-directory?board=linkedin-jobs&job=linkedin-people-operations',
    label: 'Job Directory preview',
    description: '80%-viewport browser-like preview with job list, selected role details, and source-site Apply action.',
  },
  {
    href: '/v3/job-directory?state=loading',
    label: 'Job Directory loading',
    description: 'Layout-matched loading rows for the job-board directory.',
  },
  {
    href: '/v3/job-directory?state=error',
    label: 'Job Directory error',
    description: 'Recoverable directory load failure with retry action.',
  },
  {
    href: '/v3/job-directory?state=offline',
    label: 'Job Directory offline',
    description: 'Cached boards remain browsable while external application handoff is unavailable.',
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
    href: '/v3/resume/editor?tab=chat&state=suggestions&fair-use=nearing',
    label: 'Resume Builder fair use, nearing',
    description: 'The prompt meter in the chat sidebar as a sitting approaches its 25-prompt cap.',
  },
  {
    href: '/v3/resume/editor?tab=chat&state=suggestions&fair-use=spent',
    label: 'Resume Builder fair use, spent',
    description: 'Cooldown wall in the builder, with prompts for sale to start a fresh sitting.',
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
    href: '/v3/interview-prep/session?state=low-balance',
    label: 'Interview Prep low balance',
    description: 'Compact warning notice over the session, with Add funds beside it. No waiting for the balance to drain.',
  },
  {
    href: '/v3/interview-prep/session?state=out-of-balance',
    label: 'Interview Prep out of balance',
    description: 'Session paused notice in the danger tone, pinned so it can be reviewed on demand.',
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
    href: '/v3/interview-copilot/session?state=low-balance',
    label: 'Copilot low balance',
    description: 'Compact warning notice over the live session, with Add funds beside it and a dismiss.',
  },
  {
    href: '/v3/interview-copilot/session?state=out-of-balance',
    label: 'Copilot out of balance',
    description: 'Session paused notice in the danger tone, pinned so it can be reviewed without waiting.',
  },
  {
    href: '/v3/interview-copilot/session?state=fair-use-nearing',
    label: 'Copilot fair use, nearing',
    description: 'Live session with the stretch running out: how much is left before Copilot rests.',
  },
  {
    href: '/v3/interview-copilot/session?state=fair-use-spent',
    label: 'Copilot fair use, stretch spent',
    description: 'The cooldown wall mid-interview, with minutes for sale as the way to carry on now.',
  },
  {
    href: '/v3/interview-copilot/session?state=fair-use-spent-locked',
    label: 'Copilot fair use, no way past',
    description: 'The same wall on a plan whose cooldown cannot be bought out: the clock is the only route.',
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
    href: '/v3/auto-apply/agent?fair-use=running',
    label: 'Auto Apply fair use, running',
    description: 'Run meter under the agent stats: applications used of the 50 this run allows.',
  },
  {
    href: '/v3/auto-apply/agent?fair-use=spent',
    label: 'Auto Apply fair use, run spent',
    description: 'The agent resting after a full run, with credits offered to start the next one now.',
  },
  {
    href: '/v3/auto-apply/jobs',
    label: 'Auto Apply jobs',
    description: 'Jobs tab with search, filters, excellent-match rows, and pagination.',
  },
  {
    href: '/v3/auto-apply/jobs/coinbase-financial-engineering',
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
    href: '/admin/accounts?tab=invites',
    label: 'Admin invites',
    description: 'Invite by email or by link, with a plan or a credit balance attached to whoever accepts.',
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
    href: '/admin/products',
    label: 'Admin products',
    description: 'Every product with tier gating, usage, revenue, health, and click-through to detail.',
  },
  {
    href: '/admin/feature-flags',
    label: 'Admin feature flags',
    description: 'Toggle parts of the web app on and off from a single page.',
  },
  {
    href: '/admin/products/coding-copilot',
    label: 'Admin product detail (degraded)',
    description: 'Per-product stats, usage trend, grouped recent errors, and the filterable session log.',
  },
  {
    href: '/admin/transactions',
    label: 'Admin transactions',
    description: 'Ledger with volume tiles, failed-renewal banner, status filter, search, and pagination.',
  },
  {
    href: '/admin/transactions?tab=disputes',
    label: 'Admin disputes queue',
    description: 'Dispute cards with evidence deadlines, overdue escalation, and submit/accept confirmations.',
  },
  {
    href: '/admin/transactions?tab=refunds',
    label: 'Admin refunds queue',
    description: 'Pending refund requests with approve, and deny gated on a written reason.',
  },
  {
    href: '/admin/transactions/txn_7T3XQP',
    label: 'Admin transaction detail',
    description: 'Invoice line items, tax, totals, customer block, and the payment event timeline.',
  },
  {
    href: '/admin/systems?tab=team',
    label: 'Admin systems: team',
    description: 'Admin/support roster with human-labelled permissions, invite dialog, and a self-revoke guard.',
  },
  {
    href: '/admin/systems?tab=audit',
    label: 'Admin systems: audit log',
    description: 'Platform-wide log with actor/action/result/date filters, denied entries, and before-after expansion.',
  },
  {
    href: '/admin/systems?tab=notifications',
    label: 'Admin systems: notifications',
    description: 'Per-channel notification rules with thresholds, plus the feed behind the shell bell.',
  },
  {
    href: '/admin/systems?state=restricted',
    label: 'Admin systems (restricted)',
    description: 'Permission-denied treatment for an admin without the manage-users permission.',
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
        <h1 className="font-gowun mt-3 text-4xl font-semibold tracking-normal">Jobwhisper UI Studio</h1>
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
          <h2 className="text-2xl font-semibold">Try-it funnels</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {tryFunnelRoutes.map((route) => (
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
