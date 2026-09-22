
import { MarketingFooter, MarketingNav } from '@/features/marketing/marketing-chrome'

type LegalPageKind = 'privacy' | 'terms'

type LegalSection = {
  readonly title: string
  readonly paragraphs: readonly string[]
}

const CONTENT: Record<LegalPageKind, { readonly title: string; readonly intro: string; readonly sections: readonly LegalSection[] }> = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'This policy explains what Jobwhisper collects, why we collect it, how it is used across our products, and the choices available to you.',
    sections: [
      { title: 'Scope and definitions', paragraphs: ['This policy applies to Jobwhisper websites, applications, browser extensions, and related services that link to it. In this policy, “Jobwhisper,” “we,” and “us” mean the Jobwhisper service, while “you” means the person using an account or browsing our public pages.'] },
      { title: 'Information you provide', paragraphs: ['We collect account and contact details such as your name, email address, sign-in preferences, and support messages. We also collect the content you choose to add, including resumes, cover letters, job descriptions, job preferences, interview context, notes, and application answers.', 'You decide what to place in your workspace. Please avoid adding information that is not needed for your job search, and do not upload another person’s personal information unless you have permission to do so. Payment details are handled by our payment providers; we receive transaction status and limited billing details needed to provide credits, subscriptions, receipts, and support.'] },
      { title: 'Usage and device information', paragraphs: ['When you use Jobwhisper, we may receive basic usage, browser, device, and diagnostic information such as pages viewed, feature interactions, approximate location derived from your IP address, operating system, and error logs. We use this information to keep the service reliable, protect accounts, and understand which features need improvement.'] },
      { title: 'How we use information', paragraphs: ['We use information to create and secure your account, provide Interview Prep and Copilot features, tailor resumes, match jobs, prepare Auto Apply submissions, deliver managed services you request, process payments, respond to support, and communicate about service changes.', 'We may also use information to prevent fraud and abuse, troubleshoot technical issues, measure product performance, and develop safer and more useful features. We do not sell your personal information or use your job-search content to advertise third-party products.'] },
      { title: 'AI and automated processing', paragraphs: ['Jobwhisper uses automated processing to organize context, suggest resume language, score relevance, and support interview preparation. These systems process the information needed for the feature you start and may produce incomplete or inaccurate suggestions; you remain responsible for reviewing content before using it.', 'If you choose Done For You, a success manager may review the preferences and materials needed to scout roles and prepare applications. You can update or remove materials from your workspace and can contact support if you want help understanding how your information is being used.'] },
      { title: 'Cookies and local storage', paragraphs: ['We use essential browser storage to keep the product working, remember your selected theme, and maintain short-lived session state. We do not use third-party advertising cookies. Your browser settings can block or remove storage, but some signed-in features may no longer work correctly.'] },
      { title: 'When we share information', paragraphs: ['We share information with vendors that provide hosting, authentication, payments, email delivery, security, and customer support. These providers may process information only to perform services for us and are expected to protect it.', 'We may disclose information when required by law, to respond to a valid legal process, to protect users and the service, or in connection with a merger, acquisition, financing, or sale of assets. We share information with employers, job boards, or other third parties only when you direct us to do so, such as when an application is submitted.'] },
      { title: 'Retention and deletion', paragraphs: ['We keep information while your account is active and for as long as reasonably necessary to provide the service, complete a transaction, resolve disputes, prevent abuse, maintain security records, and meet legal or accounting requirements. Retention periods vary by the type and purpose of the information.', 'You may ask us to delete your account or specific content by contacting support. Deletion may not remove information that we must retain for legal, security, fraud-prevention, or transaction records, and backups may take time to cycle out.'] },
      { title: 'Security and international processing', paragraphs: ['We use administrative, technical, and organizational safeguards designed to protect information in our care. No online service can promise absolute security, so please use a strong password and contact us promptly if you suspect unauthorized access.', 'Jobwhisper and our service providers may process information in countries other than where you live. Where required, we use appropriate safeguards for those transfers and apply this policy to the information we process.'] },
      { title: 'Your privacy choices', paragraphs: ['Depending on where you live, you may have rights to access, correct, export, restrict, or delete personal information, and to object to certain processing. You can update many details in your account, remove documents, or contact us to make a request. We may need to verify your identity before completing a request and will respond within the time required by applicable law.'] },
      { title: 'Children, changes, and contact', paragraphs: ['Jobwhisper is intended for adults pursuing education or employment opportunities and is not directed to children. If you believe a child has provided personal information, contact us so we can review and remove it where appropriate.', 'We may update this policy as the service changes. We will publish the revised version here with a new effective date. Questions and privacy requests can be sent to privacy@jobwhisper.org.'] },
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: 'These terms set the ground rules for using Jobwhisper, including our interview tools, resume tools, Auto Apply, and managed services. Please read them before creating an account or purchasing credits.',
    sections: [
      { title: 'Agreement and eligibility', paragraphs: ['By creating an account, accessing a paid feature, or using Jobwhisper, you agree to these terms and any product-specific terms shown at checkout. If you use Jobwhisper for an organization, you confirm that you have authority to accept these terms on its behalf.', 'You must be legally able to enter this agreement and provide accurate account information. Jobwhisper is designed for adults pursuing education or employment opportunities.'] },
      { title: 'Your account and acceptable use', paragraphs: ['Keep your credentials confidential and tell us promptly about unauthorized access. You are responsible for activity under your account and for maintaining accurate job preferences and application information.', 'Do not use Jobwhisper to break the law, impersonate another person, infringe rights, distribute malware, probe or disrupt the service, scrape at scale, bypass usage limits, or submit applications without the authorization of the account holder.'] },
      { title: 'Your content and permission', paragraphs: ['You retain ownership of resumes, job preferences, interview context, answers, and other content you provide. You grant Jobwhisper a limited, non-exclusive permission to host, reproduce, transform, and transmit that content only as needed to operate the features you request and provide support.', 'You represent that you have the rights and permissions needed for your content, and that it does not knowingly violate law or another person’s rights. You can remove content from your workspace, subject to retention needed for security, legal, or transaction records.'] },
      { title: 'AI suggestions and review', paragraphs: ['Jobwhisper may generate suggestions, summaries, matches, and draft application content. Outputs can be wrong, incomplete, or unsuitable for a particular employer. Review every output, verify dates and claims, and make the final decision about what to send.', 'Jobwhisper does not provide legal, immigration, employment, financial, or professional advice. Nothing in an output guarantees that an employer will read, respond to, or accept an application.'] },
      { title: 'Auto Apply and job-search tools', paragraphs: ['When you enable Auto Apply, you authorize Jobwhisper to use your saved preferences and materials to identify suitable roles and prepare or submit applications within the settings you select. You are responsible for reviewing those settings, keeping your information current, and ensuring that submissions accurately represent you.', 'Job listings come from third parties and may be changed, removed, duplicated, or closed without notice. Jobwhisper does not guarantee a particular number of applications, interviews, offers, compensation, or employment outcome.'] },
      { title: 'Done For You managed service', paragraphs: ['Done For You is a managed, one-time service in which a success manager may scout roles, review matches, tailor materials, and submit applications on your behalf using the information and preferences you provide. You remain responsible for the accuracy of that information and for responding to employers.', 'Any interview target or service commitment is limited to the package description shown before purchase. It is not a promise of employment, compensation, or a specific hiring result. We may pause work when required information is missing or when applications would not be appropriate.'] },
      { title: 'Plans, credits, and payment', paragraphs: ['Interview plans are recurring subscriptions. Included interview credits are measured in minutes and refresh with each billing cycle. Resume Builder and Auto Apply use prepaid credits: one resume prompt consumes one resume credit, and Auto Apply charges one credit only for a successful application. Prepaid credits remain valid for 30 days unless the checkout page states otherwise.', 'Done For You packages are one-time purchases. Current prices, taxes where applicable, renewal dates, package scope, and credit validity are shown before you confirm payment. Subscription cancellations apply to future renewals; access and unused balances are handled according to the product and checkout terms displayed at purchase.'] },
      { title: 'Refunds and billing questions', paragraphs: ['If a payment, renewal, credit purchase, or managed package does not look right, contact support@jobwhisper.org with the account email and transaction details. Refund eligibility, statutory cancellation rights, and any product-specific remedy are determined by the checkout terms and applicable law.'] },
      { title: 'Intellectual property and feedback', paragraphs: ['Jobwhisper’s software, branding, designs, documentation, and underlying technology belong to Jobwhisper or its licensors. These terms give you permission to use the service while your account is in good standing; they do not transfer ownership.', 'If you send suggestions or feedback, you allow us to use it without restriction or compensation, provided we do not identify you publicly without permission.'] },
      { title: 'Third-party services', paragraphs: ['Jobwhisper may link to or work with employer sites, job boards, payment providers, and other third-party services. Those services have their own terms and privacy practices. We are not responsible for third-party availability, content, security, or decisions, and a link does not mean we endorse an employer or listing.'] },
      { title: 'Suspension and termination', paragraphs: ['You may stop using Jobwhisper at any time. We may suspend or terminate access when reasonably necessary to protect users, investigate misuse, comply with law, collect amounts owed, or maintain the security and integrity of the service. Where practical, we will provide notice and an opportunity to resolve the issue.', 'Sections that by their nature should continue—such as ownership, payment obligations, disclaimers, limits of liability, and dispute-related provisions—will survive termination.'] },
      { title: 'Disclaimers and limits', paragraphs: ['Jobwhisper is provided on an as-available basis. To the extent permitted by law, we disclaim implied warranties and do not promise uninterrupted service, error-free outputs, or a particular job-search result.', 'To the extent permitted by applicable law, Jobwhisper and its providers will not be liable for indirect, incidental, special, consequential, or lost-profit damages arising from use of the service. Nothing in these terms limits rights or remedies that cannot legally be limited.'] },
      { title: 'Changes and contact', paragraphs: ['We may update these terms or change the service as it develops. Material changes will be posted here with a new effective date. If you continue using Jobwhisper after the updated terms take effect, you accept the revised terms.', 'Questions about these terms can be sent to support@jobwhisper.org.'] },
    ],
  },
}

export type LegalPageProps = { readonly kind: LegalPageKind }

export function LegalPage({ kind }: LegalPageProps) {
  const content = CONTENT[kind]

  return (
    // Light, like the rest of the public pages this is linked from — see PricingPage.
    <div data-theme="light" className="min-h-screen bg-canvas font-rethink text-ink">
      <MarketingNav />

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

      <MarketingFooter />
    </div>
  )
}
