import type { HelpArticle } from '../types'

export const troubleshootingArticles: readonly HelpArticle[] = [
  {
    slug: 'browser-requirements',
    title: 'Browser requirements',
    description: 'Supported browsers and system requirements.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Jobwhisper works best on modern browsers. Here are the requirements.' },
      { type: 'heading', text: 'Supported browsers', level: 2 },
      { type: 'list', items: [
        'Google Chrome (recommended) — latest version',
        'Mozilla Firefox — latest version',
        'Apple Safari — latest version',
        'Microsoft Edge — latest version',
      ]},
      { type: 'heading', text: 'System requirements', level: 2 },
      { type: 'list', items: [
        'Stable internet connection (10 Mbps+ recommended for Interview Copilot).',
        'A working microphone (required for Interview Copilot).',
        'Desktop app (Mac or Windows) for live interview coaching.',
      ]},
      { type: 'callout', variant: 'tip', text: 'If you are experiencing issues, try clearing your browser cache and disabling extensions. Some ad blockers can interfere with the app.' },
    ],
  },
  {
    slug: 'common-issues',
    title: 'Common issues and fixes',
    description: 'Quick solutions to frequently reported problems.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Here are solutions to the most common issues users encounter.' },
      { type: 'heading', text: 'Resume looks off after tailoring', level: 2 },
      { type: 'list', items: [
        'Check that your source resume has real content, not just a bare template.',
        'Ensure the job description is detailed — vague descriptions produce vague results.',
        'Try re-running the tailoring with a fresh paste of the job description.',
      ]},
      { type: 'heading', text: 'No Auto-Apply matches', level: 2 },
      { type: 'list', items: [
        'Broaden your role or location filters.',
        'Remove hard-to-match requirements like specific company names.',
        'Check that your preferences are not too restrictive.',
      ]},
      { type: 'heading', text: 'Copilot not hearing audio', level: 2 },
      { type: 'list', items: [
        'Confirm the desktop app has microphone permissions.',
        'Check that the correct audio device is selected in Copilot settings.',
        'Run the 2-minute audio test before each interview.',
      ]},
      { type: 'heading', text: 'Page not loading or blank screen', level: 2 },
      { type: 'list', items: [
        'Clear your browser cache.',
        'Disable browser extensions (especially ad blockers).',
        'Try an incognito/private window.',
        'Check your internet connection.',
      ]},
    ],
  },
  {
    slug: 'contacting-support',
    title: 'Contacting support',
    description: 'How to reach the Jobwhisper support team.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'If you cannot find an answer in the help center, you can reach our support team directly.' },
      { type: 'heading', text: 'Support channels', level: 2 },
      { type: 'list', items: [
        'Email — support@jobwhisper.org (response within 24 hours on business days)',
        'In-app support — go to Help > Send us a message',
      ]},
      { type: 'heading', text: 'What to include', level: 2 },
      { type: 'list', items: [
        'Your account email.',
        'A description of the issue.',
        'Steps to reproduce (if applicable).',
        'Screenshots or screen recordings (helpful but not required).',
      ]},
      { type: 'callout', variant: 'info', text: 'Premium plan users receive priority support with faster response times.' },
    ],
  },
  {
    slug: 'privacy-and-security',
    title: 'Privacy and security',
    description: 'How your data is protected.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Jobwhisper handles sensitive career material. Here is how we protect it.' },
      { type: 'heading', text: 'Encryption', level: 2 },
      { type: 'list', items: [
        'In transit — TLS 1.3',
        'At rest — AES-256',
      ]},
      { type: 'heading', text: 'Data privacy', level: 2 },
      { type: 'list', items: [
        'We do not sell your data.',
        'We do not use your resume, application, or interview data to train AI models.',
        'AI suggestions are generated in real time via third-party providers under strict data-processing agreements.',
        'Payment data is processed by Stripe and never touches our servers.',
      ]},
      { type: 'heading', text: 'Your rights', level: 2 },
      { type: 'list', items: [
        'Export your data anytime from Account > Settings.',
        'Delete your account and all data — processed within 30 days.',
        'GDPR and CCPA compliant.',
      ]},
      { type: 'callout', variant: 'info', text: 'Interview audio is processed in real time and not persisted unless you explicitly enable session recording.' },
    ],
  },
]
