import { motion } from 'framer-motion'

const tools = [
  {
    tag: 'AI Resume',
    title: 'AI Resume Builder with ATS-compliant templates.',
    description: 'Create a polished, ATS-friendly resume in minutes with our AI-powered builder, tailored to highlight your skills and impress employers.',
    image: '/lightforth-home/images/aiSuggestion.gif',
    cta: 'Create a resume',
    secondaryCta: 'ATS Checker',
    secondaryHref: '/ats-checker',
  },
  {
    tag: 'AI-Auto Apply',
    title: 'We find the job that matches your profile and Auto apply for you.',
    description: "We'll search every major job board, find the perfect roles and apply for you, so you can focus on landing your dream job.",
    image: '/lightforth-home/images/AutoApply10s.gif',
    cta: 'Start Applying',
    secondaryCta: 'See Matched Jobs',
  },
  {
    tag: 'AI Interview Prep',
    title: 'Master interview techniques with our advanced interview simulator.',
    description: 'Practice with real interview questions and personalized feedback to sharpen your skills and walk into every interview fully prepared.',
    image: '/lightforth-home/images/interview-prep.png',
    cta: 'Start Practicing',
  },
  {
    tag: 'Co-Pilot',
    title: 'Real-Time Support to Help You Shine in Every Interview.',
    description: 'Get real-time guidance and expert suggestions during live interviews to answer confidently and leave a lasting impression.',
    image: '/lightforth-home/images/co-pilot.png',
    cta: 'Start Now',
    secondaryCta: 'Install Google Chrome',
    secondaryHref: 'https://chromewebstore.google.com/detail/interview-copilot-by-ligh/hbpdbcaomojbmabloieeenccijgioicd',
  },
]

export function Tools({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0494fc]">What we have to Offer</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            Our Tools covers everything you need to secure
            <br />
            your next role.
          </h2>
        </div>

        <div className="mt-16 space-y-20">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.tag}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`flex flex-col items-center gap-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
            >
              <div className="flex-1 space-y-4">
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0494fc]">
                  {tool.tag}
                </span>
                <h3 className="text-2xl font-bold text-slate-900">{tool.title}</h3>
                <p className="text-slate-600">{tool.description}</p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={onGetStarted}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0494fc] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0380e0]"
                  >
                    {tool.cta}
                  </button>
                  {tool.secondaryCta && (
                    <a
                      href={tool.secondaryHref || '#'}
                      className="text-sm font-semibold text-[#0494fc] hover:underline"
                      target={tool.secondaryHref?.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                    >
                      {tool.secondaryCta}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <img
                  src={tool.image}
                  alt={tool.tag}
                  className="w-full rounded-xl border border-slate-100 shadow-lg"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
