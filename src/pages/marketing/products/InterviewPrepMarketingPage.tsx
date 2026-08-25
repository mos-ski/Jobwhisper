import { MarketingLayout } from '../MarketingLayout'

export default function InterviewPrepMarketingPage() {
  return (
    <MarketingLayout>
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#f0f7ff] to-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0494fc]">AI INTERVIEW</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
            Get more successful interviews
            <br />
            and better job offers
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Our system helps you prepare for interviews with tailored questions and expert feedback,
            giving you the confidence to answer with ease.
          </p>
          <a href="/v3/auth/sign-in" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0494fc] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[#0380e0]">
            Get Started
          </a>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-4xl px-6">
          <img src="/lightforth-home/images/heroSessionAI-Interview.gif" alt="AI Interview" className="w-full rounded-xl shadow-lg" />
        </div>
      </section>

      {[
        { title: 'Interview details', subtitle: 'Set the Job details you wish to interview for', desc: 'To get the best out of this interview, start by entering the job details you wish to interview for to help us tailor your interview experience.', image: '/lightforth-home/images/interviewDetails.gif' },
        { title: 'Permission', subtitle: 'Set permission and choose your preferred Interviewer', desc: "Customise your interview experience by giving permission and choosing your preferred interviewer's voice.", image: '/lightforth-home/images/interview2.png' },
        { title: 'Interview session', subtitle: 'Start the Interview and respond accordingly', desc: 'Instantly begin your interview and respond accordingly while our AI takes note of your responses and body language to provide accurate feedback.', image: '/lightforth-home/images/interview3.png' },
        { title: 'Insights', subtitle: 'Get insights about interview performance', desc: 'This will help you understand your strengths and areas for improvement after interviews. It provides feedback, analytics, or tips to enhance your chances of success.', image: '/lightforth-home/images/seeReport.gif' },
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
          <h2 className="text-3xl font-bold text-center text-slate-900">Why use AI-Interview?</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { title: 'Personalized Feedback', desc: 'Analyzes your responses and provides insights on strengths and areas for improvement.' },
              { title: 'Realistic Practice', desc: 'Simulates real interview scenarios that helps you build confidence and refine your answers.' },
              { title: '24/7 Availability', desc: 'Allows you to practice anytime, anywhere, without needing a human interviewer.' },
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
