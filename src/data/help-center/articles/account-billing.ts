import type { HelpArticle } from '../types'

export const accountBillingArticles: readonly HelpArticle[] = [
  {
    slug: 'managing-your-account',
    title: 'Managing your account',
    description: 'Profile, password, two-factor authentication, data export and deletion.',
    lastUpdated: '2026-09-22',
    content: [
      { type: 'paragraph', text: 'Everything about your account lives under Settings in the app. Most of it is routine; two items are worth reading before you use them.' },

      { type: 'heading', text: 'What you can change', level: 2 },
      { type: 'list', items: [
        'Name, email, and profile details including your target role and preferred locations.',
        'Password, or connecting Google sign-in to an existing account.',
        'Two-factor authentication.',
        'A full export of your data.',
        'Permanent deletion of your account.',
      ]},

      { type: 'heading', text: 'Changing your email', level: 2 },
      { type: 'paragraph', text: 'A new address has to be verified before it becomes the address of record, and until then sign-in and billing notices continue going to the old one. Change it while you still have access to the old inbox — recovering an account whose email has moved and cannot receive the verification link needs support to step in.' },

      { type: 'heading', text: 'Two-factor authentication', level: 2 },
      { type: 'paragraph', text: 'Worth enabling. A Jobwhisper account holds your full work history, your Knowledge Base, and the applications you have submitted — more about your career than most people keep in one place. Save the recovery codes somewhere other than the device running your authenticator.' },

      { type: 'heading', text: 'Exporting your data', level: 2 },
      { type: 'paragraph', text: 'Export produces your profile, resumes and their versions, application history, and Knowledge Base documents. It is useful as a backup, and useful if you want to keep your tailored resumes after you stop subscribing.' },

      { type: 'heading', text: 'Deleting your account', level: 2 },
      { type: 'paragraph', text: 'Deletion is permanent and processed within 30 days. It removes your resumes, application history, interview reports, and Knowledge Base. There is no undo once it completes.' },
      { type: 'list', items: [
        'Export first if you want to keep anything. Your tailored resumes in particular are hard to reproduce.',
        'Cancel an active subscription separately. Deleting the account is not the same action as ending billing.',
        'If you only want to stop paying, cancel instead. Cancelling keeps your data and your resume history.',
      ]},

      { type: 'callout', variant: 'warning', text: 'Deletion and cancellation are different things. Cancelling ends billing and keeps your work; deleting removes the work. If you may come back to this search later, cancel.' },
    ],
  },

  {
    slug: 'plans-and-pricing',
    title: 'Plans and pricing',
    description: 'Every price, what each tier includes, and the two ways Jobwhisper charges.',
    lastUpdated: '2026-09-28',
    content: [
      { type: 'paragraph', text: 'Jobwhisper bills in two separate ways. A plan is a subscription, and everything it covers is unlimited: there is no credit balance and nothing runs out before your renewal. Without a plan, you buy what you use as prepaid credits. Credits only exist for people without a plan.' },

      { type: 'heading', text: 'Plans', level: 2 },
      { type: 'paragraph', text: 'Every plan runs on web, desktop and mobile, and every plan includes call recording.' },
      { type: 'list', items: [
        'Starter: $47 a week. Unlimited Interview Prep and Interview Copilot, plus a 3-document Knowledge Base. Renews weekly until you cancel.',
        'Pro: $99 a month. Everything in Starter, plus unlimited Meeting Copilot, Coding Copilot and Resume Builder, Auto Apply for up to 500 jobs a month, and a 5-document Knowledge Base.',
        'Premium: $497 a month. Everything in Pro, with no job cap on Auto Apply, plus priority support and a 10-document Knowledge Base.',
      ]},

      { type: 'heading', text: 'What the tiers actually gate', level: 3 },
      { type: 'paragraph', text: 'Usage is not the difference. Interviews are unlimited on all three. Pro is where Meeting Copilot, Coding Copilot, Resume Builder and Auto Apply arrive. Premium matters once you are applying past 500 jobs a month. If you only need the interview itself, Starter does everything Pro does for that week.' },

      { type: 'heading', text: 'Pay as you go, without a plan', level: 2 },
      { type: 'paragraph', text: 'Prepaid credits, no subscription, and they expire 30 days after purchase. A subscriber never sees these balances.' },
      { type: 'list', items: [
        'Interview minutes: $0.10 a minute, top up from $10. One balance covers Interview Prep and a live Interview Copilot session.',
        'Resume Builder: $0.10 per AI prompt, top up from $5. ATS scoring and downloads are free.',
        'Auto Apply: $1 per successful application, top up from $10. Charged only when an application is actually submitted and accepted.',
      ]},

      { type: 'heading', text: 'Done For You', level: 2 },
      { type: 'paragraph', text: 'A one-time managed service rather than a subscription. A success manager scouts roles, tailors your resume, and submits applications until you reach a set number of interview invitations.' },
      { type: 'list', items: [
        '5 interviews guaranteed — $497, one time.',
        '20 interviews guaranteed — $1,997, one time.',
      ]},
      { type: 'paragraph', text: 'Both include job scouting and match review, per-role resume tailoring, applications submitted for you, and full Jobwhisper access while the package runs. The larger package adds priority scheduling.' },

      { type: 'heading', text: 'Upgrading and downgrading', level: 2 },
      { type: 'list', ordered: true, items: [
        'Go to Billing & subscription and choose a plan.',
        'Confirm. Upgrades apply immediately and are prorated, so you pay the difference for the rest of the cycle, not a second full month.',
        'Downgrades apply at the start of your next cycle, so you keep what you are paying for until then.',
      ]},

      { type: 'callout', variant: 'tip', text: 'Because upgrades are prorated and immediate, starting on a lower tier costs nothing. If you find you need Auto Apply or Resume Builder partway through a cycle, move up then and pay only the difference.' },
    ],
  },

  {
    slug: 'credits-and-top-ups',
    title: 'Credits and top-ups',
    description: 'Who uses credits, what consumes one, and how the balances differ.',
    lastUpdated: '2026-09-28',
    content: [
      { type: 'paragraph', text: 'Credits are for people without a plan. If you subscribe, everything your plan covers is unlimited and you have no credit balance to watch. Without a plan, you buy prepaid credits for the product you want to use, and each product has its own balance.' },

      { type: 'heading', text: 'Interview credits', level: 2 },
      { type: 'paragraph', text: 'One credit is one interview minute, at $0.10 a minute, bought from $10. They are spent by anything that runs in real time.' },
      { type: 'list', items: [
        'An Interview Prep session: one credit per minute of the session.',
        'Interview Copilot in a live interview: one credit per minute connected.',
      ]},
      { type: 'paragraph', text: 'A 45-minute interview costs 45 credits, so $10 covers roughly two of them. If you have several interviews coming up, a Starter week is usually cheaper than buying minutes.' },

      { type: 'heading', text: 'Why minutes rather than sessions', level: 3 },
      { type: 'paragraph', text: 'Per-session pricing punishes short use. A ten-minute phone screen and a two-hour panel are not the same thing, and charging them identically would push you to avoid opening Copilot for anything brief. Metering by the minute means a quick screen costs what a quick screen is worth.' },

      { type: 'heading', text: 'Job-search credits', level: 2 },
      { type: 'paragraph', text: 'Prepaid balances for Resume Builder and Auto Apply. Both are included in Pro and Premium, so you only buy these without a plan.' },
      { type: 'list', items: [
        'Resume Builder: $0.10 per AI prompt. Scoring and downloading are free.',
        'Auto Apply: $1 per application that is successfully submitted.',
        'Both expire 30 days after purchase.',
      ]},

      { type: 'heading', text: 'Topping up', level: 2 },
      { type: 'list', ordered: true, items: [
        'Go to Billing & subscription, then job-search credits.',
        'Choose a preset amount or enter your own, above the minimum for that product.',
        'Pay. The balance is available immediately.',
      ]},

      { type: 'heading', text: 'Running out mid-interview', level: 2 },
      { type: 'paragraph', text: 'The thing to avoid without a plan. Check your balance before a scheduled interview rather than during one. A long panel can consume more than you expect, and the middle of a final round is the worst possible moment to be handling a payment screen. If you are close to the line, top up or subscribe beforehand.' },
      { type: 'paragraph', text: 'On a plan there is no balance to run out. What a plan does bound is one unbroken stretch of use: 90 minutes on Starter, two hours on Pro, three on Premium. After that the feature rests for a few hours at no cost, or you can pay $10 to start a fresh stretch straight away. You are warned before you reach it.' },

      { type: 'callout', variant: 'warning', text: 'The balances are not interchangeable. Interview minutes cannot pay for applications, and Auto Apply credit cannot pay for Copilot time.' },
    ],
  },

  {
    slug: 'refund-policy',
    title: 'Refund policy',
    description: 'The money-back window, how to claim, and what happens to your data.',
    lastUpdated: '2026-09-28',
    content: [
      { type: 'paragraph', text: 'New subscriptions carry a 14-day money-back guarantee. It exists because whether the product suits your search is hard to judge from the outside, and we would rather you found out than stayed subscribed to something that is not helping.' },

      { type: 'heading', text: 'Requesting a refund', level: 2 },
      { type: 'list', ordered: true, items: [
        'Email support@jobwhisper.org within 14 days of the charge.',
        'Include the email address on the account. A reason is welcome but not required.',
        'Refunds go back to the original payment method.',
      ]},
      { type: 'paragraph', text: 'Card refunds take 5 to 7 business days to appear; PayPal is usually 3 to 5. That window is the payment network\'s, not ours — the refund is issued when we process it.' },

      { type: 'heading', text: 'What happens afterwards', level: 2 },
      { type: 'list', items: [
        'Your subscription ends and plan features stop.',
        'Your data is kept for 30 days so you can export it, then removed unless you resubscribe.',
      ]},
      { type: 'paragraph', text: 'Export your resume versions before that window closes if you want them. They are the hardest thing to reproduce.' },

      { type: 'heading', text: 'Cancellation', level: 2 },
      { type: 'list', items: [
        'Weekly (Starter) and monthly: cancel any time; access runs to the end of the week or month you have paid for.',
        'Annual — cancel any time; access runs to the end of the annual term.',
        'Outside the 14-day window there are no partial refunds for unused time.',
      ]},

      { type: 'heading', text: 'Prepaid credits', level: 2 },
      { type: 'paragraph', text: 'Job-search credits are a prepaid purchase rather than a subscription, so the 14-day subscription guarantee does not apply to them in the same way. If a top-up went wrong — a duplicate charge, or credits that expired through a fault on our side — contact support and we will sort it out.' },

      { type: 'callout', variant: 'info', text: 'Jobwhisper also advertises a land-the-job guarantee, which is separate from this refund window and has its own terms. Ask support for the current terms before relying on it.' },
    ],
  },

  {
    slug: 'changing-or-canceling-your-plan',
    title: 'Changing or canceling your plan',
    description: 'Switching tiers mid-cycle, pausing a search, and what you keep.',
    lastUpdated: '2026-09-28',
    content: [
      { type: 'paragraph', text: 'Plans change from Billing & subscription. Nothing here requires contacting support.' },

      { type: 'heading', text: 'Upgrading', level: 2 },
      { type: 'paragraph', text: 'Immediate and prorated. You are charged the difference for the remainder of the current cycle, and everything the new plan covers is available straight away. Upgrading in the last week of a cycle costs roughly a week of the difference, not a month.' },

      { type: 'heading', text: 'Downgrading', level: 2 },
      { type: 'paragraph', text: 'Applies at the start of your next cycle. You keep the higher tier until then, which means there is no benefit to downgrading early — do it whenever you decide, and it takes effect when the cycle turns.' },
      { type: 'paragraph', text: 'Check what the lower tier gates before you drop. Moving from Pro to Starter gives up Meeting Copilot, Coding Copilot, Resume Builder and Auto Apply, and reduces your Knowledge Base allowance. If you are over the new document limit, sort that out before the change lands.' },

      { type: 'heading', text: 'Cancelling', level: 2 },
      { type: 'list', items: [
        'Weekly (Starter) and monthly: access continues to the end of the current week or month.',
        'Annual — access continues to the end of the annual term.',
        'Your account, resumes, and history remain. Cancelling is not deletion.',
      ]},

      { type: 'heading', text: 'Pausing a search', level: 2 },
      { type: 'paragraph', text: 'Searches stop and start, and paying through a quiet month is avoidable. Cancel the subscription and keep using job-search credits, which are prepaid and need no plan. Your resumes and history stay put, and you resubscribe when interviews start landing again. This is the pattern we would actually recommend between active stretches.' },

      { type: 'callout', variant: 'tip', text: 'If you only need the interview side for a week or two, Starter renews weekly, so you can subscribe for the weeks you are interviewing and cancel in between.' },
    ],
  },
]
