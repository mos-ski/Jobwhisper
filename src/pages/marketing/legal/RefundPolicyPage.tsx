import { MarketingLayout } from '../MarketingLayout'

const legalTabs = [
  { label: 'Terms of Service', href: '/terms-condition' },
  { label: 'Privacy Statement', href: '/privacy-statement' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Cookie Policy', href: '/cookie' },
  { label: 'Refund Policy', href: '/refund-policy' },
]

export default function RefundPolicyPage() {
  return (
    <MarketingLayout>
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-3xl font-bold text-slate-900">Refund Policy</h1>
          <div className="mt-4 flex flex-wrap gap-3">
            {legalTabs.map((tab) => (
              <a key={tab.label} href={tab.href} className="text-sm text-[#0494fc] hover:underline">
                {tab.label}
              </a>
            ))}
          </div>

          <div className="prose prose-slate mt-8 max-w-none text-sm leading-7 text-slate-700">
            <p className="font-semibold">Updated at March 14th, 2025</p>
            <p>
              At Lightforth, we deliver digital services including AI-assisted resume curation, automated job
              applications, and interview preparation tools through a subscription-based model. Our services begin
              the moment users activate their accounts or features, and because they are <strong>intangible,
              personalized, and consumed in real-time</strong> refunds are generally <strong>not offered</strong>.
              However, we're committed to fairness, transparency, and helping you make the most of your career
              journey with us.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8">1. Refund Eligibility</h2>
            <p>Lightforth does <strong>not issue refunds</strong> under the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>AI-powered Job Applications:</strong> Once our system begins applying to jobs on your behalf.</li>
              <li><strong>Interview Copilot Usage:</strong> If you've accessed or used the Interview Copilot.</li>
              <li><strong>Active Subscriptions:</strong> After your billing cycle starts.</li>
              <li><strong>Activation Offer Renewal:</strong> After a discounted activation offer renews into a paid subscription.</li>
            </ul>
            <p>
              We encourage non-subscribers to use their 5 monthly credits to evaluate the platform before
              choosing a paid plan.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8">1.2 Service Access and Digital Usage</h2>
            <p>
              Once a service has been accessed, initiated, or used—either partially or fully—it is considered
              consumed and is <strong>not eligible</strong> for a refund.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8">2. Subscription Cancellation</h2>
            <p>You can cancel your subscription at any time via your account settings.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Effective Date:</strong> Cancellations are effective at the end of your current billing cycle.</li>
              <li><strong>No Partial Refunds:</strong> We do not offer pro-rated refunds for unused time within a billing period.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 mt-8">3. Exceptional Cases</h2>
            <p>We understand unexpected issues can arise. If you experience:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Technical problems</strong> that prevent you from using the service</li>
              <li><strong>Billing errors</strong></li>
            </ul>
            <p>
              Please contact our support team immediately. While standard policy dictates non-refundability,
              <strong> exceptions may be considered</strong> on a case-by-case basis to ensure fair resolution.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8">4. Service Modifications or Discontinuation</h2>
            <p>We reserve the right to improve, change, or discontinue features of our platform at any time.</p>
            <ul className="list-disc pl-5">
              <li>
                In the rare event of a <strong>complete shutdown of our services</strong>, active subscribers may
                be eligible for a <strong>pro-rated refund</strong> for the unused portion of their subscription.
              </li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 mt-8">5. Support & Resolution</h2>
            <p>
              We're here to help. If you encounter any issues or have questions, please contact us at:
              support@lightforth.org
            </p>
            <p>We aim to respond within 24–48 business hours and are committed to resolving all concerns promptly.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8">6. Acceptance of Policy</h2>
            <p>
              By subscribing to and using Lightforth's services, you acknowledge and agree to this Refund and
              Cancellation Policy.
            </p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
