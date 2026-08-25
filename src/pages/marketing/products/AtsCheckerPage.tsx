import { MarketingLayout } from '../MarketingLayout'

export default function AtsCheckerPage() {
  return (
    <MarketingLayout>
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#f0f7ff] to-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0494fc]">Introducing...</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
            Build an ATS-Friendly Resume
            <br />
            That Lands Interviews
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Stop getting filtered out by bots. Our AI-powered resume builder ensures your resume beats ATS scans
            and impresses hiring managers.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">ATS-Optimized Templates</h3>
              <p className="mt-2 text-sm text-slate-600">
                <strong>Professionally Designed</strong> – Templates built to pass ATS scans while looking sleek.
                <strong> One-Click Customization</strong> – Tailor for any job in seconds.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Smart Keyword Optimization</h3>
              <p className="mt-2 text-sm text-slate-600">
                <strong>Instant Job Description Analysis</strong> – Our AI scans your target role and suggests critical keywords.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Real-Time Content Guidance</h3>
              <p className="mt-2 text-sm text-slate-600">
                <strong>AI-Powered Writing Suggestions</strong> – Get bullet-point rewrites for clarity and impact.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Universal Compatibility</h3>
              <p className="mt-2 text-sm text-slate-600">
                <strong>Exports to .docx & PDF</strong> – Ensures ATS systems parse your resume correctly.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <img src="/lightforth-home/images/atsTips.gif" alt="ATS-friendly resume builder" className="w-full rounded-xl shadow-lg" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-center text-slate-900">
            AI Tailors Your Resume to Match Any Job Description — Automatically
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
            Stop wasting hours tweaking your resume. Our AI analyzes job posts and instantly optimizes your experience,
            skills, and keywords to beat ATS and impress hiring managers.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              { step: '1', title: 'Upload Your Resume', desc: 'Paste your current resume or LinkedIn profile. We support PDF, DOCX, and LinkedIn imports.' },
              { step: '2', title: 'Paste the Job Description', desc: 'Our AI scans requirements, keywords, and hidden patterns. Works with LinkedIn, Indeed, or company job posts.' },
              { step: '3', title: 'AI Tailors Your Resume', desc: 'Rewrites bullet points to match the job. Prioritizes relevant skills + adds missing keywords. Includes ATS compatibility checks.' },
              { step: '4', title: 'Download & Apply', desc: 'Formatted for ATS + human readers. Export to PDF/DOCX with one click.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#0494fc] text-white font-bold">{s.step}</div>
                <h3 className="font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <img src="/lightforth-home/images/aiTailor.png" alt="AI Tailor" className="w-full rounded-xl shadow-lg" />
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
