import { MarketingLayout } from '../MarketingLayout'

const legalTabs = [
  { label: 'Terms of Service', href: '/terms-condition' },
  { label: 'Privacy Statement', href: '/privacy-statement' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Cookie Policy', href: '/cookie' },
  { label: 'Refund Policy', href: '/refund-policy' },
]

export default function TermsPage() {
  return (
    <MarketingLayout>
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
          <div className="mt-4 flex flex-wrap gap-3">
            {legalTabs.map((tab) => (
              <a key={tab.label} href={tab.href} className="text-sm text-[#0494fc] hover:underline">
                {tab.label}
              </a>
            ))}
          </div>

          <div className="prose prose-slate mt-8 max-w-none text-sm leading-7 text-slate-700">
            <p className="font-semibold">Updated at March 14th, 2024</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8">General Terms</h2>
            <p>
              By accessing and placing an order with LightForth, you confirm that you are in agreement with and bound
              by the terms of service contained in the Terms & Conditions outlined below. These terms apply to the
              entire website and any email or other type of communication between you and LightForth.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8">License</h2>
            <p>
              LightForth grants you a revocable, non-exclusive, non-transferable, limited license to download, install
              and use the app strictly in accordance with the terms of this Agreement.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8">Payment</h2>
            <p>
              If you register to any of our recurring payment plans, you agree to pay all fees or charges to your
              account for the Service in accordance with the fees, charges and billing terms in effect at the time
              that each fee or charge is due and payable.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8">Return and Refund Policy</h2>
            <p>
              At Lightforth, we provide AI-assisted resume curation, automated job applications, and interview
              Copilot support through a subscription-based service. Due to the nature of our digital and
              subscription-based offerings, refunds are not provided once the service has been initiated.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8">Your Suggestions</h2>
            <p>
              Any feedback, comments, ideas, improvements, or suggestions provided by you to LightForth with respect
              to the app shall remain the sole and exclusive property of LightForth.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8">Links to Other Websites</h2>
            <p>
              This Terms & Conditions applies only to the Services. The Services may contain links to other websites
              not operated or controlled by LightForth.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8">Termination</h2>
            <p>
              This Agreement shall remain in effect until terminated by you or LightForth. LightForth may, in its
              sole discretion, at any time and for any or no reason, suspend or terminate this Agreement.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8">Indemnification</h2>
            <p>
              You agree to indemnify and hold LightForth and its parents, subsidiaries, affiliates, officers,
              employees, agents, partners, and licensors harmless from any claim or demand.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8">No Warranties</h2>
            <p>
              The app is provided to you "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty
              of any kind.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8">Limitation of Liability</h2>
            <p>
              Notwithstanding any damages that you might incur, the entire liability of LightForth and any of its
              suppliers under any provision of this Agreement shall be limited to the amount actually paid by you for
              the app.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8">Severability</h2>
            <p>
              If any provision of this Agreement is held to be unenforceable or invalid, such provision will be
              changed and interpreted to accomplish the objectives of such provision to the greatest extent possible
              under applicable law.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8">Contact Us</h2>
            <p>Don't hesitate to contact us if you have any questions.</p>
            <p>Via Email: support@lightforth.org</p>
            <p>Via this Link: https://www.lightforth.org/contact</p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
