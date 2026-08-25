import { MarketingLayout } from '../MarketingLayout'

export default function ResumeMarketingPage() {
  return (
    <MarketingLayout>
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#f0f7ff] to-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0494fc]">AI RESUME</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
            Craft Compelling Resumes
            <br />
            Employers Can't Resist
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Have recruiters chase after you with a resume that gets you noticed. Expertly crafted, ATS-friendly,
            and designed to land you more interviews.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <a href="/v3/auth/sign-in" className="inline-flex items-center gap-2 rounded-full bg-[#0494fc] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[#0380e0]">
              Get Started
            </a>
            <a href="/ats-checker" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-8 py-3.5 text-base font-semibold text-slate-700 transition hover:bg-slate-50">
              Score your Resume
            </a>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-4xl px-6">
          <img src="/lightforth-home/images/aiSuggestion.gif" alt="AI Resume" className="w-full rounded-xl shadow-lg" />
        </div>
      </section>

      {[
        { title: 'AI Suggester', subtitle: "Give your resume the 'WOW' effect with AI Suggestions", desc: 'Turn any resume into something powerful with real-time suggestions, keyword optimization, and expert-backed insights to help you land more jobs.', image: '/lightforth-home/images/aiSuggestion.gif' },
        { title: 'ATS Tips', subtitle: 'Beat ATS bots with strong ATS Tips', desc: 'Our powerful ATS Tips transform your resume into a job-winning document that beats the system, grabs recruiters\' attention, and gets you in the door faster.', image: '/lightforth-home/images/atsTips.gif' },
        { title: 'ATS Scorer', subtitle: 'See your resume through the eyes of ATS', desc: 'Analyse your resume the way a recruiter would and see how well it performs so you never make mistakes and beat the silence.', image: '/lightforth-home/images/resume3.png' },
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
          <h2 className="text-3xl font-bold text-center text-slate-900">
            AI Resume Builder with ATS-compliant templates.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { icon: '/lightforth-home/images/resumex1.svg', title: 'Resume That Gets Results', desc: 'LightResume ensures your resume is crafted to catch recruiters\' eyes and meet job requirements with precision.', tag: 'Get best result', tagIcon: '/lightforth-home/images/tagicon1.svg' },
              { icon: '/lightforth-home/images/resumex2.svg', title: 'Get an Instant ATS Score', desc: 'See how well your resume matches job requirements and get personalized suggestions for improvement.', tag: 'AI-driven evaluation', tagIcon: '/lightforth-home/images/tagicon2.svg' },
              { icon: '/lightforth-home/images/resumex3.svg', title: 'Tailored to Every Job', desc: 'We customize each resume to match the job description, increasing your chances of success.', tag: 'High success rate', tagIcon: '/lightforth-home/images/tagicon3.svg' },
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
