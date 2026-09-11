import type { HelpArticle } from '../types'

export const gettingStartedArticles: readonly HelpArticle[] = [
  {
    slug: 'what-is-jobwhisper',
    title: 'What is Jobwhisper?',
    description: 'An overview of the AI-powered career platform.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Jobwhisper is an AI-powered career platform that helps job seekers land roles faster. It combines four core tools into one seamless experience.' },
      { type: 'heading', text: 'What you get', level: 2 },
      { type: 'list', items: [
        'Resume Builder — AI tailors your resume to each specific job description',
        'Auto-Apply — finds matching positions and submits applications with your approval',
        'Interview Prep — AI-powered mock interviews with detailed performance reports',
        'Interview Copilot — real-time coaching during your actual live interviews',
      ]},
      { type: 'paragraph', text: 'Whether you are a recent graduate, career changer, or actively looking, Jobwhisper adapts to your target roles and speeds up every step of the search.' },
    ],
  },
  {
    slug: 'how-to-create-an-account',
    title: 'How to create an account',
    description: 'Sign up and get started in under two minutes.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Creating a Jobwhisper account takes less than two minutes.' },
      { type: 'heading', text: 'Steps', level: 2 },
      { type: 'list', ordered: true, items: [
        'Go to jobwhisper.org and click "Get Started".',
        'Enter your email address and create a password, or sign in with Google.',
        'Verify your email — check your inbox for a verification link.',
        'Complete your profile: name, target role, and preferred locations.',
        'Upload your existing resume to get your first tailored version.',
      ]},
      { type: 'callout', variant: 'tip', text: 'You receive 5 free credits per month on the free plan, enough to try Resume Builder and get a feel for the platform.' },
    ],
  },
  {
    slug: 'choosing-a-plan',
    title: 'Choosing a plan',
    description: 'Compare Starter, Pro, and Premium to find the right fit.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Jobwhisper offers three paid plans plus a free tier. All plans include the same core features — the difference is how many credits you get each month.' },
      { type: 'heading', text: 'Plan comparison', level: 2 },
      { type: 'list', items: [
        'Free — 5 credits/month. Good for trying the platform.',
        'Starter — $27/month. 20 credits/month. Resume Builder + Auto-Apply.',
        'Pro — $49/month. 50 credits/month. All features including Interview Copilot.',
        'Premium — $79/month. 100 credits/month. Everything in Pro plus priority support.',
      ]},
      { type: 'heading', text: 'What counts as a credit?', level: 2 },
      { type: 'paragraph', text: 'Each major action — tailoring a resume, running an interview prep session, or submitting an auto-apply batch — costs credits. You see the cost before each action and can top up at any time.' },
      { type: 'callout', variant: 'info', text: 'First-time users can activate Pro for $10 for the first month. After that, it renews at $49/month unless you cancel.' },
    ],
  },
  {
    slug: 'your-first-job-search',
    title: 'Your first job search',
    description: 'A step-by-step walkthrough of your first week.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Here is a practical walkthrough of what your first week on Jobwhisper should look like.' },
      { type: 'heading', text: 'Day 1', level: 2 },
      { type: 'list', ordered: true, items: [
        'Upload your resume and paste a real target job description into Resume Builder.',
        'Review the tailored resume and ATS score — tweak as needed.',
        'Set your Auto-Apply preferences: target roles, locations, salary range, and must-haves.',
      ]},
      { type: 'heading', text: 'Days 2-3', level: 2 },
      { type: 'list', ordered: true, items: [
        'Approve your first Auto-Apply match batch.',
        'Run one Interview Prep session for a role you are actively targeting.',
      ]},
      { type: 'heading', text: 'Days 4-7', level: 2 },
      { type: 'list', ordered: true, items: [
        'Review application status in your dashboard.',
        'If you have an upcoming interview, download the desktop app and test Interview Copilot with a 2-minute practice run.',
        'Adjust your Auto-Apply filters based on the matches you are seeing.',
      ]},
      { type: 'callout', variant: 'tip', text: 'If Auto-Apply is not finding matches, try broadening your role or location filters. The more specific your preferences, the fewer results you will see.' },
    ],
  },
]
