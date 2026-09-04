import type {
  AdminContentTab,
  AdminDownloadItem,
  AdminFaqItem,
  AdminMarketplaceItem,
  AdminTutorialItem,
} from '@/contracts/admin-content.draft'

export const adminContentTabs: readonly { readonly id: AdminContentTab; readonly label: string }[] = [
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'downloads', label: 'Downloads' },
  { id: 'tutorials', label: 'Tutorials' },
  { id: 'faq', label: 'FAQ' },
]

/* -------------------------------------------------------------------------- */
/* Marketplace — mirrors the candidate-side marketplace mock                   */
/* -------------------------------------------------------------------------- */

export const adminMarketplaceItems: readonly AdminMarketplaceItem[] = [
  { id: 'swipe', name: '5 Must-Master Interview Questions: Answer Swipe File', priceDollars: 19, description: 'Word-for-word answer frameworks for the questions that end interviews early.', assetFileName: 'swipe.pdf' },
  { id: 'resumes', name: '10 Fully Customizable Resume Templates', priceDollars: 29, description: 'ATS-safe templates for every industry, ready to fill in and send today.', assetFileName: 'resumes.pdf' },
  { id: 'coverletter', name: 'Cover Letter Swipe File', priceDollars: 15, description: 'Proven cover letter openers and structures you can adapt in minutes.', assetFileName: 'coverletter.pdf' },
  { id: 'salary', name: 'Salary Negotiation Word-for-Word Scripts', priceDollars: 15, description: 'Exactly what to say when they ask your salary expectations, and when they make an offer.', assetFileName: 'salary.pdf' },
  { id: 'linkedin', name: 'LinkedIn Profile Optimization Checklist', priceDollars: 12, description: 'The same checklist recruiters use to decide who gets a message.', assetFileName: 'linkedin.pdf' },
  { id: 'starbank', name: 'Behavioural Question Story Bank (STAR Method)', priceDollars: 19, description: 'Pre-built STAR stories you can adapt to almost any behavioural question.', assetFileName: 'starbank.pdf' },
  { id: 'followup', name: 'Post-Interview Follow-Up Email Templates', priceDollars: 9, description: 'Send the right note within the hour, every time.', assetFileName: 'followup.pdf' },
  { id: 'plan30', name: '30-Day Job Search Action Plan', priceDollars: 17, description: 'A day-by-day plan so you always know exactly what to do next.', assetFileName: 'plan30.pdf' },
]

/* -------------------------------------------------------------------------- */
/* Downloads — mirrors the candidate-side downloads mock                       */
/* -------------------------------------------------------------------------- */

export const adminDownloadItems: readonly AdminDownloadItem[] = [
  { id: 'mac-apple-silicon', title: 'Jobwhisper Copilot 1.0.1', platform: 'Application', extension: 'dmg', cta: 'Download', support: 'Apple Silicon (M-series) • v1.0.1', imageSrc: '/v3-assets/figma/download-icon-apple.png', href: 'https://jobwhisper-copilot-downloads.nyc3.digitaloceanspaces.com/Jobwhisper_Copilot_1.0.1_arm64.dmg' },
  { id: 'mac-intel', title: 'Jobwhisper Copilot 1.0.1', platform: 'Application', extension: 'dmg', cta: 'Download', support: 'Intel - macOS 13+ • v1.0.1', imageSrc: '/v3-assets/figma/download-icon-apple.png', href: 'https://jobwhisper-copilot-downloads.nyc3.digitaloceanspaces.com/Jobwhisper_Copilot_1.0.1_x64.dmg' },
  { id: 'windows', title: 'Jobwhisper Copilot 1.0.1 for Windows', platform: 'Application', extension: 'exe', cta: 'Download', support: 'Windows 10+ • v1.0.1', imageSrc: '/v3-assets/figma/download-icon-windows.png', href: 'https://jobwhisper-copilot-downloads.nyc3.digitaloceanspaces.com/Jobwhisper_Copilot_Setup_1.0.1.exe' },
  { id: 'linux', title: 'Jobwhisper Copilot 1.0.1 for Linux', platform: 'Application', extension: 'AppImage', cta: 'Download', support: 'v1.0.1', imageSrc: '/v3-assets/figma/download-icon-linux.png', href: 'https://jobwhisper-copilot-downloads.nyc3.digitaloceanspaces.com/Jobwhisper_Copilot_1.0.1.AppImage' },
  { id: 'extension', title: 'Jobwhisper Auto Apply', platform: 'Browser Extension', extension: 'Chrome', cta: 'Download', support: 'Any Chromium Browser eg. Chrome, Brave', imageSrc: '/v3-assets/figma/download-icon-chrome.png', href: '/v3/extension' },
  { id: 'ios', title: 'Jobwhisper Mobile App', platform: 'Mobile App', extension: 'App Store', cta: 'Download', support: 'iOS', imageSrc: '/v3-assets/figma/download-icon-appstore.png', href: 'https://apps.apple.com/app/jobwhisper-copilot' },
  { id: 'android', title: 'Jobwhisper Mobile App', platform: 'Mobile App', extension: 'Google Play', cta: 'Download', support: 'Android', imageSrc: '/v3-assets/figma/download-icon-googleplay.png', href: 'https://play.google.com/store/apps/details?id=com.jobwhisper.copilot' },
]

