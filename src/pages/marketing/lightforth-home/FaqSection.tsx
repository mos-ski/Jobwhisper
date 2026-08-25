import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

const faqData = [
  {
    q: 'How does LightResume work?',
    a: 'LightResume uses AI to analyze your experience and the job description, then tailors your resume to match what employers and ATS systems are looking for. You can generate up to 50 resumes for 50 jobs in a single day.',
  },
  {
    q: 'How does LightResume improve my chances of passing ATS?',
    a: 'Our AI optimizes your resume formatting, keywords, and content structure to match ATS parsing requirements. This ensures your resume gets past automated filters and into the hands of hiring managers.',
  },
  {
    q: 'How many resumes can I generate per month with LightResume?',
    a: 'The number of resumes you can generate depends on your plan. Non-subscribers receive 5 credits per month, Starter users get 15 credits, Pro users get 50 credits, and Premium users get 100 credits per month.',
  },
  {
    q: 'Can LightResume be used by professionals in any industry?',
    a: 'Yes! LightResume works across all industries — tech, marketing, finance, healthcare, and more. Our AI adapts to your field\'s specific requirements and terminology.',
  },
  {
    q: 'How does LightResume help with quantifying achievements?',
    a: 'Our AI helps you identify and frame your achievements with measurable metrics, turning vague descriptions into compelling, data-driven statements that catch recruiters\' attention.',
  },
  {
    q: 'Will I be able to customize my resume for different job applications?',
    a: 'Absolutely! That\'s one of LightResume\'s core features. You can paste any job description and get a tailored version of your resume optimized for that specific role.',
  },
  {
    q: 'How fast can I build a resume with LightResume?',
    a: 'Most users create a polished, ATS-optimized resume in under 5 minutes. Simply upload your existing resume or start from scratch, and our AI handles the rest.',
  },
  {
    q: 'Can I download my resume after using LightResume?',
    a: 'Yes, you can download your resume in multiple formats including PDF and Word, ready to submit to any job application.',
  },
  {
    q: 'What is LightAuto-Apply, and how does it streamline my job search?',
    a: 'LightAuto-Apply automatically finds matching job opportunities across multiple platforms and submits tailored applications on your behalf, saving you hours of manual work every day.',
  },
  {
    q: 'How does LightAuto-Apply decide which jobs to apply for?',
    a: 'Our system matches your skills, experience, and preferences against job listings across LinkedIn, Indeed, Glassdoor, and more — only applying to roles that fit your profile.',
  },
  {
    q: 'Can I review the jobs before LightAuto-Apply submits my application?',
    a: 'Yes! You can review and approve matched jobs before any application is sent. You have full control over which positions receive your application.',
  },
  {
    q: 'Will LightAuto-Apply customize my resume and cover letter for each job?',
    a: 'Every application sent through Auto-Apply includes a tailored resume and cover letter optimized for that specific job description and company.',
  },
  {
    q: 'How do I know jobs that has been applied for?',
    a: 'Our built-in Job Tracker lets you monitor every application status in real-time, from submission through to interview offers and beyond.',
  },
  {
    q: 'How many jobs does LightAuto-Apply send applications to in a month?',
    a: 'Depending on your plan and available credits, Auto-Apply can submit up to 1000+ tailored applications per month across multiple job boards.',
  },
  {
    q: 'Can LightAuto-Apply help me manage application deadlines?',
    a: 'Yes! The Job Tracker feature helps you manage and track all your application deadlines, interview schedules, and follow-ups in one centralized dashboard.',
  },
  {
    q: 'Is my personal data safe with LightAuto-Apply?',
    a: 'Absolutely. We use enterprise-grade encryption and never share your personal data with third parties. Your privacy and security are our top priorities.',
  },
  {
    q: 'What does LightInterview offer that other interview prep doesn\'t?',
    a: 'LightInterview combines voice-enabled mock interviews with AI-powered feedback, STAR method training, and real-time performance reports — all personalized to your target role.',
  },
  {
    q: 'How does LightInterview work?',
    a: 'Practice with our AI interviewer that asks relevant questions for your target role. Get instant feedback on your answers, tone, and confidence level with detailed performance reports.',
  },
  {
    q: 'Can LightInterview help with different types of interviews?',
    a: 'Yes! We support behavioral, technical, case study, and situational interview formats. Our AI adapts to your industry and role level.',
  },
  {
    q: 'Does LightInterview use common interview methods like the STAR method?',
    a: 'Yes, our AI coach trains you on the STAR method and other proven frameworks, helping you structure compelling answers that impress hiring managers.',
  },
  {
    q: 'How can LightInterview help me prepare for virtual interviews?',
    a: 'We simulate real video interview conditions, including screen sharing scenarios, and help you practice presenting yourself confidently on camera.',
  },
  {
    q: 'Will I get feedback on my answers in LightInterview?',
    a: 'Yes! After each practice session, you receive detailed feedback on answer quality, relevance, confidence, and suggestions for improvement.',
  },
  {
    q: 'How soon can I start seeing results from using LightInterview?',
    a: 'Most users report feeling more confident after just 2-3 practice sessions. Many land interviews within their first week of using the platform.',
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0494fc]">Lets answer your questions</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            Frequently Asked
            <br />
            Questions
          </h2>
          <p className="mt-4 text-slate-600">Get answers to common questions about Lightforth</p>
        </div>

        <div className="mt-12 space-y-3">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div key={item.q} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-slate-900">{item.q}</span>
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500">
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                    <p className="text-sm leading-relaxed text-slate-600">{item.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
