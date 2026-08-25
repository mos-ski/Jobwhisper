import { MarketingLayout } from '../MarketingLayout'

export default function AutoApplyMarketingPage() {
  return (
    <MarketingLayout>
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#f0f7ff] to-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0494fc]">AI AUTO APPLY</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
            Apply Smarter, Not Harder with
            <br />
            AI-Powered Job Applications.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Lightforth helps you beat the competition by applying faster and smarter, with each application
            perfectly customized for your dream job
          </p>
          <a href="/v3/auth/sign-in" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0494fc] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[#0380e0]">
            Get Started
          </a>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-4xl px-6">
          <img src="/lightforth-home/images/autoApplyHeroSection.gif" alt="Auto Apply" className="w-full rounded-xl shadow-lg" />
        </div>
      </section>

      {[
        { title: 'Job Profile', subtitle: 'Create job profile', desc: 'Create job profile with your professional details, skills, experience, and preferences, to help us match you with relevant jobs that fits your skills and expertise. Our system allows you to create multiple job profiles.', image: '/lightforth-home/images/jobProfile.gif' },
        { title: 'Matched jobs', subtitle: 'Get matched with Jobs that fit your skill', desc: 'Let our system do the work and get you jobs that match your skills, ensuring you are ahead and helping you to automatically apply before other candidates even see the opening.', image: '/lightforth-home/images/matchedJobs.gif' },
        { title: 'Cover Letters', subtitle: 'Precise cover letter for every application', desc: 'With your permission, Auto-Apply can create customized cover letter for every apply, allowing you sound unique every time you apply.', image: '/lightforth-home/images/autoapply3.png' },
        { title: 'Applications', subtitle: 'View your Auto-applied jobs', desc: 'By applying to the right jobs consistently, you maximize your chances of landing interviews and securing the job you want without the exhausting manual work.', image: '/lightforth-home/images/autoAppliedJobs.gif' },
        { title: 'Job Tracker', subtitle: 'Never be left in the dark with Job Tracker', desc: 'Tired of wondering what happens after you apply? Now you can monitor every application with our job tracker.', image: '/lightforth-home/images/autoapply2.png' },
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
          <h2 className="text-3xl font-bold text-center text-slate-900">Why use Lightforth Auto-Apply?</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { title: 'Save Time', desc: 'Automatically applies to multiple relevant jobs without solely relying on manual effort for each application.' },
              { title: 'Increases Opportunities', desc: 'Boosts your chances of landing a job by applying to more openings that match your profile.' },
              { title: 'Ensures Consistency', desc: 'Submits your applications with accurate and updated information, reducing errors and missed opportunities.' },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <img src="/lightforth-home/images/arrow1.svg" alt="" className="mx-auto mb-4 h-10 w-10" />
                <h3 className="font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