/* -------------------------------------------------------------------------- */
/* Tutorials — mirrors the candidate-side tutorials mock, with optional category */
/* -------------------------------------------------------------------------- */

export const adminTutorialItems: readonly AdminTutorialItem[] = [
  { id: 'getting-started', title: 'Getting Started', href: 'https://jobwhisper.ai/docs/getting-started', kind: 'external', tone: 'accent', category: 'Onboarding' },
  { id: 'interview-copilot', title: 'Interview Copilot', href: 'https://jobwhisper.ai/tutorials/interview-copilot', kind: 'video', tone: 'accent', category: 'Product' },
  { id: 'auto-apply', title: 'Auto Apply', href: 'https://jobwhisper.ai/tutorials/auto-apply', kind: 'video', tone: 'positive', category: 'Product' },
  { id: 'resume-builder', title: 'Resume Builder', href: 'https://jobwhisper.ai/tutorials/resume-builder', kind: 'video', tone: 'accent-secondary', category: 'Product' },
  { id: 'interview-prep', title: 'Interview Prep', href: 'https://jobwhisper.ai/tutorials/interview-prep', kind: 'video', tone: 'danger', category: 'Product' },
]

/* -------------------------------------------------------------------------- */
/* FAQ — currently hardcoded in account-view.tsx, now data-driven for the first time */
/* -------------------------------------------------------------------------- */

export const adminFaqItems: readonly AdminFaqItem[] = [
  { id: 'faq-1', question: 'How does usage-based pricing work?', answer: "Each feature is metered by what it actually costs to run, per message for Resume Builder, per successful application for Auto-Apply, per minute for live Interview Prep and Copilot sessions. See the rate table above for exact pricing. Jobwhisper only charges for successful actions, so a failed Auto-Apply submission never costs anything." },
  { id: 'faq-2', question: 'Does unused balance roll over to next month?', answer: "Your plan's monthly included usage resets on your renewal date and does not carry forward. Any balance you've added yourself through a top-up is different, that stays on your account until you spend it." },
  { id: 'faq-3', question: "What's the difference between monthly and annual billing?", answer: "Annual billing charges you once a year at a 20% discount off the monthly rate. Monthly billing charges the full rate every month. You can switch between them at any time using the toggle above the plan cards." },
  { id: 'faq-4', question: 'Can I change plans at any time?', answer: "Yes. Upgrades take effect immediately and unlock the new plan's features right away. Downgrades take effect at the start of your next billing cycle, so you keep your current plan's benefits until then." },
  { id: 'faq-5', question: 'How do I cancel my subscription?', answer: "Use the Cancel Subscription button above. You'll keep full access until your current billing period ends, after which your account moves to the Free plan. You can renew at any time before then." },
  { id: 'faq-6', question: 'What happens to my data if I cancel?', answer: "Your saved resumes, cover letters, application history, and interview reports stay in your account. You just lose access to paid features like Auto-Apply and Copilot sessions until you resubscribe." },
  { id: 'faq-7', question: 'Is the first-time offer available more than once?', answer: "No. The $40 first-time Pro offer is available once per account, shown when you sign up. After your first month, your plan renews at the regular $99/month price." },
  { id: 'faq-8', question: 'What payment methods do you accept?', answer: "We accept all major debit and credit cards. Payments are processed securely and your card details are never stored on Jobwhisper's servers." },
  { id: 'faq-9', question: 'Do you offer refunds?', answer: "We don't offer refunds for partial billing periods, but you can cancel at any time to stop future charges, you'll keep access through the end of the period you already paid for." },
  { id: 'faq-10', question: 'Can I add more balance without upgrading my plan?', answer: "Yes. Use Buy credits on any balance above to top up mid-cycle ($5\u2013$10 minimum depending on the feature), it stays on your account until you spend it, on top of what your plan already includes." },
  { id: 'faq-11', question: 'Do Resume Builder and Auto Apply require a subscription?', answer: "No. Both are sold separately from Starter, Pro, and Premium, buy credits once in the Pay-as-you-go section below and spend them at your own pace. They work the same whether or not you have an active plan." },
]
