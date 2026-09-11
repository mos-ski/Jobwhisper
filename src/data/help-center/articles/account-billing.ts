import type { HelpArticle } from '../types'

export const accountBillingArticles: readonly HelpArticle[] = [
  {
    slug: 'managing-your-account',
    title: 'Managing your account',
    description: 'Profile, settings, and account deletion.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'You can manage most account settings from the Settings page in the app.' },
      { type: 'heading', text: 'What you can do', level: 2 },
      { type: 'list', items: [
        'Update your name, email, and profile information.',
        'Change your password.',
        'Enable two-factor authentication.',
        'Export your data.',
        'Delete your account and all associated data.',
      ]},
      { type: 'callout', variant: 'warning', text: 'Account deletion is permanent and processed within 30 days. Export your data first if you want to keep a copy.' },
    ],
  },
  {
    slug: 'plans-and-pricing',
    title: 'Plans and pricing',
    description: 'What each plan includes and how to upgrade.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Jobwhisper offers four tiers: Free, Starter, Pro, and Premium.' },
      { type: 'heading', text: 'Plan details', level: 2 },
      { type: 'list', items: [
        'Free — $0/month. 5 credits. Basic Resume Builder.',
        'Starter — $27/month. 20 credits. Resume Builder + Auto-Apply.',
        'Pro — $49/month. 50 credits. All features including Interview Copilot.',
        'Premium — $497/month. About 4,000 credits. Everything in Pro plus priority support.',
      ]},
      { type: 'heading', text: 'Upgrading', level: 2 },
      { type: 'list', ordered: true, items: [
        'Go to Account > Billing.',
        'Select your new plan.',
        'Confirm the change. Upgrades take effect immediately and are prorated.',
      ]},
      { type: 'paragraph', text: 'Downgrades take effect at the end of your current billing cycle.' },
    ],
  },
  {
    slug: 'credits-and-top-ups',
    title: 'Credits and top-ups',
    description: 'How credits work and how to buy more.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Credits are the currency for using Jobwhisper features. Each major action costs a set number of credits.' },
      { type: 'heading', text: 'What costs credits', level: 2 },
      { type: 'list', items: [
        'Resume tailoring — 1 credit per tailored version.',
        'Interview Prep session — 2 credits per session.',
        'Auto-Apply batch — 1 credit per approved application.',
        'Interview Copilot — 3 credits per live session.',
      ]},
      { type: 'heading', text: 'Topping up', level: 2 },
      { type: 'list', ordered: true, items: [
        'Go to Account > Billing > Credits.',
        'Select how many credits you want to add.',
        'Complete the payment.',
        'Credits are added to your balance immediately.',
      ]},
      { type: 'callout', variant: 'info', text: 'Unused credits roll over month to month on paid plans. Free plan credits reset each month.' },
    ],
  },
  {
    slug: 'refund-policy',
    title: 'Refund policy',
    description: '14-day money-back guarantee and cancellation details.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'Jobwhisper offers a 14-day money-back guarantee on new subscriptions.' },
      { type: 'heading', text: 'How to request a refund', level: 2 },
      { type: 'list', ordered: true, items: [
        'Email support@jobwhisper.org within 14 days of purchase.',
        'Include your account email. Reason is optional but appreciated.',
        'Refunds are processed within 5-7 business days to your original payment method.',
      ]},
      { type: 'heading', text: 'What happens after a refund', level: 2 },
      { type: 'list', items: [
        'Your account returns to the free tier with 5 monthly credits.',
        'Your data is retained for 30 days (exportable), then deleted unless you reactivate.',
      ]},
      { type: 'heading', text: 'Cancellations', level: 2 },
      { type: 'list', items: [
        'Monthly plans — cancel anytime, access continues until the end of the billing period.',
        'Annual plans — cancel anytime, effective at the end of the annual term.',
        'Coach/Org bundles — follow the same 14-day window from the bundle start date.',
      ]},
      { type: 'callout', variant: 'warning', text: 'Credit card refunds take 5-7 business days. PayPal refunds take 3-5 business days.' },
    ],
  },
  {
    slug: 'changing-or-canceling-your-plan',
    title: 'Changing or canceling your plan',
    description: 'Upgrade, downgrade, or cancel your subscription.',
    lastUpdated: '2026-09-01',
    content: [
      { type: 'paragraph', text: 'You can change or cancel your plan at any time from your account settings.' },
      { type: 'heading', text: 'Upgrading', level: 2 },
      { type: 'paragraph', text: 'Upgrades take effect immediately. You are charged the prorated difference for the remainder of your billing cycle.' },
      { type: 'heading', text: 'Downgrading', level: 2 },
      { type: 'paragraph', text: 'Downgrades take effect at the start of your next billing cycle. You keep your current plan features until then.' },
      { type: 'heading', text: 'Canceling', level: 2 },
      { type: 'list', items: [
        'Monthly plans — access ends at the close of the current billing period.',
        'Annual plans — access ends at the close of the annual term.',
        'No partial refunds outside the 14-day guarantee window.',
      ]},
      { type: 'callout', variant: 'tip', text: 'Before canceling, consider downgrading to the free plan instead — you keep access to your data and 5 monthly credits.' },
    ],
  },
]
