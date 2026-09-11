import { Link } from 'react-router-dom'

import { JobwhisperMark } from '@/ui'

type LegalPageKind = 'privacy' | 'terms'

type LegalSection = {
  readonly title: string
  readonly paragraphs: readonly string[]
}

const CONTENT: Record<LegalPageKind, { readonly title: string; readonly intro: string; readonly sections: readonly LegalSection[] }> = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'This policy explains what Jobwhisper collects, why we collect it, and the choices you have when using our products.',
    sections: [
      { title: 'Information you provide', paragraphs: ['We collect the account details, resume content, job preferences, interview context, and other information you choose to add to Jobwhisper. We use it to provide the features you request and keep your workspace available across sessions.'] },
      { title: 'How we use information', paragraphs: ['We use information to operate, personalize, secure, and improve Jobwhisper. We do not sell your personal information. We share information only with service providers that help us deliver the product, when required by law, or when you direct us to share it.'] },
      { title: 'Your choices', paragraphs: ['You can review or update your account information, remove documents, and contact support with privacy questions. You may request access to, correction of, or deletion of personal information, subject to legal and operational requirements.'] },
      { title: 'Security and retention', paragraphs: ['We use administrative, technical, and organizational safeguards designed to protect your information. We retain information only as long as needed to provide the service, meet legal obligations, resolve disputes, and enforce our agreements.'] },
      { title: 'Updates and contact', paragraphs: ['We may update this policy as Jobwhisper evolves. We will post the revised version here with a new effective date. Questions can be sent to privacy@jobwhisper.org.'] },
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: 'These terms set the ground rules for using Jobwhisper, including our interview tools, resume tools, Auto Apply, and managed services.',
    sections: [
      { title: 'Using Jobwhisper', paragraphs: ['You may use Jobwhisper only for lawful job-search and interview preparation activities. Keep your account credentials secure and make sure the information you provide is accurate and yours to use.'] },
      { title: 'Your content', paragraphs: ['You retain ownership of the resumes, job preferences, interview context, and other content you provide. You give Jobwhisper permission to process that content only as needed to provide the features you choose.'] },
      { title: 'Applications and automation', paragraphs: ['You are responsible for reviewing your preferences and the jobs submitted through Auto Apply. Automated tools may make mistakes, and Jobwhisper does not guarantee interviews, offers, or employment outcomes.'] },
      { title: 'Plans, credits, and payment', paragraphs: ['Interview plans are subscriptions measured in minutes. Resume Builder and Auto Apply use prepaid credits measured by prompts and successful applications. Managed services are one-time packages. Current prices, renewal dates, and credit validity are shown before purchase.'] },
      { title: 'Changes and termination', paragraphs: ['We may update or discontinue parts of the service as it develops. You may stop using your account at any time. We may suspend access when needed to protect the service, comply with law, or address misuse.'] },
      { title: 'Contact', paragraphs: ['If you have questions about these terms, contact support@jobwhisper.org.'] },
    ],
  },
}

export type LegalPageProps = { readonly kind: LegalPageKind }

export function LegalPage({ kind }: LegalPageProps) {
  const content = CONTENT[kind]

  return (
    <div className="min-h-screen bg-canvas font-rethink text-ink">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Jobwhisper home" className="inline-flex min-h-11 items-center rounded-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <JobwhisperMark className="h-6 w-auto text-accent" />
          </Link>
          <nav aria-label="Legal navigation" className="flex items-center gap-2 text-sm font-medium sm:gap-5">
            <Link to="/pricing" className="inline-flex min-h-11 items-center rounded-soft px-2 text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Pricing</Link>
            <Link to={kind === 'privacy' ? '/terms' : '/privacy'} className="inline-flex min-h-11 items-center rounded-soft px-2 text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">{kind === 'privacy' ? 'Terms' : 'Privacy'}</Link>
            <Link to="/v3/auth/sign-in" className="inline-flex min-h-8 items-center justify-center rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-on-accent shadow-control transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Sign in</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">Jobwhisper legal</p>
        <h1 className="mt-3 max-w-3xl font-gowun text-4xl font-bold leading-tight sm:text-5xl">{content.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">{content.intro}</p>
        <p className="mt-3 text-sm text-ink-muted">Effective September 11, 2026</p>

        <div className="mt-12 grid gap-8">
          {content.sections.map((section) => (
            <section key={section.title} className="rounded-sm border border-border bg-surface p-6 shadow-panel sm:p-8">
              <h2 className="font-gowun text-2xl font-bold text-ink">{section.title}</h2>
              <div className="mt-4 grid gap-4 text-base leading-7 text-ink-muted">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 Jobwhisper.ai</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/pricing" className="transition-colors hover:text-ink">Pricing</Link>
            <Link to="/privacy" className="transition-colors hover:text-ink">Privacy Policy</Link>
            <Link to="/terms" className="transition-colors hover:text-ink">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
