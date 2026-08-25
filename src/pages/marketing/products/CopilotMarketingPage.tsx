import { MarketingLayout } from '../MarketingLayout'

export default function CopilotMarketingPage() {
  return (
    <MarketingLayout>
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#f0f7ff] to-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0494fc]">AI CO-PILOT</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
            A Co-pilot that whispers
            <br />
            interview answers in your ear
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Never feel alone during an interview again! LightInterview co-pilot provides real-time interview
            assistance so you can always sound knowledgeable and confident.
          </p>
          <a href="/v3/auth/sign-in" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0494fc] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[#0380e0]">
            Get Started
          </a>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-4xl px-6">
          <img src="/lightforth-home/images/heroSessionCopilot.gif" alt="Co-Pilot" className="w-full rounded-xl shadow-lg" />
        </div>
      </section>

      {[
        { title: 'Interview details', subtitle: 'Provide interview details', desc: 'To get the best responses, start by entering the job details you wish to interview for and watch our system give you the best responses.', image: '/lightforth-home/images/copilot1.png' },
        { title: 'Language', subtitle: 'Get target response to questions', desc: 'Set language preference as this enhances and improves the chances of receiving the right response to questions. This also provides you with precise and well-structured answers tailored to specific queries.', image: '/lightforth-home/images/selectlanguage.gif' },
        { title: 'Smart response', subtitle: 'Smart support when you need It most', desc: 'Tough question? Not anymore! Our AI Co-Pilot offers instant guidance, key talking points, and strategic hints to help you navigate interviews like a pro and stand out from the competition.', image: '/lightforth-home/images/smartResponse.gif' },
      ].map((item, i) => (
        <section key={item.title} className={`py-16 ${i % 2 === 1 ? 'bg-slate-50' : ''}`}>
          <div className={`mx-auto max-w-6xl px-6 flex flex-col items-center gap-8 md:flex-row ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-1 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0494fc]">{item.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{item.subtitle}</h3>
              <p className="text-slate-600">{item.desc}</p>
              <a href="/v3/auth/sign-in" className="inline-flex items-center gap-2 rounded-full bg-[#0494fc] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0380e0]">
                Get Started
              </a>
            </div>
            <div className="flex-1">
              <img src={item.image} alt={item.title} className="w-full rounded-xl shadow-lg" />
            </div>
          </div>
        </section>
      ))}

      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-center text-slate-900">Why use Co-Pilot?</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { title: 'Real-time assistance', desc: 'Get live, customized suggestions to respond confidently and professionally during interviews.', icon: '/lightforth-home/images/copilotx1.svg', tag: 'Get best result', tagIcon: '/lightforth-home/images/tagicon1.svg' },
              { title: 'Increased confidence', desc: 'Enter every interview fully prepared, knowing you have trusted expert guidance to rely on.', icon: '/lightforth-home/images/copilotx2.svg', tag: 'AI-driven evaluation', tagIcon: '/lightforth-home/images/tagicon2.svg' },
              { title: 'Smarter responses', desc: 'Tackle even the toughest questions with thoughtful, polished answers tailored that makes you stand out.', icon: '/lightforth-home/images/copilotx3.svg', tag: 'High success rate', tagIcon: '/lightforth-home/images/tagicon3.svg' },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <img src={f.icon} alt="" className="mb-4 h-12 w-12" />
                <h3 className="font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
                <div className="mt-4 flex items-center gap-2">
                  <img src={f.tagIcon} alt="" className="h-4 w-4" />
                  <span className="text-xs font-semibold text-[#0494fc]">{f.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
