import type { HelpArticle } from '../types'

export const autoApplyArticles: readonly HelpArticle[] = [
  {
    slug: 'how-auto-apply-works',
    title: 'How Auto-Apply works',
    description: 'Set preferences, review matches, and submit with confidence.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Auto-Apply finds job postings that match your preferences and prepares applications for you to review before anything goes out.' },
      { type: 'heading', text: 'The process', level: 2 },
      { type: 'list', ordered: true, items: [
        'Set your target roles, locations, salary range, and must-haves.',
        'Jobwhisper scans job boards and listings for matches.',
        'You receive a batch of matched positions to review.',
        'For each match, you can see the tailored resume and application materials.',
        'Approve, edit, or reject each one — nothing is submitted without your say-so.',
      ]},
      { type: 'callout', variant: 'info', text: 'Nothing goes out without your review. Every match is shown to you before submission.' },
    ],
  },
  {
    slug: 'customizing-applications',
    title: 'Customizing your applications',
    description: 'Review and edit materials before each submission.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'For every Auto-Apply match, you can review and customize the application materials before approving submission.' },
      { type: 'heading', text: 'What you can customize', level: 2 },
      { type: 'list', items: [
        'Resume — review the tailored version, make edits if needed.',
        'Cover letter — edit or remove the generated cover letter.',
        'Contact information — verify your details are correct.',
        'Application method — some listings support quick-apply; others require external forms.',
      ]},
      { type: 'paragraph', text: 'You are always in control. Edit freely, or approve the defaults and move on.' },
    ],
  },
  {
    slug: 'credit-costs-for-auto-apply',
    title: 'Credit costs for Auto-Apply',
    description: 'How credits work with Auto-Apply batches.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Each Auto-Apply batch costs credits based on the number of applications submitted. Here is how it works.' },
      { type: 'heading', text: 'Credit breakdown', level: 2 },
      { type: 'list', items: [
        'Each approved application in a batch costs 1 credit.',
        'Rejected matches in a batch do not cost credits.',
        'You see the total credit cost before approving any batch.',
      ]},
      { type: 'heading', text: 'Managing your balance', level: 2 },
      { type: 'list', items: [
        'Check your balance on the Dashboard or Billing page.',
        'Top up credits at any time from Account > Billing > Credits.',
        'Pro includes 50 credits/month; Premium includes 100.',
      ]},
      { type: 'callout', variant: 'tip', text: 'If your credits are running low, reduce your batch size or focus on higher-quality matches rather than volume.' },
    ],
  },
]
