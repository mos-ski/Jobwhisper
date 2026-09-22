import type { HelpArticle } from '../types'

export const autoApplyArticles: readonly HelpArticle[] = [
  {
    slug: 'how-auto-apply-works',
    title: 'How Auto-Apply works',
    description: 'Matching, review, and why nothing is submitted without you.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Auto Apply takes the repetitive part of a job search — finding roles that fit, tailoring a resume for each, filling in the same details over and over — and does it for you. It stops short of the send button, deliberately.' },

      { type: 'heading', text: 'The process', level: 2 },
      { type: 'list', ordered: true, items: [
        'Set your preferences: target roles, locations, salary floor, and anything non-negotiable.',
        'Jobwhisper scans listings and matches them against those preferences and your resume.',
        'Matches arrive as a batch for you to review.',
        'Each match shows the role, why it matched, and the tailored resume prepared for it.',
        'You approve, edit, or reject each one. Approved applications are submitted; rejected ones cost nothing.',
      ]},

      { type: 'heading', text: 'Why there is a review step', level: 2 },
      { type: 'paragraph', text: 'Fully automated applying is technically easy and we chose not to build it. Three reasons, and they are worth understanding because they shape how the tool behaves.' },
      { type: 'list', items: [
        'An application carries your name. A bad one does not vanish — it is on file at a company you may want to work at in two years.',
        'Matching is good, not perfect. A posting can satisfy every filter and still be obviously wrong for reasons no filter captures: the team, the domain, the phrasing of the role.',
        'Reviewing teaches the tool. Rejections are signal, and matching improves from them in a way it cannot if everything is auto-approved.',
      ]},

      { type: 'heading', text: 'What "successful application" means', level: 2 },
      { type: 'paragraph', text: 'Auto Apply is charged per successful application — meaning the application was actually submitted to the employer and accepted by their system. If a posting closes, a portal rejects the submission, or the listing turns out to be dead, you are not charged. You pay for applications that landed, not for attempts.' },

      { type: 'heading', text: 'What it cannot do', level: 2 },
      { type: 'list', items: [
        'Answer employer screening questions it cannot verify from your profile — sponsorship status, notice period, specific certifications. Those come back to you.',
        'Get through every portal. Some employers require an account, an assessment, or a login that only you can complete.',
        'Find roles that are not posted. It works from public listings, not from a hidden market.',
      ]},

      { type: 'callout', variant: 'info', text: 'Nothing is submitted without your approval. There is no setting that turns the review step off.' },
    ],
  },

  {
    slug: 'customizing-applications',
    title: 'Customizing your applications',
    description: 'What to check in a batch, and where the review time is best spent.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Every match can be edited before it is approved. You will not want to edit everything — the point is to save time — so it helps to know where review actually pays off.' },

      { type: 'heading', text: 'What you can change', level: 2 },
      { type: 'list', items: [
        'Resume — the tailored version prepared for this posting, editable before it goes.',
        'Cover letter — edit the generated one, rewrite it, or remove it where it is not required.',
        'Contact details — worth confirming once, especially after a phone number or address change.',
        'Application method — some listings support a quick apply, others hand off to an external form.',
      ]},

      { type: 'heading', text: 'Where review time pays off', level: 2 },
      { type: 'paragraph', text: 'Reviewing every field of every match defeats the purpose. Spend the time where a mistake would actually cost you.' },
      { type: 'list', ordered: true, items: [
        'Is this role actually right? The cheapest edit is rejecting a match you would not accept an offer from.',
        'Does the resume\'s opening match the posting? The top third is what gets read.',
        'Does the cover letter name the right company? Generated letters are good, and a wrong company name is fatal.',
        'Anything unusual in the posting — a specific certification, a portfolio link, a required question — that the tailored materials do not address.',
      ]},

      { type: 'heading', text: 'A practical rhythm', level: 2 },
      { type: 'paragraph', text: 'Most people settle into sorting the batch first and editing second. Reject the wrong roles quickly, approve the clear fits with light review, and spend real time only on the handful you actively want. A batch of twenty usually contains three worth writing for.' },

      { type: 'callout', variant: 'tip', text: 'If you are editing nearly every match, your filters are too loose. If you are rejecting almost nothing, they may be too tight and you are not seeing enough. Either way the batch is telling you something about your preferences.' },
    ],
  },

  {
    slug: 'credit-costs-for-auto-apply',
    title: 'Credit costs for Auto-Apply',
    description: 'What you pay for, what is free, and keeping a balance topped up.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Auto Apply runs on its own prepaid balance and is not part of an interview subscription. You can use it with no subscription at all, and stop paying entirely when you are not searching.' },

      { type: 'heading', text: 'What it costs', level: 2 },
      { type: 'list', items: [
        '$1 per successful application — an application actually submitted and accepted by the employer.',
        'Top up from $10. Credits stay valid for 30 days from purchase.',
        'Job matching and resume tailoring for each application are included in that price.',
      ]},

      { type: 'heading', text: 'What is free', level: 2 },
      { type: 'list', items: [
        'Receiving and reviewing matches. Browsing a batch costs nothing.',
        'Rejecting a match.',
        'An application that could not be submitted — a closed posting or a portal that refused it.',
      ]},
      { type: 'paragraph', text: 'Charging only on success is the point. You are paying for applications that reached an employer, not for the tool trying.' },

      { type: 'heading', text: 'The 30-day expiry', level: 2 },
      { type: 'paragraph', text: 'Balances expire 30 days after purchase, so buy against the search you are running rather than stocking up. If you apply to roughly twenty roles a month, a $20 top-up each month is a better fit than $100 at the start — the same money, without the risk of losing the tail of it.' },

      { type: 'heading', text: 'Managing your balance', level: 2 },
      { type: 'list', items: [
        'Your balance is on the dashboard and under Billing.',
        'Top up from Billing, under job-search credits. Funds are available immediately.',
        'The cost of a batch is shown before you approve it, so there are no surprises.',
      ]},

      { type: 'callout', variant: 'warning', text: 'Auto Apply credits and interview plan credits are separate balances and are not interchangeable. Interview minutes cannot pay for applications, and application credits cannot pay for Copilot time.' },
    ],
  },
]
